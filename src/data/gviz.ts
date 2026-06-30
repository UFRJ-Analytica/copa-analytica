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

function unwrapGvizResponse(text: string) {
  const start = text.indexOf("{")
  const end = text.lastIndexOf("}")
  return text.slice(start, end + 1)
}

function cellValue(cell: GvizCell | null) {
  if (!cell) {
    return null
  }

  return cell.v ?? cell.f ?? null
}

export async function fetchSheetRows(sheetId: string, sheetName: string) {
  const url =
    `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq` +
    `?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Falha ao buscar a aba ${sheetName}.`)
  }

  const text = await response.text()
  const parsed = JSON.parse(unwrapGvizResponse(text)) as GvizResponse
  const columns = parsed.table.cols.map((col) => col.label)

  return parsed.table.rows.map((row) => {
    const record: Record<string, string | number | boolean | null> = {}
    row.c.forEach((cell, index) => {
      record[columns[index]] = cellValue(cell)
    })
    return record
  })
}
