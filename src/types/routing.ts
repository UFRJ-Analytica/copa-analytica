export type AppRouteId =
  | "home"
  | "games"
  | "game-details"
  | "ranking"
  | "models"
  | "model-details"
  | "participants"
  | "about"
  | "not-found"

export interface AppRoute {
  id: AppRouteId
  path: string
  params: Record<string, string>
}
