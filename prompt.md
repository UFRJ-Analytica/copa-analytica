# Analytica + Copa — Especificação da Plataforma

> Documento de referência para construção do site estático no GitHub Pages.  
> Toda a lógica de dados parte de uma planilha Google Sheets pública — sem backend, sem banco de dados.

---

## 1. Visão geral

**Analytica + Copa** é uma plataforma pública de competição de modelos preditivos de futebol, desenvolvida pela UFRJ Analytica para a Copa do Mundo 2026.

O site é 100% estático (GitHub Pages). Não há servidor. Os dados vivem em um Google Sheets público, acessado via URL JSON. Qualquer membro da liga atualiza a planilha e o site reflete as mudanças automaticamente.

### Fluxo geral

```
Google Sheets (fonte de verdade)
    └── publicado como JSON via Sheets API v4
        └── fetch() no frontend (vanilla JS ou Astro)
            └── renderiza leaderboard, cards de jogo, perfis
```

### URL base da API

```
https://sheets.googleapis.com/v4/spreadsheets/{SHEET_ID}/values/{RANGE}?key={API_KEY}
```

Exemplo real (planilha pública, sem autenticação):
```
https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:json&sheet={NOME_ABA}
```

A segunda forma (gviz) funciona sem API key em planilhas públicas — preferir essa.

---

## 2. Estrutura da planilha

A planilha tem 7 abas. Cada aba mapeia para uma coleção de dados no frontend.

---

### Aba 1 — `Participantes`

**Mapeamento:** perfis públicos dos membros e da comunidade externa.

| Coluna | Campo | Tipo | Descrição |
|--------|-------|------|-----------|
| A | `id` | string | Ex: `P001` — identificador único |
| B | `nome` | string | Nome completo |
| C | `email` | string | Não exibido publicamente |
| D | `vinculo` | string | Ex: `Membro UFRJ Analytica`, `Comunidade externa` |
| E | `linkedin` | url | Link completo ou handle |
| F | `github` | url | Link completo ou handle |
| G | `instagram_x` | string | Handle sem @ |
| H | `bio` | string | Apresentação curta (max 200 chars) |
| I | `foto_url` | url | URL pública de foto (opcional) |

**Como o site usa:**
- Página `/participantes` — grid de cards com avatar, nome, bio e ícones de redes sociais
- Página `/modelos/{id_modelo}` — seção "Desenvolvido por" com dados do participante
- Leaderboard — nome e link para perfil

**Fallback de avatar:** se `foto_url` estiver vazio, usar iniciais do nome com fundo gerado por hash do `id`.

---

### Aba 2 — `Modelos`

**Mapeamento:** catálogo de todos os modelos cadastrados. Um participante pode ter N modelos.

| Coluna | Campo | Tipo | Descrição |
|--------|-------|------|-----------|
| A | `id_modelo` | string | Ex: `M001` |
| B | `id_participante` | string | FK → Participantes.id |
| C | `nome_participante` | string | Desnormalizado para facilitar joins no frontend |
| D | `nome_modelo` | string | Ex: `GabXGBoost v1` |
| E | `tipo_modelo` | enum | `XGBoost`, `Random Forest`, `Rede Neural`, `LLM`, `Sistema Elo`, `Monte Carlo`, `Ensemble`, `Outro` |
| F | `colab_url` | url | Link direto para o Colab ou repositório GitHub |
| G | `datasets` | string | Descrição dos dados usados (texto livre) |
| H | `datasets_urls` | string | Links separados por vírgula |
| I | `libs` | string | Ex: `Python / scikit-learn, XGBoost` |
| J | `descricao` | string | Metodologia em linguagem humana (max 400 chars) |
| K | `data_cadastro` | date | `YYYY-MM-DD` |
| L | `ativo` | boolean | `Sim` ou `Não` — modelos inativos não aparecem no ranking |

**Como o site usa:**
- Página `/modelos` — grid com todos os modelos ativos, filtrável por tipo
- Página `/modelos/{id_modelo}` — página dedicada com metodologia, datasets e link do código
- Leaderboard — nome do modelo, tipo como badge, link para página dedicada
- Cards de jogo — lista de previsões por modelo

**Regra importante:** `ativo = Não` remove o modelo do ranking e dos cards, mas mantém a página individual acessível por URL direta.

---

### Aba 3 — `Jogos`

**Mapeamento:** fixture completo do torneio. Inclui jogos futuros com cruzamentos dinâmicos.

