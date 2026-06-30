import { DEFAULT_CACHE_TTL_MINUTES, DEFAULT_OG_IMAGE } from "@/lib/constants"
import type { SiteConfig } from "@/types/domain"

export const defaultConfig: SiteConfig = {
  sheetId: "",
  sheets: {
    participantes: "Participantes",
    modelos: "Modelos",
    jogos: "Jogos",
    previsoes: "Previsoes",
    resultados: "Resultados",
    pontuacao: "Pontuacao",
    ranking: "Ranking",
  },
  tournament: "Copa do Mundo 2026",
  currentRound: "Oitavas de final",
  siteUrl: "https://example.com/",
  youtubeLiveUrl: "",
  cacheTtlMinutes: DEFAULT_CACHE_TTL_MINUTES,
  organizationName: "UFRJ Analytica",
  organizationUrl: "https://analytica.ufrj.br/",
  defaultOgImage: DEFAULT_OG_IMAGE,
}
