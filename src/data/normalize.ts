import { defaultConfig } from "@/data/default-config"
import type {
  Game,
  MatchResult,
  Model,
  Participant,
  Prediction,
  RankingEntry,
  ScoreRecord,
  SiteConfig,
  WinnerSide,
} from "@/types/domain"

type RawRecord = Record<string, string | number | boolean | null>

function asString(value: string | number | boolean | null) {
  if (value === null || value === undefined) {
    return ""
  }

  return String(value).trim()
}

function asNumber(value: string | number | boolean | null) {
  if (typeof value === "number") {
    return value
  }

  const normalized = asString(value).replace(",", ".")
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : 0
}

function asBoolean(value: string | number | boolean | null) {
  if (typeof value === "boolean") {
    return value
  }

  const normalized = asString(value).toLowerCase()
  return ["true", "sim", "yes", "1"].includes(normalized)
}

function asWinner(value: string | number | boolean | null): WinnerSide {
  const normalized = asString(value)
  if (normalized === "Visitante" || normalized === "Empate") {
    return normalized
  }

  return "Mandante"
}

export function normalizeConfig(raw: Record<string, unknown> | null): SiteConfig {
  if (!raw) {
    return defaultConfig
  }

  return {
    sheetId: String(raw.sheet_id ?? defaultConfig.sheetId),
    sheets: {
      participantes: String(
        raw.sheet_name_participantes ?? defaultConfig.sheets.participantes
      ),
      modelos: String(raw.sheet_name_modelos ?? defaultConfig.sheets.modelos),
      jogos: String(raw.sheet_name_jogos ?? defaultConfig.sheets.jogos),
      previsoes: String(raw.sheet_name_previsoes ?? defaultConfig.sheets.previsoes),
      resultados: String(raw.sheet_name_resultados ?? defaultConfig.sheets.resultados),
      pontuacao: String(raw.sheet_name_pontuacao ?? defaultConfig.sheets.pontuacao),
      ranking: String(raw.sheet_name_ranking ?? defaultConfig.sheets.ranking),
    },
    tournament: String(raw.torneio ?? defaultConfig.tournament),
    currentRound: String(raw.rodada_atual ?? defaultConfig.currentRound),
    siteUrl: String(raw.site_url ?? defaultConfig.siteUrl),
    youtubeLiveUrl: String(raw.youtube_live_url ?? defaultConfig.youtubeLiveUrl),
    cacheTtlMinutes: Number(
      raw.cache_ttl_minutos ?? defaultConfig.cacheTtlMinutes
    ),
    organizationName: String(
      raw.organization_name ?? defaultConfig.organizationName
    ),
    organizationUrl: String(raw.organization_url ?? defaultConfig.organizationUrl),
    defaultOgImage: String(raw.default_og_image ?? defaultConfig.defaultOgImage),
  }
}

function normalizeDateValue(value: string | number | boolean | null) {
  const raw = asString(value)
  if (!raw) {
    return ""
  }

  const gvizMatch = raw.match(
    /^Date\((\d{4}),(\d{1,2}),(\d{1,2})(?:,(\d{1,2}),(\d{1,2}),?(\d{1,2})?)?\)$/
  )

  if (gvizMatch) {
    const [, year, month, day, hour = "0", minute = "0", second = "0"] = gvizMatch
    const date = new Date(
      Number(year),
      Number(month),
      Number(day),
      Number(hour),
      Number(minute),
      Number(second)
    )
    return date.toISOString()
  }

  if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}/.test(raw)) {
    return raw.replace(" ", "T")
  }

  return raw
}

export function normalizeParticipants(rows: RawRecord[]): Participant[] {
  return rows.map((row) => ({
    id: asString(row.id),
    name: asString(row.nome),
    email: asString(row.email),
    affiliation: asString(row.vinculo),
    linkedin: asString(row.linkedin),
    github: asString(row.github),
    socialHandle: asString(row.instagram_x),
    bio: asString(row.bio),
    photoUrl: asString(row.foto_url),
  }))
}

