import { useEffect, useMemo, useState } from "react"

import { getCurrentAppPath, matchRoute } from "@/lib/routing"

export function useRoute() {
  const [pathname, setPathname] = useState(() => getCurrentAppPath())

  useEffect(() => {
    function onLocationChange() {
      setPathname(getCurrentAppPath())
    }

    window.addEventListener("popstate", onLocationChange)
    return () => window.removeEventListener("popstate", onLocationChange)
  }, [])

  return useMemo(() => matchRoute(pathname), [pathname])
}
