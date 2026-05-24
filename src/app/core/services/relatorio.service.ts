import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RelatorioService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api`;

  downloadPdf(veiculoId: number, ano: number, mes?: number): Observable<Blob> {
    let params = new HttpParams()
      .set('veiculoId', veiculoId)
      .set('ano', ano);

    if (mes !== undefined) {
      params = params.set('mes', mes);
    }

    return this.http.get(`${this.base}/admin/relatorios/pdf`, {
      params,
      responseType: 'blob',
    });
  }
}