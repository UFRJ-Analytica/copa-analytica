import { DEFAULT_OG_IMAGE, SITE_NAME } from "@/lib/constants"

export interface MetaDefinition {
  title: string
  description: string
  canonicalPath: string
  image?: string
  type?: "website" | "article"
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

function upsertMeta(selector: string, attribute: "name" | "property", value: string) {
  let node = document.head.querySelector<HTMLMetaElement>(selector)
  if (!node) {
    node = document.createElement("meta")
    node.setAttribute(attribute, value)
    document.head.appendChild(node)
  }

  return node
}

export function applyMeta(meta: MetaDefinition, siteUrl: string) {
  document.title = `${meta.title} | ${SITE_NAME}`

  const canonicalUrl = new URL(meta.canonicalPath, siteUrl).toString()
  const imageUrl = new URL(meta.image ?? DEFAULT_OG_IMAGE, siteUrl).toString()

  const descriptionNode = upsertMeta('meta[name="description"]', "name", "description")
  descriptionNode.content = meta.description

  const ogTitleNode = upsertMeta('meta[property="og:title"]', "property", "og:title")
  ogTitleNode.content = `${meta.title} | ${SITE_NAME}`

  const ogDescriptionNode = upsertMeta(
    'meta[property="og:description"]',
    "property",
    "og:description"
  )
  ogDescriptionNode.content = meta.description

  const ogTypeNode = upsertMeta('meta[property="og:type"]', "property", "og:type")
  ogTypeNode.content = meta.type ?? "website"

  const ogUrlNode = upsertMeta('meta[property="og:url"]', "property", "og:url")
  ogUrlNode.content = canonicalUrl

  const ogImageNode = upsertMeta('meta[property="og:image"]', "property", "og:image")
  ogImageNode.content = imageUrl

  const twitterCardNode = upsertMeta(
    'meta[name="twitter:card"]',
    "name",
    "twitter:card"
  )
  twitterCardNode.content = "summary_large_image"

  const twitterTitleNode = upsertMeta(
    'meta[name="twitter:title"]',
    "name",
    "twitter:title"
  )
  twitterTitleNode.content = `${meta.title} | ${SITE_NAME}`

  const twitterDescriptionNode = upsertMeta(
    'meta[name="twitter:description"]',
    "name",
    "twitter:description"
  )
  twitterDescriptionNode.content = meta.description

  const twitterImageNode = upsertMeta(
    'meta[name="twitter:image"]',
    "name",
    "twitter:image"
  )
  twitterImageNode.content = imageUrl

  let canonicalNode = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!canonicalNode) {
    canonicalNode = document.createElement("link")
    canonicalNode.rel = "canonical"
    document.head.appendChild(canonicalNode)
  }
  canonicalNode.href = canonicalUrl

  const scriptId = "route-jsonld"
  const previousScript = document.getElementById(scriptId)
  if (previousScript) {
    previousScript.remove()
  }

  if (meta.jsonLd) {
    const script = document.createElement("script")
    script.id = scriptId
    script.type = "application/ld+json"
    script.textContent = JSON.stringify(meta.jsonLd)
    document.head.appendChild(script)
  }
}
