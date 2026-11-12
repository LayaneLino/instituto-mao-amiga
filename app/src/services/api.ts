import Constants from 'expo-constants';
import { Platform } from 'react-native';

function resolverUrlApi(): string {
  if (Platform.OS === 'web') {
    return 'http://localhost:8080';
  }

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

  return 'http://192.168.0.18:8080';
}

export const API_URL = resolverUrlApi();

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, mensagem: string) {
    super(mensagem);
    this.name = 'ApiError';
    this.status = status;
  }
}

type Parametros = Record<string, string | number>;

function montarQuery(parametros?: Parametros): string {
  if (!parametros) return '';
  const entradas = Object.entries(parametros).filter(
    ([, valor]) => valor !== undefined && valor !== ''
  );
  if (entradas.length === 0) return '';
  return (
    '?' +
    entradas
      .map(([chave, valor]) => `${encodeURIComponent(chave)}=${encodeURIComponent(String(valor))}`)
      .join('&')
  );
}

async function requisitar<T>(
  metodo: 'GET' | 'POST' | 'PUT' | 'DELETE',
  caminho: string,
  opcoes?: { parametros?: Parametros; corpo?: unknown }
): Promise<T> {
  const query = montarQuery(opcoes?.parametros);
  const init: RequestInit = {
    method: metodo,
    headers: opcoes?.corpo !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: opcoes?.corpo !== undefined ? JSON.stringify(opcoes.corpo) : undefined,
  };

  let resposta: Response;
  try {
    resposta = await fetch(`${API_URL}${caminho}${query}`, init);
  } catch {
    throw new ApiError(0, `Não foi possível conectar ao servidor em ${API_URL}.`);
  }

  if (!resposta.ok) {
    let mensagem = `O servidor respondeu com erro ${resposta.status}.`;
    try {
      const erroJson = (await resposta.json()) as { detail?: string; mensagem?: string };
      if (erroJson.detail) mensagem = erroJson.detail;
      else if (erroJson.mensagem) mensagem = erroJson.mensagem;
    } catch {
      mensagem = `O servidor respondeu com erro ${resposta.status}.`;
    }
    throw new ApiError(resposta.status, mensagem);
  }

  if (resposta.status === 204) {
    return undefined as T;
  }

  const texto = await resposta.text();
  if (!texto) {
    return undefined as T;
  }

  return JSON.parse(texto) as T;
}

export function get<T>(caminho: string, parametros?: Parametros): Promise<T> {
  return requisitar<T>('GET', caminho, { parametros });
}

export function post<T>(caminho: string, corpo: unknown): Promise<T> {
  return requisitar<T>('POST', caminho, { corpo });
}

export function put<T>(caminho: string, corpo: unknown): Promise<T> {
  return requisitar<T>('PUT', caminho, { corpo });
}

export function del<T = void>(caminho: string): Promise<T> {
  return requisitar<T>('DELETE', caminho);
}
