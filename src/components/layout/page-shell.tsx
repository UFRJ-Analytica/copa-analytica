import type { ReactNode } from "react"

import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"

export function PageShell({
  currentPath,
  sourceLabel,
  children,
}: {
  currentPath: string
  sourceLabel: "google-sheets" | "demo"
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader currentPath={currentPath} sourceLabel={sourceLabel} />
      <main>{children}</main>
      <SiteFooter />
    </div>
  )
}
