import type { PaginaPontos, Ponto } from '../types/ponto';
import { ApiError, apiGet } from './api';

const TAMANHO_MAXIMO_PAGINA = 50;

type OpcoesListagem = {
  page?: number;
  size?: number;
  sort?: string;
};

export function listarPontos({ page = 0, size = 20, sort }: OpcoesListagem = {}): Promise<PaginaPontos> {
  const parametros: Record<string, string | number> = { page, size };
  if (sort) parametros.sort = sort;
  return apiGet<PaginaPontos>('/pontos', parametros);
}

export async function listarTodosPontos(): Promise<Ponto[]> {
  const todos: Ponto[] = [];
  let pagina = 0;
  let totalPaginas = 1;

  while (pagina < totalPaginas) {
    const resultado = await listarPontos({ page: pagina, size: TAMANHO_MAXIMO_PAGINA, sort: 'nome,asc' });
    todos.push(...resultado.content);
    totalPaginas = resultado.page.totalPages;
    pagina += 1;
  }

  return todos;
}

export async function buscarPontoPorId(id: number): Promise<Ponto | null> {
  try {
    return await apiGet<Ponto>(`/pontos/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}
