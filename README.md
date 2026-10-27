# Instituto Mão Amiga 🤝

> Plataforma integrada para localização de pontos de coleta parceiros, registro de doações e acompanhamento de métricas de impacto comunitário.

[![React Native](https://img.shields.io/badge/React_Native-0.88-61DAFB?logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK_58-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Java](https://img.shields.io/badge/Java-17-ED8B00?logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Swagger](https://img.shields.io/badge/Swagger-OpenAPI_3-85EA2D?logo=swagger&logoColor=black)](http://localhost:8080/swagger-ui/index.html)
[![Database](https://img.shields.io/badge/Database-H2_In--Memory-003B57?logo=databricks&logoColor=white)](https://www.h2database.com/)

---

## 📌 Sumário

- [Visão Geral](#-visão-geral)
- [Funcionalidades](#-funcionalidades)
- [Arquitetura & Estrutura](#-arquitetura--estrutura)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Pré-requisitos](#-pré-requisitos)
- [Como Executar](#-como-executar)
  - [1. Backend (API Spring Boot)](#1-backend-api-spring-boot)
  - [2. Frontend (App Mobile Expo)](#2-frontend-app-mobile-expo)
  - [Configuração de Rede do App](#configuração-de-rede-do-app)
- [Documentação da API & Ferramentas](#-documentação-da-api--swagger)
  - [Swagger UI (OpenAPI 3)](#-swagger-ui-openapi-3)
  - [Console do Banco H2 (Web UI)](#️-console-do-banco-h2-web-ui)
  - [Rotas Disponíveis](#rotas-disponíveis)
- [Qualidade e Testes](#-qualidade-e-testes)
- [Padrões e Decisões Técnicas](#-padrões-e-decisões-técnicas)

---

## 📖 Visão Geral

O projeto **Instituto Mão Amiga** é uma solução composta por:
1. **Aplicativo Mobile (React Native / Expo):** Interface moderna e responsiva voltada para doadores consultarem locais de arrecadação em Goiânia/GO, favoritarem pontos e gerenciarem o histórico local de doações.
2. **API REST (Spring Boot):** Microsserviço de fornecimento dos pontos de coleta, com suporte a paginação nativa, ordenação dinâmica e persistência em banco de dados em memória (H2).

---

## ✨ Funcionalidades

### 📍 Pontos de Coleta
- **Listagem Paginada:** Consumo resiliente da API com paginação sob demanda (*infinite scroll*) e *pull-to-refresh*.
- **Tratamento de Indisponibilidade:** Feedback visual com botão de retry quando a API estiver offline.
- **Detalhes Completos:** Exibição de endereço, horários de atendimento, itens aceitos e coordenadas geográficas (latitude/longitude).
- **Favoritos:** Armazenamento local no dispositivo para acesso rápido.

### 📦 Gestão de Doações
- **Cadastro e Edição:** Formulário com validações rigorosas (apenas dígitos inteiros positivos para quantidade, categorias fixas e vinculação com os destinos fornecidos pela API).
- **Rascunho Automático (*Auto-Save*):** Preservação instantânea dos campos em preenchimento para prevenir perda de dados.
- **Histórico & Filtros:** Lista decrescente cronológica com filtragem dinâmica por categoria (*case-insensitive*).
- **Resumo Inteligente:** Consolidação de totais doados por categoria (estado derivado via `useMemo`).
- **Gerenciamento Local (CRUD):** Visualização individual, edição e exclusão de registros.

---

## 🏗 Arquitetura & Estrutura

O repositório é organizado no formato monorepo simplificado:


jhguyhgfuj

```bash
instituto-mao-amiga/
├── api/                           # Backend Spring Boot
│   ├── src/main/java/br/com/maoamiga/api/
│   │   ├── config/                # Carga de dados inicial, CORS e Global Error Handling
│   │   └── ponto/                 # Controller, Service, Repository, Entidade e DTO (Record)
│   ├── src/main/resources/        # application.properties (H2, porta, paginação)
│   ├── src/test/java/             # Testes de integração do PontoController
│   └── pom.xml                    # Dependências Maven
│
├── src/                           # Frontend React Native (Expo)
│   ├── constants/                 # Categorias e constantes de domínio
│   ├── screens/                   # Telas desacopladas (UI + navegação tipada)
│   ├── services/
│   │   ├── api.ts                 # Cliente HTTP centralizado (fetch e tratamento de rede)
│   │   ├── pontosService.ts       # Serviços de consumo da API de pontos
│   │   ├── storage.ts             # Wrapper seguro para AsyncStorage
│   │   ├── doacoesStorage.ts      # Persistência em fila assíncrona do histórico de doações
│   │   ├── rascunhoStorage.ts     # Gerenciamento de rascunhos de formulário
│   │   └── favoritosStorage.ts    # Gerenciamento de pontos favoritos
│   ├── types/                     # Tipagens TypeScript (Ponto, Doação, Navegação)
│   └── utils/                     # Helpers (alertas cross-platform Web/Mobile)
│
├── App.tsx                        # Ponto de entrada e configuração do React Navigation
├── package.json                   # Dependências e scripts do app
└── tsconfig.json                  # TypeScript com modo estrito ("strict": true)
```

---

## 🛠 Tecnologias Utilizadas

| Camada | Tecnologia | Propósito |
| :--- | :--- | :--- |
| **Mobile** | [React Native 0.88](https://reactnative.dev/) | Framework mobile nativo multiplataforma |
| **Plataforma** | [Expo SDK 58](https://expo.dev/) | Ecossistema de ferramentas e runtime |
| **Linguagem** | [TypeScript](https://www.typescriptlang.org/) | Tipagem estrita de ponta a ponta sem `any` |
| **Navegação** | [React Navigation (Native Stack)](https://reactnavigation.org/) | Navegação fluida com transições nativas |
| **Armazenamento**| [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) | Persistência local no dispositivo do usuário |
| **Backend** | [Spring Boot 3.5](https://spring.io/) | Framework robusto para desenvolvimento da API REST |
| **Documentação API** | [Swagger / OpenAPI 3](http://localhost:8080/swagger-ui/index.html) | Interface interativa de testes e documentação dos endpoints |
| **Persistência** | [Spring Data JPA / Hibernate](https://spring.io/projects/spring-data-jpa) | Mapeamento objeto-relacional |
| **Banco de Dados**| [H2 Database](https://www.h2database.com/) | Banco relacional em memória com seed automático |

---

## 📋 Pré-requisitos

Certifique-se de ter instalado em sua máquina:
- **Node.js**: versão 20 LTS ou superior
- **npm**: versão 10 ou superior
- **Java JDK**: versão 17 ou superior
- **Apache Maven**: versão 3.8 ou superior
- **Dispositivo ou Emulador:**
  - Dispositivo físico com o app **Expo Go** instalado (Android / iOS), ou
  - Emulador configurado (Android Studio ou Xcode Simulator).

---

## 🚀 Como Executar

### 1. Backend (API Spring Boot)

Abra um terminal dedicado para o serviço da API:

```bash
# Acesse o diretório da API
cd api

# Inicialize o servidor Spring Boot
# No Windows (PowerShell / CMD):
.\mvnw.cmd spring-boot:run

# No Linux / macOS:
./mvnw spring-boot:run
# (Ou simplesmente `mvn spring-boot:run` se tiver o Maven instalado no PATH)
```

A API estará acessível em: `http://localhost:8080`.  
> *Nota: Os 8 pontos de coleta de Goiânia são carregados automaticamente via `CargaInicial` a cada inicialização.*

---

### 2. Frontend (App Mobile Expo)

Abra um segundo terminal na **raiz do projeto**:

```bash
# 1. Instale as dependências (obrigatório)
npm install

# 2. Inicie o servidor Metro / Expo
npx expo start
```

Após iniciar, o terminal exibirá as opções:
- Pressione `a` para abrir no emulador Android.
- Pressione `i` para abrir no simulador iOS.
- Pressione `w` para abrir no navegador web.
- Ou escaneie o **QR Code** utilizando o app **Expo Go** no celular.

---

### Configuração de Rede do App

A comunicação com o backend é centralizada em [src/services/api.ts](file:///src/services/api.ts) e configurada com **resolução dinâmica e automática de IP**:

| Ambiente | Host Resolvido | Como Funciona |
| :--- | :--- | :--- |
| **Expo Go (Dispositivo Físico)** | `http://<IP-DO-PC>:8080` (ex: `192.168.0.4:8080`) | **Automático**: O app extrai o IP da máquina hospedeira diretamente da conexão do Metro bundler via `expo-constants`. |
| **Emulador Android Studio** | `http://10.0.2.2:8080` | **Automático**: Utiliza o alias oficial do emulador para a porta local do host. |
| **Simulador iOS / Web** | `http://localhost:8080` | **Automático**: Comunicação direta via localhost. |

> [!TIP]
> **Requisito para celular físico:** O celular e o computador devem estar conectados na **mesma rede Wi-Fi**. Certifique-se também de que o Firewall do Windows permite conexões de entrada na porta `8080` (Java).

---

## 📡 Documentação da API & Swagger

### 📑 Swagger UI (OpenAPI 3)

Com a API em execução, acesse a documentação interativa com execução de testes diretamente pelo navegador:

- **Swagger UI (Web/Local):** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **Swagger UI (Acesso pelo Celular):** `http://192.168.0.4:8080/swagger-ui.html`
- **Especificação OpenAPI JSON:** [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

---

### 🗄️ Console do Banco H2 (Web UI)

O banco de dados relacional em memória H2 possui uma interface web para consulta de tabelas (`PONTO`), execução de queries SQL e inspeção em tempo real:

- **Link de Acesso Local:** [http://localhost:8080/h2-console](http://localhost:8080/h2-console)
- **Link de Acesso via Rede:** `http://192.168.0.4:8080/h2-console`

#### Parâmetros de Conexão na Tela de Login:
| Campo | Valor a Preencher |
| :--- | :--- |
| **Driver Class** | `org.h2.Driver` |
| **JDBC URL** | `jdbc:h2:mem:maoamiga` |
| **User Name** | `sa` |
| **Password** | *(deixar em branco / vazio)* |

> Ao clicar em **Connect**, você poderá rodar queries como `SELECT * FROM PONTO;` e visualizar os 8 registros semeados na inicialização.

---

### Rotas Disponíveis

| Método | Endpoint | Descrição | Parâmetros de Query |
| :---: | :--- | :--- | :--- |
| `GET` | `/pontos` | Lista paginada dos pontos de coleta | `page` (inicia em 0), `size` (padrão 20, máx 50), `sort` (ex: `nome,asc`) |
| `GET` | `/pontos/{id}` | Busca um ponto específico por ID | — |

### Exemplo de Resposta: `GET /pontos`

```json
{
  "content": [
    {
      "id": 1,
      "nome": "Paróquia Universitária São João Evangelista",
      "endereco": "Praça Universitária, 1440 - Setor Leste Universitário, Goiânia - GO",
      "diasHorarios": "Segunda a Sexta, das 08h às 17h",
      "itensRecebeDistribui": "Roupas, calçados, cobertores e alimentos não perecíveis",
      "latitude": -16.679237,
      "longitude": -49.243574
    }
  ],
  "page": {
    "size": 20,
    "number": 0,
    "totalElements": 8,
    "totalPages": 1
  }
}
```

### Tratamento de Códigos de Status

- `200 OK`: Requisição processada com sucesso.
- `400 Bad Request`: Parâmetro de ordenação ou consulta inválido (`ParametroInvalidoException`).
- `404 Not Found`: Ponto de coleta não encontrado (`PontoNaoEncontradoException`).
- `500 Internal Server Error`: Erro inesperado tratado uniformemente via `TratamentoDeErros`.

---

## 🧪 Qualidade e Testes

### Testes Automatizados no Backend
O backend possui testes de integração do controller validando respostas paginadas, detalhes, ordenação e exceções:

```bash
cd api

# No Windows:
.\mvnw.cmd test

# No Linux / macOS:
./mvnw test
```

### Verificação de Tipos no Frontend
O projeto segue o modo estrito do TypeScript (`strict: true`), garantindo ausência de `any` ou supressões `@ts-ignore`:

```bash
npx tsc --noEmit
```

---

## 💡 Padrões e Decisões Técnicas

- **Separação de Responsabilidades (SoC):** Telas cuidam exclusivamente de apresentação e interação de interface. Requisições HTTP e persistência são delegadas a camadas especializadas de serviço (`src/services/`).
- **Prevenção de Condições de Corrida (*Race Conditions*):** As operações de escrita em disco em `doacoesStorage.ts` utilizam encadeamento de promessas em fila, impedindo sobrescrita inadvertida em caso de interações simultâneas.
- **Performance com Estado Derivado:** Cálculos de totalizadores e filtros de categorias são computados via `useMemo`, eliminando sincronizações redundantes de estado no React.
- **Segurança de Tipos no Backend:** Utilização de `records` Java imutáveis (`PontoResponse`) para comunicação externa da API, mantendo as entidades JPA isoladas do ecossistema de transporte HTTP.
