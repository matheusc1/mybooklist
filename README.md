# MyBookList

Aplicação web de tracking de leitura pessoal. Você cadastra seus livros, registra sessões de leitura por intervalo de páginas, define uma meta anual e acompanha suas estatísticas em um dashboard e em um calendário de atividade.

Este repositório contém só o front-end. A API (NestJS) fica em um repositório separado: [mybooklist-api](https://github.com/matheusc1/mybooklist-api).

## Funcionalidades

- **Login com Google ou GitHub.** Sem senha. A sessão é um cookie httpOnly emitido pela API.
- **Teste de velocidade de leitura.** No primeiro login o usuário lê dois trechos curtos e o app calibra a estimativa de tempo de leitura. O teste pode ser pulado e refeito depois pelo menu do usuário.
- **Biblioteca.** Cadastro, edição e exclusão de livros, com capa, avaliação, datas e status (lendo, concluído, pausado, abandonado, quero ler). Busca por título ou autor e filtro por status.
- **Sessões de leitura.** Registro por intervalo de páginas, com edição e exclusão. O tempo não é informado manualmente: ele é calculado a partir da velocidade de leitura medida no teste. Uma sessão que chega à última página conclui o livro.
- **Dashboard.** Livro atual, livros concluídos, estatísticas e gráfico da semana, e a meta anual de leitura.
- **Atividade.** Calendário mensal com os dias de leitura e o detalhe das sessões de cada dia.

## Stack

- **Framework:** [TanStack Start](https://tanstack.com/start) (React 19, SSR) com TypeScript
- **Roteamento e dados:** TanStack Router, TanStack Query (com hidratação via `react-router-ssr-query`)
- **Formulários e validação:** TanStack Form e Zod
- **UI:** Tailwind CSS v4, Radix UI, Base UI, Sonner (toasts) e Lucide (ícones)
- **Estado local:** Zustand
- **Testes:** Vitest e Testing Library (testes unitários e de componentes), Playwright (E2E)
- **Lint e formatação:** Biome

## Como rodar

### Pré-requisitos

- Node.js 22
- A [API do MyBookList](https://github.com/matheusc1/mybooklist-api) rodando localmente ou acessível por URL

### Instalação

```bash
npm install
```

### Variáveis de ambiente

Crie um arquivo `.env` na raiz:

```bash
VITE_API_URL=http://localhost:3000
```

| Variável | Onde é usada | Descrição |
| --- | --- | --- |
| `VITE_API_URL` | App | URL base da API. O cliente HTTP usa `credentials: 'include'`, então a API precisa permitir a origem do front-end no CORS. |
| `API_URL` | Testes E2E | URL da API usada pelas fixtures. Padrão: `http://localhost:3000`. Deve apontar para a mesma API de `VITE_API_URL`. |
| `FRONTEND_URL` | Testes E2E | `baseURL` do Playwright. Padrão: `http://localhost:5173`. |

### Desenvolvimento

```bash
npm run dev
```

O app sobe em `http://localhost:5173`.

### Scripts

| Script | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento na porta 5173 |
| `npm run build` | Build de produção |
| `npm run preview` | Serve o build localmente |
| `npm test` | Testes unitários e de componentes (Vitest) |
| `npm run test:watch` | Vitest em modo watch |
| `npm run test:coverage` | Testes com relatório de cobertura |
| `npm run test:e2e` | Testes E2E (Playwright, Chromium, um worker) |
| `npm run test:e2e:ui` | Playwright com a interface interativa |
| `npm run check` | Lint e formatação com Biome |
| `npm run lint` / `npm run format` | Só lint / só formatação |

## Testes

### Unitários e de componentes

Ficam ao lado do código, em arquivos `*.test.ts(x)`, e cobrem hooks, clientes HTTP, utilitários, modais, componentes de dashboard e atividade, e os loaders das rotas. Os helpers de render (incluindo `renderWithRouter`) estão em `src/test/`.

```bash
npm test
```

### E2E

A suíte Playwright roda contra uma instância real de teste da API, sem mocks nos fluxos principais. Ela cobre o que os testes unitários não alcançam: navegação em browser real, autenticação por cookie httpOnly, SSR e hidratação, e a invalidação de cache do TanStack Query entre rotas.

Fluxos cobertos:

- Redirecionamento de rotas protegidas e onboarding de velocidade de leitura
- Navegação autenticada e logout
- Ciclo completo de um livro: cadastro, sessão até a última página e reflexo em Meus Livros, dashboard e atividade
- Criação, edição e exclusão de sessões
- Metas e estado vazio do dashboard
- Expiração de sessão e links de login
- Persistência de capa, avaliação e datas do livro
- Landing page, metadados de SEO e páginas de erro
- Estados de carregamento e layout responsivo (desktop e mobile)

Como rodar:

1. No repositório da API, suba o servidor de testes com `npm run start:e2e`. Ele exige `E2E_TEST_MODE=true` e `TEST_DATABASE_URL` apontando para um banco dedicado de testes. Esse modo expõe endpoints que criam um usuário descartável e definem o cookie de sessão.
2. Garanta que `VITE_API_URL` (app) e `API_URL` (testes) apontem para essa mesma API.
3. Neste repositório:

```bash
npm run test:e2e
```

O Playwright sobe o front-end sozinho. Antes dos testes, o `global-setup` consulta `GET /health` na API, então um banco frio ou uma API fora do ar falha logo no início com uma mensagem clara.

Cada teste cria o próprio usuário descartável, prepara os dados pela API real e remove tudo no final. Não há dependência de dados deixados por outro teste.

## Estrutura

```
src/
  components/    # componentes por área (activity, dashboard, modals, ui)
  hooks/         # hooks de dados e de interface (TanStack Query)
  http/          # clientes da API, um arquivo por recurso
  routes/        # rotas (file-based). _authenticated/ guarda as rotas protegidas
  stores/        # Zustand
  types/         # tipos compartilhados
  utils/         # funções puras (datas, percentuais, query keys)
  test/          # setup e helpers de teste
tests/           # specs E2E do Playwright
  fixtures/      # helpers de login, seed de livros e sessões
```

## Decisões

- **Autenticação no servidor e no cliente.** A checagem de sessão roda no `beforeLoad` das rotas, então no primeiro carregamento ela acontece durante o SSR. O usuário vem de uma query compartilhada (`resolveCurrentUser`) e as rotas públicas suprimem o toast de erro para que um 401 esperado não apareça para visitantes.
- **Onboarding com escape.** Quem não tem velocidade de leitura é levado ao teste, mas pode sair dele. A escolha de pular vale pela sessão do navegador (`sessionStorage`), então o app não prende o usuário e volta a perguntar em uma nova sessão.
- **Dados da API como fonte de verdade.** Status do livro, progresso e estatísticas vêm calculados pela API. O front-end invalida as queries afetadas depois de cada mutação, e os testes E2E verificam o resultado visível em outra página.

## Projetos relacionados

- **API:** [mybooklist-api](https://github.com/matheusc1/mybooklist-api), NestJS, Drizzle ORM e PostgreSQL

## Licença

Veja o arquivo [LICENSE](./LICENSE).
