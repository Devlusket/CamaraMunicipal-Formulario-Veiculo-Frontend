import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AgendamentoService } from '../../../core/services/agendamento.service';
import { AgendamentoResponseDTO, StatusAgendamento } from '../../../core/models/agendamento.model';

@Component({
  selector: 'app-admin-agendamentos',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './admin-agendamentos.component.html',
})
export class AdminAgendamentosComponent implements OnInit {
  private agendamentoService = inject(AgendamentoService);

  agendamentos = signal<AgendamentoResponseDTO[]>([]);
  loading = signal(false);
  filtroStatus = signal<StatusAgendamento | ''>('');
  filtroVeiculo = signal('');

  agendamentosFiltrados = computed(() => {
    let lista = this.agendamentos();

    if (this.filtroStatus()) {
      lista = lista.filter(a => a.status === this.filtroStatus());
    }

    if (this.filtroVeiculo()) {
      lista = lista.filter(a =>
        a.veiculoNome.toLowerCase().includes(this.filtroVeiculo().toLowerCase())
      );
    }

    return lista;
  });
  toastService: any;


  cancelarAgendamento(id: number): void {
  if (!confirm('Deseja cancelar este agendamento?')) {
    return;
  }

  this.agendamentoService.cancelAgendamento(id).subscribe({
    next: () => {
      this.toastService.show('Agendamento cancelado.', 'success');
      this.carregarAgendamentos();
    },
    error: () => {
      this.toastService.show('Erro ao cancelar.', 'error');
    }
  });
}

 ngOnInit(): void {
  this.carregarAgendamentos();
}

carregarAgendamentos(): void {
  this.loading.set(true);

  this.agendamentoService.getAllAgendamentos().subscribe({
    next: (a) => this.agendamentos.set(a),
  }).add(() => this.loading.set(false));
}

  limparFiltros(): void {
    this.filtroStatus.set('');
    this.filtroVeiculo.set('');
  }
}