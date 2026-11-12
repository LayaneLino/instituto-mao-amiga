import type { Doacao } from './doacao';
import type { Ponto } from './ponto';

export type RootStackParamList = {
  ListaPontos: undefined;
  DetalhePonto: { id: string };
  CadastroPonto: { pontoToEdit?: Ponto } | undefined;
  CadastroDoacao: { doacaoToEdit?: Doacao } | undefined;
  HistoricoDoacoes: undefined;
  DetalheDoacao: { id: string };
};
