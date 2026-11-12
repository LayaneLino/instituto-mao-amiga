import AsyncStorage from '@react-native-async-storage/async-storage';

export async function lerJSON<T>(chave: string): Promise<T | null> {
  const bruto = await AsyncStorage.getItem(chave);
  if (bruto === null) return null;
  try {
    return JSON.parse(bruto) as T;
  } catch {
    return null;
  }
}

export async function salvarJSON<T>(chave: string, valor: T): Promise<void> {
  await AsyncStorage.setItem(chave, JSON.stringify(valor));
}

export async function removerChave(chave: string): Promise<void> {
  await AsyncStorage.removeItem(chave);
}
