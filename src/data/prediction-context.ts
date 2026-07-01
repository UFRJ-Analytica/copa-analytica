import type {
  Model,
  Prediction,
  PredictionOutcome,
  PredictionWithContext,
  ResolvedGame,
  ScoreRecord,
} from "@/types/domain"

export function deriveConfidenceProfile(prediction: Prediction) {
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

export function deriveOutcome(
  score: ScoreRecord | null,
  validSubmission: boolean
): PredictionOutcome {
  if (!validSubmission) return "late"
  if (!score) return "pending"
  if (score.exactScore) return "exact"
  if (score.correctWinner) return "winner"
  return "miss"
}

export function buildPredictionContext(
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
        new Date(right.submittedAt).getTime() -
        new Date(left.submittedAt).getTime()
    )
}
