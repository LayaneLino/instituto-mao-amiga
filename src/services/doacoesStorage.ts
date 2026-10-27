import type { Doacao, NovaDoacao } from '../types/doacao';
import { lerJSON, salvarJSON } from './storage';

const CHAVE_DOACOES = '@mao_amiga:historico_doacoes';

function ehDoacao(valor: unknown): valor is Doacao {
  if (typeof valor !== 'object' || valor === null) return false;
  const d = valor as Record<string, unknown>;
  return (
    typeof d.id === 'string' &&
    typeof d.tipoItem === 'string' &&
    typeof d.quantidade === 'number' &&
    typeof d.pontoDestino === 'string' &&
    typeof d.criadoEm === 'string'
  );
}

// Lê a lista; se o AsyncStorage falhar, o erro sobe (para não sobrescrever
// dados bons com uma lista vazia numa operação de escrita).
async function lerLista(): Promise<Doacao[]> {
  const salvo = await lerJSON<unknown>(CHAVE_DOACOES);
  return Array.isArray(salvo) ? salvo.filter(ehDoacao) : [];
}

// Todas as operações são "ler -> alterar -> gravar a lista inteira".
// Executá-las em fila evita que duas operações simultâneas
// (ex.: toque duplo) se sobrescrevam.
let fila: Promise<unknown> = Promise.resolve();
function emSequencia<T>(tarefa: () => Promise<T>): Promise<T> {
  const resultado = fila.then(tarefa);
  fila = resultado.catch(() => undefined);
  return resultado;
}

export async function listarDoacoes(): Promise<Doacao[]> {
  try {
    return await lerLista();
  } catch (error) {
    console.error('Erro ao buscar as doações:', error);
    return [];
  }
}

export async function obterDoacao(id: string): Promise<Doacao | undefined> {
  const doacoes = await listarDoacoes();
  return doacoes.find((d) => d.id === id);
}

export function salvarDoacao(novaDoacao: NovaDoacao): Promise<void> {
  return emSequencia(async () => {
    try {
      const doacoesAtuais = await lerLista();
      const doacaoCompleta: Doacao = {
        ...novaDoacao,
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
        criadoEm: new Date().toISOString(),
      };
      await salvarJSON(CHAVE_DOACOES, [...doacoesAtuais, doacaoCompleta]);
    } catch (error) {
      console.error('Erro ao salvar a doação:', error);
      throw new Error('Não foi possível salvar a doação.');
    }
  });
}

export function atualizarDoacao(doacaoAtualizada: Doacao): Promise<void> {
  return emSequencia(async () => {
    try {
      const doacoesAtuais = await lerLista();
      const novaLista = doacoesAtuais.map((doacao) =>
        doacao.id === doacaoAtualizada.id ? doacaoAtualizada : doacao
      );
      await salvarJSON(CHAVE_DOACOES, novaLista);
    } catch (error) {
      console.error('Erro ao atualizar a doação:', error);
      throw new Error('Não foi possível atualizar a doação.');
    }
  });
}

export function excluirDoacao(id: string): Promise<void> {
  return emSequencia(async () => {
    try {
      const doacoesAtuais = await lerLista();
      await salvarJSON(CHAVE_DOACOES, doacoesAtuais.filter((d) => d.id !== id));
    } catch (error) {
      console.error('Erro ao excluir a doação:', error);
      throw new Error('Não foi possível excluir a doação.');
    }
  });
}
