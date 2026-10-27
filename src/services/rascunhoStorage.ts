import { lerJSON, removerChave, salvarJSON } from './storage';

const CHAVE_RASCUNHO = '@mao_amiga:rascunho_doacao';

export type Rascunho = {
  tipoItem: string;
  quantidade: string;
  pontoDestino: string;
};

export async function carregarRascunho(): Promise<Rascunho | null> {
  try {
    const salvo = await lerJSON<unknown>(CHAVE_RASCUNHO);
    if (typeof salvo !== 'object' || salvo === null) return null;
    const r = salvo as Record<string, unknown>;
    return {
      tipoItem: typeof r.tipoItem === 'string' ? r.tipoItem : '',
      quantidade: typeof r.quantidade === 'string' ? r.quantidade : '',
      pontoDestino: typeof r.pontoDestino === 'string' ? r.pontoDestino : '',
    };
  } catch (error) {
    console.error('Erro ao ler rascunho', error);
    return null;
  }
}

export async function salvarRascunho(rascunho: Rascunho): Promise<void> {
  try {
    await salvarJSON(CHAVE_RASCUNHO, rascunho);
  } catch (error) {
    console.error('Erro ao salvar rascunho', error);
  }
}

export async function limparRascunho(): Promise<void> {
  try {
    await removerChave(CHAVE_RASCUNHO);
  } catch (error) {
    console.error('Erro ao limpar rascunho', error);
  }
}
