import { readCache, writeCache } from "@/data/cache"
import { composeAppData } from "@/data/derive"
import { fetchSheetRows } from "@/data/gviz"
import {
  normalizeConfig,
  normalizeGames,
  normalizeModels,
  normalizeParticipants,
  normalizePredictions,
  normalizeRanking,
  normalizeResults,
  normalizeScores,
} from "@/data/normalize"
import type { AppData } from "@/types/domain"

async function fetchConfig() {
  const response = await fetch(`${import.meta.env.BASE_URL}data/config.json`)
  if (!response.ok) {
    throw new Error("Nao foi possivel carregar public/data/config.json.")
  }

  const raw = (await response.json()) as Record<string, unknown>
  return normalizeConfig(raw)
}

async function loadFromSheets(): Promise<AppData> {
  const config = await fetchConfig()
  const cacheKey = `dataset:${config.sheetId}`
  const cached = readCache<AppData>(cacheKey, config.cacheTtlMinutes)
  if (cached) {
    return cached
  }

  if (!config.sheetId) {
    throw new Error(
      "sheet_id nao configurado em public/data/config.json. O app nao usa dados mockados."
    )
  }

  const [
    participantsRows,
    modelsRows,
    gamesRows,
    predictionsRows,
    resultsRows,
    scoreRows,
    rankingRows,
  ] = await Promise.all([
    fetchSheetRows(config.sheetId, config.sheets.participantes),
    fetchSheetRows(config.sheetId, config.sheets.modelos),
    fetchSheetRows(config.sheetId, config.sheets.jogos),
    fetchSheetRows(config.sheetId, config.sheets.previsoes),
    fetchSheetRows(config.sheetId, config.sheets.resultados),
    fetchSheetRows(config.sheetId, config.sheets.pontuacao).catch(() => []),
    fetchSheetRows(config.sheetId, config.sheets.ranking).catch(() => []),
  ])

  const dataset = composeAppData({
    config,
    participants: normalizeParticipants(participantsRows),
    models: normalizeModels(modelsRows),
    games: normalizeGames(gamesRows),
    predictions: normalizePredictions(predictionsRows),
    results: normalizeResults(resultsRows),
    scores: normalizeScores(scoreRows),
    ranking: normalizeRanking(rankingRows),
    sourceLabel: "google-sheets",
  })

  writeCache(cacheKey, dataset)
  return dataset
}

export async function loadAppData() {
  return loadFromSheets()
}
