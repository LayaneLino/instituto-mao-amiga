import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import type { Doacao } from '../types/doacao';
import { listarPagina } from '../services/doacoesService';

const TAMANHO_PAGINA = 10;
const MSG_ERRO =
  'Não foi possível carregar o histórico de doações. Verifique se a API está no ar e tente novamente.';

const DoacaoItem = React.memo(({ doacao }: { doacao: Doacao }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dataFormatada = new Date(doacao.criadoEm).toLocaleDateString('pt-BR');
  const quantidadeFormatada = doacao.quantidade.toLocaleString('pt-BR');

  return (
    <TouchableOpacity
      style={styles.cardItem}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('DetalheDoacao', { doacao })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.tituloItem} numberOfLines={2}>
          {quantidadeFormatada}x {doacao.tipoItem}
        </Text>
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
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState('');

  const paginasPedidasRef = useRef<Set<number>>(new Set());
  const idBuscaRef = useRef(0);
  const jaCarregouInicialRef = useRef(false);

  const carregarPagina = useCallback(async (numero: number, termoBusca: string) => {
    if (numero === 0) {
      paginasPedidasRef.current = new Set([0]);
    } else {
      if (paginasPedidasRef.current.has(numero)) return;
      paginasPedidasRef.current.add(numero);
    }

    const idAtual = ++idBuscaRef.current;

    try {
      const resultado = await listarPagina({
        filtro: termoBusca,
        page: numero,
        size: TAMANHO_PAGINA,
        sort: 'criadoEm,desc',
      });

      if (idAtual !== idBuscaRef.current && numero === 0) return;

      setDoacoes((atual) => (numero === 0 ? resultado.content : [...atual, ...resultado.content]));
      setPaginaAtual(resultado.page.number);
      setTotalPaginas(resultado.page.totalPages);
      setErro('');
    } catch {
      paginasPedidasRef.current.delete(numero);
      setErro(MSG_ERRO);
    }
  }, []);

  useEffect(() => {
    let cancelado = false;
    setCarregando(true);
    setErro('');
    carregarPagina(0, busca).finally(() => {
      jaCarregouInicialRef.current = true;
      if (!cancelado) setCarregando(false);
    });
    return () => {
      cancelado = true;
    };
  }, [busca, carregarPagina]);

  useFocusEffect(
    useCallback(() => {
      if (!jaCarregouInicialRef.current) return;
      carregarPagina(0, busca);
    }, [busca, carregarPagina])
  );

  async function carregarMais() {
    const proximaPagina = paginaAtual + 1;
    if (
      carregando ||
      carregandoMais ||
      atualizando ||
      erro !== '' ||
      proximaPagina >= totalPaginas ||
      paginasPedidasRef.current.has(proximaPagina)
    ) {
      return;
    }
    setCarregandoMais(true);
    await carregarPagina(proximaPagina, busca);
    setCarregandoMais(false);
  }

  async function atualizar() {
    setAtualizando(true);
    await carregarPagina(0, busca);
    setAtualizando(false);
  }

  async function tentarNovamente() {
    if (doacoes.length === 0) {
      setErro('');
      setCarregando(true);
      await carregarPagina(0, busca);
      setCarregando(false);
    } else {
      setErro('');
      setCarregandoMais(true);
      await carregarPagina(paginaAtual + 1, busca);
      setCarregandoMais(false);
    }
  }

  function renderRodape() {
    if (carregandoMais) return <ActivityIndicator style={styles.rodape} color="#00796B" />;
    if (erro !== '' && doacoes.length > 0) {
      return (
        <View style={styles.rodape}>
          <Text style={styles.erroTexto}>{erro}</Text>
          <TouchableOpacity style={styles.botaoTentar} onPress={tentarNovamente}>
            <Text style={styles.textoBotaoTentar}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  }

  function renderEmptyState() {
    if (busca.trim() !== '') {
      return (
        <View style={[styles.emptyContainer, { marginTop: 40 }]}>
          <Text style={styles.emptyText}>Nenhuma doação encontrada para "{busca}".</Text>
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
  }

  function renderConteudo() {
    if (carregando) {
      return (
        <View style={styles.estadoContainer}>
          <ActivityIndicator size="large" color="#00796B" />
          <Text style={styles.carregandoTexto}>Carregando doações...</Text>
        </View>
      );
    }

    if (erro !== '' && doacoes.length === 0) {
      return (
        <View style={styles.estadoContainer}>
          <Text style={styles.erroTexto}>{erro}</Text>
          <TouchableOpacity style={styles.botaoTentar} onPress={tentarNovamente}>
            <Text style={styles.textoBotaoTentar}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <FlatList
        data={doacoes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DoacaoItem doacao={item} />}
        contentContainerStyle={
          doacoes.length === 0 ? styles.listaVazia : styles.listaPreenchida
        }
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderRodape}
        onEndReached={carregarMais}
        onEndReachedThreshold={0.4}
        refreshing={atualizando}
        onRefresh={atualizar}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    );
  }

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

      {renderConteudo()}
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
    flexShrink: 1,
    marginRight: 12,
  },
  dataItem: {
    fontSize: 12,
    color: '#999999',
    flexShrink: 0,
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
  estadoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  carregandoTexto: {
    marginTop: 12,
    color: '#666666',
    fontSize: 15,
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
  rodape: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});
