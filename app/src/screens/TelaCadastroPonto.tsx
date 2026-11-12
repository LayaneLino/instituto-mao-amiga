import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { ApiError } from '../services/api';
import { cadastrar, editar } from '../services/pontosService';

type Props = NativeStackScreenProps<RootStackParamList, 'CadastroPonto'>;

const OPCOES_TIPO = ['coleta', 'distribuição'] as const;

export default function TelaCadastroPonto({ route, navigation }: Props) {
  const pontoParaEditar = route.params?.pontoToEdit;
  const isEdicao = !!pontoParaEditar;

  const [nome, setNome] = useState(pontoParaEditar?.nome ?? '');
  const [endereco, setEndereco] = useState(pontoParaEditar?.endereco ?? '');
  const [bairro, setBairro] = useState(pontoParaEditar?.bairro ?? '');
  const [horario, setHorario] = useState(pontoParaEditar?.horario ?? '');
  const [tipo, setTipo] = useState(pontoParaEditar?.tipo ?? '');
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);
  const salvandoRef = useRef(false);

  async function salvarFormulario() {
    if (salvandoRef.current) return;

    if (
      nome.trim() === '' ||
      endereco.trim() === '' ||
      bairro.trim() === '' ||
      horario.trim() === '' ||
      tipo.trim() === ''
    ) {
      setErro('Preencha todos os campos obrigatórios (nome, endereço, bairro, horário e tipo).');
      return;
    }

    setErro('');
    Keyboard.dismiss();
    salvandoRef.current = true;
    setSalvando(true);

    const payload = {
      nome: nome.trim(),
      endereco: endereco.trim(),
      bairro: bairro.trim(),
      horario: horario.trim(),
      tipo: tipo.trim(),
    };

    try {
      if (isEdicao && pontoParaEditar) {
        await editar(pontoParaEditar.id, payload);
      } else {
        await cadastrar(payload);
      }
      navigation.goBack();
    } catch (e) {
      if (e instanceof ApiError) {
        if (e.status === 0) {
          setErro('Não foi possível conectar à API. Verifique se o servidor está ligado.');
        } else {
          setErro(e.message || `A API recusou os dados (erro ${e.status}).`);
        }
      } else {
        setErro('Não foi possível salvar o ponto. Tente novamente.');
      }
    } finally {
      salvandoRef.current = false;
      setSalvando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.titulo}>{isEdicao ? 'Editar Ponto' : 'Cadastrar Ponto'}</Text>
        <Text style={styles.subtitulo}>
          {isEdicao
            ? 'Altere as informações do ponto de coleta ou distribuição.'
            : 'Preencha os dados para cadastrar um novo ponto na rede.'}
        </Text>

        <View style={styles.formulario}>
          <Text style={styles.label}>Nome *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex.: Instituto Mão Amiga"
            placeholderTextColor="#999999"
            value={nome}
            onChangeText={setNome}
          />

          <Text style={styles.label}>Endereço *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex.: Av. Deputado Jamel Cecílio, 2690"
            placeholderTextColor="#999999"
            value={endereco}
            onChangeText={setEndereco}
          />

          <Text style={styles.label}>Bairro *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex.: Jardim Goiás"
            placeholderTextColor="#999999"
            value={bairro}
            onChangeText={setBairro}
          />

          <Text style={styles.label}>Horário *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex.: Seg a Sex, 8h às 18h"
            placeholderTextColor="#999999"
            value={horario}
            onChangeText={setHorario}
          />

          <Text style={styles.label}>Tipo *</Text>
          <View style={styles.opcoesTipoContainer}>
            {OPCOES_TIPO.map((opcao) => {
              const selecionado = tipo.toLowerCase() === opcao;
              return (
                <TouchableOpacity
                  key={opcao}
                  style={[
                    styles.botaoTipo,
                    selecionado && styles.botaoTipoSelecionado,
                  ]}
                  onPress={() => setTipo(opcao)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.textoBotaoTipo,
                      selecionado && styles.textoBotaoTipoSelecionado,
                    ]}
                  >
                    {opcao === 'coleta' ? 'Coleta' : 'Distribuição'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

          <TouchableOpacity
            style={[styles.botaoSalvar, salvando && styles.botaoSalvarDesabilitado]}
            onPress={salvarFormulario}
            disabled={salvando}
          >
            <Text style={styles.textoBotaoSalvar}>
              {salvando
                ? 'Salvando...'
                : isEdicao
                  ? 'Salvar alterações'
                  : 'Cadastrar Ponto'}
            </Text>
          </TouchableOpacity>
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
    marginBottom: 20,
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
    padding: 14,
    fontSize: 15,
    color: '#1B3A5C',
    marginBottom: 16,
  },
  opcoesTipoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  botaoTipo: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00796B',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  botaoTipoSelecionado: {
    backgroundColor: '#00796B',
  },
  textoBotaoTipo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#00796B',
  },
  textoBotaoTipoSelecionado: {
    color: '#FFFFFF',
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
  botaoSalvarDesabilitado: {
    opacity: 0.6,
  },
  textoBotaoSalvar: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
