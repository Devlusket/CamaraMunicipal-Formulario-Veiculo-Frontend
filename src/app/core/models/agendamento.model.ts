export type StatusAgendamento = 'ATIVO' | 'CANCELADO';

export interface AgendamentoRequestDTO {
  requisitante: string;
  cargo: string;
  veiculoId: number;
  dataInicio: string;
  dataFim: string;
}

export interface AgendamentoResponseDTO {
  id: number;
  requisitante: string;
  cargo: string;
  veiculoId: number;
  veiculoNome: string;
  dataInicio: string;
  dataFim: string;
  status: StatusAgendamento;
  createdAt: string;
}

export interface DisponibilidadeResponseDTO {
  disponivel: boolean;
  mensagem: string;
}