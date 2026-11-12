import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Resolve a URL base da API Spring Boot de acordo com a plataforma e ambiente:
 * - Web: http://localhost:8080
 * - Expo Go (celular físico Android/iOS): detecta dinamicamente o IP do computador que está executando o Metro bundler.
 * - Emulador Android padrão: 10.0.2.2:8080
 * - Fallback padrão para rede local: 192.168.0.4:8080
 */
function resolverUrlApi(): string {
  if (Platform.OS === 'web') {
    return 'http://localhost:8080';
  }

  // No Expo Go, o hostUri traz o IP do computador onde o Metro está rodando (ex: "192.168.0.4:8081")
  const hostUri =
    Constants.expoConfig?.hostUri ??
    (Constants as unknown as { manifest2?: { extra?: { expoGo?: { debuggerHost?: string } } } })?.manifest2?.extra?.expoGo?.debuggerHost;

  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
      return `http://${ip}:8080`;
    }
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8080';
  }

  // IP local padrão do servidor
  return 'http://192.168.0.4:8080';
}

const API_URL = resolverUrlApi();

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, mensagem: string) {
    super(mensagem);
    this.name = 'ApiError';
    this.status = status;
  }
}

type Parametros = Record<string, string | number>;

export async function apiGet<T>(caminho: string, parametros?: Parametros): Promise<T> {
  const query = parametros
    ? '?' +
      Object.entries(parametros)
        .map(([chave, valor]) => `${encodeURIComponent(chave)}=${encodeURIComponent(String(valor))}`)
        .join('&')
    : '';

  let resposta: Response;
  try {
    resposta = await fetch(`${API_URL}${caminho}${query}`);
  } catch {
    // status 0 = sem resposta (servidor desligado, IP incorreto, firewall ou fora da rede)
    throw new ApiError(0, `Não foi possível conectar ao servidor em ${API_URL}.`);
  }

  if (!resposta.ok) {
    throw new ApiError(resposta.status, `O servidor respondeu com erro ${resposta.status}.`);
  }

  return (await resposta.json()) as T;
}
