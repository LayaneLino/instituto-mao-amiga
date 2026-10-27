import { Alert, Platform } from 'react-native';

export function mostrarAlerta(titulo: string, mensagem: string, aoConfirmar?: () => void): void {
  if (Platform.OS === 'web') {
    window.alert(`${titulo}\n\n${mensagem}`);
    aoConfirmar?.();
  } else {
    Alert.alert(titulo, mensagem, [{ text: 'OK', onPress: aoConfirmar }]);
  }
}

export function confirmarAcao(
  titulo: string,
  mensagem: string,
  textoConfirmar: string,
  aoConfirmar: () => void
): void {
  if (Platform.OS === 'web') {
    if (window.confirm(mensagem)) aoConfirmar();
  } else {
    Alert.alert(titulo, mensagem, [
      { text: 'Cancelar', style: 'cancel' },
      { text: textoConfirmar, style: 'destructive', onPress: aoConfirmar },
    ]);
  }
}