export function normalizeModels(rows: RawRecord[]): Model[] {
  return rows.map((row) => ({
    id: asString(row.id_modelo),
    participantId: asString(row.id_participante),
    participantName: asString(row.nome_participante),
    name: asString(row.nome_modelo),
    type: asString(row.tipo_modelo),
    colabUrl: asString(row.colab_url),
    datasets: asString(row.datasets),
    datasetUrls: asString(row.datasets_urls)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    libs: asString(row.libs),
    description: asString(row.descricao),
    registeredAt: normalizeDateValue(row.data_cadastro),
    active: asBoolean(row.ativo),
  }))
}

export function normalizeGames(rows: RawRecord[]): Game[] {
  return rows.map((row) => ({
    id: asString(row.id_jogo),
    round: asString(row.rodada),
    date: normalizeDateValue(row.data).slice(0, 10),
    kickoffBrt: asString(row.horario_brt).slice(0, 5),
    homeTeam: asString(row.mandante),
    awayTeam: asString(row.visitante),
    venue: asString(row.local),
    predictionDeadline: normalizeDateValue(row.prazo_previsao),
  }))
}

export function normalizePredictions(rows: RawRecord[]): Prediction[] {
  return rows.map((row) => ({
    id: asString(row.id_previsao),
    modelId: asString(row.id_modelo),
    modelName: asString(row.nome_modelo),
    participantName: asString(row.nome_participante),
    gameId: asString(row.id_jogo),
    homeTeam: asString(row.mandante),
    awayTeam: asString(row.visitante),
    predictedScore: asString(row.placar_previsto),
    predictedHomeGoals: asNumber(row.gols_mandante),
    predictedAwayGoals: asNumber(row.gols_visitante),
    predictedWinner: asWinner(row.vencedor_previsto),
    confidence: asNumber(row.confianca),
    notes: asString(row.observacoes),
    submittedAt: normalizeDateValue(row.timestamp_envio),
  }))
}

export function normalizeResults(rows: RawRecord[]): MatchResult[] {
  return rows.map((row) => ({
    gameId: asString(row.id_jogo),
    homeTeam: asString(row.mandante),
    awayTeam: asString(row.visitante),
    actualHomeGoals: asNumber(row.gols_mandante_real),
    actualAwayGoals: asNumber(row.gols_visitante_real),
    actualWinner: asWinner(row.vencedor_real),
    finishedAt: normalizeDateValue(row.datetime_fim),
    notes: asString(row.observacoes),
  }))
}

export function normalizeScores(rows: RawRecord[]): ScoreRecord[] {
  return rows.map((row) => ({
    predictionId: asString(row.id_previsao),
    modelId: asString(row.id_modelo),
    modelName: asString(row.nome_modelo),
    participantName: asString(row.nome_participante),
    gameId: asString(row.id_jogo),
    predictedHomeGoals: asNumber(row.gols_mandante_prev),
    predictedAwayGoals: asNumber(row.gols_visitante_prev),
    predictedWinner: asWinner(row.vencedor_previsto),
    actualHomeGoals: asNumber(row.gols_mandante_real),
    actualAwayGoals: asNumber(row.gols_visitante_real),
    actualWinner: asWinner(row.vencedor_real),
    exactScore: asBoolean(row.placar_exato),
    correctWinner: asBoolean(row.vencedor_certo),
    points: asNumber(row.pontos),
    confidence: asNumber(row.confianca),
    weightedPoints: asNumber(row.pts_x_confianca),
  }))
}

export function normalizeRanking(rows: RawRecord[]): RankingEntry[] {
  return rows.map((row) => ({
    position: asNumber(row.posicao),
    modelId: asString(row.id_modelo),
    modelName: asString(row.nome_modelo),
    participantName: asString(row.nome_participante),
    totalPoints: asNumber(row.pontos_totais),
    predictedGames: asNumber(row.jogos_previstos),
    exactScores: asNumber(row.placares_exatos),
    correctWinners: asNumber(row.vencedores_certos),
    averageConfidence: asNumber(row.confianca_media),
    weightedPoints: asNumber(row.pts_x_confianca),
    colabUrl: asString(row.colab_url),
  }))
}
