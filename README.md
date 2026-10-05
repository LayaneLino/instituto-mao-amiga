# Instituto Mão Amiga - Aplicativo de Gestão de Doações

Aplicativo mobile desenvolvido em **React Native com TypeScript** para gerenciar pontos de coleta, registrar intenções de doações, acompanhar o histórico e consolidar resumos de suprimentos para o Instituto Mão Amiga.

---

## Funcionalidades do Aplicativo

1. **Lista de Pontos de Coleta:** Visualização de locais de recebimento e distribuição com endereços, horários e tipos de itens aceitos.
2. **Sistema de Favoritos:** Salvamento local de pontos favoritos utilizando `AsyncStorage`.
3. **Cadastro e Edição de Doações:** Formulários com validação estrita, seleção inteligente de categorias e pontos de destino via Modais (otimizado para dispositivos móveis e web).
4. **Rascunho Automático (Auto-save):** Salvamento em tempo real do formulário de doação para evitar perda de dados.
5. **Histórico Consolidado:** Listagem de todas as doações realizadas ordenadas por data, com atualização dinâmica (*useFocusEffect*).
6. **Resumo Geral Dinâmico:** Quadro de totais somados por categoria de item, ordenados da maior para a menor quantidade (Calculado via *Derived State*).
7. **Busca e Filtro em Tempo Real:** Filtragem instantânea do histórico por tipo de item (Case-insensitive).
8. **Detalhes, Edição e Exclusão:** Gestão completa do ciclo de vida de cada registro de doação.

---

## Estrutura do Projeto
O código foi arquitetado de forma modular e separando responsabilidades:
* **App.tsx:** Configuração central das rotas (React Navigation) e tipagem da Stack (RootStackParamList).
* **doacoesStorage.ts:** Camada de Serviço isolada contendo toda a lógica de persistência e manipulação do AsyncStorage.
* **TelaListaPontos.tsx:** Tela principal com listagem de pontos de coleta, mock de dados e favoritos salvos localmente.
* **TelaDetalhePonto.tsx:** Tela de exibição de informações detalhadas de um ponto de coleta específico.
* **TelaCadastroDoacao.tsx:** Formulário unificado de cadastro e edição com modais de seleção, rascunho automático e validações estritas.
* **TelaHistoricoDoacoes.tsx:** Tela de listagem consolidada do histórico, contendo o resumo dinâmico por totais e a barra de filtro em tempo real.


## Decisões Técnicas e Arquitetura

* **Camada de Acesso Isolada (`doacoesStorage.ts`):** Todo o acesso ao `AsyncStorage` está concentrado em um único arquivo de serviço, garantindo o princípio da responsabilidade única (SOLID). As telas apenas consomem métodos assíncronos (`listarDoacoes`, `salvarDoacao`, `atualizarDoacao`, `excluirDoacao`).
* **Estado Derivado (*Derived State*):** Os totais do resumo e os filtros da lista não salvam cópias redundantes de estados. Eles são calculados matematicamente a cada renderização a partir do array principal, eliminando bugs de sincronização de dados.
* **Resiliência Multiplataforma:** O app conta com tratamentos específicos para rodar com alta performance tanto nativamente (iOS/Android) quanto via navegador web (`Alert` adaptado para `window.alert`, controle de scroll views e comportamentos de teclado).

---

## Tecnologias Utilizadas
* **React Native / Expo**
* **TypeScript**
* **React Navigation** (Native Stack)
* **AsyncStorage** (@react-native-async-storage/async-storage)

---

## Como Instalar e Executar o Projeto

Siga os passos abaixo para rodar o projeto em sua máquina:

1. **Pré-requisitos:**
    * Node.js instalado (versão LTS recomendada).
    * Gerenciador de pacotes `npm` ou `yarn`.
    * Expo CLI instalado globalmente (ou uso do `npx`).

2. **Passo a passo:**
   ```bash
   # Clone o repositório ou descompacte a pasta do projeto
   cd nome-do-projeto

   # Instale as dependências
   npm install

   # Inicie o projeto (Expo)
   npx expo start
   ```

3. **Formas de Visualização:**
   * Pressione w no terminal para abrir diretamente no Navegador Web.
   * Instale o aplicativo Expo Go no seu celular físico e escaneie o QR Code gerado no terminal para testar no Android/iOS.
   * Pressione a para abrir no Emulador Android ou i para o Simulador iOS (se configurados).