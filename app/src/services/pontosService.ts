import type { NovoPonto, PaginaPontos, Ponto } from '../types/ponto';
import { ApiError, del, get, post, put } from './api';

type OpcoesBuscaPagina = {
  filtro?: string;
  page?: number;
  size?: number;
  sort?: string;
};

export function listar(): Promise<Ponto[]> {
  return get<Ponto[]>('/api/v1/pontos');
}

export function buscarPagina({
  filtro = '',
  page = 0,
  size = 10,
  sort = 'nome,asc',
}: OpcoesBuscaPagina = {}): Promise<PaginaPontos> {
  const parametros: Record<string, string | number> = { page, size };
  if (sort) parametros.sort = sort;
  if (filtro.trim() !== '') parametros.filtro = filtro.trim();
  return get<PaginaPontos>('/api/v1/pontos/filtro', parametros);
}

export async function buscarPorId(id: string): Promise<Ponto | null> {
  try {
    return await get<Ponto>(`/api/v1/pontos/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export function cadastrar(dados: NovoPonto): Promise<Ponto> {
  return post<Ponto>('/api/v1/pontos', dados);
}

export function editar(id: string, dados: NovoPonto): Promise<Ponto> {
  return put<Ponto>(`/api/v1/pontos/${id}`, dados);
}

export function excluir(id: string): Promise<void> {
  return del(`/api/v1/pontos/${id}`);
}

export const listarPontos = buscarPagina;
export const listarTodosPontos = listar;
export const buscarPontoPorId = buscarPorId;
