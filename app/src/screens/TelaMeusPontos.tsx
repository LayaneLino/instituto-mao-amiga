import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import type { Ponto } from '../types/ponto';
import { buscarPorId } from '../services/pontosService';
import { listarFavoritos, removerFavorito } from '../services/favoritosStorage';

type Props = NativeStackScreenProps<RootStackParamList, 'MeusPontos'>;

export default function TelaMeusPontos({ navigation }: Props) {
  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregarFavoritos = useCallback(async () => {
    setCarregando(true);
    setErro('');
    try {
      const ids = await listarFavoritos();
      if (ids.length === 0) {
        setPontos([]);
        return;
      }

      const resultados = await Promise.all(ids.map((id) => buscarPorId(id)));
      const encontrados = resultados.filter((p): p is Ponto => p !== null);
      setPontos(encontrados);
    } catch {
      setErro(
        'Não foi possível carregar seus pontos favoritos. Verifique se a API está no ar e tente novamente.'
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarFavoritos();
    }, [carregarFavoritos])
  );

  async function desmarcarFavorito(id: string) {
    setPontos((atual) => atual.filter((p) => p.id !== id));
    await removerFavorito(id);
  }

  if (carregando) {
    return (
      <View style={styles.estadoContainer}>
        <ActivityIndicator size="large" color="#00796B" />
      </View>
    );
  }

  if (erro !== '') {
    return (
      <View style={styles.estadoContainer}>
        <Text style={styles.erroTexto}>{erro}</Text>
        <TouchableOpacity style={styles.botaoTentar} onPress={carregarFavoritos}>
          <Text style={styles.textoBotaoTentar}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={pontos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <TouchableOpacity
              style={styles.cardContent}
              onPress={() => navigation.navigate('DetalhePonto', { id: item.id })}
              activeOpacity={0.7}
            >
              <Text style={styles.nomePonto}>{item.nome}</Text>
              <Text style={styles.enderecoPonto}>
                {item.endereco} — {item.bairro}
              </Text>
              <Text style={styles.horarioPonto}>{item.horario}</Text>
              <Text style={styles.tipoPonto}>Tipo: {item.tipo}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botaoFavorito}
              onPress={() => desmarcarFavorito(item.id)}
              accessibilityRole="button"
              accessibilityLabel={`Remover ${item.nome} dos favoritos`}
            >
              <Text style={styles.favoritoTexto}>♥</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.vazioContainer}>
            <Text style={styles.vazioTexto}>Você ainda não tem pontos favoritos.</Text>
          </View>
        }
        contentContainerStyle={
          pontos.length === 0 ? styles.listaVazia : styles.listaPreenchida
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },
  listaPreenchida: {
    padding: 16,
    paddingBottom: 24,
  },
  listaVazia: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
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
    padding: 16,
  },
  nomePonto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B3A5C',
    marginBottom: 4,
  },
  enderecoPonto: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 4,
  },
  horarioPonto: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 4,
  },
  tipoPonto: {
    fontSize: 13,
    color: '#00796B',
    fontWeight: '600',
    textTransform: 'capitalize',
    marginTop: 2,
  },
  botaoFavorito: {
    minWidth: 44,
    minHeight: 44,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoritoTexto: {
    fontSize: 24,
    color: '#E53935',
  },
  vazioContainer: {
    alignItems: 'center',
  },
  vazioTexto: {
    textAlign: 'center',
    color: '#666666',
    fontSize: 16,
  },
  estadoContainer: {
    flex: 1,
    backgroundColor: '#F4F6F8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
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
