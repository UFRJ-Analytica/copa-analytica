import { getTeamCode, getTeamInitials } from "@/lib/teams"

export function TeamPill({ name }: { name: string }) {
  const code = getTeamCode(name)

  return (
    <div className="flex items-center gap-3">
      <div className="flex size-10 items-center justify-center rounded-full border border-border/70 bg-background text-sm font-semibold">
        {code ? (
          <span className={`fi fi-${code} rounded-sm text-lg`} aria-hidden="true" />
        ) : (
          <span>{getTeamInitials(name)}</span>
        )}
      </div>
      <span className="font-medium">{name}</span>
    </div>
  )
}
