import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from './App';

import { excluirDoacao } from './doacoesStorage';

type Props = NativeStackScreenProps<RootStackParamList, 'DetalheDoacao'>;

export default function TelaDetalheDoacao({ route, navigation }: Props) {
  const { doacao } = route.params;

  const dataFormatada = new Date(doacao.criadoEm).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  const executarExclusao = async () => {
    try {
      await excluirDoacao(doacao.id);
      navigation.goBack();
    } catch (error) {
      if (Platform.OS === 'web') {
        window.alert('Erro ao excluir a doação.');
      } else {
        Alert.alert('Erro', 'Não foi possível excluir a doação.');
      }
    }
  };

  const confirmarExclusao = () => {
    if (Platform.OS === 'web') {
      const confirmado = window.confirm('Tem certeza que deseja excluir esta doação? Essa ação não pode ser desfeita.');
      if (confirmado) executarExclusao();
    } else {
      Alert.alert(
        'Excluir Doação',
        'Tem certeza que deseja excluir esta doação?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Excluir', style: 'destructive', onPress: executarExclusao }
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Item Doado</Text>
        <Text style={styles.valor}>{doacao.tipoItem}</Text>
        <View style={styles.linha} />

        <Text style={styles.label}>Quantidade</Text>
        <Text style={styles.valor}>{doacao.quantidade} unidades</Text>
        <View style={styles.linha} />

        <Text style={styles.label}>Destino</Text>
        <Text style={styles.valor}>{doacao.pontoDestino}</Text>
        <View style={styles.linha} />

        <Text style={styles.label}>Data do Registro</Text>
        <Text style={styles.valor}>{dataFormatada}</Text>
      </View>

      <TouchableOpacity style={styles.botaoExcluir} onPress={confirmarExclusao}>
        <Text style={styles.textoBotaoExcluir}>Excluir Doação</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    color: '#666666',
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 4,
  },
  valor: {
    fontSize: 18,
    color: '#1B3A5C',
    fontWeight: 'bold',
  },
  linha: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 16,
  },
  botaoExcluir: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#D32F2F',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBotaoExcluir: {
    color: '#D32F2F',
    fontWeight: 'bold',
    fontSize: 16,
  },
});