import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './src/types/navigation';
import TelaListaPontos from './src/screens/TelaListaPontos';
import TelaDetalhePonto from './src/screens/TelaDetalhePonto';
import TelaCadastroPonto from './src/screens/TelaCadastroPonto';
import TelaCadastroDoacao from './src/screens/TelaCadastroDoacao';
import TelaHistoricoDoacoes from './src/screens/TelaHistoricoDoacoes';
import TelaDetalheDoacao from './src/screens/TelaDetalheDoacao';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="ListaPontos"
        screenOptions={{ headerBackButtonDisplayMode: 'minimal' }}
      >
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
          name="CadastroPonto"
          component={TelaCadastroPonto}
          options={({ route }) => ({
            title: route.params?.pontoToEdit ? 'Editar Ponto' : 'Novo Ponto',
          })}
        />
        <Stack.Screen
          name="CadastroDoacao"
          component={TelaCadastroDoacao}
          options={({ route }) => ({
            title: route.params?.doacaoToEdit ? 'Editar Doação' : 'Nova Doação',
          })}
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
