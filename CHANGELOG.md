# Changelog

## 1.0.8

- Projeto passa a ser GitHub-first, sem configuração dedicada à Vercel.
- Adicionado Capacitor 8 para empacotamento Android.
- Adicionado workflow do GitHub Actions para gerar APK debug automaticamente.
- Adicionado workflow para publicar a versão web no GitHub Pages.
- Vite passa a usar `base: './'` para funcionar no Pages e no APK com o mesmo build.
- Node 22 e Java 21 configurados no workflow Android.

## 1.0.7

- Criado `useBuilderOptions` para centralizar opções compatíveis, filtro de orçamento e dados derivados da montagem.
- Cálculo do total ao vivo e aviso de gargalo removidos do `Builder.jsx`.
- Filtro de orçamento passa a ser controlado pelo hook e continua sendo resetado ao mudar de etapa.
- Cálculo do preço máximo da categoria ficou tolerante a preços inválidos e valores vazios.
- Adicionado indicador derivado `categoriaTemPrecos` para simplificar a renderização do filtro.
- Opções, total e gargalo passaram a usar memoização baseada no estado relevante.
- `Builder.jsx` fica mais focado em composição visual e integração dos módulos.

## 1.0.6

- Criado `useBuilderFlow` para centralizar estado do setup, navegação entre etapas e seleção de peças.
- Normalização de setups antigos movida do `Builder.jsx` para o hook de fluxo.
- Seleção simples e múltipla, incluindo adição/remoção de unidades, saiu da camada visual.
- Regras de limpeza de placa-mãe, CPU e RAM ao trocar plataforma foram preservadas no hook.
- Validação antes do resumo (socket, placa-mãe, CPU, RAM, fonte e gabinete) foi centralizada.
- Eventos de adicionar/remover múltiplas peças agora toleram chamadas sem evento, reduzindo acoplamento com a UI.
- `Builder.jsx` ficou focado em composição visual, filtros e integração dos hooks.

## 1.0.5

- Criado `useSetupStorage` para centralizar salvamento, sobrescrita e histórico dos setups.
- Estados dos diálogos de salvar/versionar removidos do `Builder.jsx`.
- Leitura de `pcBuilderSetups` agora é tolerante a JSON inválido no `localStorage`.
- Mantido o limite de 10 versões no histórico, sem alterar o formato persistido.
- Fluxo de sobrescrita simplificado sem apagar e regravar o setup em duas etapas.
- `Builder.jsx` reduzido de 306 para 254 linhas.

## 1.0.4

- Criado `usePartManager` para centralizar criação, edição e exclusão de peças do Builder.
- Estado e persistência dos modais de peças removidos da página principal.
- Centralizadas as leituras e gravações de `pcBuilderCustomParts` e `pcBuilderEditedParts`.
- Mantido o formato atual do `localStorage`, sem migração de dados.
- Adicionada validação para preços inválidos ou negativos ao criar/editar peças.
- Removido `alert()` isolado da edição e substituído pelo diálogo visual de erro do projeto.
- `Builder.jsx` reduzido de 472 para 306 linhas.

## 1.0.3

- Modais do Builder extraídos para componentes independentes em `features/builder/dialogs`.
- Separados os fluxos de adicionar peça manual, editar peça, excluir peça e mensagens de erro tático.
- Diálogos de salvar setup e conflito de versões foram isolados em `SaveSetupDialogs`.
- `Builder.jsx` reduzido de 529 para 472 linhas, mantendo a lógica de montagem centralizada.
- Removidas importações de componentes Material UI que pertenciam apenas aos modais.
- Mantida compatibilidade integral com `pcBuilderSetups`, `pcBuilderCustomParts` e `pcBuilderEditedParts` no `localStorage`.

## 1.0.2

- Refatoração do Builder em módulos menores por responsabilidade.
- Criados `builderConfig`, `builderUtils`, `ProgressBar`, `BudgetFilter` e `PartCard`.
- Regras de compatibilidade, total, gargalo, fonte e gabinete removidas da camada visual.
- Corrigida exportação dos mapas de formato de placa-mãe e gabinete usados na validação.
- Normalização de RAM, armazenamento e GPU ao carregar setups antigos/predefinidos.
- Filtro de orçamento passa a ser limpo automaticamente ao trocar de categoria.
- Mantida compatibilidade com as mesmas chaves de `localStorage`.

## 1.0.1

- Refatorado o antigo `src/main.jsx` monolítico em módulos por responsabilidade.
- Banco de peças movido para `src/data/pcParts.js`.
- Telas separadas em `src/pages/`.
- Componentes compartilhados separados em `src/components/`.
- Tema Material UI isolado em `src/theme/doaTheme.js`.
- `src/main.jsx` reduzido ao bootstrap da aplicação.
- Corrigido JSX inválido no fechamento da tela de Backup.
- Mantido o mesmo formato de dados do `localStorage` para preservar setups existentes.
