import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, Modal, FlatList, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import type { Ponto } from '../types/ponto';
import { salvarDoacao, atualizarDoacao } from '../services/doacoesStorage';
import { carregarRascunho, salvarRascunho, limparRascunho } from '../services/rascunhoStorage';
import { listarTodosPontos } from '../services/pontosService';
import { tiposItens } from '../constants/tiposItens';
import { mostrarAlerta } from '../utils/alerta';

type Props = NativeStackScreenProps<RootStackParamList, 'CadastroDoacao'>;

export default function TelaCadastroDoacao({ route, navigation }: Props) {
  const doacaoParaEditar = route.params?.doacaoToEdit;
  const isEdicao = !!doacaoParaEditar;
  const [tipoItem, setTipoItem] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [pontoDestino, setPontoDestino] = useState('');
  const [modalTipoVisivel, setModalTipoVisivel] = useState(false);
  const [modalPontoVisivel, setModalPontoVisivel] = useState(false);
  const [erro, setErro] = useState('');
  const [carregou, setCarregou] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const salvandoRef = useRef(false); // trava síncrona: o state demora um render para valer

  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [carregandoPontos, setCarregandoPontos] = useState(true);
  const [erroPontos, setErroPontos] = useState('');

  const carregarPontos = useCallback(async () => {
    setCarregandoPontos(true);
    setErroPontos('');
    try {
      setPontos(await listarTodosPontos());
    } catch {
      setErroPontos('Não foi possível carregar os pontos de destino. Verifique se a API está no ar.');
    } finally {
      setCarregandoPontos(false);
    }
  }, []);

  useEffect(() => {
    carregarPontos();
  }, [carregarPontos]);

  useEffect(() => {
    if (doacaoParaEditar) {
      setTipoItem(doacaoParaEditar.tipoItem);
      setQuantidade(doacaoParaEditar.quantidade.toString());
      setPontoDestino(doacaoParaEditar.pontoDestino);
      setCarregou(true);
      return;
    }

    let ativo = true;
    carregarRascunho().then((rascunho) => {
      if (!ativo) return;
      if (rascunho) {
        if (rascunho.tipoItem) setTipoItem(rascunho.tipoItem);
        if (rascunho.quantidade) setQuantidade(rascunho.quantidade);
        if (rascunho.pontoDestino) setPontoDestino(rascunho.pontoDestino);
      }
      setCarregou(true);
    });
    return () => { ativo = false; };
  }, [doacaoParaEditar]);

  useEffect(() => {
    if (carregou && !isEdicao) {
      salvarRascunho({ tipoItem, quantidade, pontoDestino });
    }
  }, [tipoItem, quantidade, pontoDestino, carregou, isEdicao]);

  async function validarFormulario() {
    if (salvandoRef.current) return;

    if (tipoItem === '') {
      setErro('Por favor, selecione o tipo do item!');
      return;
    }

    // Só dígitos: rejeita "1e3", "0x10", "-5", "2.5", etc.
    const qtdTexto = quantidade.trim();
    if (!/^\d+$/.test(qtdTexto) || Number(qtdTexto) <= 0) {
      setErro('A quantidade deve ser um número inteiro maior que zero!');
      return;
    }
    const qtdNumerica = Number(qtdTexto);

    if (pontoDestino === '') {
      setErro('Por favor, selecione um ponto de destino!');
      return;
    }

    setErro('');
    Keyboard.dismiss();
    salvandoRef.current = true;
    setSalvando(true);

    try {
      if (doacaoParaEditar) {
        await atualizarDoacao({
          ...doacaoParaEditar,
          tipoItem: tipoItem,
          quantidade: qtdNumerica,
          pontoDestino: pontoDestino,
        });
        mostrarAlerta('Sucesso!', `Doação de ${qtdNumerica}x ${tipoItem} atualizada com sucesso!`, () => navigation.goBack());
      } else {
        await salvarDoacao({
          tipoItem: tipoItem,
          quantidade: qtdNumerica,
          pontoDestino: pontoDestino,
        });
        await limparRascunho();
        mostrarAlerta('Sucesso!', 'Doação registrada no histórico!', () => navigation.goBack());
      }
    } catch {
      setErro(isEdicao ? 'Erro ao atualizar a doação.' : 'Erro ao salvar sua doação.');
    } finally {
      salvandoRef.current = false;
      setSalvando(false);
    }
  }

  const tituloTela = isEdicao ? 'Editar Doação' : 'Registrar Doação';
  const textoBotao = isEdicao ? 'Salvar Alterações' : 'Registrar Doação';

  function renderListaPontos() {
    if (carregandoPontos) {
      return <ActivityIndicator size="large" color="#00796B" style={styles.modalStatus} />;
    }
    if (erroPontos !== '') {
      return (
        <View style={styles.modalStatus}>
          <Text style={styles.modalErroTexto}>{erroPontos}</Text>
          <TouchableOpacity style={styles.botaoTentar} onPress={carregarPontos}>
            <Text style={styles.textoBotaoTentar}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <FlatList
        data={pontos}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={<Text style={styles.modalErroTexto}>Nenhum ponto cadastrado.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.modalItem} onPress={() => { setPontoDestino(item.nome); setModalPontoVisivel(false); }}>
            <Text style={styles.modalItemTexto}>{item.nome}</Text>
          </TouchableOpacity>
        )}
      />
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.container}>

          <Text style={styles.titulo}>{tituloTela}</Text>
          <Text style={styles.subtitulo}>Preencha os dados do item doado.</Text>

          <View style={styles.formulario}>

            <Text style={styles.label}>Tipo do Item</Text>
            <TouchableOpacity
              style={styles.input}
              activeOpacity={0.7}
              onPress={() => { Keyboard.dismiss(); setModalTipoVisivel(true); }}
            >
              <Text style={{ color: tipoItem ? '#333' : '#999', fontSize: 15 }}>
                {tipoItem ? tipoItem : 'Selecione a categoria...'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.label}>Quantidade</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 5"
              value={quantidade}
              onChangeText={setQuantidade}
              keyboardType="number-pad"
              returnKeyType="done"
              maxLength={10}
              onSubmitEditing={Keyboard.dismiss}
            />

            <Text style={styles.label}>Ponto de Destino</Text>
            <TouchableOpacity
              style={styles.input}
              activeOpacity={0.7}
              onPress={() => { Keyboard.dismiss(); setModalPontoVisivel(true); }}
            >
              <Text style={{ color: pontoDestino ? '#333' : '#999', fontSize: 15 }}>
                {pontoDestino ? pontoDestino : 'Selecione um ponto...'}
              </Text>
            </TouchableOpacity>

            {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

            <TouchableOpacity
              style={[styles.botaoSalvar, salvando && styles.botaoSalvarDesabilitado]}
              onPress={validarFormulario}
              disabled={salvando}
            >
              <Text style={styles.textoBotaoSalvar}>{textoBotao}</Text>
            </TouchableOpacity>
          </View>

          <Modal visible={modalTipoVisivel} transparent={true} animationType="fade" supportedOrientations={['portrait', 'landscape']} onRequestClose={() => setModalTipoVisivel(false)}>
            <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalTipoVisivel(false)}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitulo}>Categoria do Item</Text>
                <FlatList
                  data={tiposItens}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.modalItem} onPress={() => { setTipoItem(item); setModalTipoVisivel(false); }}>
                      <Text style={styles.modalItemTexto}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity style={styles.modalBotaoFechar} onPress={() => setModalTipoVisivel(false)}>
                  <Text style={styles.modalBotaoFecharTexto}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>

          <Modal visible={modalPontoVisivel} transparent={true} animationType="fade" supportedOrientations={['portrait', 'landscape']} onRequestClose={() => setModalPontoVisivel(false)}>
            <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalPontoVisivel(false)}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitulo}>Escolha o destino</Text>
                {renderListaPontos()}
                <TouchableOpacity style={styles.modalBotaoFechar} onPress={() => setModalPontoVisivel(false)}>
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
  botaoSalvarDesabilitado: {
    opacity: 0.6,
  },
  modalStatus: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  modalErroTexto: {
    color: '#D32F2F',
    fontWeight: '500',
    fontSize: 15,
    textAlign: 'center',
  },
});
