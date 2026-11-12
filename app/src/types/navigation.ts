import type { Doacao } from './doacao';

export type RootStackParamList = {
  ListaPontos: undefined;
  DetalhePonto: { id: string };
  CadastroDoacao: { doacaoToEdit?: Doacao } | undefined;
  HistoricoDoacoes: undefined;
  DetalheDoacao: { doacao: Doacao };
};
