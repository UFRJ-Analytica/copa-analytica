import { Trophy } from "@phosphor-icons/react"

import { AppLink } from "@/components/layout/app-link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatNumber } from "@/lib/format"
import { toAppHref } from "@/lib/routing"
import type { Model, RankingEntry } from "@/types/domain"

const medalByPosition = ["🥇", "🥈", "🥉"]

export function LeaderboardCard({
  entries,
  models,
  limit = 10,
}: {
  entries: RankingEntry[]
  models: Model[]
  limit?: number
}) {
  const visibleEntries = entries.slice(0, limit)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Leaderboard</CardTitle>
            <CardDescription>
              Ranking consolidado por pontos, calibracao e placares exatos.
            </CardDescription>
          </div>
          <div className="rounded-full bg-primary/10 p-3 text-primary">
            <Trophy weight="duotone" className="size-5" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {visibleEntries.map((entry) => {
          const model = models.find((item) => item.id === entry.modelId)
          return (
            <AppLink
              key={entry.modelId}
              href={toAppHref(`/modelos/${entry.modelId}`)}
              className="flex items-center gap-4 rounded-lg border border-border/60 bg-background/70 p-3 transition hover:border-primary/50 hover:bg-background"
            >
              <div className="w-10 text-center text-lg font-semibold">
                {medalByPosition[entry.position - 1] ?? `#${entry.position}`}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-medium">{entry.modelName}</p>
                  {model ? <Badge>{model.type}</Badge> : null}
                </div>
                <p className="text-sm text-muted-foreground">{entry.participantName}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatNumber(entry.totalPoints)} pts</p>
                <p className="text-xs text-muted-foreground">
                  {formatNumber(entry.weightedPoints)} ponderados
                </p>
              </div>
            </AppLink>
          )
        })}
      </CardContent>
    </Card>
  )
}
