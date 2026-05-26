import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/components/toast/toast.component';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.html',
})
export class App {
  private swUpdate = inject(SwUpdate);

  constructor() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.subscribe(event => {
        if (event.type === 'VERSION_READY') {
          if (confirm('Nova versão disponível! Deseja atualizar agora?')) {
            window.location.reload();
          }
        }
      });
    }
  }
}