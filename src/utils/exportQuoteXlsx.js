import * as XLSX from 'xlsx'

/**
 * Exports quote line items to an Excel file.
 */
export function exportQuoteXlsx(lineItems) {
  const headers = ['Item Number', 'Description', 'Qty', 'Unit Price', 'Line Total', 'Lead Time (days)']
  const rows = lineItems.map(item => [
    item.code || '',
    item.name,
    item.qty,
    item.price || 0,
    (item.price || 0) * (item.qty || 1),
    item.leadTime ?? '',
  ])

  const data = [headers, ...rows]
  const ws = XLSX.utils.aoa_to_sheet(data)

  // Bold headers
  for (let c = 0; c < headers.length; c++) {
    const cell = ws[XLSX.utils.encode_cell({ r: 0, c })]
    if (cell) cell.s = { font: { bold: true } }
  }

  // Currency formatting for price columns
  const range = XLSX.utils.decode_range(ws['!ref'])
  for (let r = 1; r <= range.e.r; r++) {
    for (const c of [3, 4]) {
      const cell = ws[XLSX.utils.encode_cell({ r, c })]
      if (cell) cell.z = '"$"#,##0.00'
    }
  }

  // Totals row
  const total = lineItems.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0)
  const totalRow = range.e.r + 2
  ws[XLSX.utils.encode_cell({ r: totalRow, c: 3 })] = { v: 'Total', t: 's', s: { font: { bold: true } } }
  ws[XLSX.utils.encode_cell({ r: totalRow, c: 4 })] = { v: total, t: 'n', z: '"$"#,##0.00', s: { font: { bold: true } } }
  ws['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: totalRow, c: headers.length - 1 } })

  ws['!cols'] = [{ wch: 14 }, { wch: 42 }, { wch: 6 }, { wch: 12 }, { wch: 12 }, { wch: 14 }]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Quote')
  XLSX.writeFile(wb, `Quote_${new Date().toISOString().slice(0, 10)}.xlsx`)
}