| Coluna | Campo | Tipo | Descrição |
|--------|-------|------|-----------|
| A | `id_jogo` | string | Ex: `J01` |
| B | `rodada` | enum | `Oitavas de final`, `Quartas de final`, `Semifinal`, `Final` |
| C | `data` | date | `YYYY-MM-DD` |
| D | `horario_brt` | time | `HH:MM` |
| E | `mandante` | string | Nome da seleção ou `Vencedor J01` para fases futuras |
| F | `visitante` | string | Idem |
| G | `local` | string | Estádio e cidade |
| H | `prazo_previsao` | datetime | `YYYY-MM-DD HH:MM` — deadline para submissão |

**Cruzamentos dinâmicos:**  
Para jogos de quartas, semis e final, `mandante` e `visitante` recebem valores como `Vencedor J01`. O frontend resolve isso cruzando com `Resultados.vencedor_real` do jogo referenciado. Se o jogo ainda não aconteceu, exibe o placeholder como está.

**Como o site usa:**
- Página inicial — próximo jogo em destaque com countdown
- Página `/jogos` — lista de todos os jogos por rodada, com status (upcoming / ao vivo / encerrado)
- Card de jogo individual — cabeçalho com times, data, local e prazo

**Status do jogo** (calculado no frontend):
```javascript
const agora = new Date();
const inicio = new Date(`${jogo.data}T${jogo.horario_brt}:00-03:00`);
const fim = new Date(inicio.getTime() + 2 * 60 * 60 * 1000); // +2h estimado

if (agora < new Date(jogo.prazo_previsao)) status = 'aberto';
else if (agora < inicio) status = 'fechado';
else if (agora < fim) status = 'ao_vivo';
else status = 'encerrado';
```

---

### Aba 4 — `Previsoes`

**Mapeamento:** todas as previsões submetidas por todos os modelos.

| Coluna | Campo | Tipo | Descrição |
|--------|-------|------|-----------|
| A | `id_previsao` | string | Ex: `V001` |
| B | `id_modelo` | string | FK → Modelos.id_modelo |
| C | `nome_modelo` | string | Desnormalizado |
| D | `nome_participante` | string | Desnormalizado |
| E | `id_jogo` | string | FK → Jogos.id_jogo |
| F | `mandante` | string | Nome da seleção (desnormalizado) |
| G | `visitante` | string | Nome da seleção (desnormalizado) |
| H | `placar_previsto` | string | Ex: `2-1` (display only) |
| I | `gols_mandante` | number | Inteiro |
| J | `gols_visitante` | number | Inteiro |
| K | `vencedor_previsto` | enum | `Mandante`, `Visitante`, `Empate` |
| L | `confianca` | number | 0–100 (percentual) |
| M | `observacoes` | string | Justificativa do modelo (opcional) |
| N | `timestamp_envio` | datetime | `YYYY-MM-DD HH:MM` |

**Validações no frontend:**
- Só exibir previsões cujo `timestamp_envio` seja anterior ao `prazo_previsao` do jogo
- Previsões de modelos com `ativo = Não` são exibidas historicamente mas marcadas como inativas

**Como o site usa:**
- Card de jogo — seção "O que cada modelo prevê" com barras de probabilidade
- Dashboard da live — previsões ao vivo lado a lado
- Leaderboard — base de cálculo de pontos

---

### Aba 5 — `Resultados`

**Mapeamento:** resultado oficial de cada jogo. Preenchido pelo coordenador após o apito.

| Coluna | Campo | Tipo | Descrição |
|--------|-------|------|-----------|
| A | `id_jogo` | string | FK → Jogos.id_jogo |
| B | `mandante` | string | Nome (desnormalizado) |
| C | `visitante` | string | Nome (desnormalizado) |
| D | `gols_mandante_real` | number | Inteiro |
| E | `gols_visitante_real` | number | Inteiro |
| F | `vencedor_real` | enum | `Mandante`, `Visitante`, `Empate` |
| G | `datetime_fim` | datetime | `YYYY-MM-DD HH:MM` |
| H | `observacoes` | string | Prorrogação, pênaltis, etc. |

**Regra de cruzamento para playoffs:**  
Quando `vencedor_real` é preenchido para `J01`, o frontend substitui `Vencedor J01` pelo nome real da seleção em todos os jogos subsequentes.

**Como o site usa:**
- Card de jogo — exibe placar real quando disponível
- Pontuação — base para calcular acertos
- Leaderboard — triggera recalculo de pontos ao ser atualizado

---

### Aba 6 — `Pontuacao`

**Mapeamento:** pontuação calculada por previsão. Pode ser mantida pelo coordenador ou gerada por script.

