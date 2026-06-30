export type Nullable<T> = T | null

export type CompetitionRound =
  | "Fase de grupos"
  | "Oitavas de final"
  | "Quartas de final"
  | "Semifinal"
  | "Final"
  | string

export type ModelType =
  | "XGBoost"
  | "Random Forest"
  | "Rede Neural"
  | "LLM"
  | "Sistema Elo"
  | "Monte Carlo"
  | "Ensemble"
  | "Outro"
  | string

export type WinnerSide = "Mandante" | "Visitante" | "Empate"

export type GameStatus = "aberto" | "fechado" | "ao_vivo" | "encerrado"

export type PredictionOutcome =
  | "pending"
  | "exact"
  | "winner"
  | "miss"
  | "late"

export interface SiteConfig {
  sheetId: string
  sheets: {
    participantes: string
    modelos: string
    jogos: string
    previsoes: string
    resultados: string
    pontuacao: string
    ranking: string
  }
  tournament: string
  currentRound: string
  siteUrl: string
  youtubeLiveUrl: string
  cacheTtlMinutes: number
  organizationName: string
  organizationUrl: string
  defaultOgImage: string
}

export interface Participant {
  id: string
  name: string
  email: string
  affiliation: string
  linkedin: string
  github: string
  socialHandle: string
  bio: string
  photoUrl: string
}

export interface Model {
  id: string
  participantId: string
  participantName: string
  name: string
  type: ModelType
  colabUrl: string
  datasets: string
  datasetUrls: string[]
  libs: string
  description: string
  registeredAt: string
  active: boolean
}

export interface Game {
  id: string
  round: CompetitionRound
  date: string
  kickoffBrt: string
  homeTeam: string
  awayTeam: string
  venue: string
  predictionDeadline: string
}

export interface Prediction {
  id: string
  modelId: string
  modelName: string
  participantName: string
  gameId: string
  homeTeam: string
  awayTeam: string
  predictedScore: string
  predictedHomeGoals: number
  predictedAwayGoals: number
  predictedWinner: WinnerSide
  confidence: number
  notes: string
  submittedAt: string
}

export interface MatchResult {
  gameId: string
  homeTeam: string
  awayTeam: string
  actualHomeGoals: number
  actualAwayGoals: number
  actualWinner: WinnerSide
  finishedAt: string
  notes: string
}

export interface ScoreRecord {
  predictionId: string
  modelId: string
  modelName: string
  participantName: string
  gameId: string
  predictedHomeGoals: number
  predictedAwayGoals: number
  predictedWinner: WinnerSide
  actualHomeGoals: number
  actualAwayGoals: number
  actualWinner: WinnerSide
  exactScore: boolean
  correctWinner: boolean
  points: number
  confidence: number
  weightedPoints: number
}

export interface RankingEntry {
  position: number
  modelId: string
  modelName: string
  participantName: string
  totalPoints: number
  predictedGames: number
  exactScores: number
  correctWinners: number
  averageConfidence: number
  weightedPoints: number
  colabUrl: string
}

export interface ResolvedGame extends Game {
  resolvedHomeTeam: string
  resolvedAwayTeam: string
  status: GameStatus
  hasResult: boolean
  result: MatchResult | null
}

export interface PredictionWithContext extends Prediction {
  model: Model | null
  game: ResolvedGame | null
  score: ScoreRecord | null
  validSubmission: boolean
  outcome: PredictionOutcome
  confidenceProfile: {
    mandante: number
    empate: number
    visitante: number
  }
}

export interface ModelPerformance {
  totalPoints: number
  predictedGames: number
  exactScores: number
  correctWinners: number
  accuracyRate: number
  weightedPoints: number
  averageConfidence: number
}

export interface ParticipantProfile extends Participant {
  models: Model[]
  activeModels: number
  totalPoints: number
}

export interface DashboardStats {
  activeModels: number
  participants: number
  predictions: number
  completedGames: number
}

export interface AppData {
  config: SiteConfig
  participants: Participant[]
  participantProfiles: ParticipantProfile[]
  models: Model[]
  games: ResolvedGame[]
  predictions: PredictionWithContext[]
  results: MatchResult[]
  scores: ScoreRecord[]
  ranking: RankingEntry[]
  dashboard: DashboardStats
  sourceLabel: "google-sheets" | "demo"
  loadedAt: string
}
