import { useEffect } from "react"

import { applyMeta, type MetaDefinition } from "@/lib/seo"

export function usePageMeta(meta: MetaDefinition | null, siteUrl: string) {
  useEffect(() => {
    if (!meta) {
      return
    }

    applyMeta(meta, siteUrl)
  }, [meta, siteUrl])
}
