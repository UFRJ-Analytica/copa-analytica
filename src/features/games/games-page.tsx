import { useMemo, useState } from "react"

import { GameCard } from "@/components/dashboard/game-card"
import { PageIntro } from "@/components/shared/page-intro"
import { Input } from "@/components/ui/input"
import { SelectChip } from "@/components/ui/select-chip"
import { getPredictionsForGame, groupGamesByRound } from "@/data/selectors"
import type { AppData } from "@/types/domain"

export function GamesPage({ data }: { data: AppData }) {
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")

  const filteredGames = useMemo(() => {
    return data.games.filter((game) => {
      const matchesQuery =
        [game.resolvedHomeTeam, game.resolvedAwayTeam, game.venue, game.round]
          .join(" ")
          .toLowerCase()
          .includes(query.trim().toLowerCase())

      const matchesStatus =
        statusFilter === "todos" ? true : game.status === statusFilter

      return matchesQuery && matchesStatus
    })
  }, [data.games, query, statusFilter])

  const grouped = groupGamesByRound(filteredGames)

  return (
    <>
      <PageIntro
        eyebrow="Calendario"
        title="Todos os jogos"
        description="Uma visao por rodada com status dinamico, prazo de envio e previsoes agrupadas por confronto."
      />

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        <section className="grid gap-4 rounded-lg border border-border/70 bg-card/70 p-4 lg:grid-cols-[1fr_auto]">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por selecao, estadio ou rodada"
          />
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
                onClick={() => setStatusFilter(value)}
              />
            ))}
          </div>
        </section>

        <section className="space-y-8">
          {Object.entries(grouped).map(([round, games]) => (
            <div key={round} className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-heading text-2xl font-semibold">{round}</h2>
                <p className="text-sm text-muted-foreground">{games.length} jogos</p>
              </div>
              <div className="grid gap-4 xl:grid-cols-2">
                {games.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    predictions={getPredictionsForGame(data.predictions, game.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </>
  )
}
