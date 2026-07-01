import { MoonStars, Sun } from "@phosphor-icons/react"

import { AppLink } from "@/components/layout/app-link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { NAV_ITEMS } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"
import { isCurrentPath, toAppHref } from "@/lib/routing"

export function SiteHeader({ currentPath }: { currentPath: string }) {
  const { theme, setTheme } = useTheme()
  const primaryItems = NAV_ITEMS.slice(0, 3)
  const secondaryItems = NAV_ITEMS.slice(3)

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#062f55]/95 text-white backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <AppLink href={toAppHref("/")} className="flex items-center gap-3">
            <img
              src={`${import.meta.env.BASE_URL}assets/logos/copa-analytica-logo.png`}
              alt="Analytica + Copa"
              className="size-11 rounded-2xl object-cover shadow-lg shadow-black/30"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-heading text-base font-black tracking-tight">
                  Copa dos Modelos
                </p>
                <Badge className="border-emerald-300/30 bg-emerald-300/10 text-emerald-100">
                  Planilha ao vivo
                </Badge>
              </div>
              <p className="text-xs text-sky-100/70">Analytica + Copa</p>
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
                  "rounded-full border px-3 py-1.5 text-sm font-bold transition",
                  active
                    ? "border-amber-200 bg-amber-200 text-slate-950"
                    : "border-transparent text-sky-100/70 hover:border-white/15 hover:bg-white/10 hover:text-white"
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
            className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Alternar tema"
          >
            {theme === "dark" ? (
              <Sun weight="duotone" />
            ) : (
              <MoonStars weight="duotone" />
            )}
          </Button>
        </div>
      </div>
      <div className="overflow-auto border-t border-white/10 md:hidden">
        <div className="mx-auto flex max-w-6xl gap-1 px-4 py-2 sm:px-6 lg:px-8">
          {NAV_ITEMS.map((item) => {
            const active = isCurrentPath(currentPath, item.path)
            return (
              <AppLink
                key={item.path}
                href={toAppHref(item.path)}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1.5 text-sm font-bold transition",
                  active
                    ? "border-amber-200 bg-amber-200 text-slate-950"
                    : "border-transparent text-sky-100/70 hover:border-white/15 hover:bg-white/10 hover:text-white"
                )}
              >
                {item.label}
              </AppLink>
            )
          })}
        </div>
      </div>
      <div className="mx-auto hidden max-w-6xl flex-wrap items-center gap-3 px-4 py-2 text-xs text-sky-100/65 sm:px-6 md:flex lg:px-8">
        {secondaryItems.map((item) => (
          <AppLink
            key={item.path}
            href={toAppHref(item.path)}
            className={cn(
              "transition hover:text-white",
              isCurrentPath(currentPath, item.path) && "text-white"
            )}
          >
            {item.label}
          </AppLink>
        ))}
      </div>
    </header>
  )
}
