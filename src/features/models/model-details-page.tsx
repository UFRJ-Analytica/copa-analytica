import { ArrowSquareOut, Database, Stack } from "@phosphor-icons/react"

import { EmptyState } from "@/components/shared/empty-state"
import { PageIntro } from "@/components/shared/page-intro"
import { ShareActions } from "@/components/shared/share-actions"
import { OutcomeBadge } from "@/components/shared/status-badge"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getModelPerformance } from "@/data/derive"
import { formatDate, formatNumber, formatPercent } from "@/lib/format"
import type { AppData } from "@/types/domain"

export function ModelDetailsPage({
  data,
  modelId,
}: {
  data: AppData
  modelId: string
}) {
  const model = data.models.find((item) => item.id === modelId)

  if (!model) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <EmptyState
          title="Modelo nao encontrado"
          description="Esse id nao existe nos dados atuais de `Modelos`."
        />
      </div>
    )
  }

  const participant =
    data.participants.find((item) => item.id === model.participantId) ?? null
  const stats = getModelPerformance(model.id, data.ranking)
  const modelPredictions = data.predictions.filter((item) => item.modelId === model.id)

  return (
    <>
      <PageIntro
        eyebrow={model.type}
        title={model.name}
        description={model.description}
        actions={
          <ShareActions
            title={model.name}
            text="Conheca a metodologia e o historico deste modelo."
            path={`/modelos/${model.id}`}
            siteUrl={data.config.siteUrl}
          />
        }
      />
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Ficha tecnica</CardTitle>
              <CardDescription>
                Informacoes puxadas diretamente da aba `Modelos`.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <Badge>{model.type}</Badge>
                <Badge>{model.active ? "Ativo no ranking" : "Inativo no ranking"}</Badge>
              </div>
              <InfoRow label="Participante" value={participant?.name ?? model.participantName} />
              <InfoRow label="Cadastro" value={formatDate(model.registeredAt)} />
              <InfoRow label="Bibliotecas" value={model.libs} />
              <div className="rounded-lg border border-border/60 bg-background/70 p-4">
                <p className="font-medium">Datasets</p>
                <p className="mt-2 text-muted-foreground">{model.datasets}</p>
              </div>
              {model.colabUrl ? (
                <a
                  href={model.colabUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:underline"
                >
                  Abrir codigo <ArrowSquareOut />
                </a>
              ) : null}
            </CardContent>
          </Card>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
                <CardDescription>Resumo calculado a partir do ranking consolidado.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-4">
                <StatBox label="Pontos" value={formatNumber(stats.totalPoints)} />
                <StatBox label="Placar exato" value={formatNumber(stats.exactScores)} />
                <StatBox label="Acerto" value={formatPercent(stats.accuracyRate)} />
                <StatBox
                  label="Confianca media"
                  value={formatPercent(stats.averageConfidence)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stack de construcao</CardTitle>
                <CardDescription>
                  O que a pagina considera para comunicar a metodologia do modelo.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-border/60 bg-background/70 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Stack className="size-4 text-primary" />
                    <p className="font-medium">Bibliotecas</p>
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">{model.libs}</p>
                </div>
                <div className="rounded-lg border border-border/60 bg-background/70 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Database className="size-4 text-primary" />
                    <p className="font-medium">Fontes</p>
                  </div>
                  <div className="space-y-2 text-sm leading-6 text-muted-foreground">
                    <p>{model.datasets}</p>
                    {model.datasetUrls.map((url) => (
                      <a
                        key={url}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="block text-primary hover:underline"
                      >
                        {url}
                      </a>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-heading text-2xl font-semibold">Historico de previsoes</h2>
            <p className="text-sm text-muted-foreground">{modelPredictions.length} registros</p>
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            {modelPredictions.map((prediction) => (
              <Card key={prediction.id}>
                <CardHeader className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <CardTitle className="text-base">
                        {prediction.game?.resolvedHomeTeam ?? prediction.homeTeam} x{" "}
                        {prediction.game?.resolvedAwayTeam ?? prediction.awayTeam}
                      </CardTitle>
                      <CardDescription>{prediction.game?.round ?? "Rodada nao encontrada"}</CardDescription>
                    </div>
                    <OutcomeBadge outcome={prediction.outcome} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    Placar previsto <span className="font-medium text-foreground">{prediction.predictedScore}</span>
                  </p>
                  <p>Confianca declarada {prediction.confidence}%</p>
                  {prediction.notes ? <p>{prediction.notes}</p> : null}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-background/70 p-4">
      <p className="text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium text-foreground">{value}</p>
    </div>
  )
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-background/70 p-4">
      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-2 font-heading text-2xl font-semibold">{value}</p>
    </div>
  )
}
