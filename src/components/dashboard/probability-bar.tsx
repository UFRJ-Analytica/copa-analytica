import { formatPercent } from "@/lib/format"

export function ProbabilityBar({
  home,
  draw,
  away,
}: {
  home: number
  draw: number
  away: number
}) {
  return (
    <div className="space-y-2">
      <div className="flex h-2 overflow-hidden rounded-full bg-muted">
        <div className="bg-emerald-500" style={{ width: `${home}%` }} />
        <div className="bg-amber-400" style={{ width: `${draw}%` }} />
        <div className="bg-sky-500" style={{ width: `${away}%` }} />
      </div>
      <div className="flex justify-between text-[11px] text-muted-foreground">
        <span>Mandante {formatPercent(home)}</span>
        <span>Empate {formatPercent(draw)}</span>
        <span>Visitante {formatPercent(away)}</span>
      </div>
    </div>
  )
}
