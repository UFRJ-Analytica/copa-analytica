import { GithubLogo, LinkedinLogo } from "@phosphor-icons/react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { resolveGithub, resolveLinkedin, resolveSocialHandle } from "@/lib/socials"
import type { ParticipantProfile } from "@/types/domain"

function avatarColor(seed: string) {
  const palette = [
    "bg-foreground/6 text-foreground",
    "bg-primary/10 text-foreground",
    "bg-muted text-foreground",
    "bg-accent text-foreground",
  ]
  const index = seed.split("").reduce((sum, item) => sum + item.charCodeAt(0), 0)
  return palette[index % palette.length]
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

export function ParticipantsList({
  participants,
  title = "Participantes",
  description = "Quem esta construindo os modelos.",
  compact = false,
}: {
  participants: ParticipantProfile[]
  title?: string
  description?: string
  compact?: boolean
}) {
  return (
    <Card>
      <CardHeader className={compact ? "pb-2" : undefined}>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-0">
        {participants.map((participant) => (
          <article
            key={participant.id}
            className="flex gap-4 border-t border-border/60 py-5 first:border-t-0"
          >
            {participant.photoUrl ? (
              <img
                src={participant.photoUrl}
                alt={participant.name}
                className="size-12 rounded-sm object-cover"
              />
            ) : (
              <div
                className={`flex size-12 shrink-0 items-center justify-center rounded-sm text-sm font-semibold ${avatarColor(participant.id)}`}
              >
                {initials(participant.name)}
              </div>
            )}
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-medium">{participant.name}</h3>
                <Badge className="border-transparent bg-transparent px-0 text-muted-foreground">
                  {participant.affiliation}
                </Badge>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">{participant.bio}</p>
              <div className="flex flex-wrap items-center gap-4 text-xs tracking-[0.04em] text-muted-foreground">
                <span>{participant.activeModels} modelos ativos</span>
                <span>{participant.totalPoints} pontos acumulados</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                {participant.linkedin ? (
                  <a href={resolveLinkedin(participant.linkedin)} target="_blank" rel="noreferrer">
                    <LinkedinLogo className="size-5" />
                  </a>
                ) : null}
                {participant.github ? (
                  <a href={resolveGithub(participant.github)} target="_blank" rel="noreferrer">
                    <GithubLogo className="size-5" />
                  </a>
                ) : null}
                {participant.socialHandle ? (
                  <a href={resolveSocialHandle(participant.socialHandle)} target="_blank" rel="noreferrer">
                    @{participant.socialHandle}
                  </a>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </CardContent>
    </Card>
  )
}
