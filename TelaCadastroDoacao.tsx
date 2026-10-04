import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, Alert, Modal, FlatList, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from './App';

import { salvarDoacao } from './doacoesStorage';
import { pontosMock } from './TelaListaPontos';

type Props = NativeStackScreenProps<RootStackParamList, 'CadastroDoacao'>;

const CHAVE_RASCUNHO = '@mao_amiga:rascunho_doacao';

export default function TelaCadastroDoacao({ navigation }: Props) {
  const [tipoItem, setTipoItem] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [pontoDestino, setPontoDestino] = useState('');

  const [modalVisivel, setModalVisivel] = useState(false);

  const [erro, setErro] = useState('');
  const [carregou, setCarregou] = useState(false);
  const inputQuantidadeRef = useRef<TextInput>(null);

  useEffect(() => {
    AsyncStorage.getItem(CHAVE_RASCUNHO).then((salvo) => {
      if (salvo) {
        try {
          const rascunho = JSON.parse(salvo);
          if (rascunho.tipoItem) setTipoItem(rascunho.tipoItem);
          if (rascunho.quantidade) setQuantidade(rascunho.quantidade);
          if (rascunho.pontoDestino) setPontoDestino(rascunho.pontoDestino);
        } catch (e) {
          console.error("Erro ao ler rascunho", e);
        }
      }
      setCarregou(true);
    });
  }, []);

  useEffect(() => {
    if (carregou) {
      const rascunhoAtual = { tipoItem, quantidade, pontoDestino };
      AsyncStorage.setItem(CHAVE_RASCUNHO, JSON.stringify(rascunhoAtual));
    }
  }, [tipoItem, quantidade, pontoDestino, carregou]);

  async function validarFormulario() {
    if (tipoItem.trim() === '') {
      setErro('O tipo do item não pode ficar vazio!');
      return;
    }

    const qtdNumerica = Number(quantidade.trim());
    if (
      quantidade.trim() === '' ||
      isNaN(qtdNumerica) ||
      qtdNumerica <= 0 ||
      !Number.isInteger(qtdNumerica)
    ) {
      setErro('A quantidade deve ser um número válido!');
      return;
    }

    if (pontoDestino === '') {
      setErro('Por favor, selecione um ponto de destino!');
      return;
    }

    setErro('');
    Keyboard.dismiss();

    try {
      await salvarDoacao({
      tipoItem: tipoItem.trim(),
      quantidade: qtdNumerica,
      pontoDestino: pontoDestino,
    });

      setTipoItem('');
      setQuantidade('');
      setPontoDestino('');
      await AsyncStorage.removeItem(CHAVE_RASCUNHO);

      const mensagemSucesso = `Doação de ${qtdNumerica}x ${tipoItem.trim()} para "${pontoDestino}" registrada no histórico!`;

      if (Platform.OS === 'web') {
        window.alert('Sucesso!\n\n' + mensagemSucesso);
        navigation.goBack();
      } else {
        Alert.alert('Sucesso!', mensagemSucesso, [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }

    } catch (e) {
      if (Platform.OS === 'web') {
        window.alert('Erro: Ocorreu um erro ao salvar sua doação. Tente novamente.');
      } else {
        setErro('Ocorreu um erro ao salvar sua doação. Tente novamente.');
      }
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
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
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
            />

            <Text style={styles.label}>Ponto de Destino</Text>

            <TouchableOpacity
              style={styles.input}
              activeOpacity={0.7}
              onPress={() => {
                Keyboard.dismiss();
                setModalVisivel(true);
              }}
            >
              <Text style={{ color: pontoDestino ? '#333' : '#999', fontSize: 15 }}>
                {pontoDestino ? pontoDestino : 'Selecione um ponto...'}
              </Text>
            </TouchableOpacity>

            {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

            <TouchableOpacity style={styles.botaoSalvar} onPress={validarFormulario}>
              <Text style={styles.textoBotaoSalvar}>Registrar Doação</Text>
            </TouchableOpacity>
          </View>

          <Modal
            visible={modalVisivel}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setModalVisivel(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setModalVisivel(false)}
            >
              <View style={styles.modalContent}>
                <Text style={styles.modalTitulo}>Escolha o destino</Text>

                <FlatList
                  data={pontosMock}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.modalItem}
                      onPress={() => {
                        setPontoDestino(item.nome);
                        setModalVisivel(false);
                      }}
                    >
                      <Text style={styles.modalItemTexto}>{item.nome}</Text>
                    </TouchableOpacity>
                  )}
                />

                <TouchableOpacity style={styles.modalBotaoFechar} onPress={() => setModalVisivel(false)}>
                  <Text style={styles.modalBotaoFecharTexto}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
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
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    padding: 15,
    marginBottom: 16,
    justifyContent: 'center'
  },
  erro: {
    color: '#D32F2F',
    fontWeight: '500',
    marginBottom: 16,
  },
  botaoSalvar: {
    backgroundColor: '#00796B',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  textoBotaoSalvar: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B3A5C',
    marginBottom: 16,
    textAlign: 'center'
  },
  modalItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  modalItemTexto: {
    fontSize: 16,
    color: '#333333',
  },
  modalBotaoFechar: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalBotaoFecharTexto: {
    color: '#D32F2F',
    fontWeight: 'bold',
    fontSize: 16,
  }
});