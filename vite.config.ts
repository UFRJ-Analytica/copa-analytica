import path from "path"
import fs from "fs"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"

function normalizeBasePath(pathname: string) {
  const cleanPath = pathname.trim()
  if (!cleanPath || cleanPath === "/") {
    return "/"
  }

  return cleanPath.endsWith("/") ? cleanPath : `${cleanPath}/`
}

function getBasePathFromConfig() {
  try {
    const raw = fs.readFileSync(path.join("public", "data", "config.json"), "utf-8")
    const config = JSON.parse(raw) as { site_url?: string }
    if (!config.site_url) {
      return null
    }

    return normalizeBasePath(new URL(config.site_url).pathname)
  } catch {
    return null
  }
}

function getBasePath(mode: string, command: "build" | "serve") {
  if (command !== "build") {
    return "/"
  }

  const env = loadEnv(mode, process.cwd(), "")
  if (env.VITE_BASE_PATH) {
    return normalizeBasePath(env.VITE_BASE_PATH)
  }

  const configBasePath = getBasePathFromConfig()
  if (configBasePath) {
    return configBasePath
  }

  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8")) as {
    name?: string
  }
  const repoName = packageJson.name?.trim().replace(/\+/g, "-")
  return repoName ? `/${repoName}/` : "/"
}

// https://vite.dev/config/
export default defineConfig(({ mode, command }) => ({
  base: getBasePath(mode, command),
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}))
