import { useMemo, useState } from "react"

import { ModelCard } from "@/components/dashboard/model-card"
import { PageIntro } from "@/components/shared/page-intro"
import { Input } from "@/components/ui/input"
import { SelectChip } from "@/components/ui/select-chip"
import { getModelViewData } from "@/data/selectors"
import type { AppData } from "@/types/domain"

export function ModelsPage({ data }: { data: AppData }) {
  const [query, setQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("Todos")

  const modelEntries = useMemo(() => getModelViewData(data), [data])
  const types = useMemo(
    () => ["Todos", ...new Set(data.models.map((model) => model.type))],
    [data.models]
  )

  const visibleModels = useMemo(() => {
    return modelEntries.filter(({ model, participant }) => {
      const matchesQuery =
        [model.name, model.description, participant?.name ?? "", model.datasets]
          .join(" ")
          .toLowerCase()
          .includes(query.trim().toLowerCase())

      const matchesType = typeFilter === "Todos" ? true : model.type === typeFilter

      return matchesQuery && matchesType
    })
  }, [modelEntries, query, typeFilter])

  return (
    <>
      <PageIntro
        eyebrow="Catalogo"
        title="Modelos cadastrados"
        description="Um mapa tecnico do torneio, com metodologias, links de codigo, datasets e performance acumulada."
      />
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 rounded-lg border border-border/70 bg-card/70 p-4 lg:grid-cols-[1fr_auto]">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por modelo, participante ou dataset"
          />
          <div className="flex flex-wrap gap-2">
            {types.map((type) => (
              <SelectChip
                key={type}
                active={typeFilter === type}
                label={type}
                onClick={() => setTypeFilter(type)}
              />
            ))}
          </div>
        </div>

        <section className="grid gap-4 xl:grid-cols-3">
          {visibleModels.map(({ model, participant, stats }) => (
            <ModelCard
              key={model.id}
              model={model}
              participant={participant}
              stats={stats}
            />
          ))}
        </section>
      </div>
    </>
  )
}
