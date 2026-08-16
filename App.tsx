import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TelaListaPontos from './TelaListaPontos';
import TelaDetalhePonto from './TelaDetalhePonto';

export type RootStackParamList = {
  ListaPontos: undefined;
  DetalhePonto: { id: string };
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}