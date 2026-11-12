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
  - [Configuração de Rede e Onde Trocar o IP](#configuração-de-rede-e-onde-trocar-o-ip)
- [Roteiro de Demonstração (Até 3 Minutos)](#-roteiro-de-demonstração-até-3-minutos)
- [Documentação da API & Swagger](#-documentação-da-api--swagger)
  - [Swagger UI (OpenAPI 3)](#-swagger-ui-openapi-3)
  - [Console do Banco H2 (Web UI)](#️-console-do-banco-h2-web-ui)
  - [Rotas Disponíveis — Pontos de Coleta (`/api/v1/pontos`)](#rotas-disponíveis--pontos-de-coleta-apiv1pontos)
  - [Rotas Disponíveis — Doações (`/api/v1/doacoes`)](#rotas-disponíveis--doações-apiv1doacoes)
- [Qualidade e Testes](#-qualidade-e-testes)
- [Padrões e Decisões Técnicas](#-padrões-e-decisões-técnicas)

---

## 📖 Visão Geral

O projeto **Instituto Mão Amiga** é organizado em duas camadas principais:
1. **[`api/`](./api) — API REST (Spring Boot):** Backend em Java 17 + Spring Boot 3.5 responsável pelo CRUD e busca paginada de pontos de coleta/distribuição e doações em Goiânia/GO, com validação de dados (`Bean Validation`), documentação interativa via Swagger/OpenAPI e persistência em banco de dados H2 gravado em arquivo.
2. **[`app/`](./app) — Aplicativo Mobile/Web (React Native / Expo):** Interface voltada para consulta, cadastro, edição e exclusão de pontos de coleta e doações via API REST, além do gerenciamento local de pontos favoritos no aparelho (`AsyncStorage`).

---

## ✨ Funcionalidades

### 📍 Pontos de Coleta e Distribuição (API)
- **CRUD Completo (`/api/v1/pontos`):** Listagem, busca por `UUID`, cadastro (`POST`), edição (`PUT`) e exclusão (`DELETE`).
- **Busca Paginada e Ordenada (`/api/v1/pontos/filtro`):** Filtro por `nome` ou `bairro` (*case-insensitive* via `@Query`), paginação padrão de 10 itens ordenados por `nome` (`@PageableDefault`) e resposta no formato `content` + `page` (`via_dto`).
- **Validação no Servidor (`@Valid`):** Campos obrigatórios (`nome`, `endereco`, `bairro`, `horario` e `tipo`) validados via `PontoRequestDTO`, retornando `400 Bad Request` caso algum campo esteja vazio.
- **Persistência em Arquivo (H2):** Dados mantidos entre reinícios em `./data/maoamiga`, com carga inicial automática de 26 pontos em Goiânia sem duplicação.

### 📦 Doações (API)
- **CRUD Completo (`/api/v1/doacoes`):** Listagem, busca por `UUID`, cadastro (`POST` preenchendo `criadoEm` no servidor com `LocalDateTime.now()`), edição (`PUT` mantendo `id` e `criadoEm` originais) e exclusão (`DELETE`).
- **Busca Paginada por Tipo de Item (`/api/v1/doacoes/filtro`):** Filtro *case-insensitive* por `tipoItem` com ordenação padrão da mais nova para a mais antiga (`@PageableDefault(size = 10, sort = "criadoEm", direction = Sort.Direction.DESC)`).
- **Validação no Servidor (`@Valid`):** `DoacaoRequestDTO` valida `tipoItem` e `pontoDestino` obrigatórios (`@NotBlank`) e `quantidade` inteira maior que zero (`@NotNull`, `@Positive`), respondendo `400 Bad Request` sem gravar dados inválidos.

### 📱 Aplicativo (`app/`)
- **Listagem Paginada e Busca (`TelaListaPontos`):** Consumo da API (`GET /api/v1/pontos/filtro`) com campo de busca por nome ou bairro, rolagem infinita (`onEndReached` sem duplicar requisições de página), *pull-to-refresh*, indicador de carregamento inicial e mensagem amigável quando a API está desligada.
- **Cadastro e Edição de Pontos (`TelaCadastroPonto`):** Formulário único reutilizado para criação (`POST`) e edição (`PUT`, com botão `"Salvar alterações"`), contendo `nome`, `endereco`, `bairro`, `horario` e seleção de `tipo` (`"coleta"` ou `"distribuição"` via `TouchableOpacity`), validação no app e preservação do que foi digitado caso a API recuse ou esteja offline.
- **Detalhes e Exclusão do Ponto (`TelaDetalhePonto`):** Recebe apenas o `id` (`UUID`) via navegação, busca os dados na API (`GET /api/v1/pontos/{id}`), trata `404` com `"Ponto não encontrado."`, permite favoritar/desfavoritar (`♡`/`♥`) e editar ou excluir (`DELETE` com confirmação via `Alert.alert`).
- **Pontos Favoritos (`TelaMeusPontos`):** Botão de favorito (`♡`/`♥`) com área de toque mínima `44x44` na listagem, no detalhe e nos favoritos, persistência dos IDs no `AsyncStorage` e tela **"Meus pontos"** que busca cada favorito na API pelo `id` (ignorando pontos excluídos sem quebrar a tela) e permite desmarcar na hora.
- **Histórico, Detalhe e CRUD de Doações pela API (`TelaCadastroDoacao`, `TelaHistoricoDoacoes`, `TelaDetalheDoacao`):** Cadastro (`POST`) e edição (`PUT`, reaproveitando o formulário com botão `"Salvar alterações"`) escolhendo o ponto de destino via `TouchableOpacity` (`GET /api/v1/pontos`), histórico paginado com filtro (`GET /api/v1/doacoes/filtro`), detalhe buscando pelo `id` na API (`GET /api/v1/doacoes/{id}`, tratando `404` com `"Doação não encontrada."`) e exclusão (`DELETE` com confirmação via `Alert.alert`).

---

## 🏗 Arquitetura & Estrutura

O repositório está organizado nas pastas `api/` e `app/`:

```bash
instituto-mao-amiga/
├── api/                           # Backend Spring Boot
│   ├── src/main/java/br/com/maoamiga/api/
│   │   ├── config/                # CargaInicial, CorsConfig, OpenApiConfig e TratamentoDeErros
│   │   ├── controller/            # PontoController (/api/v1/pontos) e DoacaoController (/api/v1/doacoes)
│   │   ├── dto/                   # RequestDTOs (@Valid) e ResponseDTOs (records)
│   │   ├── entity/                # Entidades JPA Ponto e Doacao (UUID)
│   │   ├── repository/            # PontoRepository e DoacaoRepository (@Query)
│   │   └── service/               # PontoService, DoacaoService e exceções de domínio
│   ├── src/main/resources/        # application.properties (H2 em arquivo, porta 8080, via_dto)
│   ├── src/test/java/             # Testes de integração (PontoControllerTest e DoacaoControllerTest)
│   └── pom.xml                    # Dependências Maven (Web, JPA, H2, Validation, Lombok, Swagger)
│
└── app/                           # Frontend React Native (Expo)
    ├── src/
    │   ├── constants/             # Categorias de itens de doação (tiposItens.ts)
    │   ├── screens/               # Telas do aplicativo (Pontos, Meus Pontos, Doações)
    │   ├── services/              # api.ts, pontosService.ts, doacoesService.ts, favoritosStorage.ts, storage.ts
    │   └── types/                 # Tipagens TypeScript (Ponto, Doação, Navegação)
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
| **Validação** | [Bean Validation](https://beanvalidation.org/) | Validação declarativa dos DTOs de entrada (`@Valid`, `@NotBlank`, `@Positive`) |
| **Produtividade** | [Project Lombok](https://projectlombok.org/) | Redução de código boilerplate nas entidades |
| **Banco de Dados**| [H2 Database](https://www.h2database.com/) | Banco relacional persistido em arquivo (`jdbc:h2:file:./data/maoamiga`) |
| **Documentação API** | [Swagger / OpenAPI 3](http://localhost:8080/swagger-ui/index.html) | Interface interativa de testes e documentação dos endpoints |
| **Mobile / Web** | [React Native 0.88](https://reactnative.dev/) + [Expo SDK 58](https://expo.dev/) | Aplicativo multiplataforma |
| **Linguagem App** | [TypeScript](https://www.typescriptlang.org/) | Tipagem estrita (`strict: true`) |
| **Navegação** | [React Navigation (Native Stack)](https://reactnavigation.org/) | Navegação entre telas |
| **Armazenamento Local**| [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) | Persistência dos IDs de pontos favoritos no dispositivo |

---

## 📋 Pré-requisitos

Certifique-se de ter instalado em sua máquina:
- **Java JDK**: versão **17** ou superior
- **Node.js**: versão **20 LTS** ou superior e **npm**
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

### Configuração de Rede e Onde Trocar o IP

A URL base do servidor fica centralizada em um único arquivo: **[`app/src/services/api.ts`](./app/src/services/api.ts)** (função `resolverUrlApi`).

| Ambiente | Host Resolvido | Como Funciona / Onde Trocar o IP |
| :--- | :--- | :--- |
| **Expo Go (Dispositivo Físico)** | `http://<IP-DO-PC>:8080` (ex: `http://192.168.0.18:8080`) | Detecta automaticamente o IP da máquina via `expo-constants` ou utiliza o IP padrão na linha `return 'http://192.168.0.18:8080'` em [`app/src/services/api.ts`](./app/src/services/api.ts). Caso precise trocar manualmente o IP da sua rede Wi-Fi, basta alterar essa string em `app/src/services/api.ts`. |
| **Emulador Android Studio** | `http://10.0.2.2:8080` | Utiliza automaticamente o alias oficial do emulador para a máquina host. |
| **Simulador iOS / Web** | `http://localhost:8080` | Comunicação direta via `localhost`. |

---

## 🎬 Roteiro de Demonstração (Até 3 Minutos)

1. **Buscar, Cadastrar, Editar e Excluir um Ponto (1 min):**
   - Na tela inicial (**Pontos de Coleta**), role a lista para demonstrar a paginação infinita (`onEndReached`) e digite `"Bueno"` no campo de busca para filtrar pela API (`/api/v1/pontos/filtro`). Limpe a busca.
   - Toque em **"+ Novo Ponto"**, tente salvar vazio para mostrar a validação no app e preencha: Nome `"Ponto Comunitário Setor Oeste"`, Endereço `"Av. Assis Chateaubriand, 500"`, Bairro `"Setor Oeste"`, Horário `"Seg a Sex, 8h às 17h"`, selecione o tipo **"Coleta"** (`TouchableOpacity` destacado) e toque em **"Cadastrar Ponto"**.
   - Abra o ponto recém-criado na lista para ver os detalhes buscados pelo `id` na API, toque em **"Editar"**, altere o tipo para **"Distribuição"**, toque em **"Salvar alterações"** e mostre os dados atualizados no detalhe e na lista.
   - Volte ao detalhe desse ponto, toque em **"Excluir"**, confirme no alerta (`Cancelar` / `Excluir`) e mostre que ele desapareceu da lista.

2. **Favoritar e Tela "Meus pontos" (30 seg):**
   - Na lista principal, marque 2 pontos com o botão de coração (`♡` → `♥`).
   - Toque no botão **"Meus pontos"** no topo: mostre os pontos favoritos carregados da API pelo `id` salvo no `AsyncStorage`.
   - Desmarque um deles clicando em `♥` na própria tela **"Meus pontos"** e mostre que ele sai imediatamente da lista e atualiza o ícone na tela principal.

3. **Cadastrar, Editar e Excluir uma Doação (45 seg):**
   - Toque em **"Nova Doação"**, selecione o tipo `"Cesta Básica"`, informe a quantidade `10`, escolha um **Ponto de Destino** clicando no `TouchableOpacity` do ponto desejado (que fica destacado) e toque em **"Registrar Doação"**.
   - Acesse **"Doações"**: mostre a nova doação no topo do histórico paginado e filtre pelo tipo `"Cesta"`.
   - Toque na doação para abrir os detalhes (`GET /api/v1/doacoes/{id}`), toque em **"Editar"**, altere a quantidade para `15` e salve em **"Salvar alterações"** (mostrando que a data de cadastro `criadoEm` é mantida).
   - Toque em **"Excluir"**, confirme no alerta e mostre que ela sai do histórico.

4. **Mostrar Erros `400` e `404` na API via Swagger (45 seg):**
   - Abra o Swagger UI em [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html).
   - **Erro `400 Bad Request`:** Execute `POST /api/v1/pontos` com `"nome": ""` (ou `POST /api/v1/doacoes` com `"quantidade": 0`) e mostre a resposta `400` com os campos validados pelo `@Valid`.
   - **Erro `404 Not Found`:** Execute `GET /api/v1/pontos/00000000-0000-0000-0000-000000000000` (ou `PUT`) e mostre a resposta `404 Not Found`.

---

## 📡 Documentação da API & Swagger

### 📑 Swagger UI (OpenAPI 3)

Com a API em execução, acesse a documentação interativa pelo navegador:

- **Swagger UI:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **Especificação OpenAPI JSON:** [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

---

### 🗄️ Console do Banco H2 (Web UI)

O banco de dados H2 gravado em arquivo possui uma interface web para consulta das tabelas `PONTOS` e `DOACOES`:

- **Link de Acesso Local:** [http://localhost:8080/h2-console](http://localhost:8080/h2-console)

#### Parâmetros de Conexão na Tela de Login:
| Campo | Valor a Preencher |
| :--- | :--- |
| **Driver Class** | `org.h2.Driver` |
| **JDBC URL** | `jdbc:h2:file:./data/maoamiga` |
| **User Name** | `sa` |
| **Password** | *(deixar em branco / vazio)* |

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

#### Exemplos CRUD de Pontos e Erros `400` / `404`

##### 1. `GET http://localhost:8080/api/v1/pontos` (`200 OK`)
```json
[
  {
    "id": "11111111-2222-3333-4444-555555555501",
    "nome": "Instituto Mão Amiga",
    "endereco": "Av. T-63, 1200",
    "bairro": "Setor Pedro Ludovico",
    "horario": "Seg a Sex, 8h às 17h",
    "tipo": "coleta"
  },
  {
    "id": "11111111-2222-3333-4444-555555555502",
    "nome": "Centro Comunitário Esperança",
    "endereco": "Rua 10, 45",
    "bairro": "Setor Central",
    "horario": "Ter a Sáb, 9h às 18h",
    "tipo": "distribuição"
  }
]
```

##### 2. `GET http://localhost:8080/api/v1/pontos/{id}` (`200 OK`)
```json
{
  "id": "11111111-2222-3333-4444-555555555501",
  "nome": "Instituto Mão Amiga",
  "endereco": "Av. T-63, 1200",
  "bairro": "Setor Pedro Ludovico",
  "horario": "Seg a Sex, 8h às 17h",
  "tipo": "coleta"
}
```

##### 3. `POST http://localhost:8080/api/v1/pontos` (`201 Created`)
**Corpo da Requisição:**
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

##### 4. `PUT http://localhost:8080/api/v1/pontos/{id}` (`200 OK`)
**Corpo da Requisição:**
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

##### 5. `DELETE http://localhost:8080/api/v1/pontos/{id}` (`204 No Content`)
Sem corpo na resposta (`204 No Content`).

##### 6. Erro de Validação (`400 Bad Request` — Campo obrigatório vazio)
**Resposta (`400 Bad Request`):**
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

##### 7. Recurso Não Encontrado (`404 Not Found` — ID inexistente)
**Resposta (`404 Not Found`):**
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

### Rotas Disponíveis — Doações (`/api/v1/doacoes`)

| Método | URL Completa | Descrição | Status de Sucesso |
| :---: | :--- | :--- | :---: |
| `GET` | `http://localhost:8080/api/v1/doacoes` | Lista todas as doações registradas | `200 OK` |
| `GET` | `http://localhost:8080/api/v1/doacoes/filtro` | Busca paginada por `tipoItem` ordenada por `criadoEm,desc` | `200 OK` |
| `GET` | `http://localhost:8080/api/v1/doacoes/{id}` | Busca uma doação específica por UUID | `200 OK` |
| `POST` | `http://localhost:8080/api/v1/doacoes` | Cadastra uma nova doação (com `@Valid`) | `201 Created` |
| `PUT` | `http://localhost:8080/api/v1/doacoes/{id}` | Atualiza uma doação por UUID mantendo `criadoEm` | `200 OK` |
| `DELETE` | `http://localhost:8080/api/v1/doacoes/{id}` | Exclui uma doação existente por UUID | `204 No Content` |

#### Exemplos de Respostas de Doações (`/api/v1/doacoes`)

##### 1. `POST http://localhost:8080/api/v1/doacoes` (`201 Created`)
**Corpo da Requisição:**
```json
{
  "tipoItem": "Cesta Básica",
  "quantidade": 5,
  "pontoDestino": "Instituto Mão Amiga"
}
```
**Resposta (`201 Created`):**
```json
{
  "id": "8f14e45f-ceea-467a-a8f1-4e45fceea67a",
  "tipoItem": "Cesta Básica",
  "quantidade": 5,
  "pontoDestino": "Instituto Mão Amiga",
  "criadoEm": "2026-11-11T23:05:00"
}
```

##### 2. `GET http://localhost:8080/api/v1/doacoes` (`200 OK`)
```json
[
  {
    "id": "8f14e45f-ceea-467a-a8f1-4e45fceea67a",
    "tipoItem": "Cesta Básica",
    "quantidade": 5,
    "pontoDestino": "Instituto Mão Amiga",
    "criadoEm": "2026-11-11T23:05:00"
  }
]
```

##### 3. `GET http://localhost:8080/api/v1/doacoes/filtro?filtro=Cesta&page=0&size=10` (`200 OK`)
```json
{
  "content": [
    {
      "id": "8f14e45f-ceea-467a-a8f1-4e45fceea67a",
      "tipoItem": "Cesta Básica",
      "quantidade": 5,
      "pontoDestino": "Instituto Mão Amiga",
      "criadoEm": "2026-11-11T23:05:00"
    }
  ],
  "page": {
    "size": 10,
    "number": 0,
    "totalElements": 1,
    "totalPages": 1
  }
}
```

##### 4. `GET http://localhost:8080/api/v1/doacoes/{id}` (`200 OK`)
```json
{
  "id": "8f14e45f-ceea-467a-a8f1-4e45fceea67a",
  "tipoItem": "Cesta Básica",
  "quantidade": 5,
  "pontoDestino": "Instituto Mão Amiga",
  "criadoEm": "2026-11-11T23:05:00"
}
```

##### 5. `PUT http://localhost:8080/api/v1/doacoes/{id}` (`200 OK` — Mantém `id` e `criadoEm`)
**Corpo da Requisição:**
```json
{
  "tipoItem": "Roupas e Agasalhos",
  "quantidade": 12,
  "pontoDestino": "Centro Comunitário Esperança"
}
```
**Resposta (`200 OK`):**
```json
{
  "id": "8f14e45f-ceea-467a-a8f1-4e45fceea67a",
  "tipoItem": "Roupas e Agasalhos",
  "quantidade": 12,
  "pontoDestino": "Centro Comunitário Esperança",
  "criadoEm": "2026-11-11T23:05:00"
}
```

##### 6. `DELETE http://localhost:8080/api/v1/doacoes/{id}` (`204 No Content`)
Sem corpo na resposta (`204 No Content`).

##### 7. Erro de Validação em Doações (`400 Bad Request` — Quantidade <= 0 ou campo vazio)
```json
{
  "type": "about:blank",
  "title": "Erro de validação",
  "status": 400,
  "detail": "Um ou mais campos obrigatórios estão inválidos ou vazios.",
  "instance": "/api/v1/doacoes",
  "campos": {
    "tipoItem": "O tipo do item é obrigatório",
    "quantidade": "A quantidade deve ser maior que zero"
  }
}
```

##### 8. Doação Não Encontrada (`404 Not Found` — ID inexistente)
```json
{
  "type": "about:blank",
  "title": "Doação não encontrada",
  "status": 404,
  "detail": "Doação não encontrada com id: 00000000-0000-0000-0000-000000000000",
  "instance": "/api/v1/doacoes/00000000-0000-0000-0000-000000000000"
}
```

---

## 🧪 Qualidade e Testes

### Testes Automatizados no Backend
O backend possui testes de integração (`PontoControllerTest` e `DoacaoControllerTest`) validando listagem, busca paginada com filtro e ordenação, busca por ID, cadastro, edição, exclusão e respostas de erro (`400` e `404`):

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

- **Por que Favoritos ficam no aparelho (`AsyncStorage`) e Pontos/Doações ficam no servidor (API + H2)?**
  - **Pontos de coleta e doações** são dados de domínio compartilhados e auditáveis da plataforma: um ponto cadastrado ou atualizado deve ser visível para todos os usuários, e o registro de doações exige validação centralizada (`@Valid`) e carimbo de tempo confiável gerado pelo servidor (`LocalDateTime.now()`).
  - **Favoritos**, por outro lado, representam uma preferência individual de conveniência de cada usuário/dispositivo (sem necessidade de login/autenticação nesta etapa). Guardar apenas a lista de `id` (`UUID`) no `AsyncStorage` mantém a preferência persistida entre aberturas do app, enquanto os dados atualizados de cada ponto favorito continuam sendo buscados na API (`GET /api/v1/pontos/{id}`) ao abrir a tela **"Meus pontos"**, descartando silenciosamente pontos que tenham sido removidos do servidor (`404`).
- **Separação em Monorepo (`api/` e `app/`):** Isolamento claro entre o backend Spring Boot e o projeto mobile/web Expo.
- **Arquitetura em Camadas:** No backend, divisão em `entity`, `repository`, `service`, `controller`, `dto` e `config`, expondo exclusivamente `records` (`PontoResponseDTO`, `DoacaoResponseDTO`). No app, nenhuma tela chama `fetch` ou monta URLs diretamente; toda comunicação HTTP passa por `app/src/services/api.ts`, `pontosService.ts` e `doacoesService.ts`.
