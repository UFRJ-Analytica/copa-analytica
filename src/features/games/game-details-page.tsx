import { Clock, Target } from "@phosphor-icons/react"

import { ProbabilityBar } from "@/components/dashboard/probability-bar"
import { TeamPill } from "@/components/dashboard/team-pill"
import { EmptyState } from "@/components/shared/empty-state"
import { PageIntro } from "@/components/shared/page-intro"
import { ShareActions } from "@/components/shared/share-actions"
import { OutcomeBadge, StatusBadge } from "@/components/shared/status-badge"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getPredictionsForGame } from "@/data/selectors"
import { formatDateTime } from "@/lib/format"
import type { AppData } from "@/types/domain"

export function GameDetailsPage({
  data,
  gameId,
}: {
  data: AppData
  gameId: string
}) {
  const game = data.games.find((item) => item.id === gameId)

  if (!game) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <EmptyState
          title="Jogo nao encontrado"
          description="Confere o id do confronto na planilha ou volte para a lista de jogos."
        />
      </div>
    )
  }

  const predictions = getPredictionsForGame(data.predictions, game.id)

  return (
    <>
      <PageIntro
        eyebrow={game.round}
        title={`${game.resolvedHomeTeam} x ${game.resolvedAwayTeam}`}
        description="Painel detalhado com prazo, resultado oficial, leitura de confianca e historico completo de previsoes do confronto."
        actions={
          <ShareActions
            title={`${game.resolvedHomeTeam} x ${game.resolvedAwayTeam}`}
            text="Painel do confronto na Analytica + Copa."
            path={`/jogos/${game.id}`}
            siteUrl={data.config.siteUrl}
          />
        }
      />

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <Card>
            <CardHeader className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={game.status} />
                <Badge>{game.id}</Badge>
              </div>
              <div className="space-y-3">
                <TeamPill name={game.resolvedHomeTeam} />
                <TeamPill name={game.resolvedAwayTeam} />
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm text-muted-foreground">
              <div className="rounded-lg border border-border/60 bg-background/70 p-4">
                <p className="font-medium text-foreground">Horario</p>
                <p>{formatDateTime(`${game.date}T${game.kickoffBrt}:00-03:00`)}</p>
              </div>
              <div className="rounded-lg border border-border/60 bg-background/70 p-4">
                <p className="font-medium text-foreground">Prazo de envio</p>
                <p>{formatDateTime(game.predictionDeadline)}</p>
              </div>
              <div className="rounded-lg border border-border/60 bg-background/70 p-4">
                <p className="font-medium text-foreground">Local</p>
                <p>{game.venue}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resultado e leitura agregada</CardTitle>
              <CardDescription>
                A barra abaixo usa a confianca declarada de cada modelo como sinal comparativo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-border/60 bg-background/70 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Target className="size-4 text-primary" />
                    <p className="font-medium">Ensemble de confianca</p>
                  </div>
                  <ProbabilityBar
                    home={average(predictions.map((item) => item.confidenceProfile.mandante))}
                    draw={average(predictions.map((item) => item.confidenceProfile.empate))}
                    away={average(predictions.map((item) => item.confidenceProfile.visitante))}
                  />
                </div>
                <div className="rounded-lg border border-border/60 bg-background/70 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Clock className="size-4 text-primary" />
                    <p className="font-medium">Resultado oficial</p>
                  </div>
                  {game.result ? (
                    <>
                      <p className="font-heading text-3xl font-semibold">
                        {game.result.actualHomeGoals} x {game.result.actualAwayGoals}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {game.result.notes || "Sem observacoes adicionais."}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      O resultado oficial ainda nao foi publicado na aba `Resultados`.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-heading text-2xl font-semibold">Previsoes por modelo</h2>
            <p className="text-sm text-muted-foreground">{predictions.length} registros</p>
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            {predictions.map((prediction) => (
              <Card key={prediction.id}>
                <CardHeader className="space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-base">{prediction.modelName}</CardTitle>
                      <CardDescription>{prediction.participantName}</CardDescription>
                    </div>
                    <OutcomeBadge outcome={prediction.outcome} />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge>{prediction.predictedScore}</Badge>
                    <span>Confianca {prediction.confidence}%</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ProbabilityBar
                    home={prediction.confidenceProfile.mandante}
                    draw={prediction.confidenceProfile.empate}
                    away={prediction.confidenceProfile.visitante}
                  />
                  {prediction.notes ? (
                    <p className="text-sm leading-6 text-muted-foreground">
                      {prediction.notes}
                    </p>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}

function average(values: number[]) {
  if (values.length === 0) {
    return 0
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length
}
