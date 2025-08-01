# Calculadora Financeira

Uma aplicação web elegante para controle de gastos pessoais, desenvolvida com React e design old money.

## Sobre o Projeto

Esta calculadora financeira permite que você gerencie suas finanças pessoais de forma simples e elegante. O projeto foi desenvolvido com foco na usabilidade e na experiência do usuário, mantendo um design sofisticado inspirado no estilo old money.

## Funcionalidades

- **Controle de Salário**: Cadastre seu salário mensal
- **Rendas Extras**: Adicione e gerencie fontes de renda adicional
- **Controle de Gastos**: Registre e categorize seus gastos
- **Edição em Tempo Real**: Edite valores e categorias diretamente na interface
- **Resumo Financeiro**: Visualize análises e dicas baseadas em seus dados
- **Persistência de Dados**: Seus dados são salvos automaticamente no navegador
- **Validação de Entrada**: Impede inserção de valores negativos

## Tecnologias Utilizadas

- **React 18**: Framework principal
- **Vite**: Ferramenta de build e desenvolvimento
- **CSS3**: Estilização com variáveis customizadas
- **LocalStorage**: Persistência de dados local
- **JavaScript ES6+**: Lógica da aplicação

## Como Executar

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd Calculadora
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto:
```bash
npm run dev
```

4. Acesse no navegador: `http://localhost:5173`

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Gera build de produção
- `npm run preview`: Visualiza o build de produção

## Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── Header.jsx      # Cabeçalho da aplicação
│   ├── FinanceCalculator.jsx  # Formulários de entrada
│   └── Summary.jsx     # Resumo e análises
├── styles/             # Arquivos CSS
└── App.jsx            # Componente principal
```

## Deploy

O projeto está configurado para deploy em plataformas de hospedagem estática como:
- GitHub Pages
- Netlify
- Vercel

Para fazer o build de produção:
```bash
npm run build
```

## Características do Design

- **Paleta Old Money**: Tons de azul marinho, dourado e creme
- **Tipografia Elegante**: Combinação de Playfair Display e Inter
- **Interface Responsiva**: Funciona em desktop e mobile
- **Animações Suaves**: Transições elegantes entre estados

## Armazenamento de Dados

Os dados são salvos localmente no navegador usando localStorage:
- Não requer login ou cadastro
- Dados persistem entre sessões
- Privacidade total do usuário

## Contribuição

Este projeto foi desenvolvido como uma aplicação pessoal de controle financeiro. Sugestões e melhorias são bem-vindas.

## Licença

Projeto de uso pessoal e educacional.
