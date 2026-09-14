import React, { useRef, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Keyboard, 
  Alert, 
  KeyboardAvoidingView, 
  ScrollView, 
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from './App';

type Props = NativeStackScreenProps<RootStackParamList, 'CadastroDoacao'>;

export default function TelaCadastroDoacao({ navigation }: Props) {
  const [tipoItem, setTipoItem] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [pontoDestino, setPontoDestino] = useState('');
  const [erro, setErro] = useState('');
  const inputQuantidadeRef = useRef<TextInput>(null);
  const inputPontoRef = useRef<TextInput>(null);

  function validarFormulario() {
    if (tipoItem.trim() === '') {
      setErro('O tipo do item não pode ficar vazio!');
      return;
    }

    const qtdNumerica = Number(quantidade.trim());
    if (quantidade.trim() === '' || isNaN(qtdNumerica) || qtdNumerica <= 0 || !Number.isInteger(qtdNumerica)) {
      setErro('A quantidade deve ser um número válido!');
      return;
    }

    if (pontoDestino.trim() === '') {
      setErro('O ponto de destino não pode ficar vazio!');
      return;
    }

    setErro('');
    Keyboard.dismiss();
    Alert.alert(
      'Sucesso!',
      `Doação de ${qtdNumerica}x ${tipoItem} para "${pontoDestino}" registrada!`,
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );

    setTipoItem('');
    setQuantidade('');
    setPontoDestino('');
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.titulo}>Registrar Doação</Text>
          <Text style={styles.subtitulo}>Preencha os dados do item doado.</Text>

          <View style={styles.formulario}>
            <Text style={styles.label}>Tipo do Item</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Cesta básica, Casaco..."
              value={tipoItem}
              onChangeText={setTipoItem}
              returnKeyType="next"
              onSubmitEditing={() => inputQuantidadeRef.current?.focus()}
            />

            <Text style={styles.label}>Quantidade</Text>
            <TextInput
              ref={inputQuantidadeRef}
              style={styles.input}
              placeholder="Ex: 5"
              value={quantidade}
              onChangeText={setQuantidade}
              keyboardType="number-pad"
              returnKeyType="next"
              onSubmitEditing={() => inputPontoRef.current?.focus()}
            />

            <Text style={styles.label}>Ponto de Destino</Text>
            <TextInput
              ref={inputPontoRef}
              style={styles.input}
              placeholder="Ex: Instituto Mão Amiga"
              value={pontoDestino}
              onChangeText={setPontoDestino}
              returnKeyType="done"
              onSubmitEditing={validarFormulario}
            />

            {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

            <TouchableOpacity style={styles.botaoSalvar} onPress={validarFormulario}>
              <Text style={styles.textoBotaoSalvar}>Registrar Doação</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B3A5C',
    marginTop: 8,
  },
  subtitulo: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 24,
    marginTop: 4,
  },
  formulario: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1B3A5C',
    marginBottom: 6,
  },
  input: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 15,
  },
  erro: {
    color: '#D32F2F',
    fontWeight: '500',
    marginBottom: 16,
  },
  botaoSalvar: {
    minHeight: 44,
    backgroundColor: '#00796B',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  textoBotaoSalvar: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});