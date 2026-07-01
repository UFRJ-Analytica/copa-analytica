export const CACHE_PREFIX = "analytica-copa-v6"
export const DEFAULT_CACHE_TTL_MINUTES = 5
export const DEFAULT_OG_IMAGE = "/assets/og-image.png"
export const SITE_NAME = "Analytica + Copa"
export const SITE_TAGLINE =
  "Liga pública de modelos preditivos de futebol da UFRJ Analytica"

export const NAV_ITEMS = [
  { label: "Arena", path: "/" },
  { label: "Partidas", path: "/jogos" },
  { label: "Tabela", path: "/ranking" },
  { label: "Times", path: "/modelos" },
  { label: "Tecnicos", path: "/participantes" },
  { label: "Sobre", path: "/sobre" },
] as const

export const ROUND_ORDER = [
  "16 avos",
  "16 avos de final",
  "Dezesseis avos de final",
  "Fase de grupos",
  "Oitavas",
  "Oitavas de final",
  "Quartas de final",
  "Semifinal",
  "Final",
]
