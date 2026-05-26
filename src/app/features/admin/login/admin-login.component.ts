import { Component, inject, signal, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './admin-login.component.html',
})
export class AdminLoginComponent implements OnDestroy {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  erro = signal('');
  coldStart = signal(false);
  private coldStartTimer: any;

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.erro.set('');
    this.coldStart.set(false);

    // Após 5s sem resposta, avisa sobre o cold start
    this.coldStartTimer = setTimeout(() => {
      if (this.loading()) {
        this.coldStart.set(true);
      }
    }, 5000);

    const { username, password } = this.form.value;
    this.authService.login({ username: username!, password: password! }).subscribe({
      next: () => this.router.navigate(['/admin/dashboard']),
      error: (err) => {
        this.erro.set(
          err.status === 401
            ? 'Usuário ou senha incorretos.'
            : 'Erro ao conectar. Tente novamente.'
        );
      },
    }).add(() => {
      this.loading.set(false);
      this.coldStart.set(false);
      clearTimeout(this.coldStartTimer);
    });
  }

  ngOnDestroy(): void {
    clearTimeout(this.coldStartTimer);
  }
}