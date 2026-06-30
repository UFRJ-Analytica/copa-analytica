export const CACHE_PREFIX = "analytica-copa"
export const DEFAULT_CACHE_TTL_MINUTES = 5
export const DEFAULT_OG_IMAGE = "/assets/og-image.png"
export const SITE_NAME = "Analytica + Copa"
export const SITE_TAGLINE =
  "Liga pública de modelos preditivos de futebol da UFRJ Analytica"

export const NAV_ITEMS = [
  { label: "Inicio", path: "/" },
  { label: "Ranking", path: "/ranking" },
  { label: "Participantes", path: "/participantes" },
  { label: "Jogos", path: "/jogos" },
  { label: "Modelos", path: "/modelos" },
  { label: "Sobre", path: "/sobre" },
] as const

export const ROUND_ORDER = [
  "Fase de grupos",
  "Oitavas de final",
  "Quartas de final",
  "Semifinal",
  "Final",
]
