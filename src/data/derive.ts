import { ROUND_ORDER } from "@/lib/constants"
import type {
  AppData,
  DashboardStats,
  Game,
  MatchResult,
  Model,
  ModelPerformance,
  Participant,
  ParticipantProfile,
  Prediction,
  PredictionOutcome,
  PredictionWithContext,
  RankingEntry,
  ResolvedGame,
  ScoreRecord,
  SiteConfig,
  WinnerSide,
} from "@/types/domain"

function winnerFromScore(homeGoals: number, awayGoals: number): WinnerSide {
  if (homeGoals > awayGoals) return "Mandante"
  if (awayGoals > homeGoals) return "Visitante"
  return "Empate"
}

function calculatePoints(
  predictedHomeGoals: number,
  predictedAwayGoals: number,
  actualHomeGoals: number,
  actualAwayGoals: number
) {
  const predictedWinner = winnerFromScore(predictedHomeGoals, predictedAwayGoals)
  const actualWinner = winnerFromScore(actualHomeGoals, actualAwayGoals)
  const exactScore =
    predictedHomeGoals === actualHomeGoals &&
    predictedAwayGoals === actualAwayGoals
  const correctWinner = predictedWinner === actualWinner

  if (exactScore) {
    return { points: 5, exactScore, correctWinner }
  }

  if (actualWinner === "Empate" && correctWinner) {
    return { points: 3, exactScore, correctWinner }
  }

  if (correctWinner) {
    return { points: 2, exactScore, correctWinner }
  }

  return { points: 0, exactScore, correctWinner }
}

function getGameStatus(game: Game) {
  const now = Date.now()
  const kickoff = new Date(`${game.date}T${game.kickoffBrt}:00-03:00`).getTime()
  const deadline = new Date(game.predictionDeadline).getTime()
  const estimatedEnd = kickoff + 2 * 60 * 60 * 1000

  if (now < deadline) return "aberto" as const
  if (now < kickoff) return "fechado" as const
  if (now < estimatedEnd) return "ao_vivo" as const
  return "encerrado" as const
}

function resolvePlaceholderTeam(teamName: string, resultsByGameId: Map<string, MatchResult>) {
  const match = teamName.match(/^Vencedor\s+(J\d+)$/i)
  if (!match) {
    return teamName
  }

  const sourceResult = resultsByGameId.get(match[1])
  if (!sourceResult) {
    return teamName
  }

  if (sourceResult.actualWinner === "Mandante") {
    return sourceResult.homeTeam
  }

  if (sourceResult.actualWinner === "Visitante") {
    return sourceResult.awayTeam
  }

  return teamName
}

function deriveConfidenceProfile(prediction: Prediction) {
  const confidence = Math.min(Math.max(prediction.confidence, 0), 100)
  const remainder = 100 - confidence

  if (prediction.predictedWinner === "Mandante") {
    return {
      mandante: confidence,
      empate: remainder * 0.55,
      visitante: remainder * 0.45,
    }
  }

  if (prediction.predictedWinner === "Visitante") {
    return {
      mandante: remainder * 0.45,
      empate: remainder * 0.55,
      visitante: confidence,
    }
  }

  return {
    mandante: remainder / 2,
    empate: confidence,
    visitante: remainder / 2,
  }
}

function scorePredictions(
  predictions: Prediction[],
  gamesById: Map<string, ResolvedGame>,
  resultsByGameId: Map<string, MatchResult>
) {
  return predictions.flatMap((prediction) => {
    const game = gamesById.get(prediction.gameId)
    const result = resultsByGameId.get(prediction.gameId)
    const validSubmission = game
      ? new Date(prediction.submittedAt).getTime() <=
        new Date(game.predictionDeadline).getTime()
      : false

    if (!result || !validSubmission) {
      return []
    }

    const points = calculatePoints(
      prediction.predictedHomeGoals,
      prediction.predictedAwayGoals,
      result.actualHomeGoals,
      result.actualAwayGoals
    )

    return [
      {
        predictionId: prediction.id,
        modelId: prediction.modelId,
        modelName: prediction.modelName,
        participantName: prediction.participantName,
        gameId: prediction.gameId,
        predictedHomeGoals: prediction.predictedHomeGoals,
        predictedAwayGoals: prediction.predictedAwayGoals,
        predictedWinner: prediction.predictedWinner,
        actualHomeGoals: result.actualHomeGoals,
        actualAwayGoals: result.actualAwayGoals,
        actualWinner: result.actualWinner,
        exactScore: points.exactScore,
        correctWinner: points.correctWinner,
        points: points.points,
        confidence: prediction.confidence,
        weightedPoints: Number(
          (points.points * (prediction.confidence / 100)).toFixed(2)
        ),
      } satisfies ScoreRecord,
    ]
  })
}

