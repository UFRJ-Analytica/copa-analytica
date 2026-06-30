import { useMemo, useState } from "react"

import { ParticipantsList } from "@/components/dashboard/participants-list"
import { PageIntro } from "@/components/shared/page-intro"
import { Input } from "@/components/ui/input"
import { SelectChip } from "@/components/ui/select-chip"
import { Card, CardContent } from "@/components/ui/card"
import type { AppData } from "@/types/domain"

export function ParticipantsPage({ data }: { data: AppData }) {
  const [query, setQuery] = useState("")
  const [affiliation, setAffiliation] = useState("Todos")

  const affiliations = useMemo(
    () => ["Todos", ...new Set(data.participantProfiles.map((item) => item.affiliation))],
    [data.participantProfiles]
  )

  const participants = useMemo(() => {
    return data.participantProfiles.filter((participant) => {
      const matchesQuery =
        [participant.name, participant.bio, participant.affiliation]
          .join(" ")
          .toLowerCase()
          .includes(query.trim().toLowerCase())

      const matchesAffiliation =
        affiliation === "Todos" ? true : participant.affiliation === affiliation

      return matchesQuery && matchesAffiliation
    })
  }, [data.participantProfiles, query, affiliation])

  return (
    <>
      <PageIntro
        eyebrow="Comunidade"
        title="Participantes"
        description="Aqui fica quem esta construindo os modelos da competicao, com uma leitura simples de perfil, vinculo e presenca no ranking."
      />
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        <Card className="bg-card/70">
          <CardContent className="grid gap-4 p-4 lg:grid-cols-[1fr_auto]">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nome, bio ou vinculo"
          />
          <div className="flex flex-wrap gap-2">
            {affiliations.map((item) => (
              <SelectChip
                key={item}
                active={affiliation === item}
                label={item}
                onClick={() => setAffiliation(item)}
              />
            ))}
          </div>
          </CardContent>
        </Card>

        <ParticipantsList
          participants={participants}
          title="Quem esta fazendo os modelos"
          description="Uma lista direta dos participantes, sem esconder o que importa."
        />
      </div>
    </>
  )
}
