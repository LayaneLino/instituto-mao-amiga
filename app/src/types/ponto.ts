// Espelha, campo a campo, o record PontoResponse da API (api/.../ponto/PontoResponse.java).
export type Ponto = {
  id: number;
  nome: string;
  endereco: string;
  diasHorarios: string;
  itensRecebeDistribui: string;
  latitude: number;
  longitude: number;
};

// Formato do Page do Spring (PagedModel): { content, page }.
export type PaginaPontos = {
  content: Ponto[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
};
