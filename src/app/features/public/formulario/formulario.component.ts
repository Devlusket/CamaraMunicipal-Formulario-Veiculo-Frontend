import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { VeiculoService } from '../../../core/services/veiculo.service';
import { FormularioService } from '../../../core/services/formulario.service';
import { ToastService } from '../../../core/services/toast.service';
import { VeiculoResponseDTO } from '../../../core/models/veiculo.model';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [ReactiveFormsModule, NavbarComponent],
  templateUrl: './formulario.component.html',
})
export class FormularioComponent implements OnInit {
  private fb = inject(FormBuilder);
  private veiculoService = inject(VeiculoService);
  private formularioService = inject(FormularioService);
  private toastService = inject(ToastService);

  veiculos = signal<VeiculoResponseDTO[]>([]);
  loading = signal(false);

  form = this.fb.group({
    requisitante:        ['', Validators.required],
    cargo:               ['', Validators.required],
    veiculoId:           [null as number | null, Validators.required],
    dataSaida:           ['', Validators.required],
    dataRetornoPrevista: ['', Validators.required],
    itinerario:          ['', Validators.required],
    justificativa:       ['', Validators.required],
    odometroSaida:       [null as number | null, [Validators.required, Validators.min(0)]],
    observacao:          [''],
  });

  ngOnInit(): void {
    this.veiculoService.getVeiculosAtivos().subscribe({
      next: (v) => this.veiculos.set(v),
      error: () => this.toastService.show('Erro ao carregar veículos.', 'error'),
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const saida = new Date(this.form.value.dataSaida!);
    const retorno = new Date(this.form.value.dataRetornoPrevista!);
    if (retorno <= saida) {
      this.toastService.show('A data de retorno deve ser posterior à data de saída.', 'warning');
      return;
    }

    this.loading.set(true);

    this.formularioService.submitFormulario(this.form.value as any).subscribe({
      next: () => {
        this.toastService.show('Formulário registrado com sucesso!', 'success');
        this.form.reset();
      },
      error: (err) => {
        const msg = err.status === 409
          ? 'Veículo já está em uso ou agendado neste período.'
          : err.error?.mensagem ?? 'Erro ao registrar formulário.';
        this.toastService.show(msg, 'error');
      },
    }).add(() => this.loading.set(false));
  }

  campoInvalido(campo: string): boolean {
    const control = this.form.get(campo);
    return !!(control?.invalid && control?.touched);
  }
}