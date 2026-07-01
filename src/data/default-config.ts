import { DEFAULT_CACHE_TTL_MINUTES, DEFAULT_OG_IMAGE } from "@/lib/constants"
import type { SiteConfig } from "@/types/domain"

export const defaultConfig: SiteConfig = {
  sheetId: "1cUuWQDmFb4wKnsBIGnksnKTYSQLOD8yK",
  sheets: {
    participantes: "👥 Participantes",
    modelos: "🤖 Modelos",
    jogos: "⚽ Jogos",
    previsoes: "🎯 Previsões",
    resultados: "📊 Resultados",
    pontuacao: "🧮 Pontuação",
    ranking: "🏆 Ranking",
  },
  tournament: "Copa do Mundo 2026",
  currentRound: "Quartas de final",
  siteUrl: "https://ufrj-analytica.github.io/copa-analytica/",
  youtubeLiveUrl: "",
  cacheTtlMinutes: DEFAULT_CACHE_TTL_MINUTES,
  organizationName: "UFRJ Analytica",
  organizationUrl: "https://analytica.ufrj.br/",
  defaultOgImage: DEFAULT_OG_IMAGE,
}
