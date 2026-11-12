export type Ponto = {
  id: number;
  nome: string;
  endereco: string;
  diasHorarios: string;
  itensRecebeDistribui: string;
  latitude: number;
  longitude: number;
};

export type PaginaPontos = {
  content: Ponto[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
};
