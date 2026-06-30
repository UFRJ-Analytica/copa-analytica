import { useCallback, useEffect, useState } from "react"

import { loadAppData } from "@/data/load-app-data"
import type { AppData } from "@/types/domain"

interface AppDataState {
  data: AppData | null
  loading: boolean
  error: string
  reload: () => Promise<void>
}

export function useAppData(): AppDataState {
  const [data, setData] = useState<AppData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const reload = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const nextData = await loadAppData()
      setData(nextData)
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Nao foi possivel carregar os dados da plataforma."
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    loadAppData()
      .then((nextData) => {
        if (cancelled) {
          return
        }

        setData(nextData)
        setLoading(false)
      })
      .catch((caughtError) => {
        if (cancelled) {
          return
        }

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Nao foi possivel carregar os dados da plataforma."
        )
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [reload])

  return { data, loading, error, reload }
}
