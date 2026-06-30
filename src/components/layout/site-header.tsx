import { MoonStars, Sun } from "@phosphor-icons/react"

import { AppLink } from "@/components/layout/app-link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { NAV_ITEMS } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"
import { isCurrentPath, toAppHref } from "@/lib/routing"

export function SiteHeader({
  currentPath,
  sourceLabel,
}: {
  currentPath: string
  sourceLabel: "google-sheets" | "demo"
}) {
  const { theme, setTheme } = useTheme()
  const primaryItems = NAV_ITEMS.slice(0, 3)
  const secondaryItems = NAV_ITEMS.slice(3)

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/94 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <AppLink href={toAppHref("/")} className="flex items-center gap-3">
            <img
              src={`${import.meta.env.BASE_URL}assets/logos/logo-mark.svg`}
              alt="Analytica + Copa"
              className="size-9 rounded-sm"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-heading text-base font-semibold tracking-tight">Analytica + Copa</p>
                <Badge className="border-border bg-transparent text-muted-foreground">
                  {sourceLabel === "demo" ? "Demo" : "Live"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Competicao de modelos para a Copa
              </p>
            </div>
          </AppLink>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {primaryItems.map((item) => {
            const active = isCurrentPath(currentPath, item.path)
            return (
              <AppLink
                key={item.path}
                href={toAppHref(item.path)}
                className={cn(
                  "border-b px-2 py-1.5 text-sm font-medium transition",
                  active
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                )}
              >
                {item.label}
              </AppLink>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon-sm"
            className="rounded-sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Alternar tema"
          >
            {theme === "dark" ? <Sun weight="duotone" /> : <MoonStars weight="duotone" />}
          </Button>
        </div>
      </div>
      <div className="overflow-auto border-t border-border/60 md:hidden">
        <div className="mx-auto flex max-w-6xl gap-1 px-4 py-2 sm:px-6 lg:px-8">
          {NAV_ITEMS.map((item) => {
            const active = isCurrentPath(currentPath, item.path)
            return (
              <AppLink
                key={item.path}
                href={toAppHref(item.path)}
                className={cn(
                  "shrink-0 border-b px-2 py-1.5 text-sm font-medium transition",
                  active
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                )}
              >
                {item.label}
              </AppLink>
            )
          })}
        </div>
      </div>
      <div className="mx-auto hidden max-w-6xl flex-wrap items-center gap-3 px-4 py-2 text-xs text-muted-foreground md:flex sm:px-6 lg:px-8">
        {secondaryItems.map((item) => (
          <AppLink
            key={item.path}
            href={toAppHref(item.path)}
            className={cn(
              "transition hover:text-foreground",
              isCurrentPath(currentPath, item.path) && "text-foreground"
            )}
          >
            {item.label}
          </AppLink>
        ))}
      </div>
    </header>
  )
}
