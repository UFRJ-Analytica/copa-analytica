import { Badge } from "@/components/ui/badge"

export function SourceBanner({ sourceLabel }: { sourceLabel: "google-sheets" | "demo" }) {
  if (sourceLabel !== "demo") {
    return null
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-950 dark:text-amber-100">
        <div className="flex flex-wrap items-center gap-3">
          <Badge className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-200">
            Demo local
          </Badge>
          <p>
            `sheet_id` ainda nao foi configurado em <code>public/data/config.json</code>.
            A interface esta funcionando com um conjunto de dados de exemplo.
          </p>
        </div>
      </div>
    </div>
  )
}
