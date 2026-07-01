import { getGameStatus, resolvePlaceholderTeam } from "@/data/game-status"
import { buildPredictionContext } from "@/data/prediction-context"
import { buildRanking, getModelPerformance } from "@/data/ranking"
import { scorePredictions } from "@/data/scoring"
import { ROUND_ORDER } from "@/lib/constants"
import type {
  AppData,
  DashboardStats,
  Game,
  MatchResult,
  Model,
  Participant,
  ParticipantProfile,
  Prediction,
  RankingEntry,
  ResolvedGame,
  ScoreRecord,
  SiteConfig,
} from "@/types/domain"

export { getModelPerformance }

function buildParticipantProfiles(
  participants: Participant[],
  models: Model[],
  ranking: RankingEntry[]
) {
  const rankingByModelId = new Map(
    ranking.map((entry) => [entry.modelId, entry])
  )

  return participants.map((participant) => {
    const participantModels = models.filter(
      (model) => model.participantId === participant.id
    )

    const totalPoints = participantModels.reduce((sum, model) => {
      return sum + (rankingByModelId.get(model.id)?.totalPoints ?? 0)
    }, 0)

    return {
      ...participant,
      models: participantModels,
      activeModels: participantModels.filter((model) => model.active).length,
      totalPoints,
    } satisfies ParticipantProfile
  })
}

function resolveGames(
  games: Game[],
  resultsByGameId: Map<string, MatchResult>
) {
  return games
    .map((game) => {
      const result = resultsByGameId.get(game.id) ?? null
      const status = result ? "encerrado" : getGameStatus(game)

      return {
        ...game,
        resolvedHomeTeam: resolvePlaceholderTeam(
          game.homeTeam,
          resultsByGameId
        ),
        resolvedAwayTeam: resolvePlaceholderTeam(
          game.awayTeam,
          resultsByGameId
        ),
        status: status === "encerrado" && !result ? "fechado" : status,
        hasResult: Boolean(result),
        result,
      } satisfies ResolvedGame
    })
    .sort((left, right) => {
      const roundIndexDiff =
        ROUND_ORDER.indexOf(left.round) - ROUND_ORDER.indexOf(right.round)
      if (roundIndexDiff !== 0) {
        return roundIndexDiff
      }

      return (
        new Date(`${left.date}T${left.kickoffBrt}:00-03:00`).getTime() -
        new Date(`${right.date}T${right.kickoffBrt}:00-03:00`).getTime()
      )
    })
}

export function composeAppData(input: {
  config: SiteConfig
  participants: Participant[]
  models: Model[]
  games: Game[]
  predictions: Prediction[]
  results: MatchResult[]
  scores: ScoreRecord[]
  ranking: RankingEntry[]
  sourceLabel: "google-sheets"
}): AppData {
  const resultsByGameId = new Map(
    input.results.map((item) => [item.gameId, item])
  )
  const resolvedGames = resolveGames(input.games, resultsByGameId)
  const modelsById = new Map(input.models.map((item) => [item.id, item]))
  const gamesById = new Map(resolvedGames.map((item) => [item.id, item]))
  const recomputedScores = scorePredictions(
    input.predictions,
    gamesById,
    resultsByGameId
  )
  const computedScores = recomputedScores
  const computedRanking = buildRanking(input.models, computedScores)
  const scoresByPredictionId = new Map(
    computedScores.map((item) => [item.predictionId, item])
  )
  const predictions = buildPredictionContext(
    input.predictions,
    modelsById,
    gamesById,
    scoresByPredictionId
  )
  const participantProfiles = buildParticipantProfiles(
    input.participants,
    input.models,
    computedRanking
  )

  const dashboard: DashboardStats = {
    activeModels: input.models.filter((model) => model.active).length,
    participants: input.participants.length,
    predictions: predictions.filter((prediction) => prediction.validSubmission)
      .length,
    completedGames: input.results.length,
  }

  return {
    config: input.config,
    participants: input.participants,
    participantProfiles,
    models: input.models,
    games: resolvedGames,
    predictions,
    results: input.results,
    scores: computedScores,
    ranking: computedRanking,
    dashboard,
    sourceLabel: input.sourceLabel,
    loadedAt: new Date().toISOString(),
  }
}
