export interface VeiculoResponseDTO {
  id: number;
  nome: string;
  placa: string;
  ativo: boolean;
  createdAt: string;
}

export interface VeiculoRequestDTO {
  nome: string;
  placa: string;
}