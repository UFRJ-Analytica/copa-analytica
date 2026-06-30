import { CACHE_PREFIX } from "@/lib/constants"

interface CacheEntry<T> {
  data: T
  ts: number
}

function getKey(key: string) {
  return `${CACHE_PREFIX}:${key}`
}

export function readCache<T>(key: string, ttlMinutes: number) {
  const raw = window.sessionStorage.getItem(getKey(key))
  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as CacheEntry<T>
    const ttlMs = ttlMinutes * 60 * 1000
    if (Date.now() - parsed.ts > ttlMs) {
      window.sessionStorage.removeItem(getKey(key))
      return null
    }

    return parsed.data
  } catch {
    window.sessionStorage.removeItem(getKey(key))
    return null
  }
}

export function writeCache<T>(key: string, data: T) {
  const payload: CacheEntry<T> = {
    data,
    ts: Date.now(),
  }
  window.sessionStorage.setItem(getKey(key), JSON.stringify(payload))
}
