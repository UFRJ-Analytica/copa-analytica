import { getModelPerformance } from "@/data/derive"
import type { AppData, PredictionWithContext, ResolvedGame } from "@/types/domain"

export function getNextGame(games: ResolvedGame[]) {
  return [...games]
    .filter((game) => ["aberto", "fechado"].includes(game.status))
    .sort(
      (left, right) =>
        new Date(left.predictionDeadline).getTime() -
        new Date(right.predictionDeadline).getTime()
    )[0]
}

export function getPredictionsForGame(predictions: PredictionWithContext[], gameId: string) {
  return predictions.filter((prediction) => prediction.gameId === gameId)
}

export function groupGamesByRound(games: ResolvedGame[]) {
  return games.reduce<Record<string, ResolvedGame[]>>((groups, game) => {
    groups[game.round] ??= []
    groups[game.round].push(game)
    return groups
  }, {})
}

export function getLatestPredictions(predictions: PredictionWithContext[], limit: number) {
  return predictions.slice(0, limit)
}

export function getModelViewData(data: AppData) {
  return data.models.map((model) => ({
    model,
    participant:
      data.participants.find((participant) => participant.id === model.participantId) ?? null,
    stats: getModelPerformance(model.id, data.ranking),
  }))
}
