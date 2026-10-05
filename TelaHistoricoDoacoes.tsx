import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from './App';

import { listarDoacoes, type Doacao } from './doacoesStorage';

const DoacaoItem = React.memo(({ doacao }: { doacao: Doacao }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dataFormatada = new Date(doacao.criadoEm).toLocaleDateString('pt-BR');

  return (
    <TouchableOpacity
      style={styles.cardItem}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('DetalheDoacao', { doacao })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.tituloItem}>{doacao.quantidade}x {doacao.tipoItem}</Text>
        <Text style={styles.dataItem}>{dataFormatada}</Text>
      </View>
      <Text style={styles.destinoItem}>Destino: {doacao.pontoDestino}</Text>
    </TouchableOpacity>
  );
});

type Props = NativeStackScreenProps<RootStackParamList, 'HistoricoDoacoes'>;

export default function TelaHistoricoDoacoes({ navigation }: Props) {
  const [doacoes, setDoacoes] = useState<Doacao[]>([]);
  const [busca, setBusca] = useState('');
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      listarDoacoes().then((dados) => {
        if (isActive) setDoacoes(dados.reverse());
      });
      return () => { isActive = false; };
    }, [])
  );

  const doacoesFiltradas = doacoes.filter((doacao) =>
    doacao.tipoItem.toLowerCase().includes(busca.toLowerCase())
  );

  const renderEmptyState = () => {
    if (busca.trim() !== '') {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Nenhuma doação encontrada para "{busca}".
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Você ainda não tem doações registradas.</Text>
        <TouchableOpacity
          style={styles.botaoNovaDoacao}
          onPress={() => navigation.navigate('CadastroDoacao')}
        >
          <Text style={styles.textoBotaoNovaDoacao}>Fazer minha primeira doação</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.buscaContainer}>
        <TextInput
          style={styles.inputBusca}
          placeholder="Buscar por tipo de item..."
          value={busca}
          onChangeText={setBusca}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      <FlatList
        data={doacoesFiltradas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DoacaoItem doacao={item} />}
        contentContainerStyle={doacoesFiltradas.length === 0 ? styles.listaVazia : styles.listaPreenchida}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },
  buscaContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  inputBusca: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  // RESTANTE DOS ESTILOS
  listaPreenchida: {
    padding: 16,
    paddingTop: 8,
  },
  listaVazia: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  cardItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tituloItem: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B3A5C',
  },
  dataItem: {
    fontSize: 12,
    color: '#999999',
  },
  destinoItem: {
    fontSize: 14,
    color: '#4A4A4A',
  },
  emptyContainer: {
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  botaoNovaDoacao: {
    backgroundColor: '#00796B',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  textoBotaoNovaDoacao: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});