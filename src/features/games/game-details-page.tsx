import { Clock, MapPin, Medal, Target, Trophy } from "@phosphor-icons/react"

import { ProbabilityBar } from "@/components/dashboard/probability-bar"
import { EmptyState } from "@/components/shared/empty-state"
import { ShareActions } from "@/components/shared/share-actions"
import { OutcomeBadge, StatusBadge } from "@/components/shared/status-badge"
import { Badge } from "@/components/ui/badge"
import {
  getGamePredictionSummary,
  getOutcomeIcon,
  getOutcomeTone,
} from "@/data/game-insights"
import { getPredictionsForGame } from "@/data/selectors"
import { formatDateTime, formatOutcomeLabel, formatPercent } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { AppData, PredictionWithContext } from "@/types/domain"

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
          description="Confere o id do confronto na planilha ou volte para a lista de partidas."
        />
      </div>
    )
  }

  const predictions = getPredictionsForGame(data.predictions, game.id)
  const summary = getGamePredictionSummary(game, predictions)
  const officialScore = game.result
    ? `${game.result.actualHomeGoals} x ${game.result.actualAwayGoals}`
    : "x"

  return (
    <div className="bg-[#063b6a] text-white">
      <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_18%_18%,rgba(96,165,250,0.25),transparent_35%),radial-gradient(circle_at_84%_8%,rgba(250,204,21,0.28),transparent_28%),linear-gradient(135deg,#063b6a,#020817_76%)]">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-8 size-28 rounded-full border-[14px] border-sky-200/30" />
          <div className="absolute right-20 bottom-10 size-24 rounded-full border-[14px] border-sky-200/25" />
          <div className="absolute right-44 bottom-24 h-32 w-3 rotate-[30deg] rounded-full bg-sky-200/20" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border-amber-300/35 bg-amber-300/10 text-amber-100">
                {game.id}
              </Badge>
              <Badge className="border-sky-300/30 bg-sky-300/10 text-sky-100">
                {game.round}
              </Badge>
              <StatusBadge status={game.status} />
            </div>
            <ShareActions
              title={`${game.resolvedHomeTeam} x ${game.resolvedAwayTeam}`}
              text="Resultado dos modelos na Copa dos Modelos."
              path={`/jogos/${game.id}`}
              siteUrl={data.config.siteUrl}
            />
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-end">
            <div>
              <p className="mb-3 text-xs font-bold tracking-[0.22em] text-amber-100 uppercase">
                Placar da partida
              </p>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                <HeroTeam
                  name={game.resolvedHomeTeam}
                  score={game.result?.actualHomeGoals}
                />
                <div className="rounded-[2rem] border border-white/15 bg-black/35 px-5 py-4 text-center font-heading text-2xl font-black text-amber-100 shadow-xl shadow-black/30">
                  {officialScore === "x" ? "x" : ""}
                </div>
                <HeroTeam
                  align="right"
                  name={game.resolvedAwayTeam}
                  score={game.result?.actualAwayGoals}
                />
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-sky-100/75">
                <span className="inline-flex items-center gap-2">
                  <Clock className="size-4" />{" "}
                  {formatDateTime(`${game.date}T${game.kickoffBrt}:00-03:00`)}
                </span>
                {game.venue ? (
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="size-4" /> {game.venue}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="rounded-[2rem] border border-amber-200/20 bg-black/30 p-5 shadow-2xl shadow-black/30 backdrop-blur">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-amber-200 text-slate-950">
                  <Trophy weight="fill" />
                </div>
                <div>
                  <p className="text-xs font-bold tracking-[0.18em] text-amber-100 uppercase">
                    resumo dos modelos
                  </p>
                  <p className="font-heading text-xl font-black">
                    {summary.totalPredictions} previsões
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <HeroMini
                  label="vencedor"
                  value={summary.correctWinners + summary.exactScores}
                />
                <HeroMini label="cravadas" value={summary.exactScores} accent />
                <HeroMini label="pontos" value={summary.pointsDistributed} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/10 backdrop-blur">
            <div className="mb-5 flex items-center gap-3">
              <Target className="size-6 text-amber-200" weight="fill" />
              <div>
                <h2 className="font-heading text-2xl font-black">
                  Consenso da partida
                </h2>
                <p className="text-sm text-sky-100/65">
                  Média das confianças declaradas pelos modelos.
                </p>
              </div>
            </div>
            <ProbabilityBar
              home={summary.consensus.home}
              draw={summary.consensus.draw}
              away={summary.consensus.away}
            />
            <div className="mt-5 rounded-2xl border border-amber-200/20 bg-amber-200/10 p-4">
              <p className="text-xs font-bold tracking-[0.18em] text-amber-100 uppercase">
                favorito dos modelos
              </p>
              <p className="mt-1 font-heading text-3xl font-black text-white">
                {summary.consensus.label}
              </p>
              <p className="text-sm text-sky-100/70">
                {formatPercent(summary.consensus.confidence)} de confiança média
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/10 backdrop-blur">
            <div className="mb-5 flex items-center gap-3">
              <Medal className="size-6 text-amber-200" weight="fill" />
              <div>
                <h2 className="font-heading text-2xl font-black">
                  Melhores neste jogo
                </h2>
                <p className="text-sm text-sky-100/65">
                  Quem mais pontuou ou chegou perto do placar.
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {summary.bestPredictions.length > 0 ? (
                summary.bestPredictions.map((prediction, index) => (
                  <div
                    key={prediction.id}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-2xl bg-amber-200 font-heading font-black text-slate-950">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-bold">{prediction.modelName}</p>
                        <p className="text-sm text-sky-100/60">
                          {prediction.predictedScore} ·{" "}
                          {prediction.participantName}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-heading text-2xl font-black text-amber-200">
                        +{prediction.score?.points ?? 0}
                      </p>
                      <OutcomeBadge outcome={prediction.outcome} />
                    </div>
                  </div>
                ))
              ) : (
                <p className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-sky-100/70">
                  Ainda não há previsões para destacar nesta partida.
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold tracking-[0.22em] text-amber-100 uppercase">
                resultado dos modelos
              </p>
              <h2 className="font-heading text-3xl font-black">
                Previsões por modelo
              </h2>
            </div>
            <p className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm text-sky-100/75">
              {predictions.length} registros
            </p>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            {predictions.map((prediction) => (
              <PredictionResultCard
                key={prediction.id}
                prediction={prediction}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

function HeroTeam({
  name,
  score,
  align = "left",
}: {
  name: string
  score: number | undefined
  align?: "left" | "right"
}) {
  return (
    <div className={align === "right" ? "text-right" : undefined}>
      <p className="font-heading text-3xl leading-tight font-black tracking-tight sm:text-5xl">
        {name}
      </p>
      <p className="mt-2 font-heading text-7xl font-black text-amber-200 drop-shadow-lg">
        {score ?? "—"}
      </p>
    </div>
  )
}

function HeroMini({
  label,
  value,
  accent = false,
}: {
  label: string
  value: number
  accent?: boolean
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3">
      <p
        className={
          accent
            ? "font-heading text-3xl font-black text-amber-200"
            : "font-heading text-3xl font-black text-white"
        }
      >
        {value}
      </p>
      <p className="text-[10px] font-bold tracking-[0.16em] text-sky-100/60 uppercase">
        {label}
      </p>
    </div>
  )
}

function PredictionResultCard({
  prediction,
}: {
  prediction: PredictionWithContext
}) {
  return (
    <article
      className={cn(
        "rounded-[2rem] border p-5 shadow-xl shadow-black/10",
        getOutcomeTone(prediction.outcome)
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-black/30 text-2xl">
            {getOutcomeIcon(prediction.outcome)}
          </div>
          <div className="min-w-0">
            <h3 className="font-heading text-xl font-black">
              {prediction.modelName}
            </h3>
            <p className="text-sm text-sky-100/65">
              {prediction.participantName}
            </p>
          </div>
        </div>
        <OutcomeBadge outcome={prediction.outcome} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <PredictionMetric label="previu" value={prediction.predictedScore} />
        <PredictionMetric
          label="pontos"
          value={`+${prediction.score?.points ?? 0}`}
          accent
        />
        <PredictionMetric
          label="confiança"
          value={formatPercent(prediction.confidence)}
        />
      </div>

      <div className="mt-5">
        <ProbabilityBar
          home={prediction.confidenceProfile.mandante}
          draw={prediction.confidenceProfile.empate}
          away={prediction.confidenceProfile.visitante}
        />
      </div>

      {prediction.notes ? (
        <p className="mt-4 rounded-2xl border border-white/10 bg-black/15 p-4 text-sm leading-6 text-sky-50/75">
          {prediction.notes}
        </p>
      ) : null}

      <p className="mt-4 text-xs font-bold tracking-[0.16em] text-sky-100/55 uppercase">
        {formatOutcomeLabel(prediction.outcome)}
      </p>
    </article>
  )
}

function PredictionMetric({
  label,
  value,
  accent = false,
}: {
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
      <p
        className={
          accent
            ? "font-heading text-2xl font-black text-amber-200"
            : "font-heading text-2xl font-black text-white"
        }
      >
        {value}
      </p>
      <p className="text-[10px] font-bold tracking-[0.16em] text-sky-100/60 uppercase">
        {label}
      </p>
    </div>
  )
}