function buildRanking(models: Model[], scores: ScoreRecord[]) {
  const scoresByModel = new Map<string, ScoreRecord[]>()

  scores.forEach((score) => {
    const list = scoresByModel.get(score.modelId) ?? []
    list.push(score)
    scoresByModel.set(score.modelId, list)
  })

  const ranking = models
    .filter((model) => model.active)
    .map((model) => {
      const modelScores = scoresByModel.get(model.id) ?? []
      const totalPoints = modelScores.reduce((sum, item) => sum + item.points, 0)
      const weightedPoints = modelScores.reduce(
        (sum, item) => sum + item.weightedPoints,
        0
      )
      const exactScores = modelScores.filter((item) => item.exactScore).length
      const correctWinners = modelScores.filter((item) => item.correctWinner).length
      const averageConfidence =
        modelScores.length > 0
          ? modelScores.reduce((sum, item) => sum + item.confidence, 0) /
            modelScores.length
          : 0

      return {
        position: 0,
        modelId: model.id,
        modelName: model.name,
        participantName: model.participantName,
        totalPoints,
        predictedGames: modelScores.length,
        exactScores,
        correctWinners,
        averageConfidence: Number(averageConfidence.toFixed(1)),
        weightedPoints: Number(weightedPoints.toFixed(2)),
        colabUrl: model.colabUrl,
      } satisfies RankingEntry
    })
    .sort((left, right) => {
      if (right.totalPoints !== left.totalPoints) {
        return right.totalPoints - left.totalPoints
      }

      if (right.weightedPoints !== left.weightedPoints) {
        return right.weightedPoints - left.weightedPoints
      }

      return right.exactScores - left.exactScores
    })
    .map((entry, index) => ({ ...entry, position: index + 1 }))

  return ranking
}

function buildParticipantProfiles(
  participants: Participant[],
  models: Model[],
  ranking: RankingEntry[]
) {
  const rankingByModelId = new Map(ranking.map((entry) => [entry.modelId, entry]))

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

function deriveOutcome(score: ScoreRecord | null, validSubmission: boolean): PredictionOutcome {
  if (!validSubmission) return "late"
  if (!score) return "pending"
  if (score.exactScore) return "exact"
  if (score.correctWinner) return "winner"
  return "miss"
}

function buildPredictionContext(
  predictions: Prediction[],
  modelsById: Map<string, Model>,
  gamesById: Map<string, ResolvedGame>,
  scoresByPredictionId: Map<string, ScoreRecord>
) {
  return predictions
    .map((prediction) => {
      const game = gamesById.get(prediction.gameId) ?? null
      const validSubmission = game
        ? new Date(prediction.submittedAt).getTime() <=
          new Date(game.predictionDeadline).getTime()
        : false
      const score = scoresByPredictionId.get(prediction.id) ?? null

      return {
        ...prediction,
        model: modelsById.get(prediction.modelId) ?? null,
        game,
        score,
        validSubmission,
        outcome: deriveOutcome(score, validSubmission),
        confidenceProfile: deriveConfidenceProfile(prediction),
      } satisfies PredictionWithContext
    })
    .sort(
      (left, right) =>
        new Date(right.submittedAt).getTime() - new Date(left.submittedAt).getTime()
    )
}

export function getModelPerformance(
  modelId: string,
  ranking: RankingEntry[]
): ModelPerformance {
  const entry = ranking.find((item) => item.modelId === modelId)
  if (!entry) {
    return {
      totalPoints: 0,
      predictedGames: 0,
      exactScores: 0,
      correctWinners: 0,
      accuracyRate: 0,
      weightedPoints: 0,
      averageConfidence: 0,
    }
  }

  return {
    totalPoints: entry.totalPoints,
    predictedGames: entry.predictedGames,
    exactScores: entry.exactScores,
    correctWinners: entry.correctWinners,
    accuracyRate:
      entry.predictedGames > 0
        ? (entry.correctWinners / entry.predictedGames) * 100
        : 0,
    weightedPoints: entry.weightedPoints,
    averageConfidence: entry.averageConfidence,
  }
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
  sourceLabel: "google-sheets" | "demo"
}): AppData {
  const resultsByGameId = new Map(input.results.map((item) => [item.gameId, item]))

  const resolvedGames = input.games
    .map((game) => {
      const result = resultsByGameId.get(game.id) ?? null
      return {
        ...game,
        resolvedHomeTeam: resolvePlaceholderTeam(game.homeTeam, resultsByGameId),
        resolvedAwayTeam: resolvePlaceholderTeam(game.awayTeam, resultsByGameId),
        status: getGameStatus(game),
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

  const modelsById = new Map(input.models.map((item) => [item.id, item]))
  const gamesById = new Map(resolvedGames.map((item) => [item.id, item]))
  const computedScores =
    input.scores.length > 0
      ? input.scores
      : scorePredictions(input.predictions, gamesById, resultsByGameId)
  const computedRanking =
    input.ranking.length > 0 ? input.ranking : buildRanking(input.models, computedScores)
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
    predictions: predictions.filter((prediction) => prediction.validSubmission).length,
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
