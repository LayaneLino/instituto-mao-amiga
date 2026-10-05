import AsyncStorage from '@react-native-async-storage/async-storage';

export type Doacao = {
  id: string;
  tipoItem: string;
  quantidade: number;
  pontoDestino: string;
  criadoEm: string;
};

const CHAVE_DOACOES = '@mao_amiga:historico_doacoes';

export async function listarDoacoes(): Promise<Doacao[]> {
  try {
    const doacoesSalvas = await AsyncStorage.getItem(CHAVE_DOACOES);
    return doacoesSalvas ? JSON.parse(doacoesSalvas) : [];
  } catch (error) {
    console.error('Erro ao buscar as doações:', error);
    return [];
  }
}

export async function salvarDoacao(novaDoacao: Omit<Doacao, 'id' | 'criadoEm'>): Promise<void> {
  try {
    const doacoesAtuais = await listarDoacoes();

    const doacaoCompleta: Doacao = {
      ...novaDoacao,
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      criadoEm: new Date().toISOString(),
    };

    const novaLista = [...doacoesAtuais, doacaoCompleta];

    await AsyncStorage.setItem(CHAVE_DOACOES, JSON.stringify(novaLista));
  } catch (error) {
    console.error('Erro ao salvar a doação:', error);
    throw new Error('Não foi possível salvar a doação.');
  }
}

export async function excluirDoacao(id: string): Promise<void> {
  try {
    const doacoesAtuais = await listarDoacoes();

    const novaLista = doacoesAtuais.filter((doacao) => doacao.id !== id);

    await AsyncStorage.setItem(CHAVE_DOACOES, JSON.stringify(novaLista));
  } catch (error) {
    console.error('Erro ao excluir a doação:', error);
    throw new Error('Não foi possível excluir a doação.');
  }
}

export async function obterDoacao(id: string): Promise<Doacao | undefined> {
  const doacoes = await listarDoacoes();
  return doacoes.find((d) => d.id === id);
}

export async function atualizarDoacao(doacaoAtualizada: Doacao): Promise<void> {
  try {
    const doacoesAtuais = await listarDoacoes();

    const novaLista = doacoesAtuais.map((doacao) =>
      doacao.id === doacaoAtualizada.id ? doacaoAtualizada : doacao
    );

    await AsyncStorage.setItem(CHAVE_DOACOES, JSON.stringify(novaLista));
  } catch (error) {
    console.error('Erro ao atualizar a doação:', error);
    throw new Error('Não foi possível atualizar a doação.');
  }
}