function normalizeUrl(raw: string, prefix: string) {
  if (!raw) {
    return ""
  }

  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw
  }

  const value = raw.replace(/^@/, "").trim()
  return `${prefix}${value}`
}

export function resolveLinkedin(value: string) {
  return normalizeUrl(value, "https://www.linkedin.com/in/")
}

export function resolveGithub(value: string) {
  return normalizeUrl(value, "https://github.com/")
}

export function resolveSocialHandle(value: string) {
  return normalizeUrl(value, "https://x.com/")
}
