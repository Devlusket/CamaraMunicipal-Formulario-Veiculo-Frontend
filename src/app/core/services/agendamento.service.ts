import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AgendamentoRequestDTO,
  AgendamentoResponseDTO,
  DisponibilidadeResponseDTO,
} from '../models/agendamento.model';

@Injectable({ providedIn: 'root' })
export class AgendamentoService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api`;

  createAgendamento(data: AgendamentoRequestDTO): Observable<AgendamentoResponseDTO> {
    return this.http.post<AgendamentoResponseDTO>(`${this.base}/agendamentos`, data);
  }

  cancelAgendamento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/agendamentos/${id}`);
  }

  checkDisponibilidade(
    veiculoId: number,
    dataInicio: string,
    dataFim: string
  ): Observable<DisponibilidadeResponseDTO> {
    const params = new HttpParams()
      .set('veiculoId', veiculoId)
      .set('dataInicio', dataInicio)
      .set('dataFim', dataFim);

    return this.http.get<DisponibilidadeResponseDTO>(
      `${this.base}/agendamentos/disponibilidade`,
      { params }
    );
  }

  getAgendamentosFuturos(): Observable<AgendamentoResponseDTO[]> {
    return this.http.get<AgendamentoResponseDTO[]>(`${this.base}/agendamentos/futuros`);
  }

  getAllAgendamentos(): Observable<AgendamentoResponseDTO[]> {
    return this.http.get<AgendamentoResponseDTO[]>(`${this.base}/admin/agendamentos`);
  }
}