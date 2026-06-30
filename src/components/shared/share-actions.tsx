import { Copy, LinkSimple, LinkedinLogo, ShareNetwork, WhatsappLogo } from "@phosphor-icons/react"
import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"

function openShare(url: string) {
  window.open(url, "_blank", "noopener,noreferrer")
}

export function ShareActions({
  title,
  text,
  path,
  siteUrl,
}: {
  title: string
  text: string
  path: string
  siteUrl: string
}) {
  const [copied, setCopied] = useState(false)
  const shareUrl = useMemo(() => new URL(path, siteUrl).toString(), [path, siteUrl])

  async function copyLink() {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  async function nativeShare() {
    if (!navigator.share) {
      await copyLink()
      return
    }

    await navigator.share({ title, text, url: shareUrl })
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" className="rounded-full" onClick={() => void nativeShare()}>
        <ShareNetwork weight="duotone" />
        Compartilhar
      </Button>
      <Button variant="outline" size="sm" className="rounded-full" onClick={() => void copyLink()}>
        {copied ? <LinkSimple weight="duotone" /> : <Copy weight="duotone" />}
        {copied ? "Copiado" : "Copiar link"}
      </Button>
      <Button
        variant="outline"
        size="icon-sm"
        className="rounded-full"
        onClick={() =>
          openShare(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              shareUrl
            )}`
          )
        }
        aria-label="Compartilhar no LinkedIn"
      >
        <LinkedinLogo weight="fill" />
      </Button>
      <Button
        variant="outline"
        size="icon-sm"
        className="rounded-full"
        onClick={() =>
          openShare(
            `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} ${shareUrl}`)}`
          )
        }
        aria-label="Compartilhar no WhatsApp"
      >
        <WhatsappLogo weight="fill" />
      </Button>
    </div>
  )
}
