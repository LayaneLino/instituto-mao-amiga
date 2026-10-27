import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import type { Ponto } from '../types/ponto';
import { listarPontos } from '../services/pontosService';
import { listarFavoritos, salvarFavoritos } from '../services/favoritosStorage';

const TAMANHO_PAGINA = 20;
const MSG_ERRO = 'Não foi possível carregar os pontos de coleta. Verifique se a API está no ar e tente novamente.';

function PontoItem({ ponto, onPress, isFavorito, onToggleFavorito }: { ponto: Ponto; onPress: () => void; isFavorito: boolean; onToggleFavorito: () => void }) {
  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity style={styles.cardContent} onPress={onPress} activeOpacity={0.7}>
        <Text style={styles.nomePonto}>{ponto.nome}</Text>
        <Text style={styles.enderecoPonto}>{ponto.endereco}</Text>
        <Text style={styles.itensPonto}>{ponto.itensRecebeDistribui}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botaoFavorito}
        onPress={onToggleFavorito}
        accessibilityRole="button"
        accessibilityLabel={isFavorito ? `Remover ${ponto.nome} dos favoritos` : `Adicionar ${ponto.nome} aos favoritos`}
      >
        <Text style={styles.favoritoTexto}>{isFavorito ? '★' : '☆'}</Text>
      </TouchableOpacity>
    </View>
  );
}

type Props = NativeStackScreenProps<RootStackParamList, 'ListaPontos'>;

export default function TelaListaPontos({ navigation }: Props) {
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [carregandoMais, setCarregandoMais] = useState(false);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState('');

  const [favoritos, setFavoritos] = useState<number[]>([]);
  const [favoritosCarregados, setFavoritosCarregados] = useState(false);

  const carregarPagina = useCallback(async (numero: number) => {
    try {
      const resultado = await listarPontos({ page: numero, size: TAMANHO_PAGINA, sort: 'id,asc' });
      setPontos((atual) => (numero === 0 ? resultado.content : [...atual, ...resultado.content]));
      setPaginaAtual(resultado.page.number);
      setTotalPaginas(resultado.page.totalPages);
      setErro('');
    } catch {
      setErro(MSG_ERRO);
    }
  }, []);

  useEffect(() => {
    carregarPagina(0).finally(() => setCarregando(false));
  }, [carregarPagina]);

  useEffect(() => {
    listarFavoritos().then((ids) => {
      setFavoritos(ids);
      setFavoritosCarregados(true);
    });
  }, []);

  // Só grava depois de ter carregado, para não sobrescrever os favoritos salvos.
  useEffect(() => {
    if (favoritosCarregados) salvarFavoritos(favoritos);
  }, [favoritos, favoritosCarregados]);

  function alternarFavorito(id: number) {
    if (!favoritosCarregados) return;
    setFavoritos((atual) => (atual.includes(id) ? atual.filter((favId) => favId !== id) : [...atual, id]));
  }

  async function carregarMais() {
    if (carregando || carregandoMais || atualizando || erro !== '' || paginaAtual + 1 >= totalPaginas) return;
    setCarregandoMais(true);
    await carregarPagina(paginaAtual + 1);
    setCarregandoMais(false);
  }

  async function atualizar() {
    setAtualizando(true);
    await carregarPagina(0);
    setAtualizando(false);
  }

  async function tentarNovamente() {
    if (pontos.length === 0) {
      setErro('');
      setCarregando(true);
      await carregarPagina(0);
      setCarregando(false);
    } else {
      setErro('');
      setCarregandoMais(true);
      await carregarPagina(paginaAtual + 1);
      setCarregandoMais(false);
    }
  }

  function renderRodape() {
    if (carregandoMais) return <ActivityIndicator style={styles.rodape} color="#00796B" />;
    if (erro !== '' && pontos.length > 0) {
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

  function renderConteudo() {
    if (carregando) {
      return <ActivityIndicator size="large" color="#00796B" style={styles.carregandoInicial} />;
    }

    if (erro !== '' && pontos.length === 0) {
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
        data={pontos}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <PontoItem
            ponto={item}
            isFavorito={favoritos.includes(item.id)}
            onToggleFavorito={() => alternarFavorito(item.id)}
            onPress={() => navigation.navigate('DetalhePonto', { id: item.id })}
          />
        )}
        ListEmptyComponent={<Text style={styles.vazioTexto}>Nenhum ponto de coleta cadastrado.</Text>}
        ListFooterComponent={renderRodape}
        onEndReached={carregarMais}
        onEndReachedThreshold={0.5}
        refreshing={atualizando}
        onRefresh={atualizar}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.tituloTela}>Pontos de Coleta</Text>

      <View style={styles.botoesHeader}>
        <TouchableOpacity
          style={[styles.botaoHeader, styles.botaoHistorico]}
          onPress={() => navigation.navigate('HistoricoDoacoes')}
        >
          <Text style={styles.textoBotaoHistorico}>Meu Histórico</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.botaoHeader, styles.botaoDoar]}
          onPress={() => navigation.navigate('CadastroDoacao')}
        >
          <Text style={styles.textoBotaoNovaDoacao}>Nova Doação</Text>
        </TouchableOpacity>
      </View>

      {renderConteudo()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
    padding: 16,
  },
  tituloTela: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B3A5C',
    marginBottom: 16,
    marginTop: 8,
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  cardContent: {
    flex: 1,
    padding: 16
  },
  nomePonto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B3A5C',
    marginBottom: 4,
  },
  enderecoPonto: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  itensPonto: {
    fontSize: 13,
    color: '#00796B',
    fontWeight: '600',
    marginTop: 4,
  },
  botoesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  botaoHeader: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  botaoHistorico: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#00796B',
    marginRight: 8,
  },
  botaoDoar: {
    backgroundColor: '#00796B',
    marginLeft: 8,
  },
  textoBotaoHistorico: {
    color: '#00796B',
    fontWeight: 'bold',
    fontSize: 15,
  },
  textoBotaoNovaDoacao: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  botaoFavorito: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  favoritoTexto: {
    fontSize: 24,
    color: '#FBC02D'
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
  carregandoInicial: {
    marginTop: 40,
  },
  vazioTexto: {
    textAlign: 'center',
    color: '#666666',
    fontSize: 16,
    marginTop: 40,
  },
  rodape: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});
