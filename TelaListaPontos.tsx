import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from './App';

export type Ponto = {
  id: string;
  nome: string;
  endereco: string;
  diasHorarios: string;
  itensRecebeDistribui: string;
};

export const pontosMock: Ponto[] = [
  {
    id: '1',
    nome: 'Instituto Mão Amiga',
    endereco: 'Avenida Jamel Cecílio',
    diasHorarios: 'Segunda a Sexta, das 08h às 18h',
    itensRecebeDistribui: 'Recebe: Alimentos e roupas.',
  },
  {
    id: '2',
    nome: 'Fatesg',
    endereco: 'Rua 227a',
    diasHorarios: 'Segunda a Sexta, das 08h às 21h',
    itensRecebeDistribui: 'Recebe: Brinquedos e materiais escolares.',
  },
  {
    id: '3',
    nome: 'Sesi Multiparque',
    endereco: 'Avenida João Leite',
    diasHorarios: 'Sábados, das 08h às 12h',
    itensRecebeDistribui: 'Recebe: Móveis/eletrodomésticos e sapatos.',
  },
  {
    id: '4',
    nome: 'Casa da Indústria',
    endereco: 'Avenida Araguaia',
    diasHorarios: 'Sábados, das 12h às 16h',
    itensRecebeDistribui: 'Recebe: Itens de cama, mesa e banho.',
  },
  { 
    id: '5', 
    nome: 'Centro Cultural Oscar Niemeyer', 
    endereco: 'GO-020', 
    diasHorarios: 'Terça a Domingo, das 14h às 19h', 
    itensRecebeDistribui: 'Distribui: Cestas básicas e produtos de higiene pessoal.' 
  },
  { 
    id: '6', 
    nome: 'Shopping Flamboyant', 
    endereco: 'Avenida Deputado Jamel Cecílio', 
    diasHorarios: 'Domingos, das 07h às 13h', 
    itensRecebeDistribui: 'Distribui: Marmitas prontas e agasalhos.' 
  },
  { 
    id: '7', 
    nome: 'Shopping Cerrado', 
    endereco: 'Avenida Anhanguera', 
    diasHorarios: 'Quartas e Sextas, das 09h às 17h', 
    itensRecebeDistribui: 'Distribui: Roupas infantis e fraldas.' 
  },
  { 
    id: '8', 
    nome: 'Shopping Passeio das Águas', 
    endereco: 'Avenida Perimetral Norte', 
    diasHorarios: 'Segundas-feiras, das 18h às 21h', 
    itensRecebeDistribui: 'Distribui: Cobertores e refeições.' 
  },
];

const CHAVE_FAVORITOS = '@mao_amiga:pontos_favoritos';

function PontoItem({ ponto, onPress, isFavorito, onToggleFavorito }: { ponto: Ponto; onPress: () => void; isFavorito: boolean; onToggleFavorito: () => void }) {
  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity style={styles.cardContent} onPress={onPress} activeOpacity={0.7}>
        <Text style={styles.nomePonto}>{ponto.nome}</Text>
        <Text style={styles.enderecoPonto}>{ponto.endereco}</Text>
        <Text style={styles.itensPonto}>{ponto.itensRecebeDistribui}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botaoFavorito} onPress={onToggleFavorito}>
        <Text style={styles.favoritoTexto}>{isFavorito ? '★' : '☆'}</Text>
      </TouchableOpacity>
    </View>
  );
}

type Props = NativeStackScreenProps<RootStackParamList, 'ListaPontos'>;

export default function TelaListaPontos({ navigation }: Props) {
  const [favoritos, setFavoritos] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(CHAVE_FAVORITOS).then((salvo) => {
      if (salvo) {
        try {
          const arrayParseado = JSON.parse(salvo);
          if (Array.isArray(arrayParseado)) setFavoritos(arrayParseado);
        } catch (e) {
          console.error('Erro ao ler favoritos', e);
        }
      }
    });
  }, []);

  function alternarFavorito(id: string) {
    setFavoritos((atual) => {
      const listaAtual = Array.isArray(atual) ? atual : [];
      const novo = listaAtual.includes(id)
        ? listaAtual.filter((favId) => favId !== id)
        : [...listaAtual, id];

      AsyncStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(novo));
      return novo;
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.tituloTela}>Pontos de Coleta</Text>

      <TouchableOpacity
        style={styles.botaoNovaDoacao}
        onPress={() => navigation.navigate('CadastroDoacao')}
      >
        <Text style={styles.textoBotaoNovaDoacao}>Nova Doação</Text>
      </TouchableOpacity>

      <FlatList
        data={pontosMock}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PontoItem
            ponto={item}
            isFavorito={favoritos.includes(item.id)}
            onToggleFavorito={() => alternarFavorito(item.id)}
            onPress={() => navigation.navigate('DetalhePonto', { id: item.id })} 
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
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
  botaoNovaDoacao: {
    backgroundColor: '#00796B',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  textoBotaoNovaDoacao: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
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
});