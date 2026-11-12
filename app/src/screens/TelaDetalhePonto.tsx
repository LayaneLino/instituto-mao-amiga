import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import type { Ponto } from '../types/ponto';
import { buscarPorId, excluir } from '../services/pontosService';
import { listarFavoritos, salvarFavoritos } from '../services/favoritosStorage';

function DetalhePonto({
  ponto,
  favorito,
  aoAlternarFavorito,
}: {
  ponto: Ponto;
  favorito: boolean;
  aoAlternarFavorito: () => void;
}) {
  return (
    <View style={styles.container}>
      <View style={styles.cabecalhoCard}>
        <Text style={styles.nome}>{ponto.nome}</Text>
        <TouchableOpacity
          style={styles.botaoFavorito}
          onPress={aoAlternarFavorito}
          accessibilityLabel={favorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Text style={[styles.iconeFavorito, favorito && styles.iconeFavoritoAtivo]}>
            {favorito ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Endereço</Text>
      <Text style={styles.valor}>{ponto.endereco}</Text>

      <Text style={styles.label}>Bairro</Text>
      <Text style={styles.valor}>{ponto.bairro}</Text>

      <Text style={styles.label}>Horário de funcionamento</Text>
      <Text style={styles.valor}>{ponto.horario}</Text>

      <Text style={styles.label}>Tipo</Text>
      <Text style={styles.tipoBadge}>{ponto.tipo}</Text>
    </View>
  );
}

type Props = NativeStackScreenProps<RootStackParamList, 'DetalhePonto'>;

export default function TelaDetalhePonto({ route, navigation }: Props) {
  const { id } = route.params;
  const [ponto, setPonto] = useState<Ponto | null>(null);
  const [favorito, setFavorito] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [erroExclusao, setErroExclusao] = useState('');
  const [excluindo, setExcluindo] = useState(false);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro('');
    try {
      const [dadosPonto, idsFavoritos] = await Promise.all([
        buscarPorId(id),
        listarFavoritos(),
      ]);
      setPonto(dadosPonto);
      setFavorito(idsFavoritos.includes(id));
    } catch {
      setErro(
        'Não foi possível carregar o ponto. Verifique se a API está no ar e tente novamente.'
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

  async function aoAlternarFavorito() {
    const atuais = await listarFavoritos();
    const jaEhFavorito = atuais.includes(id);
    const novosFavoritos = jaEhFavorito
      ? atuais.filter((item) => item !== id)
      : [...atuais, id];
    setFavorito(!jaEhFavorito);
    await salvarFavoritos(novosFavoritos);
  }

  async function executarExclusao() {
    if (!ponto || excluindo) return;
    setErroExclusao('');
    setExcluindo(true);
    try {
      await excluir(ponto.id);
      navigation.goBack();
    } catch {
      setErroExclusao(
        'Não foi possível excluir o ponto. Verifique se a API está no ar e tente novamente.'
      );
    } finally {
      setExcluindo(false);
    }
  }

  function confirmarExclusao() {
    if (Platform.OS === 'web') {
      if (window.confirm('Tem certeza que deseja excluir este ponto?')) {
        executarExclusao();
      }
      return;
    }

    Alert.alert('Excluir Ponto', 'Tem certeza que deseja excluir este ponto?', [
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
        <DetalhePonto
          ponto={ponto}
          favorito={favorito}
          aoAlternarFavorito={aoAlternarFavorito}
        />

        {erroExclusao !== '' && <Text style={styles.erroExclusao}>{erroExclusao}</Text>}

        <View style={styles.botoesContainer}>
          <TouchableOpacity
            style={styles.botaoEditar}
            onPress={() => navigation.navigate('CadastroPonto', { pontoToEdit: ponto })}
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
  container: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 20,
  },
  cabecalhoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  nome: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B3A5C',
    marginRight: 8,
  },
  botaoFavorito: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconeFavorito: {
    fontSize: 24,
    color: '#888888',
  },
  iconeFavoritoAtivo: {
    color: '#D32F2F',
  },
  label: {
    fontSize: 13,
    color: '#666666',
    textTransform: 'uppercase',
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  valor: {
    fontSize: 16,
    color: '#333333',
  },
  tipoBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0F2F1',
    color: '#00796B',
    fontWeight: 'bold',
    fontSize: 14,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    textTransform: 'capitalize',
    marginTop: 4,
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
    backgroundColor: '#FFFFFF',
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
