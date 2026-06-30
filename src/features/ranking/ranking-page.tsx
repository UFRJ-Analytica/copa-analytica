import { useMemo, useState } from "react"

import { RankingTable } from "@/components/dashboard/ranking-table"
import { PageIntro } from "@/components/shared/page-intro"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { AppData } from "@/types/domain"

export function RankingPage({ data }: { data: AppData }) {
  const [query, setQuery] = useState("")

  const entries = useMemo(() => {
    return data.ranking.filter((entry) =>
      [entry.modelName, entry.participantName]
        .join(" ")
        .toLowerCase()
        .includes(query.trim().toLowerCase())
    )
  }, [data.ranking, query])

  return (
    <>
      <PageIntro
        eyebrow="Leaderboard"
        title="Ranking consolidado"
        description="A competicao acontece aqui: uma tabela direta, facil de comparar e sem ruido desnecessario."
      />

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar modelo ou participante"
        />

        <RankingTable
          entries={entries}
          models={data.models}
          title="Tabela de rankeamento dos modelos"
          description="Comparacao direta entre modelos e participantes."
        />

        <Card>
          <CardHeader>
            <CardTitle>Como a pontuacao funciona</CardTitle>
            <CardDescription>
              Regra simples para manter a leitura do ranking transparente.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <ExplainMetric
              title="5 pontos"
              description="Placar exato: acertou gols do mandante e do visitante."
            />
            <ExplainMetric
              title="3 pontos"
              description="Empate correto: previu empate, mas errou o placar exato."
            />
            <ExplainMetric
              title="2 pontos"
              description="Vencedor correto: acertou o lado do vencedor sem cravar o placar."
            />
          </CardContent>
        </Card>
      </div>
    </>
  )
}

function ExplainMetric({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-background/70 p-4">
      <p className="font-medium">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  )
}
