interface GvizCell {
  f?: string
  v?: string | number | boolean | null
}

interface GvizResponse {
  table: {
    cols: Array<{ label: string }>
    rows: Array<{ c: Array<GvizCell | null> }>
  }
}

type CellValue = string | number | boolean | null

function unwrapGvizResponse(text: string) {
  const start = text.indexOf("{")
  const end = text.lastIndexOf("}")
  return text.slice(start, end + 1)
}

function cellValue(cell: GvizCell | null): CellValue {
  if (!cell) {
    return null
  }

  return cell.v ?? cell.f ?? null
}

function normalizeHeaderText(value: CellValue) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
}

function canonicalHeader(value: CellValue) {
  const header = normalizeHeaderText(value)

  if (!header) return ""
  if (header === "id") return "id"
  if (header.includes("id previsao")) return "id_previsao"
  if (header.includes("id modelo")) return "id_modelo"
  if (header.includes("id participante")) return "id_participante"
  if (header.includes("id jogo")) return "id_jogo"
  if (header.includes("nome completo")) return "nome"
  if (header === "nome" || header.includes("nome do participante")) {
    return "nome_participante"
  }
  if (header === "participante") return "nome_participante"
  if (header.includes("nome do modelo") || header === "modelo")
    return "nome_modelo"
  if (header.includes("e mail") || header === "email") return "email"
  if (header.includes("vinculo")) return "vinculo"
  if (header.includes("linkedin")) return "linkedin"
  if (header.includes("github")) return "github"
  if (header.includes("instagram") || header === "x") return "instagram_x"
  if (header.includes("bio") || header.includes("apresentacao")) return "bio"
  if (header.includes("foto url")) return "foto_url"
  if (header.includes("tipo de modelo")) return "tipo_modelo"
  if (header.includes("colab") || header.includes("link do modelo"))
    return "colab_url"
  if (header.includes("datasets usados")) return "datasets"
  if (header.includes("dataset") && header.includes("link"))
    return "datasets_urls"
  if (header.includes("linguagem") || header.includes("libs")) return "libs"
  if (header.includes("descricao") || header.includes("abordagem"))
    return "descricao"
  if (header.includes("data de cadastro")) return "data_cadastro"
  if (header.includes("ativo")) return "ativo"
  if (header === "rodada") return "rodada"
  if (header === "data") return "data"
  if (header.includes("horario")) return "horario_brt"
  if (header === "mandante") return "mandante"
  if (header === "visitante") return "visitante"
  if (header === "local") return "local"
  if (header.includes("prazo previsao")) return "prazo_previsao"
  if (header.includes("placar previsto")) return "placar_previsto"
  if (header.includes("gols m prev")) return "gols_mandante_prev"
  if (header.includes("gols v prev")) return "gols_visitante_prev"
  if (header.includes("gols mandante") && header.includes("real"))
    return "gols_mandante_real"
  if (header.includes("gols visitante") && header.includes("real"))
    return "gols_visitante_real"
  if (header.includes("gols m real")) return "gols_mandante_real"
  if (header.includes("gols v real")) return "gols_visitante_real"
  if (header === "gols mandante") return "gols_mandante"
  if (header === "gols visitante") return "gols_visitante"
  if (
    header.includes("vencedor previsto") ||
    header.includes("vencedor prev")
  ) {
    return "vencedor_previsto"
  }
  if (header.includes("vencedor real")) return "vencedor_real"
  if (header.includes("confianca")) {
    return header.includes("media") ? "confianca_media" : "confianca"
  }
  if (header.includes("observacoes") || header.includes("justificativa"))
    return "observacoes"
  if (header.includes("timestamp envio")) return "timestamp_envio"
  if (header.includes("data hora fim")) return "datetime_fim"
  if (header.includes("placar exato")) return "placar_exato"
  if (header.includes("vencedor certo")) return "vencedor_certo"
  if (header === "pontos") return "pontos"
  if (header.includes("pts confianca")) return "pts_x_confianca"
  if (header.includes("pontos totais")) return "pontos_totais"
  if (header.includes("jogos prev")) return "jogos_previstos"
  if (header.includes("placares exatos")) return "placares_exatos"
  if (header.includes("vencedores certos")) return "vencedores_certos"
  if (header === "pos" || header.includes(" pos")) return "posicao"

  return header.replace(/ /g, "_")
}

function recognizedHeaders(values: CellValue[]) {
  return values.map(canonicalHeader).filter(Boolean)
}

function scoreHeaderCandidate(values: CellValue[]) {
  const headers = recognizedHeaders(values)
  const uniqueHeaders = new Set(headers)
  return uniqueHeaders.size
}

function findHeaderRow(rows: CellValue[][]) {
  return rows.findIndex((row) => scoreHeaderCandidate(row) >= 3)
}

function buildRecords(headers: CellValue[], rows: CellValue[][]) {
  const columns = inferBlankHeaders(headers.map(canonicalHeader))

  return rows
    .filter((row) => row.some((value) => String(value ?? "").trim()))
    .map((row) => {
      const record: Record<string, CellValue> = {}
      row.forEach((value, index) => {
        const key = columns[index]
        if (key) {
          record[key] = value
        }
      })
      return record
    })
}

function inferBlankHeaders(columns: string[]) {
  const inferred = [...columns]

  inferred.forEach((column, index) => {
    if (column) return

    if (inferred[index - 1] === "placar_previsto") {
      inferred[index] = "gols_mandante"
      return
    }

    if (inferred[index - 1] === "rodada") {
      inferred[index] = "data"
      return
    }

    if (inferred[index - 2] === "rodada") {
      inferred[index] = "horario_brt"
      return
    }

    if (inferred[index - 2] === "placar_previsto") {
      inferred[index] = "gols_visitante"
      return
    }

    if (inferred[index - 1] === "vencedor_previsto") {
      inferred[index] = "confianca"
      return
    }

    if (inferred[index - 1] === "visitante") {
      inferred[index] = "gols_mandante_real"
      return
    }

    if (inferred[index - 2] === "visitante") {
      inferred[index] = "gols_visitante_real"
    }
  })

  return inferred
}

export async function fetchSheetRows(sheetId: string, sheetName: string) {
  const url =
    `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq` +
    `?tqx=out:json&headers=0&sheet=${encodeURIComponent(sheetName)}`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Falha ao buscar a aba ${sheetName}.`)
  }

  const text = await response.text()
  const parsed = JSON.parse(unwrapGvizResponse(text)) as GvizResponse
  const rows = parsed.table.rows.map((row) => row.c.map(cellValue))
  const headerRowIndex = findHeaderRow(rows)

  if (headerRowIndex >= 0) {
    return buildRecords(rows[headerRowIndex], rows.slice(headerRowIndex + 1))
  }

  return buildRecords(
    parsed.table.cols.map((col) => col.label),
    rows
  )
}
