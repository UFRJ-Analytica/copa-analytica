import { ArrowRight } from "@phosphor-icons/react"

import { ParticipantsList } from "@/components/dashboard/participants-list"
import { RankingTable } from "@/components/dashboard/ranking-table"
import { AppLink } from "@/components/layout/app-link"
import { PageIntro } from "@/components/shared/page-intro"
import { ShareActions } from "@/components/shared/share-actions"
import { formatNumber } from "@/lib/format"
import { toAppHref } from "@/lib/routing"
import type { AppData } from "@/types/domain"

export function HomePage({ data }: { data: AppData }) {
  return (
    <>
      <PageIntro
        eyebrow="Competicao de modelos"
        title="Uma Copa do Mundo entre modelos preditivos"
        description="Acompanhamos uma competicao de modelos que tentam antecipar os jogos da Copa. O foco aqui e apresentar quem cria esses modelos e como a classificacao evolui ao longo do torneio."
        actions={
          <>
            <AppLink
              href={toAppHref("/ranking")}
              className="inline-flex h-10 items-center gap-2 rounded-sm border border-foreground bg-foreground px-4 text-sm font-medium text-background transition hover:opacity-92"
            >
              Ver ranking <ArrowRight weight="bold" />
            </AppLink>
            <AppLink
              href={toAppHref("/participantes")}
              className="inline-flex h-10 items-center rounded-sm border border-border bg-background px-4 text-sm font-medium text-foreground transition hover:bg-muted"
            >
              Conhecer participantes
            </AppLink>
            <ShareActions
              title="Analytica + Copa"
              text="Acompanhe a competicao de modelos da UFRJ Analytica."
              path="/"
              siteUrl={data.config.siteUrl}
            />
          </>
        }
      />

      <div className="mx-auto max-w-6xl space-y-14 px-4 py-12 sm:px-6 lg:px-8">
        <section className="grid gap-4 border-y border-border/70 py-5 md:grid-cols-3">
          <SmallMetric
            label="Modelos"
            value={String(data.dashboard.activeModels)}
            detail="ativos na disputa"
          />
          <SmallMetric
            label="Participantes"
            value={String(data.dashboard.participants)}
            detail="construindo modelos"
          />
          <SmallMetric
            label="Jogos pontuados"
            value={String(data.dashboard.completedGames)}
            detail="ja consolidados"
          />
        </section>

        <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="max-w-3xl space-y-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Sobre a competicao
            </p>
            <h2 className="font-heading text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              Um experimento publico para comparar modelos, metodos e intuicoes.
            </h2>
            <div className="max-w-2xl space-y-4 text-[15px] leading-8 text-muted-foreground">
              <p>
                Cada participante cadastra um ou mais modelos e envia previsoes para os
                confrontos da Copa. A partir dos resultados oficiais, a pontuacao e atualizada
                e a classificacao vai tomando forma rodada a rodada.
              </p>
              <p>
                Em vez de transformar isso num painel carregado, o site organiza a leitura em
                duas frentes principais: quem esta construindo os modelos e como esses modelos
                estao performando.
              </p>
            </div>
          </div>

          <aside className="border-l border-border/70 pl-0 lg:pl-8">
            <div className="space-y-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Lider atual
                </p>
                <p className="mt-2 text-2xl font-semibold leading-tight">
                  {data.ranking[0]?.modelName ?? "Sem ranking"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {data.ranking[0]?.participantName ?? "Aguardando dados"}
                </p>
              </div>
              <div className="border-t border-border/70 pt-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Pontos distribuidos
                </p>
                <p className="mt-2 text-2xl font-semibold">
                  {formatNumber(
                    data.ranking.reduce((sum, entry) => sum + entry.totalPoints, 0)
                  )}
                </p>
              </div>
              <div className="border-t border-border/70 pt-5 text-sm leading-7 text-muted-foreground">
                {data.config.tournament} · {data.config.currentRound} ·{" "}
                {data.sourceLabel === "demo" ? "dados demonstrativos" : "dados da planilha"}
              </div>
            </div>
          </aside>
        </section>

        <RankingTable
          entries={data.ranking.slice(0, 8)}
          models={data.models}
          compact
          title="Tabela de rankeamento dos modelos"
          description="A classificacao principal da competicao."
        />

        <ParticipantsList
          participants={data.participantProfiles.slice(0, 4)}
          compact
          title="Quem esta fazendo os modelos"
          description="Perfis de quem esta por tras dos projetos em competicao."
        />

        <section className="flex flex-wrap items-center justify-between gap-4 border-t border-border/70 pt-4">
          <div>
            <p className="font-medium">Leitura principal do site</p>
            <p className="text-sm text-muted-foreground">
              Participantes e ranking concentram o nucleo da experiencia.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <AppLink
              href={toAppHref("/participantes")}
              className="inline-flex h-10 items-center rounded-sm border border-border bg-background px-4 text-sm font-medium text-foreground transition hover:bg-muted"
            >
              Participantes
            </AppLink>
            <AppLink
              href={toAppHref("/ranking")}
              className="inline-flex h-10 items-center rounded-sm border border-foreground bg-foreground px-4 text-sm font-medium text-background transition hover:opacity-92"
            >
              Ranking completo
            </AppLink>
          </div>
        </section>
      </div>
    </>
  )
}

function SmallMetric({
  label,
  value,
  detail,
}: {
  label: string
  value: string
  detail: string
}) {
  return (
    <div className="px-1 py-1">
      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="mt-2 font-heading text-3xl font-semibold tracking-tight">{value}</p>
      <p className="text-sm text-muted-foreground">{detail}</p>
    </div>
  )
}
