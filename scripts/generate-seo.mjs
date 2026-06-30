import fs from "fs/promises"
import path from "path"

const root = process.cwd()
const publicDir = path.join(root, "public")
const configPath = path.join(publicDir, "data", "config.json")

async function readConfig() {
  const raw = await fs.readFile(configPath, "utf-8")
  return JSON.parse(raw)
}

async function fetchSheetRows(sheetId, sheetName) {
  const url =
    `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq` +
    `?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Falha ao carregar ${sheetName}`)
  }

  const text = await response.text()
  const start = text.indexOf("{")
  const end = text.lastIndexOf("}")
  const parsed = JSON.parse(text.slice(start, end + 1))
  const cols = parsed.table.cols.map((col) => col.label)

  return parsed.table.rows.map((row) => {
    const record = {}
    row.c.forEach((cell, index) => {
      record[cols[index]] = cell?.v ?? cell?.f ?? null
    })
    return record
  })
}

function normalizeSiteUrl(siteUrl) {
  return siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`
}

function buildUrl(siteUrl, pathname) {
  return new URL(pathname.replace(/^\//, ""), normalizeSiteUrl(siteUrl)).toString()
}

function serializeSitemap(urls) {
  const items = urls
    .map(
      (url) => `
  <url>
    <loc>${url}</loc>
  </url>`
    )
    .join("")

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}
</urlset>
`
}

async function main() {
  const config = await readConfig()
  const siteUrl = normalizeSiteUrl(config.site_url || "https://example.com/")

  const routes = new Set([
    buildUrl(siteUrl, "/"),
    buildUrl(siteUrl, "/jogos"),
    buildUrl(siteUrl, "/ranking"),
    buildUrl(siteUrl, "/modelos"),
    buildUrl(siteUrl, "/participantes"),
    buildUrl(siteUrl, "/sobre"),
  ])

  if (config.sheet_id) {
    try {
      const [games, models] = await Promise.all([
        fetchSheetRows(config.sheet_id, config.sheet_name_jogos || "Jogos"),
        fetchSheetRows(config.sheet_id, config.sheet_name_modelos || "Modelos"),
      ])

      games.forEach((game) => {
        if (game.id_jogo) {
          routes.add(buildUrl(siteUrl, `/jogos/${game.id_jogo}`))
        }
      })

      models.forEach((model) => {
        if (model.id_modelo) {
          routes.add(buildUrl(siteUrl, `/modelos/${model.id_modelo}`))
        }
      })
    } catch (error) {
      console.warn("SEO generator: usando apenas rotas estaticas.", error)
    }
  }

  await fs.writeFile(path.join(publicDir, "sitemap.xml"), serializeSitemap([...routes]))
  await fs.writeFile(
    path.join(publicDir, "robots.txt"),
    `User-agent: *\nAllow: /\n\nSitemap: ${buildUrl(siteUrl, "/sitemap.xml")}\n`
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
