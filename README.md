# Analytica + Copa

Plataforma estatica para acompanhar uma competicao publica de modelos preditivos de futebol da UFRJ Analytica.

O site foi pensado para:

- rodar em `GitHub Pages`
- consumir dados de uma `Google Sheets` publica
- nao depender de backend
- manter codigo modular, com arquivos pequenos e responsabilidades separadas
- publicar SEO, Open Graph e compartilhamento por rota

## Stack

- `React 19`
- `TypeScript`
- `Vite`
- `Tailwind CSS v4`
- componentes baseados em `shadcn/ui`

## Como funciona

1. A planilha Google publica e a fonte de verdade.
2. O frontend busca as abas via `gviz` do Google Sheets.
3. Os dados sao normalizados em `src/data`.
4. A aplicacao deriva ranking, status de jogo, cruzamentos e metricas no cliente.
5. O build gera `sitemap.xml` e `robots.txt` automaticamente.

Se `sheet_id` estiver vazio, a plataforma entra em modo demo com dados locais de exemplo.

## Estrutura principal

```text
public/
  assets/              logos, icons e og-image
  data/config.json     configuracao da planilha e do site
  404.html             fallback para GitHub Pages

scripts/
  generate-seo.mjs     gera sitemap.xml e robots.txt

src/
  app/                 composicao geral da app e metadata por rota
  components/          layout, dashboard, shared e ui
  data/                fetch, cache, normalizacao e derivacoes
  features/            paginas por dominio
  hooks/               hooks de rota, dados e SEO
  lib/                 helpers de formato, teams, routing e SEO
  types/               contratos de dominio e rotas
```

## Configuracao da planilha

Edite [public/data/config.json](public/data/config.json) e preencha pelo menos:

```json
{
  "sheet_id": "SEU_GOOGLE_SHEET_ID",
  "site_url": "https://SEU-USUARIO.github.io/SEU-REPO/"
}
```

### Requisitos da planilha

- a planilha precisa estar publica em modo visualizacao
- os nomes das abas devem bater com os nomes em `config.json`
- os cabecalhos devem seguir a especificacao em `prompt.md`

## Desenvolvimento local

Instalar dependencias:

```bash
npm install
```

Rodar ambiente local:

```bash
npm run dev
```

No PowerShell com politica restritiva, pode ser necessario usar:

```bash
npm.cmd run dev
```

## Scripts

- `npm run dev` - sobe o ambiente local
- `npm run typecheck` - checa TypeScript
- `npm run lint` - roda ESLint
- `npm run seo` - gera `public/sitemap.xml` e `public/robots.txt`
- `npm run build` - gera SEO + build de producao
- `npm run preview` - serve a build localmente

## SEO e compartilhamento

O projeto ja sai com:

- meta description base em `index.html`
- Open Graph e Twitter Cards por rota
- JSON-LD por pagina
- `sitemap.xml`
- `robots.txt`
- imagem de compartilhamento em `public/assets/og-image.png`

As rotas dinamicas de `jogos/:id` e `modelos/:id` entram no sitemap quando `sheet_id` esta configurado e o script consegue ler a planilha.

## GitHub Pages

O projeto esta preparado para deploy estatico.

### Pontos importantes

- `404.html` faz o fallback das rotas para SPA no GitHub Pages
- o `base` do Vite e inferido no build a partir do nome do pacote
- se quiser forcar outro subcaminho, use `VITE_BASE_PATH`

Exemplo:

```bash
VITE_BASE_PATH=/analytica-copa/ npm run build
```

## Assets

Os arquivos atuais em `public/assets` sao placeholders. Voce pode substituir por:

- logo oficial
- favicon final
- icones PWA finais
- `og-image` definitiva

Mantendo os mesmos nomes, a app continua funcionando sem ajustes extras.

## Fluxo recomendado antes de publicar

1. Configurar `sheet_id` e `site_url`
2. Validar se a planilha publica responde
3. Rodar `npm run typecheck`
4. Rodar `npm run lint`
5. Rodar `npm run build`
6. Testar a pasta `dist` com `npm run preview`
7. Publicar no GitHub Pages

## Observacoes

- O repositório ainda contem `prompt.md` como documento de especificacao funcional.
- A app aceita aba `Ranking` pronta, mas tambem recompõe parte das metricas se necessario.
- Modelos inativos saem do ranking principal, mas continuam visiveis historicamente.
