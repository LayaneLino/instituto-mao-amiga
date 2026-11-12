import type { Doacao, NovaDoacao, PaginaDoacoes } from '../types/doacao';
import { ApiError, del, get, post, put } from './api';

type OpcoesBuscaPagina = {
  filtro?: string;
  page?: number;
  size?: number;
  sort?: string;
};

export function listarPagina({
  filtro = '',
  page = 0,
  size = 10,
  sort = 'criadoEm,desc',
}: OpcoesBuscaPagina = {}): Promise<PaginaDoacoes> {
  const parametros: Record<string, string | number> = { page, size };
  if (sort) parametros.sort = sort;
  if (filtro.trim() !== '') parametros.filtro = filtro.trim();
  return get<PaginaDoacoes>('/api/v1/doacoes/filtro', parametros);
}

export async function buscarPorId(id: string): Promise<Doacao | null> {
  try {
    return await get<Doacao>(`/api/v1/doacoes/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export function cadastrar(dados: NovaDoacao): Promise<Doacao> {
  return post<Doacao>('/api/v1/doacoes', dados);
}

export function editar(id: string, dados: NovaDoacao): Promise<Doacao> {
  return put<Doacao>(`/api/v1/doacoes/${id}`, dados);
}

export function excluir(id: string): Promise<void> {
  return del(`/api/v1/doacoes/${id}`);
}
