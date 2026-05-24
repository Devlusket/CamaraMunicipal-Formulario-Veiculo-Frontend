import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FormularioRequestDTO, FormularioResponseDTO } from '../models/formulario.model';

@Injectable({ providedIn: 'root' })
export class FormularioService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api`;

  submitFormulario(data: FormularioRequestDTO): Observable<FormularioResponseDTO> {
    return this.http.post<FormularioResponseDTO>(`${this.base}/formularios`, data);
  }

  getAllFormularios(): Observable<FormularioResponseDTO[]> {
    return this.http.get<FormularioResponseDTO[]>(`${this.base}/admin/formularios`);
  }
}