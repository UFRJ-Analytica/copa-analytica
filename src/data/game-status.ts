import type { Game, MatchResult, WinnerSide } from "@/types/domain"

export function winnerFromScore(
  homeGoals: number,
  awayGoals: number
): WinnerSide {
  if (homeGoals > awayGoals) return "Mandante"
  if (awayGoals > homeGoals) return "Visitante"
  return "Empate"
}

export function getGameStatus(game: Game) {
  const now = Date.now()
  const kickoff = new Date(`${game.date}T${game.kickoffBrt}:00-03:00`).getTime()
  const deadline = new Date(game.predictionDeadline).getTime()
  const estimatedEnd = kickoff + 2 * 60 * 60 * 1000

  if (now < deadline) return "aberto" as const
  if (now < kickoff) return "fechado" as const
  if (now < estimatedEnd) return "ao_vivo" as const
  return "encerrado" as const
}

export function resolvePlaceholderTeam(
  teamName: string,
  resultsByGameId: Map<string, MatchResult>
) {
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
