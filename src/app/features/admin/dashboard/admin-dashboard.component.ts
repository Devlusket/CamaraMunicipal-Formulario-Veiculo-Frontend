import { Component, OnInit, inject, signal } from '@angular/core';
import { VeiculoService } from '../../../core/services/veiculo.service';
import { AgendamentoService } from '../../../core/services/agendamento.service';
import { FormularioService } from '../../../core/services/formulario.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
  private veiculoService = inject(VeiculoService);
  private agendamentoService = inject(AgendamentoService);
  private formularioService = inject(FormularioService);

  totalVeiculosAtivos = signal(0);
  totalAgendamentosFuturos = signal(0);
  totalFormulariosDoMes = signal(0);
  loading = signal(true);

  ngOnInit(): void {
    const mesAtual = new Date().getMonth();
    const anoAtual = new Date().getFullYear();

    this.veiculoService.getAllVeiculos().subscribe(v =>
      this.totalVeiculosAtivos.set(v.filter(x => x.ativo).length)
    );

    this.agendamentoService.getAgendamentosFuturos().subscribe(a =>
      this.totalAgendamentosFuturos.set(a.length)
    );

    this.formularioService.getAllFormularios().subscribe(f => {
      const doMes = f.filter(x => {
        const data = new Date(x.createdAt);
        return data.getMonth() === mesAtual && data.getFullYear() === anoAtual;
      });
      this.totalFormulariosDoMes.set(doMes.length);
      this.loading.set(false);
    });
  }
}