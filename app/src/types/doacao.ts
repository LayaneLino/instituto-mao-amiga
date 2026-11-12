export type Doacao = {
  id: string;
  tipoItem: string;
  quantidade: number;
  pontoDestino: string;
  criadoEm: string;
};

export type NovaDoacao = Omit<Doacao, 'id' | 'criadoEm'>;

export type PaginaDoacoes = {
  content: Doacao[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
};
