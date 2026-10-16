# TODO — MyBookList (front-end)

## Contexto

Itens pendentes da expansão das funcionalidades, que acompanham as novas
rotas do backend (ver `TODO.md` da API). Cada tela nova consome uma rota de
composição: `book-details` para a página do livro e `yearly-overview` para a
página anual. Ordem do mais simples para o mais complexo.

---

## Prioridade 1 — Ajustes em telas existentes

### 1.1 Gráfico semanal

- [ ] Clicar na barra de um dia abre o `SessionModal` referente àquela data,
      passando apenas a data
- [ ] Hover na barra mostra a quantidade de páginas do dia. O mesmo
      comportamento vale para o gráfico anual (3.1), então vale um tooltip
      reaproveitável

### 1.2 Campo de texto no livro

- [ ] Textarea de notas no formulário de livro (criação e edição)
- [ ] Contador de caracteres sempre visível (ex: `131/xxxx`), que fica
      vermelho ao chegar a 90% do limite
- [ ] Limite vindo do backend (depende do 2.1 da API)

### 1.3 `resetToPlanned` na exclusão da última sessão

Backend já pronto (`DELETE /reading-sessions/:id?resetToPlanned=true`).

- [ ] Opção no `DeleteModal` quando a sessão apagada é a última do livro
- [ ] Para saber se é a última, buscar as sessões do livro pelo id, ao abrir o
      modal ou ao clicar em excluir (a definir, a segunda opção é menos
      fluida, porém mais leve)

---

## Prioridade 2 — Página do livro

### 2.1 Página de detalhe do livro

Visualização de todas as reading-sessions, estatísticas de leitura e
informações do livro. Consome a rota do `book-details` (depende do 2.3 da API).

- [ ] Rota e página do livro
- [ ] Cabeçalho com as informações do livro
- [ ] Estatísticas: tempo total, quantidade de sessões e dias com sessões
      (vindas da API) e dias que levou (calculado no front com `startedAt` e
      `completedAt`; sem `startedAt`, não aparece)
- [ ] Lista de reading-sessions, da mais recente para a mais antiga, com
      editar e apagar reaproveitando `SessionModal` e `DeleteModal`
- [ ] Exibição das notas do livro (depende do 2.1 da API)
- [ ] Estado vazio para livro sem sessões, que não depende do status do
      livro, com botão para registrar sessão

### 2.2 Navegação para a página do livro

- [ ] Clique no card de finished books do dashboard leva para a página do livro
- [ ] Forma de navegar de um livro (na listagem de livros) para a página de
      detalhes, com o ponto de acesso a definir no design

---

## Prioridade 3 — Anos anteriores

### 3.1 Página anual

Consome a rota do `yearly-overview` (depende do 3.4 da API).

- [ ] Rota e página com seletor de ano no topo, com setas, travado no ano
      atual para frente e livre para os anos anteriores; o ano fica na URL
      como search param
- [ ] Meta do ano selecionado (sem meta: "sem meta definida")
- [ ] Estatísticas do ano selecionado
- [ ] Gráfico de páginas por mês, com hover mostrando a quantidade de páginas
      (depende do `pagesByMonth` do 3.2 da API)
- [ ] Livros concluídos agrupados por mês, em cards, em ordem cronológica,
      omitindo meses sem livros; card com capa (com visual alternativo
      quando não houver), título, nota e data de conclusão, levando à
      página do livro
- [ ] Estado vazio para ano sem informação, com texto diferente para o ano
      atual e para anos passados

### 3.2 Ponto de entrada

- [ ] Botão de yearly overview no user-menu, que leva à página anual
