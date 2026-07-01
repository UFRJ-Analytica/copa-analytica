import type {
  Model,
  ModelPerformance,
  RankingEntry,
  ScoreRecord,
} from "@/types/domain"

export function buildRanking(models: Model[], scores: ScoreRecord[]) {
  const scoresByModel = new Map<string, ScoreRecord[]>()

  scores.forEach((score) => {
    const list = scoresByModel.get(score.modelId) ?? []
    list.push(score)
    scoresByModel.set(score.modelId, list)
  })

  return models
    .filter((model) => model.active)
    .map((model) => {
      const modelScores = scoresByModel.get(model.id) ?? []
      const totalPoints = modelScores.reduce(
        (sum, item) => sum + item.points,
        0
      )
      const weightedPoints = modelScores.reduce(
        (sum, item) => sum + item.weightedPoints,
        0
      )
      const exactScores = modelScores.filter((item) => item.exactScore).length
      const correctWinners = modelScores.filter(
        (item) => item.correctWinner
      ).length
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
