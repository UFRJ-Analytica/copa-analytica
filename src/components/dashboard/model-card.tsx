import { ArrowSquareOut } from "@phosphor-icons/react"

import { AppLink } from "@/components/layout/app-link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatNumber, formatPercent } from "@/lib/format"
import { toAppHref } from "@/lib/routing"
import type { Model, ModelPerformance, Participant } from "@/types/domain"

export function ModelCard({
  model,
  participant,
  stats,
}: {
  model: Model
  participant: Participant | null
  stats: ModelPerformance
}) {
  return (
    <Card className="h-full">
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>{model.name}</CardTitle>
            <CardDescription>{participant?.name ?? model.participantName}</CardDescription>
          </div>
          <Badge>{model.type}</Badge>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">{model.description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg border border-border/60 bg-background/70 p-3">
            <dt className="text-muted-foreground">Pontos</dt>
            <dd className="mt-1 text-lg font-semibold">{formatNumber(stats.totalPoints)}</dd>
          </div>
          <div className="rounded-lg border border-border/60 bg-background/70 p-3">
            <dt className="text-muted-foreground">Acerto</dt>
            <dd className="mt-1 text-lg font-semibold">
              {formatPercent(stats.accuracyRate)}
            </dd>
          </div>
        </dl>
        <div className="flex flex-wrap items-center gap-3">
          <AppLink
            href={toAppHref(`/modelos/${model.id}`)}
            className="text-sm font-medium text-primary hover:underline"
          >
            Ver pagina do modelo
          </AppLink>
          {model.colabUrl ? (
            <a
              href={model.colabUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              Codigo <ArrowSquareOut />
            </a>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
