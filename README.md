# Instituto Mão Amiga 🤝

> Plataforma integrada para localização e gestão de pontos de coleta e distribuição parceiros e registro de doações.

[![React Native](https://img.shields.io/badge/React_Native-0.88-61DAFB?logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK_58-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Java](https://img.shields.io/badge/Java-17-ED8B00?logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Swagger](https://img.shields.io/badge/Swagger-OpenAPI_3-85EA2D?logo=swagger&logoColor=black)](http://localhost:8080/swagger-ui/index.html)
[![Database](https://img.shields.io/badge/Database-H2-003B57?logo=databricks&logoColor=white)](https://www.h2database.com/)

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
- [Documentação da API & Swagger](#-documentação-da-api--swagger)
  - [Swagger UI (OpenAPI 3)](#-swagger-ui-openapi-3)
  - [Console do Banco H2 (Web UI)](#️-console-do-banco-h2-web-ui)
  - [Rotas Disponíveis — Pontos de Coleta (`/api/v1/pontos`)](#rotas-disponíveis--pontos-de-coleta-apiv1pontos)
- [Qualidade e Testes](#-qualidade-e-testes)
- [Padrões e Decisões Técnicas](#-padrões-e-decisões-técnicas)

---

## 📖 Visão Geral

O projeto **Instituto Mão Amiga** é organizado em duas camadas principais:
1. **[`api/`](./api) — API REST (Spring Boot):** Backend em Java 17 + Spring Boot 3.5 responsável pelo CRUD de pontos de coleta e distribuição em Goiânia/GO, com validação de dados (`Bean Validation`), documentação interativa via Swagger/OpenAPI e persistência em banco de dados H2 gravado em arquivo.
2. **[`app/`](./app) — Aplicativo Mobile/Web (React Native / Expo):** Interface voltada para consulta de locais de arrecadação/distribuição, favoritos e gerenciamento de doações.

---

## ✨ Funcionalidades

### 📍 Pontos de Coleta e Distribuição (API)
- **CRUD Completo (`/api/v1/pontos`):** Listagem, busca por `UUID`, cadastro (`POST`), edição (`PUT`) e exclusão (`DELETE`).
- **Busca Paginada e Ordenada (`/api/v1/pontos/filtro`):** Filtro por `nome` ou `bairro` (*case-insensitive* via `@Query`), paginação padrão de 10 itens ordenados por `nome` (`@PageableDefault`) e resposta no formato `content` + `page` (`via_dto`).
- **Validação no Servidor (`@Valid`):** Campos obrigatórios (`nome`, `endereco`, `bairro`, `horario` e `tipo`) validados via `PontoRequestDTO`, retornando `400 Bad Request` caso algum campo esteja vazio.
- **Persistência em Arquivo (H2):** Dados mantidos entre reinícios em `./data/maoamiga`, com carga inicial automática de 26 pontos em Goiânia sem duplicação.

### 📱 Aplicativo (`app/`)
- **Listagem Paginada e Busca (`TelaListaPontos`):** Consumo da API (`GET /api/v1/pontos/filtro`) com campo de busca por nome ou bairro, rolagem infinita (`onEndReached` sem duplicar requisições de página), *pull-to-refresh*, indicador de carregamento inicial e mensagem amigável quando a API está desligada.
- **Detalhes do Ponto (`TelaDetalhePonto`):** Recebe apenas o `id` (`UUID`) via navegação e busca os dados atualizados na API (`GET /api/v1/pontos/{id}`), tratando o status `404` com a mensagem `"Ponto não encontrado."`.
- **Favoritos:** Marcação de pontos favoritos (`♡`/`♥`) persistida localmente no dispositivo (`AsyncStorage`).
- **Gestão de Doações:** Cadastro, edição, exclusão, rascunho automático e histórico de doações.

---

## 🏗 Arquitetura & Estrutura

O repositório está organizado nas pastas `api/` e `app/`:

```bash
instituto-mao-amiga/
├── api/                           # Backend Spring Boot
│   ├── src/main/java/br/com/maoamiga/api/
│   │   ├── config/                # CargaInicial, CorsConfig, OpenApiConfig e TratamentoDeErros
│   │   ├── controller/            # PontoController (/api/v1/pontos)
│   │   ├── dto/                   # PontoRequestDTO (@Valid) e PontoResponseDTO (record)
│   │   ├── entity/                # Entidade JPA Ponto (UUID, nome, endereco, bairro, horario, tipo)
│   │   ├── repository/            # PontoRepository (Spring Data JPA)
│   │   └── service/               # PontoService e PontoNaoEncontradoException
│   ├── src/main/resources/        # application.properties (H2 em arquivo, porta 8080)
│   ├── src/test/java/             # Testes de integração do PontoController
│   └── pom.xml                    # Dependências Maven (Web, JPA, H2, Validation, Lombok, Swagger)
│
└── app/                           # Frontend React Native (Expo)
    ├── src/
    │   ├── constants/             # Categorias e constantes de domínio
    │   ├── screens/               # Telas do aplicativo (UI + navegação tipada)
    │   ├── services/              # Cliente HTTP (api.ts) e serviços de dados/storage
    │   ├── types/                 # Tipagens TypeScript (Ponto, Doação, Navegação)
    │   └── utils/                 # Helpers (alertas cross-platform Web/Mobile)
    ├── App.tsx                    # Ponto de entrada e configuração do React Navigation
    ├── package.json               # Dependências e scripts do app
    └── tsconfig.json              # TypeScript com modo estrito ("strict": true)
```

---

## 🛠 Tecnologias Utilizadas

| Camada | Tecnologia | Propósito |
| :--- | :--- | :--- |
| **Backend** | [Spring Boot 3.5](https://spring.io/) | Framework para desenvolvimento da API REST |
| **Persistência** | [Spring Data JPA / Hibernate](https://spring.io/projects/spring-data-jpa) | Mapeamento objeto-relacional |
| **Validação** | [Bean Validation](https://beanvalidation.org/) | Validação declarativa dos DTOs de entrada (`@Valid`, `@NotBlank`) |
| **Produtividade** | [Project Lombok](https://projectlombok.org/) | Redução de código boilerplate nas entidades |
| **Banco de Dados**| [H2 Database](https://www.h2database.com/) | Banco relacional persistido em arquivo (`jdbc:h2:file:./data/maoamiga`) |
| **Documentação API** | [Swagger / OpenAPI 3](http://localhost:8080/swagger-ui/index.html) | Interface interativa de testes e documentação dos endpoints |
| **Mobile / Web** | [React Native 0.88](https://reactnative.dev/) + [Expo SDK 58](https://expo.dev/) | Aplicativo multiplataforma |
| **Linguagem App** | [TypeScript](https://www.typescriptlang.org/) | Tipagem estrita (`strict: true`) |
| **Navegação** | [React Navigation (Native Stack)](https://reactnavigation.org/) | Navegação entre telas |
| **Armazenamento Local**| [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) | Persistência local no dispositivo |

---

## 📋 Pré-requisitos

Certifique-se de ter instalado em sua máquina:
- **Java JDK**: versão 17 ou superior
- **Node.js**: versão 20 LTS ou superior e **npm**
- **Dispositivo, Emulador ou Navegador Web:**
  - Dispositivo físico com o app **Expo Go** instalado (Android / iOS), emulador (Android Studio / Xcode) ou navegador web.

---

## 🚀 Como Executar

### 1. Backend (API Spring Boot)

Abra um terminal para o serviço da API:

```bash
cd api

# No Windows (PowerShell / CMD):
.\mvnw.cmd spring-boot:run

# No Linux / macOS:
./mvnw spring-boot:run
```

A API estará acessível em: `http://localhost:8080`.  
> *Nota: Os 26 pontos iniciais de Goiânia são carregados automaticamente via `CargaInicial` caso o banco ainda não os possua, sem duplicar a cada reinício.*

---

### 2. Frontend (App Mobile Expo)

Abra um segundo terminal na pasta `app`:

```bash
cd app

# 1. Instale as dependências
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

A comunicação com o backend é centralizada em [`app/src/services/api.ts`](./app/src/services/api.ts) com resolução automática de host:

| Ambiente | Host Resolvido | Como Funciona |
| :--- | :--- | :--- |
| **Expo Go (Dispositivo Físico)** | `http://<IP-DO-PC>:8080` (ex: `192.168.0.18:8080`) | **Automático**: Extrai o IP da máquina hospedeira a partir do Metro bundler via `expo-constants`. |
| **Emulador Android Studio** | `http://10.0.2.2:8080` | **Automático**: Utiliza o alias oficial do emulador para a máquina host. |
| **Simulador iOS / Web** | `http://localhost:8080` | **Automático**: Comunicação direta via `localhost`. |

---

## 📡 Documentação da API & Swagger

### 📑 Swagger UI (OpenAPI 3)

Com a API em execução, acesse a documentação interativa pelo navegador:

- **Swagger UI:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **Especificação OpenAPI JSON:** [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

---

### 🗄️ Console do Banco H2 (Web UI)

O banco de dados H2 gravado em arquivo possui uma interface web para consulta da tabela `PONTOS` e execução de queries SQL:

- **Link de Acesso Local:** [http://localhost:8080/h2-console](http://localhost:8080/h2-console)

#### Parâmetros de Conexão na Tela de Login:
| Campo | Valor a Preencher |
| :--- | :--- |
| **Driver Class** | `org.h2.Driver` |
| **JDBC URL** | `jdbc:h2:file:./data/maoamiga` |
| **User Name** | `sa` |
| **Password** | *(deixar em branco / vazio)* |

> Ao clicar em **Connect**, você poderá rodar `SELECT * FROM PONTOS;` para visualizar os registros persistidos.

---

### Rotas Disponíveis — Pontos de Coleta (`/api/v1/pontos`)

| Método | URL Completa | Descrição | Status de Sucesso |
| :---: | :--- | :--- | :---: |
| `GET` | `http://localhost:8080/api/v1/pontos` | Lista todos os pontos de coleta e distribuição | `200 OK` |
| `GET` | `http://localhost:8080/api/v1/pontos/filtro` | Busca paginada por nome ou bairro (`filtro`, `page`, `size`, `sort`) | `200 OK` |
| `GET` | `http://localhost:8080/api/v1/pontos/{id}` | Busca um ponto específico por UUID | `200 OK` |
| `POST` | `http://localhost:8080/api/v1/pontos` | Cadastra um novo ponto (com `@Valid`) | `201 Created` |
| `PUT` | `http://localhost:8080/api/v1/pontos/{id}` | Atualiza um ponto existente por UUID (com `@Valid`) | `200 OK` |
| `DELETE` | `http://localhost:8080/api/v1/pontos/{id}` | Exclui um ponto existente por UUID | `204 No Content` |

#### Exemplos de Busca Paginada (`/api/v1/pontos/filtro`)

##### A) Sem filtro (1ª página, 10 itens ordenados por `nome`)
**Chamada:** `GET http://localhost:8080/api/v1/pontos/filtro?page=0&size=10`
```json
{
  "content": [
    {
      "id": "11111111-2222-3333-4444-555555555501",
      "nome": "Araguaia Shopping",
      "endereco": "Rua 44, 399",
      "bairro": "Setor Central",
      "horario": "Seg a Sáb, 8h30 às 20h30",
      "tipo": "coleta"
    },
    {
      "id": "11111111-2222-3333-4444-555555555502",
      "nome": "Associação Solidária Campinas",
      "endereco": "Av. 24 de Outubro, 1820",
      "bairro": "Setor Campinas",
      "horario": "Seg a Sex, 9h às 17h",
      "tipo": "distribuição"
    }
  ],
  "page": {
    "size": 10,
    "number": 0,
    "totalElements": 26,
    "totalPages": 3
  }
}
```

##### B) Filtrando por bairro (`filtro=Bueno`)
**Chamada:** `GET http://localhost:8080/api/v1/pontos/filtro?filtro=Bueno&page=0&size=10`
```json
{
  "content": [
    {
      "id": "11111111-2222-3333-4444-555555555503",
      "nome": "Casa de Apoio São Vicente",
      "endereco": "Rua T-37, 2910",
      "bairro": "Setor Bueno",
      "horario": "Seg a Sex, 8h às 18h",
      "tipo": "distribuição"
    },
    {
      "id": "11111111-2222-3333-4444-555555555504",
      "nome": "Goiânia Shopping",
      "endereco": "Av. T-10, 1300",
      "bairro": "Setor Bueno",
      "horario": "Seg a Sáb, 10h às 22h",
      "tipo": "coleta"
    },
    {
      "id": "11111111-2222-3333-4444-555555555505",
      "nome": "Parque Vaca Brava - Ponto Solidário",
      "endereco": "Av. T-10, s/n",
      "bairro": "Setor Bueno",
      "horario": "Sáb e Dom, 8h às 14h",
      "tipo": "coleta"
    }
  ],
  "page": {
    "size": 10,
    "number": 0,
    "totalElements": 3,
    "totalPages": 1
  }
}
```

##### C) Pedindo a segunda página ordenada por bairro (`page=1&size=10&sort=bairro,asc`)
**Chamada:** `GET http://localhost:8080/api/v1/pontos/filtro?page=1&size=10&sort=bairro,asc`
```json
{
  "content": [
    {
      "id": "11111111-2222-3333-4444-555555555511",
      "nome": "Casa de Apoio São Vicente",
      "endereco": "Rua T-37, 2910",
      "bairro": "Setor Bueno",
      "horario": "Seg a Sex, 8h às 18h",
      "tipo": "distribuição"
    },
    {
      "id": "11111111-2222-3333-4444-555555555512",
      "nome": "Goiânia Shopping",
      "endereco": "Av. T-10, 1300",
      "bairro": "Setor Bueno",
      "horario": "Seg a Sáb, 10h às 22h",
      "tipo": "coleta"
    }
  ],
  "page": {
    "size": 10,
    "number": 1,
    "totalElements": 26,
    "totalPages": 3
  }
}
```

#### 1. `GET http://localhost:8080/api/v1/pontos` (`200 OK`)
```json
[
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "nome": "Instituto Mão Amiga",
    "endereco": "Av. Deputado Jamel Cecílio, 2690",
    "bairro": "Jardim Goiás",
    "horario": "Seg a Sex, 8h às 18h",
    "tipo": "coleta"
  }
]
```

#### 2. `GET http://localhost:8080/api/v1/pontos/{id}` (`200 OK`)
```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "nome": "Instituto Mão Amiga",
  "endereco": "Av. Deputado Jamel Cecílio, 2690",
  "bairro": "Jardim Goiás",
  "horario": "Seg a Sex, 8h às 18h",
  "tipo": "coleta"
}
```

#### 3. `POST http://localhost:8080/api/v1/pontos` (`201 Created`)
**Corpo da Requisição (`PontoRequestDTO`):**
```json
{
  "nome": "Paróquia São João Evangelista",
  "endereco": "Praça Universitária, 1440",
  "bairro": "Setor Leste Universitário",
  "horario": "Seg a Sex, 8h às 17h",
  "tipo": "coleta"
}
```
**Resposta (`201 Created`):**
```json
{
  "id": "d4e5f6a7-b8c9-4012-9def-0123456789ab",
  "nome": "Paróquia São João Evangelista",
  "endereco": "Praça Universitária, 1440",
  "bairro": "Setor Leste Universitário",
  "horario": "Seg a Sex, 8h às 17h",
  "tipo": "coleta"
}
```

#### 4. `PUT http://localhost:8080/api/v1/pontos/{id}` (`200 OK`)
**Corpo da Requisição (`PontoRequestDTO`):**
```json
{
  "nome": "Paróquia São João Evangelista",
  "endereco": "Praça Universitária, 1440",
  "bairro": "Setor Leste Universitário",
  "horario": "Seg a Sáb, 8h às 18h",
  "tipo": "distribuição"
}
```
**Resposta (`200 OK`):**
```json
{
  "id": "d4e5f6a7-b8c9-4012-9def-0123456789ab",
  "nome": "Paróquia São João Evangelista",
  "endereco": "Praça Universitária, 1440",
  "bairro": "Setor Leste Universitário",
  "horario": "Seg a Sáb, 8h às 18h",
  "tipo": "distribuição"
}
```

#### 5. `DELETE http://localhost:8080/api/v1/pontos/{id}` (`204 No Content`)
Sem corpo de resposta (`204 No Content`).

#### 6. Erro de Validação (`400 Bad Request` — Campo obrigatório vazio)
```json
{
  "type": "about:blank",
  "title": "Erro de validação",
  "status": 400,
  "detail": "Um ou mais campos obrigatórios estão inválidos ou vazios.",
  "instance": "/api/v1/pontos",
  "campos": {
    "nome": "O nome é obrigatório",
    "bairro": "O bairro é obrigatório"
  }
}
```

#### 7. Recurso Não Encontrado (`404 Not Found` — ID inexistente)
```json
{
  "type": "about:blank",
  "title": "Ponto não encontrado",
  "status": 404,
  "detail": "Ponto não encontrado com id: 00000000-0000-0000-0000-000000000000",
  "instance": "/api/v1/pontos/00000000-0000-0000-0000-000000000000"
}
```

---

## 🧪 Qualidade e Testes

### Testes Automatizados no Backend
O backend possui testes de integração do `PontoController` validando listagem, busca paginada com filtro e ordenação (`/api/v1/pontos/filtro`), busca por ID, cadastro, edição, exclusão e respostas de erro (`400` e `404`):

```bash
cd api

# No Windows:
.\mvnw.cmd test

# No Linux / macOS:
./mvnw test
```

### Verificação de Tipos no Frontend
O aplicativo segue o modo estrito do TypeScript (`strict: true`):

```bash
cd app
npx tsc --noEmit
```

---

## 💡 Padrões e Decisões Técnicas

- **Separação em Monorepo (`api/` e `app/`):** Isolamento claro entre o backend Spring Boot e o projeto mobile/web Expo.
- **Arquitetura em Camadas no Backend:** Divisão em `entity`, `repository`, `service`, `controller`, `dto` e `config`, expondo exclusivamente `PontoResponseDTO` (`record`) nas respostas HTTP e validando a entrada com `PontoRequestDTO` (`@Valid`).
- **Separação de Responsabilidades no App:** Telas cuidam de apresentação e interação, delegando requisições HTTP e persistência para `app/src/services/`.
