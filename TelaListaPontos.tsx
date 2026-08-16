import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
];

function PontoItem({ ponto, onPress }: { ponto: Ponto; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.nomePonto}>{ponto.nome}</Text>
      <Text style={styles.enderecoPonto}>{ponto.endereco}</Text>
      <Text style={styles.itensPonto}>{ponto.itensRecebeDistribui}</Text>
    </TouchableOpacity>
  );
}

type Props = NativeStackScreenProps<RootStackParamList, 'ListaPontos'>;

export default function TelaListaPontos({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.tituloTela}>Pontos de Coleta</Text>
      
      {pontosMock.map((ponto) => (
        <PontoItem 
          key={ponto.id} 
          ponto={ponto} 
          onPress={() => navigation.navigate('DetalhePonto', { id: ponto.id })} 
        />
      ))}
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
  card: {
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
});