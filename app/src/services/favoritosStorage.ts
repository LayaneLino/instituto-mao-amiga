import { lerJSON, salvarJSON } from './storage';

const CHAVE_FAVORITOS = '@mao_amiga:pontos_favoritos';

export async function listarFavoritos(): Promise<string[]> {
  try {
    const salvo = await lerJSON<unknown>(CHAVE_FAVORITOS);
    if (!Array.isArray(salvo)) return [];
    return salvo.filter((v): v is string => typeof v === 'string' && v.trim() !== '');
  } catch (error) {
    console.error('Erro ao ler favoritos', error);
    return [];
  }
}

export async function salvarFavoritos(ids: string[]): Promise<void> {
  try {
    await salvarJSON(CHAVE_FAVORITOS, ids);
  } catch (error) {
    console.error('Erro ao salvar favoritos', error);
  }
}
