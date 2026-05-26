import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { FormularioService } from '../../../core/services/formulario.service';
import { FormularioResponseDTO } from '../../../core/models/formulario.model';

@Component({
  selector: 'app-admin-formularios',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './admin-formularios.component.html',
})
export class AdminFormulariosComponent implements OnInit {
  private formularioService = inject(FormularioService);

  formularios = signal<FormularioResponseDTO[]>([]);
  loading = signal(false);
  filtroVeiculo = signal('');
  filtroDataInicio = signal('');
  filtroDataFim = signal('');
  detalheVisivel = signal<number | null>(null);

  formulariosFiltrados = computed(() => {
    let lista = this.formularios();

    if (this.filtroVeiculo()) {
      lista = lista.filter(f =>
        f.veiculoNome.toLowerCase().includes(this.filtroVeiculo().toLowerCase())
      );
    }

    if (this.filtroDataInicio()) {
      lista = lista.filter(f => f.dataSaida >= this.filtroDataInicio());
    }

    if (this.filtroDataFim()) {
      lista = lista.filter(f => f.dataSaida <= this.filtroDataFim());
    }

    return lista.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  });

  ngOnInit(): void {
    this.loading.set(true);
    this.formularioService.getAllFormularios().subscribe({
      next: (f) => this.formularios.set(f),
    }).add(() => this.loading.set(false));
  }

  toggleDetalhe(id: number): void {
    this.detalheVisivel.update(v => v === id ? null : id);
  }

  limparFiltros(): void {
    this.filtroVeiculo.set('');
    this.filtroDataInicio.set('');
    this.filtroDataFim.set('');
  }
}