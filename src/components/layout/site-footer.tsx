import { AppLink } from "@/components/layout/app-link"
import { toAppHref } from "@/lib/routing"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:px-6 lg:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-medium text-foreground">Analytica + Copa</p>
          <p>Plataforma estatica preparada para GitHub Pages e Google Sheets.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <AppLink href={toAppHref("/ranking")} className="hover:text-foreground">
            Ranking
          </AppLink>
          <AppLink href={toAppHref("/modelos")} className="hover:text-foreground">
            Modelos
          </AppLink>
          <AppLink href={toAppHref("/sobre")} className="hover:text-foreground">
            Sobre
          </AppLink>
        </div>
      </div>
    </footer>
  )
}
