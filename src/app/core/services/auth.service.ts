import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Credenciais } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private credenciais: Credenciais | null = null;

  login(credenciais: Credenciais): Observable<any> {
    this.credenciais = credenciais;

    return this.http.get(`${environment.apiUrl}/api/admin/veiculos`).pipe(
      tap(() => {}),
      catchError((err) => {
        this.credenciais = null;
        return throwError(() => err);
      })
    );
  }

  logout(): void {
    this.credenciais = null;
    this.router.navigate(['/admin/login']);
  }

  isAuthenticated(): boolean {
    return this.credenciais !== null;
  }

  getCredenciais(): Credenciais | null {
    return this.credenciais;
  }
}