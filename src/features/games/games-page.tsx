import { useMemo, useState } from "react"
import { MagnifyingGlass, SoccerBall, Trophy } from "@phosphor-icons/react"

import { MatchCard } from "@/components/dashboard/match-card"
import { Input } from "@/components/ui/input"
import { SelectChip } from "@/components/ui/select-chip"
import { getGamePredictionSummary } from "@/data/game-insights"
import { getPredictionsForGame, groupGamesByRound } from "@/data/selectors"
import type {
  AppData,
  GameStatus,
  PredictionWithContext,
  ResolvedGame,
} from "@/types/domain"

export function GamesPage({ data }: { data: AppData }) {
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<GameStatus | "todos">(
    "todos"
  )

  const groupedAll = useMemo(() => groupGamesByRound(data.games), [data.games])
  const rounds = Object.keys(groupedAll)
  const [selectedRound, setSelectedRound] = useState<string>(rounds[0] ?? "")

  const filteredGames = useMemo(() => {
    return data.games.filter((game) => {
      const matchesQuery = [
        game.resolvedHomeTeam,
        game.resolvedAwayTeam,
        game.venue,
        game.round,
        game.id,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query.trim().toLowerCase())

      const matchesStatus =
        statusFilter === "todos" ? true : game.status === statusFilter
      const matchesRound = selectedRound ? game.round === selectedRound : true

      return matchesQuery && matchesStatus && matchesRound
    })
  }, [data.games, query, selectedRound, statusFilter])

  const grouped = groupGamesByRound(filteredGames)
  const activeRoundGames = selectedRound
    ? (groupedAll[selectedRound] ?? [])
    : data.games
  const phaseSummary = getPhaseSummary(activeRoundGames, data.predictions)

  return (
    <div className="bg-[#063b6a] text-white">
      <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_15%_10%,rgba(96,165,250,0.28),transparent_32%),radial-gradient(circle_at_86%_12%,rgba(250,204,21,0.24),transparent_28%),linear-gradient(135deg,#063b6a,#031526_72%)]">
        <NetworkPattern />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8 lg:py-14">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/25 bg-amber-200/10 px-3 py-1 text-xs font-bold tracking-[0.22em] text-amber-100 uppercase">
              <SoccerBall weight="fill" /> Arena de partidas
            </div>
            <div className="max-w-3xl space-y-4">
              <h1 className="font-heading text-4xl font-black tracking-tight sm:text-6xl">
                Acompanhe jogo por jogo, modelo por modelo.
              </h1>
              <p className="text-lg leading-8 text-sky-100/80">
                Fases do mata-mata, placar oficial e o resultado de cada modelo
                em uma tela feita para parecer campeonato — não planilha.
              </p>
            </div>
            <div className="grid max-w-3xl gap-3 sm:grid-cols-3">
              <HeroMetric label="fase ativa" value={selectedRound || "—"} />
              <HeroMetric label="partidas" value={phaseSummary.games} />
              <HeroMetric label="previsões" value={phaseSummary.predictions} />
            </div>
          </div>

          <div className="rounded-[2rem] border border-amber-200/20 bg-black/30 p-5 shadow-2xl shadow-black/30 backdrop-blur">
            <div className="flex items-center gap-4">
              <img
                src={`${import.meta.env.BASE_URL}assets/logos/copa-analytica-logo.png`}
                alt="Copa dos Modelos"
                className="size-20 rounded-3xl object-cover shadow-xl shadow-black/40"
              />
              <div>
                <p className="text-xs font-bold tracking-[0.22em] text-amber-100 uppercase">
                  resumo da fase
                </p>
                <h2 className="mt-1 font-heading text-2xl font-black">
                  {selectedRound}
                </h2>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <MiniStat label="encerrados" value={phaseSummary.completed} />
              <MiniStat label="ao vivo" value={phaseSummary.live} />
              <MiniStat
                label="vencedor certo"
                value={phaseSummary.correctWinners}
              />
              <MiniStat
                label="placar exato"
                value={phaseSummary.exactScores}
                accent
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-4 shadow-2xl shadow-black/10 backdrop-blur">
          <div className="mb-4 flex items-center gap-2 text-sm font-bold tracking-[0.16em] text-sky-100/70 uppercase">
            <Trophy className="text-amber-200" weight="fill" /> Fases do
            mata-mata
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {rounds.map((round) => {
              const games = groupedAll[round] ?? []
              const active = round === selectedRound
              return (
                <button
                  key={round}
                  type="button"
                  onClick={() => setSelectedRound(round)}
                  className={
                    active
                      ? "shrink-0 rounded-2xl border border-amber-200 bg-amber-200 px-4 py-3 text-left text-slate-950 shadow-lg shadow-amber-950/20"
                      : "shrink-0 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-left text-sky-50 transition hover:border-amber-200/40 hover:bg-white/10"
                  }
                >
                  <span className="block text-sm font-black">{round}</span>
                  <span className="mt-1 block text-xs opacity-75">
                    {games.length} jogos
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        <section className="grid gap-4 rounded-[2rem] border border-white/10 bg-black/20 p-4 backdrop-blur lg:grid-cols-[1fr_auto]">
          <div className="relative">
            <MagnifyingGlass className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-sky-100/50" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por seleção, estádio, fase ou código do jogo"
              className="border-white/10 bg-white/10 pl-10 text-white placeholder:text-sky-100/45"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              ["todos", "Todos"],
              ["aberto", "Abertos"],
              ["fechado", "Fechados"],
              ["ao_vivo", "Ao vivo"],
              ["encerrado", "Encerrados"],
            ].map(([value, label]) => (
              <SelectChip
                key={value}
                active={statusFilter === value}
                label={label}
                onClick={() => setStatusFilter(value as GameStatus | "todos")}
              />
            ))}
          </div>
        </section>

        <section className="space-y-8">
          {Object.entries(grouped).map(([round, games]) => (
            <div key={round} className="space-y-4">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-bold tracking-[0.22em] text-amber-100 uppercase">
                    fase selecionada
                  </p>
                  <h2 className="font-heading text-3xl font-black">{round}</h2>
                </div>
                <p className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm text-sky-100/75">
                  {games.length} partidas encontradas
                </p>
              </div>
              <div className="grid gap-5 xl:grid-cols-2">
                {games.map((game) => (
                  <MatchCard
                    key={game.id}
                    game={game}
                    predictions={getPredictionsForGame(
                      data.predictions,
                      game.id
                    )}
                  />
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}

function getPhaseSummary(
  games: ResolvedGame[],
  predictions: PredictionWithContext[]
) {
  const summaries = games.map((game) =>
    getGamePredictionSummary(game, getPredictionsForGame(predictions, game.id))
  )

  return {
    games: games.length,
    completed: games.filter((game) => game.status === "encerrado").length,
    live: games.filter((game) => game.status === "ao_vivo").length,
    predictions: summaries.reduce(
      (total, summary) => total + summary.totalPredictions,
      0
    ),
    correctWinners: summaries.reduce(
      (total, summary) => total + summary.correctWinners + summary.exactScores,
      0
    ),
    exactScores: summaries.reduce(
      (total, summary) => total + summary.exactScores,
      0
    ),
  }
}

function HeroMetric({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
      <p className="text-xs font-bold tracking-[0.18em] text-sky-100/60 uppercase">
        {label}
      </p>
      <p className="mt-2 line-clamp-1 font-heading text-2xl font-black text-white">
        {value}
      </p>
    </div>
  )
}

function MiniStat({
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

function NetworkPattern() {
  return (
    <div aria-hidden="true" className="absolute inset-0 opacity-25">
      <div className="absolute top-8 left-8 size-28 rounded-full border-[14px] border-sky-200/30" />
      <div className="absolute top-36 left-24 h-28 w-3 rounded-full bg-sky-200/25" />
      <div className="absolute bottom-14 left-24 size-24 rounded-full border-[14px] border-sky-200/30" />
      <div className="absolute top-20 right-20 size-24 rounded-full border-[14px] border-sky-200/25" />
      <div className="absolute right-36 bottom-16 h-36 w-3 rotate-[30deg] rounded-full bg-sky-200/20" />
      <div className="absolute right-52 bottom-20 size-20 rounded-full border-[14px] border-sky-200/25" />
    </div>
  )
}
