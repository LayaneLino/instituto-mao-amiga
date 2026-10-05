import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TelaListaPontos from './TelaListaPontos';
import TelaDetalhePonto from './TelaDetalhePonto';
import TelaCadastroDoacao from './TelaCadastroDoacao';
import { type Doacao } from './doacoesStorage';
import TelaDetalheDoacao from './TelaDetalheDoacao';

import TelaHistoricoDoacoes from './TelaHistoricoDoacoes';

export type RootStackParamList = {
  ListaPontos: undefined;
  DetalhePonto: { id: string };
  CadastroDoacao: undefined;
  HistoricoDoacoes: undefined;
  DetalheDoacao: { doacao: Doacao };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ListaPontos" screenOptions={{ headerBackButtonDisplayMode: 'minimal' }}>
        <Stack.Screen
          name="ListaPontos"
          component={TelaListaPontos}
          options={{ title: 'Instituto Mão Amiga' }}
        />
        <Stack.Screen
          name="DetalhePonto"
          component={TelaDetalhePonto}
          options={{ title: 'Detalhes do Ponto' }}
        />
        <Stack.Screen
          name="CadastroDoacao"
          component={TelaCadastroDoacao}
          options={{ title: 'Nova Doação' }}
        />

        <Stack.Screen
          name="HistoricoDoacoes"
          component={TelaHistoricoDoacoes}
          options={{ title: 'Minhas Doações' }}
        />
        <Stack.Screen
          name="DetalheDoacao"
          component={TelaDetalheDoacao}
          options={{ title: 'Doação' }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}