import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { VeiculoRequestDTO, VeiculoResponseDTO } from '../models/veiculo.model';

@Injectable({ providedIn: 'root' })
export class VeiculoService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api`; 

  getVeiculosAtivos(): Observable<VeiculoResponseDTO[]> {
    return this.http.get<VeiculoResponseDTO[]>(`${this.base}/veiculos`);
  }

  getAllVeiculos(): Observable<VeiculoResponseDTO[]> {
    return this.http.get<VeiculoResponseDTO[]>(`${this.base}/admin/veiculos`);
  }

  createVeiculo(data: VeiculoRequestDTO): Observable<VeiculoResponseDTO> {
    return this.http.post<VeiculoResponseDTO>(`${this.base}/admin/veiculos`, data);
  }

  updateVeiculo(id: number, data: VeiculoRequestDTO): Observable<VeiculoResponseDTO> {
    return this.http.put<VeiculoResponseDTO>(`${this.base}/admin/veiculos/${id}`, data);
  }

  deactivateVeiculo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/admin/veiculos/${id}`);
  }




}