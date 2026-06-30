import { AppError } from "@/app/app-error"
import { getPageMeta } from "@/app/get-page-meta"
import { PageShell } from "@/components/layout/page-shell"
import { EmptyState } from "@/components/shared/empty-state"
import { LoadingState } from "@/components/shared/loading-state"
import { SourceBanner } from "@/components/shared/source-banner"
import { AboutPage } from "@/features/about/about-page"
import { GameDetailsPage } from "@/features/games/game-details-page"
import { GamesPage } from "@/features/games/games-page"
import { HomePage } from "@/features/home/home-page"
import { ModelDetailsPage } from "@/features/models/model-details-page"
import { ModelsPage } from "@/features/models/models-page"
import { ParticipantsPage } from "@/features/participants/participants-page"
import { RankingPage } from "@/features/ranking/ranking-page"
import { useAppData } from "@/hooks/use-app-data"
import { usePageMeta } from "@/hooks/use-page-meta"
import { useRoute } from "@/hooks/use-route"

export function App() {
  const route = useRoute()
  const { data, loading, error, reload } = useAppData()
  const meta = data ? getPageMeta(route, data) : null
  usePageMeta(meta, data?.config.siteUrl ?? "https://example.com/")

  if (loading) {
    return <LoadingState />
  }

  if (error || !data) {
    return (
      <PageShell currentPath={route.path} sourceLabel="demo">
        <AppError message={error} onRetry={reload} />
      </PageShell>
    )
  }

  return (
    <PageShell currentPath={route.path} sourceLabel={data.sourceLabel}>
      <SourceBanner sourceLabel={data.sourceLabel} />
      {route.id === "home" ? <HomePage data={data} /> : null}
      {route.id === "games" ? <GamesPage data={data} /> : null}
      {route.id === "game-details" ? (
        <GameDetailsPage data={data} gameId={route.params.id} />
      ) : null}
      {route.id === "ranking" ? <RankingPage data={data} /> : null}
      {route.id === "models" ? <ModelsPage data={data} /> : null}
      {route.id === "model-details" ? (
        <ModelDetailsPage data={data} modelId={route.params.id} />
      ) : null}
      {route.id === "participants" ? <ParticipantsPage data={data} /> : null}
      {route.id === "about" ? <AboutPage data={data} /> : null}
      {route.id === "not-found" ? (
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <EmptyState
            title="Pagina nao encontrada"
            description="A rota nao existe ou nao esta disponivel nesta publicacao."
          />
        </div>
      ) : null}
    </PageShell>
  )
}

export default App
