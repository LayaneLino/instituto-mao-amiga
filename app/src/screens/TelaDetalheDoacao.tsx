import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import type { Doacao } from '../types/doacao';
import { buscarPorId, excluir } from '../services/doacoesService';

type Props = NativeStackScreenProps<RootStackParamList, 'DetalheDoacao'>;

export default function TelaDetalheDoacao({ route, navigation }: Props) {
  const { id } = route.params;
  const [doacao, setDoacao] = useState<Doacao | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [erroExclusao, setErroExclusao] = useState('');
  const [excluindo, setExcluindo] = useState(false);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro('');
    try {
      setDoacao(await buscarPorId(id));
    } catch {
      setErro(
        'Não foi possível carregar a doação. Verifique se a API está no ar e tente novamente.'
      );
    } finally {
      setCarregando(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  async function executarExclusao() {
    if (!doacao || excluindo) return;
    setErroExclusao('');
    setExcluindo(true);
    try {
      await excluir(doacao.id);
      navigation.goBack();
    } catch {
      setErroExclusao(
        'Não foi possível excluir a doação. Verifique se a API está no ar e tente novamente.'
      );
    } finally {
      setExcluindo(false);
    }
  }

  function confirmarExclusao() {
    if (Platform.OS === 'web') {
      if (window.confirm('Tem certeza que deseja excluir esta doação?')) {
        executarExclusao();
      }
      return;
    }

    Alert.alert('Excluir Doação', 'Tem certeza que deseja excluir esta doação?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: executarExclusao },
    ]);
  }

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

  if (!doacao) {
    return (
      <SafeAreaView style={styles.screen} edges={['bottom', 'left', 'right']}>
        <View style={styles.estadoContainer}>
          <Text style={styles.naoEncontrado}>Doação não encontrada.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const dataFormatada = new Date(doacao.criadoEm).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <SafeAreaView style={styles.screen} edges={['bottom', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.label}>Item Doado</Text>
          <Text style={styles.valor}>{doacao.tipoItem}</Text>
          <View style={styles.linha} />

          <Text style={styles.label}>Quantidade</Text>
          <Text style={styles.valor}>
            {doacao.quantidade.toLocaleString('pt-BR')} unidades
          </Text>
          <View style={styles.linha} />

          <Text style={styles.label}>Destino</Text>
          <Text style={styles.valor}>{doacao.pontoDestino}</Text>
          <View style={styles.linha} />

          <Text style={styles.label}>Data do Registro</Text>
          <Text style={styles.valor}>{dataFormatada}</Text>
        </View>

        {erroExclusao !== '' && <Text style={styles.erroExclusao}>{erroExclusao}</Text>}

        <View style={styles.botoesContainer}>
          <TouchableOpacity
            style={styles.botaoEditar}
            onPress={() => navigation.navigate('CadastroDoacao', { doacaoToEdit: doacao })}
            disabled={excluindo}
          >
            <Text style={styles.textoBotaoEditar}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.botaoExcluir, excluindo && styles.botaoDesabilitado]}
            onPress={confirmarExclusao}
            disabled={excluindo}
          >
            <Text style={styles.textoBotaoExcluir}>
              {excluindo ? 'Excluindo...' : 'Excluir'}
            </Text>
          </TouchableOpacity>
        </View>
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
  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  botaoEditar: {
    flex: 1,
    backgroundColor: '#00796B',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  textoBotaoEditar: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  botaoExcluir: {
    flex: 1,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#D32F2F',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  textoBotaoExcluir: {
    color: '#D32F2F',
    fontWeight: 'bold',
    fontSize: 16,
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  erroExclusao: {
    color: '#D32F2F',
    fontWeight: '500',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
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
  erroTexto: {
    color: '#D32F2F',
    fontWeight: '500',
    fontSize: 15,
    textAlign: 'center',
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
});
