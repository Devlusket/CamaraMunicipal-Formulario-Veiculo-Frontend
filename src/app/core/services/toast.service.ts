import { Injectable, signal } from '@angular/core';

export type ToastTipo = 'success' | 'error' | 'warning';

export interface Toast {
  id: number;
  mensagem: string;
  tipo: ToastTipo;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);
  private contador = 0;

  show(mensagem: string, tipo: ToastTipo = 'success'): void {
    const id = ++this.contador;
    this.toasts.update(t => [...t, { id, mensagem, tipo }]);
    setTimeout(() => this.dismiss(id), 4000);
  }

  dismiss(id: number): void {
    this.toasts.update(t => t.filter(toast => toast.id !== id));
  }
}