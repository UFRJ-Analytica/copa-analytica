import type {
  MatchResult,
  Prediction,
  ResolvedGame,
  ScoreRecord,
} from "@/types/domain"

import { winnerFromScore } from "@/data/game-status"

export function calculatePoints(
  predictedHomeGoals: number,
  predictedAwayGoals: number,
  actualHomeGoals: number,
  actualAwayGoals: number
) {
  const predictedWinner = winnerFromScore(
    predictedHomeGoals,
    predictedAwayGoals
  )
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

export function scorePredictions(
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
