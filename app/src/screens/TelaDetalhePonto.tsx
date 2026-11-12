import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import type { Ponto } from '../types/ponto';
import { buscarPontoPorId } from '../services/pontosService';

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
  const [ponto, setPonto] = useState<Ponto | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro('');
    try {
      setPonto(await buscarPontoPorId(id)); // null = a API respondeu 404
    } catch {
      setErro('Não foi possível carregar o ponto. Verifique se a API está no ar e tente novamente.');
    } finally {
      setCarregando(false);
    }
  }, [id]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  if (carregando) {
    return (
      <SafeAreaView style={styles.screen} edges={['bottom', 'left', 'right']}>
        <ActivityIndicator size="large" color="#00796B" style={styles.carregando} />
      </SafeAreaView>
    );
  }

  if (erro !== '') {
    return (
      <SafeAreaView style={styles.screen} edges={['bottom', 'left', 'right']}>
        <View style={styles.estadoContainer}>
          <Text style={styles.erroTexto}>{erro}</Text>
          <TouchableOpacity style={styles.botaoTentar} onPress={carregar}>
            <Text style={styles.textoBotaoTentar}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!ponto) {
    return (
      <SafeAreaView style={styles.screen} edges={['bottom', 'left', 'right']}>
        <View style={styles.estadoContainer}>
          <Text style={styles.naoEncontrado}>Ponto não encontrado.</Text>
        </View>
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
  botaoTentar: {
    backgroundColor: '#00796B',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  textoBotaoTentar: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  erroTexto: {
    color: '#D32F2F',
    fontWeight: '500',
    fontSize: 15,
    textAlign: 'center',
  },
  estadoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  carregando: {
    marginTop: 40,
  },
  naoEncontrado: {
    fontSize: 18,
    color: '#4A4A4A',
    fontWeight: '600',
    textAlign: 'center',
  },
});
