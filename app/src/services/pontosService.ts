import type { PaginaPontos, Ponto } from '../types/ponto';
import { ApiError, apiGet } from './api';

const TAMANHO_MAXIMO_PAGINA = 50; // limite definido pela API

type OpcoesListagem = {
  page?: number;
  size?: number;
  sort?: string; // ex.: "nome,asc"
};

export function listarPontos({ page = 0, size = 20, sort }: OpcoesListagem = {}): Promise<PaginaPontos> {
  const parametros: Record<string, string | number> = { page, size };
  if (sort) parametros.sort = sort;
  return apiGet<PaginaPontos>('/pontos', parametros);
}

// Percorre todas as páginas (usado onde a tela precisa de todos os pontos, como o seletor de destino).
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

// Devolve null quando a API responde 404 (ponto não existe). Outros erros sobem.
export async function buscarPontoPorId(id: number): Promise<Ponto | null> {
  try {
    return await apiGet<Ponto>(`/pontos/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}
