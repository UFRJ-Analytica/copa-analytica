import type { ReactNode } from "react"

import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"

export function PageShell({
  currentPath,
  children,
}: {
  currentPath: string
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader currentPath={currentPath} />
      <main>{children}</main>
      <SiteFooter />
    </div>
  )
}
