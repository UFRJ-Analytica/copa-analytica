import { getModelPerformance } from "@/data/derive"
import { ROUND_ORDER } from "@/lib/constants"
import type {
  AppData,
  PredictionWithContext,
  ResolvedGame,
} from "@/types/domain"

export function getNextGame(games: ResolvedGame[]) {
  return [...games]
    .filter((game) => ["aberto", "fechado"].includes(game.status))
    .sort(
      (left, right) =>
        new Date(left.predictionDeadline).getTime() -
        new Date(right.predictionDeadline).getTime()
    )[0]
}

export function getPredictionsForGame(
  predictions: PredictionWithContext[],
  gameId: string
) {
  return predictions.filter((prediction) => prediction.gameId === gameId)
}

export function groupGamesByRound(
  games: ResolvedGame[]
): Record<string, ResolvedGame[]> {
  const grouped = games.reduce<Record<string, ResolvedGame[]>>(
    (groups, game) => {
      groups[game.round] ??= []
      groups[game.round].push(game)
      return groups
    },
    {}
  )

  return Object.fromEntries(
    Object.entries(grouped)
      .map(([round, roundGames]): [string, ResolvedGame[]] => [
        round,
        [...roundGames].sort((left, right) => {
          const dateDiff =
            new Date(left.date).getTime() - new Date(right.date).getTime()
          if (dateDiff !== 0) return dateDiff
          return left.id.localeCompare(right.id, "pt-BR", { numeric: true })
        }),
      ])
      .sort(([left], [right]) => getRoundOrder(left) - getRoundOrder(right))
  )
}

function getRoundOrder(round: string) {
  const normalizedRound = normalizeRound(round)
  const index = ROUND_ORDER.findIndex(
    (item) => normalizeRound(item) === normalizedRound
  )
  return index === -1 ? ROUND_ORDER.length : index
}

function normalizeRound(round: string) {
  return round
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
}

export function getLatestPredictions(
  predictions: PredictionWithContext[],
  limit: number
) {
  return predictions.slice(0, limit)
}

export function getModelViewData(data: AppData) {
  return data.models.map((model) => ({
    model,
    participant:
      data.participants.find(
        (participant) => participant.id === model.participantId
      ) ?? null,
    stats: getModelPerformance(model.id, data.ranking),
  }))
}
