import { CalendarBlank, ClockCountdown, MapPin } from "@phosphor-icons/react"

import { AppLink } from "@/components/layout/app-link"
import { ProbabilityBar } from "@/components/dashboard/probability-bar"
import { TeamPill } from "@/components/dashboard/team-pill"
import { OutcomeBadge, StatusBadge } from "@/components/shared/status-badge"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate, formatDateTime, formatRelativeCountdown } from "@/lib/format"
import { toAppHref } from "@/lib/routing"
import type { PredictionWithContext, ResolvedGame } from "@/types/domain"

export function GameCard({
  game,
  predictions,
  featured = false,
}: {
  game: ResolvedGame
  predictions: PredictionWithContext[]
  featured?: boolean
}) {
  return (
    <Card className={featured ? "border-primary/40" : undefined}>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{game.round}</Badge>
              <StatusBadge status={game.status} />
            </div>
            <div className="space-y-3">
              <TeamPill name={game.resolvedHomeTeam} />
              <TeamPill name={game.resolvedAwayTeam} />
            </div>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CalendarBlank className="size-4" />
              <span>{formatDate(game.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="size-4" />
              <span>{game.venue}</span>
            </div>
            <div className="flex items-center gap-2">
              <ClockCountdown className="size-4" />
              <span>{formatRelativeCountdown(game.predictionDeadline)}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-border/60 bg-background/70 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">Prazo de envio</CardTitle>
              <CardDescription>{formatDateTime(game.predictionDeadline)}</CardDescription>
            </div>
            {game.result ? (
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Resultado oficial</p>
                <p className="font-heading text-2xl font-semibold">
                  {game.result.actualHomeGoals} x {game.result.actualAwayGoals}
                </p>
              </div>
            ) : null}
          </div>
        </div>

        <div className="space-y-3">
          {predictions.slice(0, featured ? 4 : 3).map((prediction) => (
            <div
              key={prediction.id}
              className="rounded-lg border border-border/60 bg-background/70 p-4"
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium">{prediction.modelName}</p>
                  <p className="text-sm text-muted-foreground">
                    {prediction.predictedScore} · confianca {prediction.confidence}%
                  </p>
                </div>
                <OutcomeBadge outcome={prediction.outcome} />
              </div>
              <ProbabilityBar
                home={prediction.confidenceProfile.mandante}
                draw={prediction.confidenceProfile.empate}
                away={prediction.confidenceProfile.visitante}
              />
            </div>
          ))}
        </div>

        <AppLink
          href={toAppHref(`/jogos/${game.id}`)}
          className="inline-flex items-center text-sm font-medium text-primary hover:underline"
        >
          Ver painel completo do jogo
        </AppLink>
      </CardContent>
    </Card>
  )
}
