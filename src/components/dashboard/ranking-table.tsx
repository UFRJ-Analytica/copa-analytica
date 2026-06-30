import { AppLink } from "@/components/layout/app-link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatNumber, formatPercent } from "@/lib/format"
import { toAppHref } from "@/lib/routing"
import type { Model, RankingEntry } from "@/types/domain"

export function RankingTable({
  entries,
  models,
  title = "Ranking",
  description = "Leitura consolidada da competicao.",
  compact = false,
}: {
  entries: RankingEntry[]
  models: Model[]
  title?: string
  description?: string
  compact?: boolean
}) {
  return (
    <Card>
      <CardHeader className={compact ? "pb-2" : undefined}>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="px-0 pt-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-separate border-spacing-0 text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                <th className="border-b border-border/70 px-6 py-3 font-medium">Pos</th>
                <th className="border-b border-border/70 px-6 py-3 font-medium">Modelo</th>
                <th className="border-b border-border/70 px-6 py-3 font-medium">Participante</th>
                <th className="border-b border-border/70 px-6 py-3 font-medium">Pontos</th>
                <th className="border-b border-border/70 px-6 py-3 font-medium">Exatos</th>
                <th className="border-b border-border/70 px-6 py-3 font-medium">Acerto</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => {
                const model = models.find((item) => item.id === entry.modelId)
                const accuracy =
                  entry.predictedGames > 0
                    ? (entry.correctWinners / entry.predictedGames) * 100
                    : 0

                return (
                  <tr
                    key={entry.modelId}
                    className="transition hover:bg-muted/18"
                  >
                    <td className="border-b border-border/60 px-6 py-4 font-semibold text-foreground">
                      #{entry.position}
                    </td>
                    <td className="border-b border-border/60 px-6 py-4">
                      <div className="flex items-center gap-2">
                        <AppLink
                          href={toAppHref(`/modelos/${entry.modelId}`)}
                          className="font-medium hover:text-foreground"
                        >
                          {entry.modelName}
                        </AppLink>
                        {model ? (
                          <Badge className="border-transparent bg-transparent px-0 text-muted-foreground">
                            {model.type}
                          </Badge>
                        ) : null}
                      </div>
                    </td>
                    <td className="border-b border-border/60 px-6 py-4 text-muted-foreground">
                      {entry.participantName}
                    </td>
                    <td className="border-b border-border/60 px-6 py-4 font-medium">
                      {formatNumber(entry.totalPoints)}
                    </td>
                    <td className="border-b border-border/60 px-6 py-4">
                      {formatNumber(entry.exactScores)}
                    </td>
                    <td className="border-b border-border/60 px-6 py-4 text-muted-foreground">
                      {formatPercent(accuracy)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
