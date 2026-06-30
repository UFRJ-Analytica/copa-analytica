const TEAM_CODES: Record<string, string> = {
  argentina: "ar",
  brasil: "br",
  brazil: "br",
  uruguai: "uy",
  uruguay: "uy",
  chile: "cl",
  colombia: "co",
  mexico: "mx",
  "estados unidos": "us",
  usa: "us",
  "united states": "us",
  canada: "ca",
  espanha: "es",
  spain: "es",
  portugal: "pt",
  franca: "fr",
  france: "fr",
  inglaterra: "gb-eng",
  england: "gb-eng",
  alemanha: "de",
  germany: "de",
  italia: "it",
  italy: "it",
  holanda: "nl",
  netherlands: "nl",
  belgica: "be",
  belgium: "be",
  croacia: "hr",
  croatia: "hr",
  marrocos: "ma",
  morocco: "ma",
  japao: "jp",
  japan: "jp",
  "coreia do sul": "kr",
  "south korea": "kr",
}

export function getTeamCode(teamName: string) {
  const normalized = teamName.trim().toLowerCase()
  return TEAM_CODES[normalized] ?? null
}

export function getTeamInitials(teamName: string) {
  const clean = teamName.replace("Vencedor ", "")
  return clean
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}
