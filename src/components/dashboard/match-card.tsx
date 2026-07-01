import { CalendarBlank, MapPin, Trophy } from "@phosphor-icons/react"

import { AppLink } from "@/components/layout/app-link"
import { OutcomeBadge, StatusBadge } from "@/components/shared/status-badge"
import { Badge } from "@/components/ui/badge"
import { getGamePredictionSummary } from "@/data/game-insights"
import { formatDate, formatPercent } from "@/lib/format"
import { toAppHref } from "@/lib/routing"
import type { PredictionWithContext, ResolvedGame } from "@/types/domain"

export function MatchCard({
  game,
  predictions,
}: {
  game: ResolvedGame
  predictions: PredictionWithContext[]
}) {
  const summary = getGamePredictionSummary(game, predictions)
  const bestPrediction = summary.bestPredictions[0]

  return (
    <article className="group overflow-hidden rounded-3xl border border-white/10 bg-[#071a2d]/90 shadow-2xl shadow-black/20 transition hover:-translate-y-0.5 hover:border-amber-300/45 hover:shadow-amber-950/30">
      <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.22),transparent_34%),linear-gradient(135deg,rgba(20,83,130,0.82),rgba(2,12,27,0.96))] p-5">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border-amber-300/35 bg-amber-300/10 text-amber-100">
              {game.id}
            </Badge>
            <Badge className="border-sky-300/30 bg-sky-300/10 text-sky-100">
              {game.round}
            </Badge>
          </div>
          <StatusBadge status={game.status} />
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-white">
          <TeamScore
            align="left"
            name={game.resolvedHomeTeam}
            score={game.result?.actualHomeGoals}
          />
          <div className="rounded-full border border-white/15 bg-black/35 px-3 py-2 text-center font-heading text-xs font-black tracking-[0.25em] text-amber-100 uppercase">
            vs
          </div>
          <TeamScore
            align="right"
            name={game.resolvedAwayTeam}
            score={game.result?.actualAwayGoals}
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-sky-100/80">
          <span className="inline-flex items-center gap-1.5">
            <CalendarBlank className="size-4" /> {formatDate(game.date)}
          </span>
          {game.venue ? (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4" /> {game.venue}
            </span>
          ) : null}
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <Metric label="previsões" value={summary.totalPredictions} />
          <Metric
            label="vencedor"
            value={summary.correctWinners + summary.exactScores}
          />
          <Metric label="cravadas" value={summary.exactScores} accent />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          {game.result ? (
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-amber-300 text-lg text-slate-950">
                <Trophy weight="fill" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold tracking-[0.18em] text-amber-100 uppercase">
                  Melhor previsão
                </p>
                {bestPrediction ? (
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-sky-50">
                    <strong>{bestPrediction.modelName}</strong>
                    <span className="text-sky-100/65">
                      previu {bestPrediction.predictedScore}
                    </span>
                    <OutcomeBadge outcome={bestPrediction.outcome} />
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-sky-100/70">
                    Ainda sem previsões para comparar.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-amber-100 uppercase">
                Consenso dos modelos
              </p>
              <p className="mt-1 text-sm text-sky-50">
                {summary.consensus.label} favorito ·{" "}
                {formatPercent(summary.consensus.confidence)}
              </p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-300 to-emerald-300"
                  style={{
                    width: `${Math.min(summary.consensus.confidence, 100)}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <AppLink
          href={toAppHref(`/jogos/${game.id}`)}
          className="inline-flex w-full items-center justify-center rounded-2xl border border-amber-300/35 bg-amber-300/10 px-4 py-3 text-sm font-bold text-amber-100 transition hover:bg-amber-300 hover:text-slate-950"
        >
          Ver resultado dos modelos
        </AppLink>
      </div>
    </article>
  )
}

function TeamScore({
  name,
  score,
  align,
}: {
  name: string
  score: number | undefined
  align: "left" | "right"
}) {
  return (
    <div className={align === "right" ? "text-right" : undefined}>
      <p className="line-clamp-2 text-lg leading-tight font-black tracking-tight md:text-xl">
        {name}
      </p>
      <p className="mt-1 font-heading text-5xl font-black text-amber-200 drop-shadow">
        {score ?? "—"}
      </p>
    </div>
  )
}

function Metric({
  label,
  value,
  accent = false,
}: {
  label: string
  value: number
  accent?: boolean
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
      <p
        className={
          accent
            ? "font-heading text-2xl font-black text-amber-200"
            : "font-heading text-2xl font-black text-white"
        }
      >
        {value}
      </p>
      <p className="text-[10px] font-semibold tracking-[0.16em] text-sky-100/65 uppercase">
        {label}
      </p>
    </div>
  )
}
