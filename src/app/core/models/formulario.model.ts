export interface FormularioRequestDTO {
  requisitante: string;
  cargo: string;
  veiculoId: number;
  dataSaida: string;
  dataRetornoPrevista: string;
  itinerario: string;
  justificativa: string;
  odometroSaida: number;
  observacao?: string;
}

export interface FormularioResponseDTO {
  id: number;
  requisitante: string;
  cargo: string;
  veiculoId: number;
  veiculoNome: string;
  dataSaida: string;
  dataRetornoPrevista: string;
  itinerario: string;
  justificativa: string;
  odometroSaida: number;
  observacao?: string;
  createdAt: string;
}