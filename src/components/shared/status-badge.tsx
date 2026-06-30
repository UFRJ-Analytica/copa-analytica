import { Badge } from "@/components/ui/badge"
import { formatOutcomeLabel, formatStatusLabel } from "@/lib/format"
import type { GameStatus, PredictionOutcome } from "@/types/domain"

export function StatusBadge({ status }: { status: GameStatus }) {
  const className =
    status === "aberto"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
      : status === "ao_vivo"
        ? "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300"
        : status === "fechado"
          ? "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300"
          : "border-border/70 bg-secondary text-secondary-foreground"

  return <Badge className={className}>{formatStatusLabel(status)}</Badge>
}

export function OutcomeBadge({ outcome }: { outcome: PredictionOutcome }) {
  const className =
    outcome === "exact"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
      : outcome === "winner"
        ? "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300"
        : outcome === "late"
          ? "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300"
          : outcome === "miss"
            ? "border-border/70 bg-muted text-muted-foreground"
            : "border-border/70 bg-secondary text-secondary-foreground"

  return <Badge className={className}>{formatOutcomeLabel(outcome)}</Badge>
}
