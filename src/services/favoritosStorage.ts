import { lerJSON, salvarJSON } from './storage';

const CHAVE_FAVORITOS = '@mao_amiga:pontos_favoritos';

// Retorna os ids dos pontos favoritos. Versões antigas do app guardavam ids como
// texto ("1"); aqui eles são convertidos para número, que é o id usado pela API.
export async function listarFavoritos(): Promise<number[]> {
  try {
    const salvo = await lerJSON<unknown>(CHAVE_FAVORITOS);
    if (!Array.isArray(salvo)) return [];
    return salvo.map((v) => Number(v)).filter((n) => Number.isInteger(n));
  } catch (error) {
    console.error('Erro ao ler favoritos', error);
    return [];
  }
}

export async function salvarFavoritos(ids: number[]): Promise<void> {
  try {
    await salvarJSON(CHAVE_FAVORITOS, ids);
  } catch (error) {
    console.error('Erro ao salvar favoritos', error);
  }
}