| Coluna | Campo | Tipo | Descrição |
|--------|-------|------|-----------|
| A | `id_previsao` | string | FK → Previsoes.id_previsao |
| B | `id_modelo` | string | FK → Modelos.id_modelo |
| C | `nome_modelo` | string | Desnormalizado |
| D | `nome_participante` | string | Desnormalizado |
| E | `id_jogo` | string | FK → Jogos.id_jogo |
| F | `gols_mandante_prev` | number | Espelho de Previsoes |
| G | `gols_visitante_prev` | number | Espelho de Previsoes |
| H | `vencedor_previsto` | enum | Espelho de Previsoes |
| I | `gols_mandante_real` | number | Espelho de Resultados |
| J | `gols_visitante_real` | number | Espelho de Resultados |
| K | `vencedor_real` | enum | Espelho de Resultados |
| L | `placar_exato` | boolean | `TRUE` se I=F e J=G |
| M | `vencedor_certo` | boolean | `TRUE` se H=K |
| N | `pontos` | number | 5 (placar exato) / 3 (empate certo) / 2 (vencedor certo) / 0 |
| O | `confianca` | number | Espelho de Previsoes.confianca |
| P | `pts_x_confianca` | number | N × (O / 100) — métrica de calibração |

**Lógica de pontuação:**
```
placar_exato     → 5 pontos
empate correto   → 3 pontos  (vencedor = Empate e acertou)
vencedor correto → 2 pontos
errou tudo       → 0 pontos
```

**Como o site usa:**
- Leaderboard — soma de pontos por modelo, ordenado decrescente
- Cards de jogo — badge de resultado por modelo (✓ placar / ✓ vencedor / ✗)
- Métricas avançadas — Brier Score e calibração

---

### Aba 7 — `Ranking`

**Mapeamento:** leaderboard consolidado. Pode ser gerado pelo frontend ou mantido como aba auxiliar.

| Coluna | Campo | Tipo | Descrição |
|--------|-------|------|-----------|
| A | `posicao` | number | 1, 2, 3... |
| B | `id_modelo` | string | FK → Modelos |
| C | `nome_modelo` | string | Desnormalizado |
| D | `nome_participante` | string | Desnormalizado |
| E | `pontos_totais` | number | Soma de Pontuacao.pontos |
| F | `jogos_previstos` | number | Quantidade de previsões válidas |
| G | `placares_exatos` | number | Contagem de placar_exato = TRUE |
| H | `vencedores_certos` | number | Contagem de vencedor_certo = TRUE |
| I | `confianca_media` | number | Média de confiança — desempate |
| J | `pts_x_confianca` | number | Soma de pts_x_confianca — métrica de calibração |
| K | `colab_url` | url | Link direto para o código |

**Ordenação:** `pontos_totais` DESC → `pts_x_confianca` DESC → `placares_exatos` DESC

---

## 3. Como o frontend consome os dados

### Função de fetch padrão

```javascript
const SHEET_ID = 'SEU_SHEET_ID_AQUI';

async function fetchAba(nomeAba) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(nomeAba)}`;
  const res  = await fetch(url);
  const text = await res.text();
  const json = JSON.parse(text.slice(47, -2)); // remove wrapper do gviz

  const cols = json.table.cols.map(c => c.label);
  return json.table.rows.map(row => {
    const obj = {};
    row.c.forEach((cell, i) => {
      obj[cols[i]] = cell ? cell.v : null;
    });
    return obj;
  });
}

// Uso:
const participantes = await fetchAba('Participantes');
const modelos       = await fetchAba('Modelos');
const jogos         = await fetchAba('Jogos');
const previsoes     = await fetchAba('Previsoes');
const resultados    = await fetchAba('Resultados');
const ranking       = await fetchAba('Ranking');
```

### Cache local

Para não chamar o Sheets a cada interação do usuário:

```javascript
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

async function fetchComCache(aba) {
  const key = `analytica_${aba}`;
  const cached = sessionStorage.getItem(key);
  if (cached) {
    const { data, ts } = JSON.parse(cached);
    if (Date.now() - ts < CACHE_TTL) return data;
  }
  const data = await fetchAba(aba);
  sessionStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
  return data;
}
```

---

## 4. Páginas do site

| Rota | Conteúdo | Dados consumidos |
|------|----------|-----------------|
| `/` | Hero, próximo jogo, leaderboard resumido, últimas previsões | Jogos, Ranking, Previsoes |
| `/jogos` | Todos os jogos por rodada com status | Jogos, Resultados |
| `/jogos/{id}` | Card completo do jogo com previsões e resultado | Jogos, Previsoes, Resultados, Pontuacao |
| `/ranking` | Leaderboard completo com métricas | Ranking, Modelos |
| `/modelos` | Grid de todos os modelos com filtro por tipo | Modelos, Participantes |
| `/modelos/{id}` | Página do modelo com metodologia e histórico | Modelos, Participantes, Previsoes, Pontuacao |
| `/participantes` | Grid de participantes | Participantes, Modelos |
| `/sobre` | Explicação do projeto, regras e métricas | — |

---

## 5. Componentes principais

### LeaderboardCard
```
props: { ranking[], limit = 10 }
exibe: posição, medalha (🥇🥈🥉), nome do modelo, participante,
       pontos, barra de pontos proporcional, badge do tipo de modelo,
       link para página do modelo
