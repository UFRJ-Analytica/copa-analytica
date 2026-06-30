import { SITE_TAGLINE } from "@/lib/constants"
import type { AppData, Model, RankingEntry, ResolvedGame } from "@/types/domain"
import type { AppRoute } from "@/types/routing"

function websiteSchema(siteUrl: string, title: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: title,
    description,
    url: new URL(path, siteUrl).toString(),
  }
}

export function getPageMeta(route: AppRoute, data: AppData) {
  if (route.id === "home") {
    return {
      title: "Liga de Modelos",
      description:
        "Acompanhe rankings, previsoes por jogo e perfis tecnicos da competicao Analytica + Copa.",
      canonicalPath: "/",
      jsonLd: websiteSchema(data.config.siteUrl, "Analytica + Copa", SITE_TAGLINE, "/"),
    }
  }

  if (route.id === "games") {
    return {
      title: "Jogos",
      description:
        "Painel completo dos confrontos, prazos, resultados e previsoes dos modelos.",
      canonicalPath: "/jogos",
      jsonLd: websiteSchema(data.config.siteUrl, "Jogos", SITE_TAGLINE, "/jogos"),
    }
  }

  if (route.id === "ranking") {
    return {
      title: "Ranking",
      description:
        "Leaderboard consolidado com pontos totais, placares exatos e calibracao.",
      canonicalPath: "/ranking",
      jsonLd: websiteSchema(data.config.siteUrl, "Ranking", SITE_TAGLINE, "/ranking"),
    }
  }

  if (route.id === "models") {
    return {
      title: "Modelos",
      description:
        "Catalogo tecnico com metodologia, datasets, bibliotecas e performance de cada modelo.",
      canonicalPath: "/modelos",
      jsonLd: websiteSchema(data.config.siteUrl, "Modelos", SITE_TAGLINE, "/modelos"),
    }
  }

  if (route.id === "participants") {
    return {
      title: "Participantes",
      description:
        "Conheca os participantes da liga e seus modelos ativos dentro da competicao.",
      canonicalPath: "/participantes",
      jsonLd: websiteSchema(
        data.config.siteUrl,
        "Participantes",
        SITE_TAGLINE,
        "/participantes"
      ),
    }
  }

  if (route.id === "about") {
    return {
      title: "Sobre a Plataforma",
      description:
        "Regras, arquitetura estatica, integracao com Google Sheets e metricas de avaliacao.",
      canonicalPath: "/sobre",
      jsonLd: websiteSchema(data.config.siteUrl, "Sobre", SITE_TAGLINE, "/sobre"),
    }
  }

  if (route.id === "game-details") {
    const game = data.games.find((item) => item.id === route.params.id)
    return getGameMeta(game, data)
  }

  if (route.id === "model-details") {
    const model = data.models.find((item) => item.id === route.params.id)
    const rankingEntry = data.ranking.find((item) => item.modelId === route.params.id)
    return getModelMeta(model, rankingEntry, data)
  }

  return {
    title: "Pagina nao encontrada",
    description: "A rota pedida nao existe dentro da plataforma Analytica + Copa.",
    canonicalPath: route.path,
    jsonLd: websiteSchema(data.config.siteUrl, "Nao encontrado", SITE_TAGLINE, route.path),
  }
}

function getGameMeta(game: ResolvedGame | undefined, data: AppData) {
  if (!game) {
    return {
      title: "Jogo nao encontrado",
      description: "Nao encontramos este jogo na planilha atual.",
      canonicalPath: "/jogos",
    }
  }

  return {
    title: `${game.resolvedHomeTeam} x ${game.resolvedAwayTeam}`,
    description:
      "Veja prazo, previsoes por modelo, placar oficial e sinais agregados para o confronto.",
    canonicalPath: `/jogos/${game.id}`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "SportsEvent",
      name: `${game.resolvedHomeTeam} x ${game.resolvedAwayTeam}`,
      startDate: `${game.date}T${game.kickoffBrt}:00-03:00`,
      location: {
        "@type": "Place",
        name: game.venue,
      },
      url: new URL(`/jogos/${game.id}`, data.config.siteUrl).toString(),
    },
  }
}

function getModelMeta(
  model: Model | undefined,
  ranking: RankingEntry | undefined,
  data: AppData
) {
  if (!model) {
    return {
      title: "Modelo nao encontrado",
      description: "Nao encontramos este modelo no catalogo atual.",
      canonicalPath: "/modelos",
    }
  }

  const points = ranking ? `${ranking.totalPoints} pontos` : "sem pontuacao publicada"

  return {
    title: model.name,
    description: `${model.type}. ${points}. Metodologia, datasets e historico do modelo dentro da competicao.`,
    canonicalPath: `/modelos/${model.id}`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "SoftwareSourceCode",
      name: model.name,
      codeRepository: model.colabUrl,
      programmingLanguage: model.libs,
      description: model.description,
      url: new URL(`/modelos/${model.id}`, data.config.siteUrl).toString(),
    },
  }
}
