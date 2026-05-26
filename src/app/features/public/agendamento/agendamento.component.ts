import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { VeiculoService } from '../../../core/services/veiculo.service';
import { AgendamentoService } from '../../../core/services/agendamento.service';
import { ToastService } from '../../../core/services/toast.service';
import { VeiculoResponseDTO } from '../../../core/models/veiculo.model';
import { AgendamentoResponseDTO } from '../../../core/models/agendamento.model';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { DatePipe } from '@angular/common';
import { FooterComponent } from "../../../shared/components/footer/footer.component";

@Component({
  selector: 'app-agendamento',
  standalone: true,
  imports: [ReactiveFormsModule, NavbarComponent, DatePipe, FooterComponent],
  templateUrl: './agendamento.component.html',
})
export class AgendamentoComponent implements OnInit {
  private fb = inject(FormBuilder);
  private veiculoService = inject(VeiculoService);
  private agendamentoService = inject(AgendamentoService);
  private toastService = inject(ToastService);

  veiculos = signal<VeiculoResponseDTO[]>([]);
  agendamentosFuturos = signal<AgendamentoResponseDTO[]>([]);
  mostrarFuturos = signal(false);
  disponivel = signal<boolean | null>(null);
  loadingVerificar = signal(false);
  loadingConfirmar = signal(false);
  loadingFuturos = signal(false);
  servidorAcordando = signal(false);
  private coldStartTimer: any;
  // modalVisivel = signal(false);
  // agendamentoParaCancelar = signal<number | null>(null);

  form = this.fb.group({
    requisitante: ['', Validators.required],
    cargo:        ['', Validators.required],
    veiculoId:    [null as number | null, Validators.required],
    dataInicio:   ['', Validators.required],
    dataFim:      ['', Validators.required],
  });





  ngOnInit(): void {
  this.coldStartTimer = setTimeout(() => {
    if (this.veiculos().length === 0) {
      this.servidorAcordando.set(true);
    }
  }, 5000);

  this.veiculoService.getVeiculosAtivos().subscribe({
    next: (v) => {
      this.veiculos.set(v);
      this.servidorAcordando.set(false);
      clearTimeout(this.coldStartTimer);
    },
    error: () => {
      this.servidorAcordando.set(false);
      clearTimeout(this.coldStartTimer);
      this.toastService.show('Erro ao carregar veículos.', 'error');
    },
  });
}





  verificarDisponibilidade(): void {
    const { veiculoId, dataInicio, dataFim } = this.form.value;
    if (!veiculoId || !dataInicio || !dataFim) {
      this.toastService.show('Preencha veículo, data de início e data de fim para verificar.', 'warning');
      return;
    }

    this.loadingVerificar.set(true);
    this.agendamentoService.checkDisponibilidade(veiculoId, dataInicio, dataFim).subscribe({
      next: (r) => this.disponivel.set(r.disponivel),
      error: () => this.toastService.show('Erro ao verificar disponibilidade.', 'error'),
    }).add(() => this.loadingVerificar.set(false));
  }

  confirmarAgendamento(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loadingConfirmar.set(true);
    this.agendamentoService.createAgendamento(this.form.value as any).subscribe({
      next: () => {
        this.toastService.show('Agendamento realizado com sucesso!', 'success');
        this.form.reset();
        this.disponivel.set(null);
        if (this.mostrarFuturos()) this.carregarFuturos();
      },
      error: (err) => {
        const msg = err.status === 409
          ? 'Veículo já está ocupado neste período.'
          : 'Erro ao realizar agendamento.';
        this.toastService.show(msg, 'error');
      },
    }).add(() => this.loadingConfirmar.set(false));
  }

  toggleFuturos(): void {
    this.mostrarFuturos.update(v => !v);
    if (this.mostrarFuturos() && this.agendamentosFuturos().length === 0) {
      this.carregarFuturos();
    }
  }

  carregarFuturos(): void {
  const veiculoId = this.form.value.veiculoId;
  if (!veiculoId) {
    this.toastService.show(
      'Selecione um veículo para visualizar os agendamentos.',
      'warning'
    );
    return;
  }

  this.loadingFuturos.set(true);
  this.agendamentoService.getAgendamentosFuturos(veiculoId).subscribe({
    next: (a) => {
      const agora = new Date();
      const validos = a.filter(ag =>
        ag.status === 'ATIVO' && new Date(ag.dataFim) > agora
      );
      this.agendamentosFuturos.set(validos);
    },
    error: () => this.toastService.show('Erro ao carregar agendamentos.', 'error'),
  }).add(() => this.loadingFuturos.set(false));
}

  // abrirModalCancelamento(id: number): void {
  //   this.agendamentoParaCancelar.set(id);
  //   this.modalVisivel.set(true);
  // }

  // confirmarCancelamento(): void {
  //   const id = this.agendamentoParaCancelar();
  //   if (!id) return;

  //   this.agendamentoService.cancelAgendamento(id).subscribe({
  //     next: () => {
  //       this.toastService.show('Agendamento cancelado.', 'success');
  //       this.carregarFuturos();
  //     },
  //     error: () => this.toastService.show('Erro ao cancelar agendamento.', 'error'),
  //   });

  //   this.modalVisivel.set(false);
  // }

  campoInvalido(campo: string): boolean {
    const control = this.form.get(campo);
    return !!(control?.invalid && control?.touched);
  }
}