```

### JogoCard
```
props: { jogo, previsoes[], resultado? }
exibe: times + bandeiras, data/hora, status badge (Aberto / Fechado / Encerrado),
       previsões de cada modelo em barras horizontais (mandante / empate / visitante),
       resultado real quando disponível, badge de acerto por modelo
```

### ModeloCard
```
props: { modelo, participante, stats }
exibe: nome, tipo como badge, participante com avatar,
       pontos totais, placares exatos, link do Colab
```

### ProbabilityBar
```
props: { mandante: number, empate: number, visitante: number, label: string }
exibe: barra tricolor com percentuais, cor âmbar se for linha Ensemble
```

---

## 6. Métricas exibidas no site

| Métrica | Fórmula | Onde aparece |
|---------|---------|-------------|
| Pontos totais | `SUM(pontos)` | Leaderboard, perfil do modelo |
| Placares exatos | `COUNT(placar_exato = TRUE)` | Leaderboard, perfil |
| Taxa de acerto | `vencedores_certos / jogos_previstos` | Perfil do modelo |
| Pts × Confiança | `SUM(pontos × confiança / 100)` | Leaderboard (desempate) |
| Ensemble | Média das probabilidades de todos os modelos ativos | Cards de jogo, dashboard da live |

---

## 7. Assets visuais

Os arquivos abaixo devem estar no repositório em `/assets/`:

```
/assets/
  logo.svg              — logo principal Analytica + Copa
  logo-dark.svg         — versão para fundos escuros (live dashboard)
  favicon.ico
  bandeiras/            — PNGs 40×28 das seleções (nome = código ISO 3166-1 alpha-2)
    br.png, mx.png, ar.png, fr.png ...
  og-image.png          — 1200×630 para Open Graph (compartilhamento em redes)
```

**Bandeiras:** usar a biblioteca `flag-icons` via CDN como fallback:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flag-icons@7/css/flag-icons.min.css">
<span class="fi fi-br"></span>
```

---

## 8. Configuração (data/config.json)

Arquivo de configuração local que o frontend lê para saber qual planilha usar:

```json
{
  "sheet_id": "SEU_GOOGLE_SHEET_ID",
  "sheet_name_participantes": "Participantes",
  "sheet_name_modelos": "Modelos",
  "sheet_name_jogos": "Jogos",
  "sheet_name_previsoes": "Previsoes",
  "sheet_name_resultados": "Resultados",
  "sheet_name_pontuacao": "Pontuacao",
  "sheet_name_ranking": "Ranking",
  "torneio": "Copa do Mundo 2026",
  "rodada_atual": "Oitavas de final",
  "site_url": "https://ufrj-analytica.github.io/analytica-copa",
  "youtube_live_url": "",
  "cache_ttl_minutos": 5
}
```

---

## 9. Deploy no GitHub Pages

```
/
├── index.html
├── jogos/
│   └── index.html
├── ranking/
│   └── index.html
├── modelos/
│   └── index.html
├── participantes/
│   └── index.html
├── sobre/
│   └── index.html
├── assets/
│   └── (logo, bandeiras, etc.)
├── data/
│   └── config.json
└── js/
    ├── api.js       — fetch e cache do Google Sheets
    ├── render.js    — componentes HTML gerados via JS
    └── utils.js     — formatação de datas, cálculo de status
```

### GitHub Actions (deploy automático)

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: .
```

Push no `main` → site atualizado em ~30 segundos.

---

## 10. Checklist de onboarding

Para um novo membro ou IA que for construir o site:

- [ ] `SHEET_ID` configurado em `data/config.json`
- [ ] Planilha pública (Compartilhar → Qualquer pessoa com o link → Visualizador)
- [ ] Cabeçalhos das abas exatamente iguais aos desta spec (case-sensitive)
- [ ] Assets em `/assets/` conforme seção 7
- [ ] GitHub Pages habilitado no repositório (Settings → Pages → Branch: main)
- [ ] Testar `fetchAba('Participantes')` no console antes de subir

---

*UFRJ Analytica · Analytica + Copa · Copa do Mundo 2026*  
*Documento gerado em junho de 2026 — atualizar conforme o projeto evolui*