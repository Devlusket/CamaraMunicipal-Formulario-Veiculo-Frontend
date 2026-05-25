import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
})
export class ToastComponent {
  toastService = inject(ToastService);

  toastClasse(toast: Toast): string {
    const classes = {
      success: 'bg-green-600',
      error:   'bg-red-600',
      warning: 'bg-yellow-500',
    };
    return classes[toast.tipo];
  }

  icone(toast: Toast): string {
    const icones = {
      success: '✓',
      error:   '✕',
      warning: '⚠',
    };
    return icones[toast.tipo];
  }
}