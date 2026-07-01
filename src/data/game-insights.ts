import type {
  PredictionWithContext,
  ResolvedGame,
  WinnerSide,
} from "@/types/domain"

export interface GamePredictionSummary {
  totalPredictions: number
  exactScores: number
  correctWinners: number
  misses: number
  pending: number
  late: number
  pointsDistributed: number
  averageConfidence: number
  bestPredictions: PredictionWithContext[]
  consensus: {
    label: string
    side: WinnerSide | null
    confidence: number
    home: number
    draw: number
    away: number
  }
}

const outcomePriority: Record<PredictionWithContext["outcome"], number> = {
  exact: 4,
  winner: 3,
  pending: 2,
  late: 1,
  miss: 0,
}

export function getGamePredictionSummary(
  game: ResolvedGame,
  predictions: PredictionWithContext[]
): GamePredictionSummary {
  const exactScores = predictions.filter(
    (prediction) => prediction.outcome === "exact"
  ).length
  const correctWinners = predictions.filter(
    (prediction) => prediction.outcome === "winner"
  ).length
  const misses = predictions.filter(
    (prediction) => prediction.outcome === "miss"
  ).length
  const pending = predictions.filter(
    (prediction) => prediction.outcome === "pending"
  ).length
  const late = predictions.filter(
    (prediction) => prediction.outcome === "late"
  ).length
  const pointsDistributed = predictions.reduce(
    (total, prediction) => total + (prediction.score?.points ?? 0),
    0
  )
  const averageConfidence = average(
    predictions.map((prediction) => prediction.confidence)
  )

  const home = average(
    predictions.map((prediction) => prediction.confidenceProfile.mandante)
  )
  const draw = average(
    predictions.map((prediction) => prediction.confidenceProfile.empate)
  )
  const away = average(
    predictions.map((prediction) => prediction.confidenceProfile.visitante)
  )

  const consensus = buildConsensus(game, home, draw, away)
  const bestPredictions = getBestPredictions(predictions)

  return {
    totalPredictions: predictions.length,
    exactScores,
    correctWinners,
    misses,
    pending,
    late,
    pointsDistributed,
    averageConfidence,
    bestPredictions,
    consensus,
  }
}

export function getOutcomeIcon(outcome: PredictionWithContext["outcome"]) {
  if (outcome === "exact") return "🎯"
  if (outcome === "winner") return "✅"
  if (outcome === "late") return "⏰"
  if (outcome === "miss") return "❌"
  return "⏳"
}

export function getOutcomeTone(outcome: PredictionWithContext["outcome"]) {
  if (outcome === "exact") return "border-emerald-400/50 bg-emerald-400/10"
  if (outcome === "winner") return "border-sky-400/50 bg-sky-400/10"
  if (outcome === "late") return "border-amber-400/50 bg-amber-400/10"
  if (outcome === "miss") return "border-rose-400/35 bg-rose-400/10"
  return "border-border/70 bg-background/60"
}

function getBestPredictions(predictions: PredictionWithContext[]) {
  return [...predictions]
    .sort((left, right) => {
      const pointsDiff = (right.score?.points ?? 0) - (left.score?.points ?? 0)
      if (pointsDiff !== 0) return pointsDiff

      const outcomeDiff =
        outcomePriority[right.outcome] - outcomePriority[left.outcome]
      if (outcomeDiff !== 0) return outcomeDiff

      return right.confidence - left.confidence
    })
    .filter((prediction, index, sorted) => {
      if (index === 0) return true
      const best = sorted[0]
      return (
        (prediction.score?.points ?? 0) === (best.score?.points ?? 0) &&
        prediction.outcome === best.outcome
      )
    })
    .slice(0, 3)
}

function buildConsensus(
  game: ResolvedGame,
  home: number,
  draw: number,
  away: number
) {
  const options: Array<{ side: WinnerSide; value: number; label: string }> = [
    { side: "Mandante", value: home, label: game.resolvedHomeTeam },
    { side: "Empate", value: draw, label: "Empate" },
    { side: "Visitante", value: away, label: game.resolvedAwayTeam },
  ]

  const best = options.sort((left, right) => right.value - left.value)[0]

  return {
    label: best?.value ? best.label : "Sem consenso ainda",
    side: best?.value ? best.side : null,
    confidence: best?.value ?? 0,
    home,
    draw,
    away,
  }
}

function average(values: number[]) {
  if (values.length === 0) return 0
  return values.reduce((sum, value) => sum + value, 0) / values.length
}
