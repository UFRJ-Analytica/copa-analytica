import type { ReactNode } from "react"

import {
  CloudArrowDown,
  Gauge,
  GlobeHemisphereWest,
  Rows,
} from "@phosphor-icons/react"

import { PageIntro } from "@/components/shared/page-intro"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { AppData } from "@/types/domain"

export function AboutPage({ data }: { data: AppData }) {
  return (
    <>
      <PageIntro
        eyebrow="Arquitetura"
        title="Como a plataforma funciona"
        description="Tudo foi organizado para rodar sem backend, com codigo modular, paginas pequenas e uma pipeline de dados previsivel para GitHub Pages."
      />
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        <section className="grid gap-4 xl:grid-cols-3">
          <FeatureCard
            icon={<GlobeHemisphereWest className="size-6" weight="duotone" />}
            title="Deploy estatico"
            description="A app foi preparada para buildar no Vite e publicar no GitHub Pages, com rotas tratadas e assets publicos."
          />
          <FeatureCard
            icon={<Rows className="size-6" weight="duotone" />}
            title="Google Sheets como fonte"
            description="As abas publicas alimentam participantes, modelos, jogos, previsoes, resultados, pontuacao e ranking."
          />
          <FeatureCard
            icon={<Gauge className="size-6" weight="duotone" />}
            title="SEO e compartilhamento"
            description="Metadados por rota, Open Graph, Twitter Cards, JSON-LD, sitemap e robots automatizados no build."
          />
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Pipeline de dados</CardTitle>
            <CardDescription>
              O frontend tenta ler o ranking pronto, mas tambem sabe recomputar
              o necessario se algumas abas auxiliares falharem.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-4">
            {[
              "Le a configuracao publica em data/config.json.",
              "Busca as abas via gviz JSON do Google Sheets.",
              "Normaliza tipos, datas, booleans e chaves.",
              "Resolve cruzamentos, status, pontuacao e SEO de rota.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-lg border border-border/60 bg-background/70 p-4 text-sm leading-6 text-muted-foreground"
              >
                {item}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configuracao esperada</CardTitle>
            <CardDescription>
              O projeto exige um `sheet_id` configurado e le os dados publicados
              pelo Google Sheets.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge>public/data/config.json</Badge>
              <Badge>Google Sheets publico</Badge>
              <Badge>GitHub Pages</Badge>
            </div>
            <div className="rounded-lg border border-border/60 bg-background/70 p-4">
              <pre className="overflow-auto text-sm leading-6 text-muted-foreground">
                <code>{`{
  "sheet_id": "SEU_ID_DA_PLANILHA",
  "site_url": "${data.config.siteUrl}",
  "cache_ttl_minutos": ${data.config.cacheTtlMinutes}
}`}</code>
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Checklist operacional</CardTitle>
            <CardDescription>
              O minimo que precisa estar redondo para a publicacao final ficar
              tranquila.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {[
              "Publicar a planilha como visualizacao para qualquer pessoa com link.",
              "Conferir cabeçalhos exatamente como no documento de especificacao.",
              "Trocar logos, icones e og-image pelos assets finais em public/assets.",
              "Atualizar site_url para o endereco real do GitHub Pages.",
              "Executar build para regenerar sitemap.xml e robots.txt.",
              "Fazer um teste de compartilhamento em WhatsApp, LinkedIn e X.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-lg border border-border/60 bg-background/70 p-4 text-sm leading-6 text-muted-foreground"
              >
                {item}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Camada de dados em tempo real</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <CloudArrowDown className="size-5 text-primary" />
            <span>
              Origem atual:{" "}
              <strong className="text-foreground">Google Sheets</strong>
            </span>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode
  title: string
  description: string
}) {
  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="w-fit rounded-full bg-primary/10 p-3 text-primary">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
