export type Ponto = {
  id: string;
  nome: string;
  endereco: string;
  bairro: string;
  horario: string;
  tipo: string;
};

export type NovoPonto = Omit<Ponto, 'id'>;

export type PaginaPontos = {
  content: Ponto[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
};
