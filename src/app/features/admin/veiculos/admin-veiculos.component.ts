import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { VeiculoService } from '../../../core/services/veiculo.service';
import { ToastService } from '../../../core/services/toast.service';
import { VeiculoResponseDTO } from '../../../core/models/veiculo.model';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-admin-veiculos',
  standalone: true,
  imports: [ReactiveFormsModule, ConfirmModalComponent],
  templateUrl: './admin-veiculos.component.html',
})
export class AdminVeiculosComponent implements OnInit {
  private veiculoService = inject(VeiculoService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);

  veiculos = signal<VeiculoResponseDTO[]>([]);
  loading = signal(false);
  modalFormVisivel = signal(false);
  confirmModalVisivel = signal(false);
  editandoId = signal<number | null>(null);
  veiculoParaDesativar = signal<number | null>(null);

  form = this.fb.group({
    nome:  ['', Validators.required],
    placa: ['', Validators.required],
  });

  ngOnInit(): void {
    this.carregarVeiculos();
  }

  carregarVeiculos(): void {
    this.loading.set(true);
    this.veiculoService.getAllVeiculos().subscribe({
      next: (v) => this.veiculos.set(v),
      error: () => this.toastService.show('Erro ao carregar veículos.', 'error'),
    }).add(() => this.loading.set(false));
  }

  abrirModalNovo(): void {
    this.editandoId.set(null);
    this.form.reset();
    this.modalFormVisivel.set(true);
  }

  abrirModalEditar(v: VeiculoResponseDTO): void {
    this.editandoId.set(v.id);
    this.form.patchValue({ nome: v.nome, placa: v.placa });
    this.modalFormVisivel.set(true);
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const id = this.editandoId();
    const data = this.form.value as any;
    const op = id
      ? this.veiculoService.updateVeiculo(id, data)
      : this.veiculoService.createVeiculo(data);

    op.subscribe({
      next: () => {
        this.toastService.show(id ? 'Veículo atualizado!' : 'Veículo criado!', 'success');
        this.modalFormVisivel.set(false);
        this.carregarVeiculos();
      },
      error: () => this.toastService.show('Erro ao salvar veículo.', 'error'),
    });
  }

  confirmarDesativacao(id: number): void {
    this.veiculoParaDesativar.set(id);
    this.confirmModalVisivel.set(true);
  }

  desativar(): void {
    const id = this.veiculoParaDesativar();
    if (!id) return;

    this.veiculoService.deactivateVeiculo(id).subscribe({
      next: () => {
        this.toastService.show('Veículo desativado.', 'success');
        this.carregarVeiculos();
      },
      error: () => this.toastService.show('Erro ao desativar veículo.', 'error'),
    });

    this.confirmModalVisivel.set(false);
  }

  campoInvalido(campo: string): boolean {
    const control = this.form.get(campo);
    return !!(control?.invalid && control?.touched);
  }
}