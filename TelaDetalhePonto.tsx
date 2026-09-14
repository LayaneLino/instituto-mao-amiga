import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from './App';
import { type Ponto, pontosMock } from './TelaListaPontos';

function DetalhePonto({ ponto }: { ponto: Ponto }) {
  return (
    <View style={styles.container}>
      <Text style={styles.nome}>{ponto.nome}</Text>
      <Text style={styles.endereco}>{ponto.endereco}</Text>
      <Text style={styles.horarios}>{ponto.diasHorarios}</Text>
      <Text style={styles.itens}>{ponto.itensRecebeDistribui}</Text>
    </View>
  );
}

type Props = NativeStackScreenProps<RootStackParamList, 'DetalhePonto'>;

export default function TelaDetalhePonto({ route }: Props) {
  const { id } = route.params;
  
  const ponto = pontosMock.find((p) => p.id === id);

  if (!ponto) {
    return (
      <SafeAreaView style={styles.screen} edges={['bottom', 'left', 'right']}>
        <Text>Ponto não encontrado.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <DetalhePonto ponto={ponto} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  container: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 8,
    elevation: 2, 
    shadowColor: '#000', 
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  nome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B3A5C',
    marginBottom: 8,
  },
  endereco: {
    fontSize: 16,
    color: '#4A4A4A',
    marginBottom: 4,
  },
  horarios: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00796B',
    marginBottom: 16,
  },
  itens: {
    fontSize: 15,
    color: '#333333',
    lineHeight: 22,
  },
});