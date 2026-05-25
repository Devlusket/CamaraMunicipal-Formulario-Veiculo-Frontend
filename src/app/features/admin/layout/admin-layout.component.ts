import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
})
export class AdminLayoutComponent {
  private authService = inject(AuthService);
  sidebarAberta = signal(false);

  toggleSidebar(): void {
    this.sidebarAberta.update(v => !v);
  }

  logout(): void {
    this.authService.logout();
  }
}