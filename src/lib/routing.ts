import type { AppRoute, AppRouteId } from "@/types/routing"

function trimSlashes(value: string) {
  return value.replace(/^\/+|\/+$/g, "")
}

function getBasePath() {
  const base = import.meta.env.BASE_URL || "/"
  if (base === "/") {
    return ""
  }

  return trimSlashes(base)
}

export function toAppHref(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`
  const base = getBasePath()

  if (!base) {
    return normalized
  }

  return `/${base}${normalized === "/" ? "" : normalized}`
}

export function getCurrentAppPath() {
  const url = new URL(window.location.href)
  const redirectedPath = url.searchParams.get("p")
  const redirectedQuery = url.searchParams.get("q")

  if (redirectedPath) {
    const cleanSearch = redirectedQuery ? `?${redirectedQuery}` : ""
    const target = `${redirectedPath}${cleanSearch}${url.hash}`
    window.history.replaceState({}, "", toAppHref(target))
    return redirectedPath
  }

  const base = getBasePath()
  const pathname = trimSlashes(url.pathname)

  if (!base) {
    return `/${pathname}`
  }

  const withoutBase = pathname.startsWith(base)
    ? pathname.slice(base.length)
    : pathname
  return `/${trimSlashes(withoutBase)}`
}

export function navigate(path: string) {
  window.history.pushState({}, "", toAppHref(path))
  window.dispatchEvent(new PopStateEvent("popstate"))
}

export function isCurrentPath(pathname: string, expected: string) {
  return pathname === expected || pathname.startsWith(`${expected}/`)
}

function buildRoute(id: AppRouteId, path: string, params: Record<string, string>) {
  return { id, path, params } satisfies AppRoute
}

export function matchRoute(pathname: string): AppRoute {
  const cleanPath = pathname === "/" ? "/" : `/${trimSlashes(pathname)}`

  if (cleanPath === "/") return buildRoute("home", cleanPath, {})
  if (cleanPath === "/jogos") return buildRoute("games", cleanPath, {})
  if (cleanPath.startsWith("/jogos/")) {
    return buildRoute("game-details", cleanPath, {
      id: decodeURIComponent(cleanPath.replace("/jogos/", "")),
    })
  }
  if (cleanPath === "/ranking") return buildRoute("ranking", cleanPath, {})
  if (cleanPath === "/modelos") return buildRoute("models", cleanPath, {})
  if (cleanPath.startsWith("/modelos/")) {
    return buildRoute("model-details", cleanPath, {
      id: decodeURIComponent(cleanPath.replace("/modelos/", "")),
    })
  }
  if (cleanPath === "/participantes") {
    return buildRoute("participants", cleanPath, {})
  }
  if (cleanPath === "/sobre") return buildRoute("about", cleanPath, {})

  return buildRoute("not-found", cleanPath, {})
}
