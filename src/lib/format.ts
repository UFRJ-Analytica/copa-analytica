import type { GameStatus, PredictionOutcome } from "@/types/domain"

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
})

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
})

const timeFormatter = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
})

const numberFormatter = new Intl.NumberFormat("pt-BR")
const percentFormatter = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 0,
})

export function formatDate(value: string) {
  const dateOnlyMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch
    return dateFormatter.format(
      new Date(Number(year), Number(month) - 1, Number(day))
    )
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date)
}

export function formatDateTime(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? "—" : dateTimeFormatter.format(date)
}

export function formatTime(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : timeFormatter.format(date)
}

export function formatNumber(value: number) {
  return numberFormatter.format(value)
}

export function formatPercent(value: number) {
  return `${percentFormatter.format(value)}%`
}

export function formatStatusLabel(status: GameStatus) {
  if (status === "aberto") return "Aberto"
  if (status === "fechado") return "Fechado"
  if (status === "ao_vivo") return "Ao vivo"
  return "Encerrado"
}

export function formatOutcomeLabel(outcome: PredictionOutcome) {
  if (outcome === "exact") return "Placar exato"
  if (outcome === "winner") return "Vencedor correto"
  if (outcome === "late") return "Fora do prazo"
  if (outcome === "miss") return "Nao pontuou"
  return "Pendente"
}

export function formatRelativeCountdown(targetIso: string) {
  const target = new Date(targetIso).getTime()
  if (Number.isNaN(target)) {
    return "Sem prazo"
  }

  const diff = target - Date.now()
  if (diff <= 0) {
    return "Prazo encerrado"
  }

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days}d ${hours % 24}h`
  }

  return `${hours}h ${minutes}min`
}
