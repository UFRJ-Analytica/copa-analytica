import { ArrowRight, SoccerBall, Trophy } from "@phosphor-icons/react"

import { AppLink } from "@/components/layout/app-link"
import { ShareActions } from "@/components/shared/share-actions"
import { formatDate, formatNumber } from "@/lib/format"
import { toAppHref } from "@/lib/routing"
import type { AppData, ResolvedGame } from "@/types/domain"

const LOGO_SRC = "/assets/logos/copa-analytica-logo.png"
const medals = ["🥇", "🥈", "🥉"]

export function HomePage({ data }: { data: AppData }) {
  const leader = data.ranking[0]
  const topThree = data.ranking.slice(0, 3)
  const totalPoints = data.ranking.reduce(
    (sum, entry) => sum + entry.totalPoints,
    0
  )
  const featuredGame = getFeaturedGame(data.games)
  const featuredGamePredictions = featuredGame
    ? data.predictions.filter(
        (prediction) => prediction.gameId === featuredGame.id
      ).length
    : 0

  return (
    <>
      <section className="relative overflow-hidden border-b border-[#f4d36a]/20 bg-[#073d6d] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(63,111,159,0.48),transparent_20%),radial-gradient(circle_at_82%_16%,rgba(244,211,106,0.14),transparent_18%),linear-gradient(145deg,#073d6d_0%,#052a4b_54%,#071018_100%)]" />
        <div className="absolute top-28 -left-24 size-72 rounded-full border-[28px] border-[#3f6f9f]/20" />
        <div className="absolute top-40 right-8 size-28 rounded-full border-[20px] border-[#3f6f9f]/18" />
        <div className="absolute bottom-20 left-1/2 size-44 rounded-full border-[24px] border-[#3f6f9f]/12" />

        <div className="relative mx-auto flex min-h-[calc(100svh-88px)] max-w-5xl flex-col items-center justify-center px-5 py-10 text-center sm:min-h-[720px] sm:px-6 lg:px-8">
          <div className="relative w-full max-w-[255px] sm:max-w-[330px] lg:max-w-[360px]">
            <div className="absolute -inset-8 rounded-full bg-[#f4d36a]/16 blur-3xl" />
            <div className="absolute inset-10 rounded-[3rem] bg-black/50 blur-3xl" />
            <div className="absolute -top-4 -right-5 size-16 rounded-full border-[14px] border-[#3f6f9f]/30 sm:size-24" />
            <div className="absolute -bottom-7 -left-7 size-20 rounded-full border-[16px] border-[#3f6f9f]/22 sm:size-28" />
            <div className="relative rounded-[1.65rem] border border-[#f4d36a]/32 bg-black/24 p-3 shadow-2xl shadow-black/40 backdrop-blur sm:rounded-[2rem] sm:p-4">
              <img
                src={LOGO_SRC}
                alt="Analytica + Copa"
                className="aspect-square w-full rounded-[1.2rem] object-cover shadow-2xl shadow-black/45 sm:rounded-[1.45rem]"
              />
              <div className="pointer-events-none absolute inset-3 rounded-[1.2rem] ring-1 ring-white/10 sm:inset-4 sm:rounded-[1.45rem]" />
            </div>
            <div className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#f4d36a]/45 bg-black px-4 py-2.5 text-[11px] font-black tracking-[0.18em] whitespace-nowrap text-[#f4d36a] uppercase shadow-xl shadow-black/35 sm:-bottom-5 sm:px-5 sm:py-3 sm:text-sm">
              <Trophy weight="fill" className="size-4" />
              Copa dos Modelos
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#f4d36a]/35 bg-[#f4d36a]/10 px-4 py-2 text-[11px] font-bold tracking-[0.24em] text-[#f4d36a] uppercase sm:text-xs">
              <SoccerBall weight="duotone" className="size-4" />
              Arena Analytica
            </div>

            <div className="max-w-3xl space-y-4">
              <h1 className="font-heading text-4xl leading-[0.94] font-black tracking-[-0.06em] sm:text-6xl lg:text-7xl">
                A Copa dos Modelos entrou em campo.
              </h1>
              <p className="mx-auto max-w-2xl text-base leading-7 text-sky-100 sm:text-lg sm:leading-8">
                Um placar simples para acompanhar modelos de IA disputando fase
                a fase quem entende melhor os jogos.
              </p>
            </div>

            <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
              <AppLink
                href={toAppHref("/jogos")}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#f4d36a] px-6 text-sm font-black text-[#061421] shadow-lg shadow-black/25 transition hover:-translate-y-0.5 hover:bg-[#ffe785]"
              >
                Ver partidas <ArrowRight weight="bold" />
              </AppLink>
              <AppLink
                href={toAppHref("/ranking")}
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 bg-white/8 px-6 text-sm font-bold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/14"
              >
                Ver tabela
              </AppLink>
              <ShareActions
                title="Copa dos Modelos"
                text="Acompanhe a competicao de modelos da Analytica + Copa."
                path="/"
                siteUrl={data.config.siteUrl}
              />
            </div>

            <div className="flex w-full max-w-2xl flex-wrap items-center justify-center gap-x-5 gap-y-2 border-y border-white/14 py-4 text-sm text-sky-100">
              <span>
                <strong className="font-heading text-xl text-white">
                  {data.dashboard.activeModels}
                </strong>{" "}
                modelos
              </span>
              <span className="hidden h-1 w-1 rounded-full bg-[#f4d36a] sm:block" />
              <span>
                <strong className="font-heading text-xl text-white">
                  {data.games.length}
                </strong>{" "}
                partidas
              </span>
              <span className="hidden h-1 w-1 rounded-full bg-[#f4d36a] sm:block" />
              <span>
                <strong className="font-heading text-xl text-white">
                  {formatNumber(totalPoints)}
                </strong>{" "}
                pontos
              </span>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-5 py-12 sm:px-6 lg:px-8">
        <section className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="space-y-8">
            <div className="space-y-3">
              <p className="text-xs font-black tracking-[0.26em] text-primary uppercase">
                Lider agora
              </p>
              <div>
                <h2 className="font-heading text-4xl font-black tracking-[-0.05em] sm:text-5xl">
                  {leader?.modelName ?? "Ranking em breve"}
                </h2>
                <p className="mt-2 text-muted-foreground">
                  {leader?.participantName ?? "Aguardando primeiras previsoes"}
                </p>
              </div>
              <p className="font-heading text-6xl font-black tracking-[-0.06em] text-primary">
                {formatNumber(leader?.totalPoints ?? 0)}
                <span className="ml-2 text-base font-bold tracking-normal text-muted-foreground">
                  pts
                </span>
              </p>
            </div>

            <div className="space-y-0 border-y border-border/70">
              {topThree.map((entry, index) => (
                <AppLink
                  key={entry.modelId}
                  href={toAppHref(`/modelos/${entry.modelId}`)}
                  className="group flex items-center justify-between gap-4 border-b border-border/70 py-4 last:border-b-0"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="text-2xl">{medals[index]}</span>
                    <div className="min-w-0">
                      <p className="truncate font-bold group-hover:text-primary">
                        {entry.modelName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {entry.participantName}
                      </p>
                    </div>
                  </div>
                  <p className="font-heading text-xl font-black">
                    {formatNumber(entry.totalPoints)}
                  </p>
                </AppLink>
              ))}
            </div>
          </div>

          <FeaturedMatch
            game={featuredGame}
            predictions={featuredGamePredictions}
          />
        </section>

        <section className="mt-16 border-t border-border/70 pt-10">
          <div className="grid gap-8 md:grid-cols-[0.75fr_1.25fr] md:items-start">
            <div>
              <p className="text-xs font-black tracking-[0.26em] text-muted-foreground uppercase">
                Como usar
              </p>
              <h2 className="mt-3 font-heading text-3xl font-black tracking-[-0.04em]">
                Entra, olha o jogo, entende quem pontuou.
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              <HomeStep
                title="Partidas"
                text="Fases do mata-mata, placar oficial e leitura por jogo."
              />
              <HomeStep
                title="Tabela"
                text="Ranking direto, sem excesso de painel e metricas soltas."
              />
              <HomeStep
                title="Times"
                text="Modelos, tecnicos e estilos de previsao em um so lugar."
              />
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

function getFeaturedGame(games: ResolvedGame[]) {
  return (
    games.find((game) => game.status === "ao_vivo") ??
    games.find((game) => game.status === "aberto") ??
    [...games].reverse().find((game) => game.hasResult) ??
    games[0]
  )
}

function FeaturedMatch({
  game,
  predictions,
}: {
  game: ResolvedGame | undefined
  predictions: number
}) {
  if (!game) {
    return (
      <div className="border-l border-border/70 pl-6 text-muted-foreground">
        Aguardando jogos na planilha.
      </div>
    )
  }

  return (
    <div className="space-y-6 lg:border-l lg:border-border/70 lg:pl-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-black tracking-[0.26em] text-primary uppercase">
            Partida em destaque
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {game.round} · {formatDate(game.date)} · {predictions} previsoes
          </p>
        </div>
        <AppLink
          href={toAppHref(`/jogos/${game.id}`)}
          className="inline-flex h-10 items-center rounded-full border border-border px-4 text-sm font-bold transition hover:border-primary hover:text-primary"
        >
          Ver modelos
        </AppLink>
      </div>

      <AppLink href={toAppHref(`/jogos/${game.id}`)} className="group block">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-y border-border/70 py-8">
          <ScoreSide
            name={game.resolvedHomeTeam}
            score={game.result?.actualHomeGoals}
          />
          <div className="rounded-full border border-border px-3 py-2 text-xs font-black tracking-[0.18em] text-muted-foreground uppercase transition group-hover:border-primary group-hover:text-primary">
            vs
          </div>
          <ScoreSide
            name={game.resolvedAwayTeam}
            score={game.result?.actualAwayGoals}
            align="right"
          />
        </div>
      </AppLink>

      <p className="max-w-xl text-sm leading-7 text-muted-foreground">
        O detalhe da partida mostra cada palpite, a confianca do modelo e quanto
        ele somou no ranking.
      </p>
    </div>
  )
}

function ScoreSide({
  name,
  score,
  align = "left",
}: {
  name: string
  score?: number
  align?: "left" | "right"
}) {
  return (
    <div className={align === "right" ? "text-right" : undefined}>
      <p className="text-lg font-black sm:text-xl">{name}</p>
      <p className="mt-2 font-heading text-5xl font-black text-primary">
        {score ?? "-"}
      </p>
    </div>
  )
}

function HomeStep({ title, text }: { title: string; text: string }) {
  return (
    <div className="border-t border-border/70 pt-4">
      <h3 className="font-heading text-2xl font-black tracking-[-0.04em]">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  )
}
