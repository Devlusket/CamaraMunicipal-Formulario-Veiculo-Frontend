import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { VeiculoService } from '../../../core/services/veiculo.service';
import { RelatorioService } from '../../../core/services/relatorio.service';
import { ToastService } from '../../../core/services/toast.service';
import { VeiculoResponseDTO } from '../../../core/models/veiculo.model';

@Component({
  selector: 'app-admin-relatorios',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './admin-relatorios.component.html',
})
export class AdminRelatoriosComponent implements OnInit {
  private fb = inject(FormBuilder);
  private veiculoService = inject(VeiculoService);
  private relatorioService = inject(RelatorioService);
  private toastService = inject(ToastService);

  veiculos = signal<VeiculoResponseDTO[]>([]);
  loading = signal(false);

  meses = [
    { valor: 1, nome: 'Janeiro' },
    { valor: 2, nome: 'Fevereiro' },
    { valor: 3, nome: 'Março' },
    { valor: 4, nome: 'Abril' },
    { valor: 5, nome: 'Maio' },
    { valor: 6, nome: 'Junho' },
    { valor: 7, nome: 'Julho' },
    { valor: 8, nome: 'Agosto' },
    { valor: 9, nome: 'Setembro' },
    { valor: 10, nome: 'Outubro' },
    { valor: 11, nome: 'Novembro' },
    { valor: 12, nome: 'Dezembro' },
  ];

  form = this.fb.group({
    veiculoId: [null as number | null, Validators.required],
    ano:       [new Date().getFullYear(), Validators.required],
    mes:       [null as number | null],
  });

  ngOnInit(): void {
    this.veiculoService.getAllVeiculos().subscribe({
      next: (v) => this.veiculos.set(v.filter(x => x.ativo)),
      error: () => this.toastService.show('Erro ao carregar veículos.', 'error'),
    });
  }

  gerarPdf(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { veiculoId, ano, mes } = this.form.value;
    this.loading.set(true);

    this.relatorioService.downloadPdf(veiculoId!, ano!, mes ?? undefined).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const veiculo = this.veiculos().find(v => v.id === veiculoId);
        const nomeBase = veiculo?.nome.toLowerCase().replace(/\s+/g, '-') ?? 'veiculo';
        const nomeMes = mes ? `-${String(mes).padStart(2, '0')}` : '';
        a.href = url;
        a.download = `relatorio-${nomeBase}-${ano}${nomeMes}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        this.toastService.show('PDF gerado com sucesso!', 'success');
      },
      error: () => this.toastService.show('Erro ao gerar PDF. Tente novamente.', 'error'),
    }).add(() => this.loading.set(false));
  }

  campoInvalido(campo: string): boolean {
    const control = this.form.get(campo);
    return !!(control?.invalid && control?.touched);
  }
}