import path from "path"
import fs from "fs"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"

function getBasePath(mode: string, command: "build" | "serve") {
  if (command !== "build") {
    return "/"
  }

  const env = loadEnv(mode, process.cwd(), "")
  if (env.VITE_BASE_PATH) {
    return env.VITE_BASE_PATH
  }

  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8")) as {
    name?: string
  }
  const repoName = packageJson.name?.trim()
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
