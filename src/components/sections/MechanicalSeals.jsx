import React, { useState, useMemo, useRef, useEffect } from 'react'
import * as XLSX from 'xlsx'
import { SEAL_DATA } from '../../data/sealData'

const TYPE_LABELS = {
  SA:   'Seal Assembly',
  SPK:  'Spare Parts Kit',
}

const FILTER_DEFS = [
  { key: 'model',     label: 'Seal Model', optionLabel: v => v },
  { key: 'size',      label: 'Size',       optionLabel: v => formatSize(v) },
  { key: 'face',      label: 'Seal Faces',  optionLabel: v => v },
  { key: 'elastomer', label: 'Elastomers', optionLabel: v => v },
]

const ALL_METALS = ['316SS']
const ALL_UNITS = ['inch', 'metric']
const ALL_TYPES = ['SA', 'SPK']

const STORAGE_KEY_FILTERS = 'chesterton_ms_filters'

function formatSize(s) {
  const n = parseFloat(s)
  if (n >= 25) return `${Math.round(n)}mm`
  return `${Math.round(n * 1000) / 1000}"`
}

function formatPrice(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

function sortedSizes(vals) {
  return [...vals].sort((a, b) => parseFloat(a) - parseFloat(b))
}

const emptyFilters = () => ({ model: new Set(), size: new Set(), face: new Set(), elastomer: new Set() })

// ── Persistence helpers ───────────────────────────────────────────────────

function saveFilters(state) {
  try {
    const serializable = {
      search: state.search,
      activeUnits: [...state.activeUnits],
      activeTypes: [...state.activeTypes],
      metalFilter: [...state.metalFilter],
      filters: {
        model: [...state.filters.model],
        size: [...state.filters.size],
        face: [...state.filters.face],
        elastomer: [...state.filters.elastomer],
      },
      pageSize: state.pageSize,
    }
    localStorage.setItem(STORAGE_KEY_FILTERS, JSON.stringify(serializable))
  } catch { /* ignore */ }
}

function loadFilters() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FILTERS)
    if (!raw) return null
    const p = JSON.parse(raw)
    return {
      search: p.search || '',
      activeUnits: new Set(p.activeUnits || ['inch', 'metric']),
      activeTypes: new Set(p.activeTypes || ['SA', 'SPK']),
      metalFilter: new Set(p.metalFilter || []),
      filters: {
        model: new Set(p.filters?.model || []),
        size: new Set(p.filters?.size || []),
        face: new Set(p.filters?.face || []),
        elastomer: new Set(p.filters?.elastomer || []),
      },
      pageSize: p.pageSize || 25,
    }
  } catch { return null }
}

// ── MultiSelect ──────────────────────────────────────────────────────────

function MultiSelect({ label, options, selected, onChange, optionLabel }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const handleClick = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const allSelected = selected.size === 0
  const count = selected.size
  const buttonLabel = allSelected ? 'All' : count === 1 ? optionLabel([...selected][0]) : `${count} selected`
  const isActive = !allSelected

  const toggle = val => {
    const next = new Set(selected)
    next.has(val) ? next.delete(val) : next.add(val)
    onChange(next)
  }

  return (
    <div ref={ref} className="flex flex-col gap-1.5 relative" style={{ minWidth: '110px' }}>
      <label className="text-[10px] font-semibold uppercase" style={{ color: '#6e6e73', letterSpacing: '0.1em' }}>{label}</label>
      <button
        onClick={() => setOpen(o => !o)}
        className="text-[13px] px-3 py-2 rounded-[10px] focus:outline-none transition-all text-left flex items-center justify-between gap-2"
        style={{
          background: isActive ? 'rgba(200,16,46,0.05)' : 'rgba(0,0,0,0.04)',
          border: isActive ? '1px solid rgba(200,16,46,0.3)' : '1px solid rgba(0,0,0,0.08)',
          color: isActive ? '#1c1c1e' : '#6e6e73',
          fontWeight: isActive ? 500 : 400,
        }}
      >
        <span className="truncate">{buttonLabel}</span>
        <svg
          className="w-3 h-3 flex-shrink-0"
          style={{ opacity: 0.45, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute top-full left-0 mt-1 rounded-[12px] z-50"
          style={{
            background: 'white',
            border: '1px solid rgba(0,0,0,0.1)',
            boxShadow: '0 8px 28px rgba(0,0,0,0.13)',
            minWidth: '100%',
            maxHeight: '220px',
            overflowY: 'auto',
          }}
        >
          <button
            onClick={() => onChange(new Set())}
            className="w-full text-left px-3 py-2 text-[12px] flex items-center gap-2.5 transition-colors"
            style={{
              borderBottom: '1px solid rgba(0,0,0,0.06)',
              fontWeight: allSelected ? 600 : 400,
              color: allSelected ? '#c8102e' : '#1c1c1e',
              background: allSelected ? 'rgba(200,16,46,0.03)' : 'transparent',
            }}
            onMouseEnter={e => { if (!allSelected) e.currentTarget.style.background = 'rgba(0,0,0,0.03)' }}
            onMouseLeave={e => { e.currentTarget.style.background = allSelected ? 'rgba(200,16,46,0.03)' : 'transparent' }}
          >
            <Checkbox checked={allSelected} />
            All
          </button>

          {options.map(v => {
            const checked = selected.has(v)
            return (
              <button
                key={v}
                onClick={() => toggle(v)}
                className="w-full text-left px-3 py-2 text-[12px] flex items-center gap-2.5 transition-colors"
                style={{
                  color: checked ? '#c8102e' : '#1c1c1e',
                  fontWeight: checked ? 500 : 400,
                  background: checked ? 'rgba(200,16,46,0.03)' : 'transparent',
                }}
                onMouseEnter={e => { if (!checked) e.currentTarget.style.background = 'rgba(0,0,0,0.03)' }}
                onMouseLeave={e => { e.currentTarget.style.background = checked ? 'rgba(200,16,46,0.03)' : 'transparent' }}
              >
                <Checkbox checked={checked} />
                {optionLabel(v)}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Checkbox({ checked }) {
  return (
    <span
      className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
      style={{
        border: checked ? 'none' : '1.5px solid rgba(0,0,0,0.22)',
        background: checked ? '#c8102e' : 'transparent',
      }}
    >
      {checked && (
        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
    </span>
  )
}

// ── Sort indicator ────────────────────────────────────────────────────────

function SortIcon({ dir }) {
  if (!dir) {
    return (
      <svg className="w-3 h-3 inline ml-1" style={{ opacity: 0.25 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    )
  }
  return (
    <svg className="w-3 h-3 inline ml-1" style={{ color: '#c8102e' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      {dir === 'asc'
        ? <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        : <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      }
    </svg>
  )
}

// ── Export helpers ──────────────────────────────────────────────────────────

const EXPORT_HEADERS = ['Item Number', 'Model', 'Description', 'Type', 'Size', 'Face', 'Elastomer', 'List Price', 'Lead Time (days)']

function rowToArr(row) {
  return [
    row.itemNumber,
    row.model,
    row.description,
    TYPE_LABELS[row.type] ?? row.type,
    formatSize(row.size),
    row.face,
    row.elastomer,
    row.listPrice,
    row.leadTime ?? '',
  ]
}

function makeSheet(rows) {
  const data = [EXPORT_HEADERS, ...rows.map(rowToArr)]
  const ws = XLSX.utils.aoa_to_sheet(data)
  const range = XLSX.utils.decode_range(ws['!ref'])
  const priceCol = EXPORT_HEADERS.indexOf('List Price')
  for (let r = range.s.r; r <= range.e.r; r++) {
    const cell = ws[XLSX.utils.encode_cell({ r, c: priceCol })]
    if (!cell) continue
    if (r === 0) {
      cell.s = { font: { bold: true } }
    } else {
      cell.z = '"$"#,##0'
    }
  }
  for (let c = range.s.c; c <= range.e.c; c++) {
    if (c === priceCol) continue
    const cell = ws[XLSX.utils.encode_cell({ r: 0, c })]
    if (cell) cell.s = { font: { bold: true } }
  }
  ws['!cols'] = [{ wch: 14 }, { wch: 10 }, { wch: 42 }, { wch: 14 }, { wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 16 }]
  return ws
}

function makeTermsSheet() {
  const lines = [
    ['A.W. Chesterton Company — Mechanical Seals Price List'],
    ['Terms & Conditions'],
    [],
    ['CONFIDENTIALITY'],
    ['This price list is confidential and intended solely for authorized A.W. Chesterton distributors and sales personnel.'],
    ['Unauthorized reproduction or distribution is strictly prohibited.'],
    [],
    ['PRICING'],
    ['All prices are in USD and represent U.S. List Price. Prices are subject to change without notice.'],
    ['Applicable discounts, surcharges, or freight charges are not reflected in this document.'],
    [],
    ['VALIDITY'],
    ['Prices listed are valid at the time of export. Please verify current pricing with your Chesterton representative'],
    ['or the official pricing system prior to quoting.'],
    [],
    ['WARRANTIES & LIABILITY'],
    ['A.W. Chesterton Company makes no warranties, express or implied, regarding the accuracy or completeness'],
    ['of this price list. Chesterton shall not be liable for any errors or omissions.'],
    [],
    ['CONTACT'],
    ['For pricing questions or to place an order, contact your local Chesterton sales representative'],
    ['or visit www.chesterton.com.'],
    [],
    ['© A.W. Chesterton Company. All rights reserved.'],
  ]
  const ws = XLSX.utils.aoa_to_sheet(lines)
  ws['!cols'] = [{ wch: 100 }]
  const boldRows = [0, 1, 3, 7, 11, 15, 19, 23]
  for (const r of boldRows) {
    const cell = ws[XLSX.utils.encode_cell({ r, c: 0 })]
    if (cell) cell.s = { font: { bold: true } }
  }
  return ws
}

function exportOneList(rows) {
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, makeTermsSheet(), 'Terms & Conditions')
  XLSX.utils.book_append_sheet(wb, makeSheet(rows), 'All Items')
  XLSX.writeFile(wb, 'MS_Pricing_Export.xlsx')
}

function exportByModel(rows) {
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, makeTermsSheet(), 'Terms & Conditions')
  const groups = {}
  for (const row of rows) {
    if (!groups[row.model]) groups[row.model] = []
    groups[row.model].push(row)
  }
  for (const model of Object.keys(groups).sort()) {
    XLSX.utils.book_append_sheet(wb, makeSheet(groups[model]), model)
  }
  XLSX.writeFile(wb, 'MS_Pricing_Export_By_Model.xlsx')
}

function exportByModelType(rows) {
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, makeTermsSheet(), 'Terms & Conditions')
  const groups = {}
  for (const row of rows) {
    const key = `${row.model} ${row.type}`
    if (!groups[key]) groups[key] = []
    groups[key].push(row)
  }
  for (const key of Object.keys(groups).sort()) {
    XLSX.utils.book_append_sheet(wb, makeSheet(groups[key]), key)
  }
  XLSX.writeFile(wb, 'MS_Pricing_Export_By_Model_Type.xlsx')
}

// ── Export dropdown button ───────────────────────────────────────────────────

function ExportButton({ rows }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const options = [
    { label: 'One List', sub: '1 tab — all items', action: () => { exportOneList(rows); setOpen(false) } },
    { label: 'By Model', sub: 'Tab per model (442, 442C…)', action: () => { exportByModel(rows); setOpen(false) } },
    { label: 'By Model / Type', sub: 'Tab per model + SA/SPK', action: () => { exportByModelType(rows); setOpen(false) } },
  ]

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-[8px] transition-all focus:outline-none"
        style={{
          background: '#c8102e',
          color: 'white',
          boxShadow: '0 1px 4px rgba(200,16,46,0.3)',
        }}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.25}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
        </svg>
        Export
        <svg
          className="w-3 h-3"
          style={{ opacity: 0.7, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1.5 rounded-[12px] z-50 overflow-hidden"
          style={{
            background: 'white',
            border: '1px solid rgba(0,0,0,0.1)',
            boxShadow: '0 8px 28px rgba(0,0,0,0.15)',
            minWidth: '220px',
          }}
        >
          <div className="px-3 py-2" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <p className="text-[10px] font-semibold uppercase" style={{ color: '#6e6e73', letterSpacing: '0.1em' }}>
              MS Pricing Export — {rows.length.toLocaleString()} items
            </p>
          </div>
          {options.map(({ label, sub, action }) => (
            <button
              key={label}
              onClick={action}
              className="w-full text-left px-3 py-2.5 transition-colors flex flex-col gap-0.5"
              style={{ borderTop: '1px solid rgba(0,0,0,0.04)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.03)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span className="text-[13px] font-medium" style={{ color: '#1c1c1e' }}>{label}</span>
              <span className="text-[11px]" style={{ color: '#6e6e73' }}>{sub}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Comparison Matrix ────────────────────────────────────────────────────

function ComparisonMatrix({ rows, onAddToQuote }) {
  const matrix = useMemo(() => {
    const models = [...new Set(rows.map(r => r.model))].sort()
    const combos = [...new Set(rows.map(r => `${r.face} / ${r.elastomer}`))].sort()
    const byModel = {}
    for (const model of models) {
      const modelRows = rows.filter(r => r.model === model)
      const sizes = [...new Set(modelRows.map(r => r.size))].sort((a, b) => parseFloat(a) - parseFloat(b))
      const lookup = {}
      for (const r of modelRows) {
        lookup[`${r.size}|${r.face} / ${r.elastomer}`] = r
      }
      byModel[model] = { sizes, lookup }
    }
    return { models, combos, byModel }
  }, [rows])

  if (matrix.models.length === 0) {
    return (
      <div className="py-16 text-center text-[13px]" style={{ color: '#6e6e73' }}>
        No items match the selected filters.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', background: 'rgba(0,0,0,0.02)' }}>
            <th
              className="text-left py-3 px-4 font-semibold uppercase sticky left-0 z-10"
              style={{ fontSize: '10px', color: '#6e6e73', letterSpacing: '0.1em', background: 'rgba(248,248,250,1)', minWidth: '80px' }}
            >
              Size
            </th>
            {matrix.combos.map(combo => (
              <th
                key={combo}
                className="text-center py-3 px-3 font-semibold uppercase"
                style={{ fontSize: '10px', color: '#6e6e73', letterSpacing: '0.08em', minWidth: '120px' }}
              >
                {combo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.models.map(model => (
            <React.Fragment key={model}>
              {/* Model header row */}
              <tr>
                <td
                  colSpan={matrix.combos.length + 1}
                  className="py-2.5 px-4 sticky left-0 z-10"
                  style={{ background: 'rgba(200,16,46,0.05)', borderTop: '2px solid rgba(200,16,46,0.15)' }}
                >
                  <span
                    className="text-[11px] font-bold uppercase tracking-wide"
                    style={{ color: '#c8102e' }}
                  >
                    {model}
                  </span>
                </td>
              </tr>
              {/* Size rows for this model */}
              {matrix.byModel[model].sizes.map((size, si) => (
                <tr
                  key={`${model}-${size}`}
                  style={{ borderTop: si === 0 ? 'none' : '1px solid rgba(0,0,0,0.04)' }}
                >
                  <td
                    className="py-2.5 px-4 text-[12px] font-semibold sticky left-0 z-10"
                    style={{ color: '#1c1c1e', background: 'rgba(248,248,250,1)' }}
                  >
                    {formatSize(size)}
                  </td>
                  {matrix.combos.map(combo => {
                    const row = matrix.byModel[model].lookup[`${size}|${combo}`]
                    if (!row) return <td key={combo} className="py-2.5 px-3 text-center text-[11px]" style={{ color: '#aeaeb2' }}>—</td>
                    return (
                      <td key={combo} className="py-2.5 px-3 text-center">
                        <button
                          onClick={(e) => {
                            const cp = counterpartMap.get(`${row.model}|${row.size}|${row.face}|${row.elastomer}|${row.type === 'SA' ? 'SPK' : 'SA'}`)
                            onAddToQuote?.({ name: row.description, code: row.itemNumber, price: row.listPrice, leadTime: row.leadTime, type: row.type, counterpart: cp ? { name: cp.description, code: cp.itemNumber, price: cp.listPrice, leadTime: cp.leadTime, type: cp.type } : undefined }, e.currentTarget.getBoundingClientRect())
                          }}
                          className="inline-flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all group"
                          style={{ background: 'transparent' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(200,16,46,0.05)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          title={`${row.description} — Click to add to quote`}
                        >
                          <span className="text-[13px] font-semibold tabular-nums" style={{ color: '#1c1c1e' }}>
                            {formatPrice(row.listPrice)}
                          </span>
                          <span className="text-[9px] font-mono" style={{ color: '#aeaeb2' }}>
                            {row.itemNumber}
                          </span>
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────

const SORT_KEYS = [
  { key: 'itemNumber', label: 'Item Number', align: 'left',  width: 'w-[130px]' },
  { key: 'model',      label: 'Model',       align: 'left',  width: 'w-[90px]' },
  { key: 'description',label: 'Description', align: 'left',  width: '' },
  { key: 'listPrice',  label: 'List Price',  align: 'right', width: 'w-[110px]' },
  { key: 'leadTime',   label: 'Lead Time',   align: 'right', width: 'w-[110px]' },
]

function compareFn(key, dir) {
  return (a, b) => {
    let av = a[key], bv = b[key]
    if (key === 'size') { av = parseFloat(av); bv = parseFloat(bv) }
    if (typeof av === 'number' && typeof bv === 'number') return dir === 'asc' ? av - bv : bv - av
    av = String(av ?? '').toLowerCase()
    bv = String(bv ?? '').toLowerCase()
    if (av < bv) return dir === 'asc' ? -1 : 1
    if (av > bv) return dir === 'asc' ? 1 : -1
    return 0
  }
}

export default function MechanicalSeals({ onAddToQuote }) {
  const saved = useRef(loadFilters()).current

  const [search, setSearch]           = useState(saved?.search ?? '')
  const [activeUnits, setActiveUnits] = useState(saved?.activeUnits ?? new Set(['inch', 'metric']))
  const [activeTypes, setActiveTypes] = useState(saved?.activeTypes ?? new Set(['SA', 'SPK']))
  const [filters, setFilters]         = useState(saved?.filters ?? emptyFilters())
  const [metalFilter, setMetalFilter] = useState(saved?.metalFilter ?? new Set())
  const [page, setPage]               = useState(1)
  const [pageSize, setPageSize]       = useState(saved?.pageSize ?? 25)
  const [sortCol, setSortCol]         = useState(null)
  const [sortDir, setSortDir]         = useState('asc')
  const [viewMode, setViewMode]       = useState('table') // 'table' | 'matrix'
  const [selectedRows, setSelectedRows] = useState(new Set())

  // Persist filters on change
  useEffect(() => {
    saveFilters({ search, activeUnits, activeTypes, metalFilter, filters, pageSize })
  }, [search, activeUnits, activeTypes, metalFilter, filters, pageSize])

  const resetPage = () => { setPage(1); setSelectedRows(new Set()) }

  const toggleUnit = unit => {
    setActiveUnits(prev => {
      if (prev.size === 1 && prev.has(unit)) return prev
      const next = new Set(prev)
      next.has(unit) ? next.delete(unit) : next.add(unit)
      setFilters(f => ({ ...f, size: new Set() }))
      return next
    })
    resetPage()
  }

  const toggleType = type => {
    setActiveTypes(prev => {
      if (prev.size === 1 && prev.has(type)) return prev
      const next = new Set(prev)
      next.has(type) ? next.delete(type) : next.add(type)
      return next
    })
    resetPage()
  }

  const unitFilter = row => {
    const n = parseFloat(row.size)
    return activeUnits.has(n >= 25 ? 'metric' : 'inch')
  }

  const optionsFor = useMemo(() => {
    const result = {}
    FILTER_DEFS.forEach(({ key }) => {
      const subset = SEAL_DATA.filter(row => {
        if (!unitFilter(row)) return false
        if (!activeTypes.has(row.type)) return false
        return FILTER_DEFS.every(f => {
          if (f.key === key) return true
          if (filters[f.key].size === 0) return true
          return filters[f.key].has(String(row[f.key]))
        })
      })
      const vals = [...new Set(subset.map(r => String(r[key])))]
      result[key] = key === 'size' ? sortedSizes(vals) : vals.sort()
    })
    return result
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, activeUnits, activeTypes])

  const setFilter = (key, val) => { setFilters(prev => ({ ...prev, [key]: val })); resetPage() }

  const visibleRows = useMemo(() => {
    const q = search.trim().toLowerCase()
    return SEAL_DATA.filter(row => {
      if (!unitFilter(row)) return false
      if (!activeTypes.has(row.type)) return false
      for (const { key } of FILTER_DEFS) {
        if (filters[key].size > 0 && !filters[key].has(String(row[key]))) return false
      }
      if (q) {
        const haystack = `${row.itemNumber} ${row.description}`.toLowerCase()
        if (q.includes('*')) {
          const parts = q.split('*').filter(Boolean)
          let idx = 0
          for (const part of parts) {
            const found = haystack.indexOf(part, idx)
            if (found === -1) return false
            idx = found + part.length
          }
        } else {
          if (!haystack.includes(q)) return false
        }
      }
      return true
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, search, activeUnits, activeTypes])

  const sortedRows = useMemo(() => {
    if (!sortCol) return visibleRows
    return [...visibleRows].sort(compareFn(sortCol, sortDir))
  }, [visibleRows, sortCol, sortDir])

  const typeCounts = useMemo(() => {
    const counts = { SA: 0, SPK: 0 }
    for (const row of visibleRows) if (row.type in counts) counts[row.type]++
    return counts
  }, [visibleRows])

  const isFiltered = Object.values(filters).some(s => s.size > 0) || search ||
    activeUnits.size < 2 || activeTypes.size < 2 || metalFilter.size > 0

  const clearAll = () => {
    setFilters(emptyFilters())
    setSearch('')
    setActiveUnits(new Set(['inch', 'metric']))
    setActiveTypes(new Set(['SA', 'SPK']))
    setMetalFilter(new Set())
    setSortCol(null)
    resetPage()
  }

  const handleSort = (key) => {
    if (sortCol === key) {
      if (sortDir === 'asc') setSortDir('desc')
      else { setSortCol(null); setSortDir('asc') }
    } else {
      setSortCol(key)
      setSortDir('asc')
    }
    resetPage()
  }

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize))
  const clampedPage = Math.min(page, totalPages)
  const pagedRows = sortedRows.slice((clampedPage - 1) * pageSize, clampedPage * pageSize)

  // ── SA ↔ SPK cross-reference ──────────────────────────────────────────────

  const counterpartMap = useMemo(() => {
    const map = new Map()
    for (const row of SEAL_DATA) {
      map.set(`${row.model}|${row.size}|${row.face}|${row.elastomer}|${row.type}`, row)
    }
    return map
  }, [])

  const findCounterpart = (row) =>
    counterpartMap.get(`${row.model}|${row.size}|${row.face}|${row.elastomer}|${row.type === 'SA' ? 'SPK' : 'SA'}`)

  // ── Bulk selection ─────────────────────────────────────────────────────────

  const rowKey = (row) => `${row.itemNumber}|${row.description}`
  const allPageSelected = pagedRows.length > 0 && pagedRows.every(r => selectedRows.has(rowKey(r)))

  const toggleSelect = (key) => {
    setSelectedRows(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const toggleSelectAll = () => {
    setSelectedRows(prev => {
      const next = new Set(prev)
      if (allPageSelected) {
        pagedRows.forEach(r => next.delete(rowKey(r)))
      } else {
        pagedRows.forEach(r => next.add(rowKey(r)))
      }
      return next
    })
  }

  const addSelectedToQuote = (e) => {
    const rect = e?.currentTarget?.getBoundingClientRect()
    let first = true
    for (const row of sortedRows) {
      if (selectedRows.has(rowKey(row))) {
        const cp = findCounterpart(row)
        onAddToQuote?.({
          name: row.description, code: row.itemNumber, price: row.listPrice, leadTime: row.leadTime, type: row.type,
          counterpart: cp ? { name: cp.description, code: cp.itemNumber, price: cp.listPrice, leadTime: cp.leadTime, type: cp.type } : undefined,
        }, first ? rect : null)
        first = false
      }
    }
    setSelectedRows(new Set())
  }

  return (
    <div className="step-enter">
      {/* Section header */}
      <div className="mb-7">
        <p
          className="text-[10px] font-semibold uppercase mb-2"
          style={{ color: '#6e6e73', letterSpacing: '0.12em' }}
        >
          Product Line
        </p>
        <h2 className="text-[28px] font-bold text-brand-black tracking-tight leading-tight">Mechanical Seals</h2>
        <p className="text-[14px] mt-1.5" style={{ color: '#6e6e73' }}>
          Split seal price list — 442, 442C, and 442HP models.
        </p>
      </div>

      {/* Filter card */}
      <div
        className="rounded-2xl p-5 mb-4 flex flex-col gap-4"
        style={{
          background: 'white',
          border: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
        }}
      >
        {/* Row 1: Type + Units toggles */}
        <div className="flex flex-wrap gap-5 items-end">
          {/* Type segmented control */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-semibold uppercase" style={{ color: '#6e6e73', letterSpacing: '0.1em' }}>Product Type</label>
            <div
              className="flex p-0.5 gap-0.5 rounded-[10px]"
              style={{ background: 'rgba(0,0,0,0.06)' }}
            >
              {ALL_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => toggleType(type)}
                  className="px-3 py-1.5 rounded-[8px] text-[12px] font-medium transition-all focus:outline-none flex items-center gap-1.5"
                  style={{
                    background: activeTypes.has(type) ? '#c8102e' : 'transparent',
                    color: activeTypes.has(type) ? 'white' : '#6e6e73',
                    boxShadow: activeTypes.has(type) ? '0 1px 4px rgba(200,16,46,0.3)' : 'none',
                  }}
                >
                  {TYPE_LABELS[type]}
                  <span
                    className="text-[10px] font-semibold tabular-nums"
                    style={{ opacity: activeTypes.has(type) ? 0.65 : 0.5 }}
                  >
                    {typeCounts[type].toLocaleString()}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Units segmented control */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-semibold uppercase" style={{ color: '#6e6e73', letterSpacing: '0.1em' }}>Units</label>
            <div
              className="flex p-0.5 gap-0.5 rounded-[10px]"
              style={{ background: 'rgba(0,0,0,0.06)' }}
            >
              {ALL_UNITS.map(unit => (
                <button
                  key={unit}
                  onClick={() => toggleUnit(unit)}
                  className="px-3.5 py-1.5 rounded-[8px] text-[12px] font-medium transition-all focus:outline-none"
                  style={{
                    background: activeUnits.has(unit) ? '#c8102e' : 'transparent',
                    color: activeUnits.has(unit) ? 'white' : '#6e6e73',
                    boxShadow: activeUnits.has(unit) ? '0 1px 4px rgba(200,16,46,0.3)' : 'none',
                  }}
                >
                  {unit === 'inch' ? 'Inch' : 'Metric'}
                </button>
              ))}
            </div>
          </div>

          {isFiltered && (
            <button
              onClick={clearAll}
              className="text-[12px] font-medium flex items-center gap-1 self-end ml-auto transition-opacity hover:opacity-70"
              style={{ color: '#c8102e' }}
            >
              Clear all
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }} />

        {/* Row 2: Multi-select filters */}
        <div className="flex flex-wrap gap-3 items-end">
          {FILTER_DEFS.map(({ key, label, optionLabel }) => (
            <MultiSelect
              key={key}
              label={label}
              options={optionsFor[key] ?? []}
              selected={filters[key]}
              onChange={val => setFilter(key, val)}
              optionLabel={optionLabel}
            />
          ))}
          <MultiSelect
            label="Metals"
            options={ALL_METALS}
            selected={metalFilter}
            onChange={val => { setMetalFilter(val); resetPage() }}
            optionLabel={v => v}
          />
        </div>

        <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }} />

        {/* Row 3: Search */}
        <div className="relative">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: 'rgba(0,0,0,0.3)' }}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); resetPage() }}
            placeholder="Search item number or description — use * as wildcard (e.g. 442*RSC/CB*EP)"
            className="w-full text-[13px] pl-10 pr-9 py-2.5 rounded-[10px] focus:outline-none focus:ring-2 transition-all"
            style={{
              background: 'rgba(0,0,0,0.04)',
              border: search ? '1px solid rgba(200,16,46,0.3)' : '1px solid rgba(0,0,0,0.08)',
              color: '#1c1c1e',
              focusRingColor: 'rgba(200,16,46,0.2)',
            }}
          />
          {search && (
            <button
              onClick={() => { setSearch(''); resetPage() }}
              className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-60"
              style={{ color: '#6e6e73' }}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Results bar */}
      <div className="flex items-center justify-between mb-2.5 px-1 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className="text-[12px]" style={{ color: '#6e6e73' }}>
            <span className="font-semibold text-brand-black">{visibleRows.length.toLocaleString()}</span>
            {' '}{visibleRows.length === 1 ? 'result' : 'results'}
            {isFiltered && (
              <span style={{ color: 'rgba(0,0,0,0.3)' }}> of {SEAL_DATA.length.toLocaleString()}</span>
            )}
          </span>
          {selectedRows.size > 0 && viewMode === 'table' && (
            <button
              onClick={addSelectedToQuote}
              className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-[8px] transition-all focus:outline-none"
              style={{ background: '#c8102e', color: 'white', boxShadow: '0 1px 4px rgba(200,16,46,0.3)' }}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add {selectedRows.size} to Quote
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          {/* View mode toggle */}
          <div
            className="flex p-0.5 gap-0.5 rounded-[8px]"
            style={{ background: 'rgba(0,0,0,0.06)' }}
          >
            <button
              onClick={() => setViewMode('table')}
              className="px-2.5 py-1 rounded-[6px] text-[11px] font-medium transition-all focus:outline-none flex items-center gap-1"
              style={{
                background: viewMode === 'table' ? 'white' : 'transparent',
                color: viewMode === 'table' ? '#1c1c1e' : '#6e6e73',
                boxShadow: viewMode === 'table' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
              title="Table view"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Table
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              className="px-2.5 py-1 rounded-[6px] text-[11px] font-medium transition-all focus:outline-none flex items-center gap-1"
              style={{
                background: viewMode === 'matrix' ? 'white' : 'transparent',
                color: viewMode === 'matrix' ? '#1c1c1e' : '#6e6e73',
                boxShadow: viewMode === 'matrix' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
              title="Comparison matrix"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M10 3v18M14 3v18" />
              </svg>
              Compare
            </button>
          </div>

          <ExportButton rows={visibleRows} />
          <div className="flex items-center gap-1.5">
          <span className="text-[11px]" style={{ color: '#6e6e73' }}>Show</span>
          {[25, 50, 100].map(n => (
            <button
              key={n}
              onClick={() => { setPageSize(n); setPage(1) }}
              className="text-[11px] px-2.5 py-1 rounded-[7px] font-medium transition-all focus:outline-none"
              style={{
                background: pageSize === n ? '#c8102e' : 'rgba(0,0,0,0.05)',
                color: pageSize === n ? 'white' : '#6e6e73',
                border: pageSize === n ? '1px solid transparent' : '1px solid rgba(0,0,0,0.08)',
              }}
            >
              {n}
            </button>
          ))}
          </div>
        </div>
      </div>

      {/* Content area */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'white',
          border: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
        }}
      >
        {viewMode === 'matrix' ? (
          <ComparisonMatrix rows={visibleRows} onAddToQuote={onAddToQuote} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', background: 'rgba(0,0,0,0.02)' }}>
                    <th className="w-[44px] py-3 px-3 text-center">
                      <button
                        onClick={toggleSelectAll}
                        className="w-4 h-4 rounded flex items-center justify-center mx-auto"
                        style={{
                          border: allPageSelected ? 'none' : '1.5px solid rgba(0,0,0,0.22)',
                          background: allPageSelected ? '#c8102e' : 'transparent',
                        }}
                        title={allPageSelected ? 'Deselect all on page' : 'Select all on page'}
                      >
                        {allPageSelected && (
                          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    </th>
                    {SORT_KEYS.map(({ key, label, align, width }) => (
                      <th
                        key={key}
                        onClick={() => handleSort(key)}
                        className={`text-${align} py-3 ${key === 'itemNumber' || key === 'listPrice' ? 'px-5' : 'px-4'} font-semibold uppercase ${width} cursor-pointer select-none transition-colors`}
                        style={{ fontSize: '10px', color: sortCol === key ? '#c8102e' : '#6e6e73', letterSpacing: '0.1em' }}
                        onMouseEnter={e => { if (sortCol !== key) e.currentTarget.style.color = '#1c1c1e' }}
                        onMouseLeave={e => { if (sortCol !== key) e.currentTarget.style.color = '#6e6e73' }}
                      >
                        {label}
                        <SortIcon dir={sortCol === key ? sortDir : null} />
                      </th>
                    ))}
                    <th className="w-[80px]" />
                  </tr>
                </thead>
                <tbody>
                  {sortedRows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-16 text-center text-[13px]" style={{ color: '#6e6e73' }}>
                        No items match the selected filters.
                      </td>
                    </tr>
                  ) : (
                    pagedRows.map((row, i) => {
                      const key = rowKey(row)
                      const checked = selectedRows.has(key)
                      const counterpart = findCounterpart(row)
                      return (
                        <tr
                          key={`${row.itemNumber}-${i}`}
                          className="transition-colors group"
                          style={{
                            borderTop: i === 0 ? 'none' : '1px solid rgba(0,0,0,0.04)',
                            background: checked ? 'rgba(200,16,46,0.03)' : 'transparent',
                          }}
                          onMouseEnter={e => { if (!checked) e.currentTarget.style.background = 'rgba(242,242,247,0.7)' }}
                          onMouseLeave={e => { e.currentTarget.style.background = checked ? 'rgba(200,16,46,0.03)' : 'transparent' }}
                        >
                          <td className="py-3 px-3 text-center">
                            <button
                              onClick={() => toggleSelect(key)}
                              className="w-4 h-4 rounded flex items-center justify-center mx-auto"
                              style={{
                                border: checked ? 'none' : '1.5px solid rgba(0,0,0,0.22)',
                                background: checked ? '#c8102e' : 'transparent',
                              }}
                            >
                              {checked && (
                                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </button>
                          </td>
                          <td className="py-3 px-5 font-mono text-[11px] font-medium whitespace-nowrap" style={{ color: '#1c1c1e' }}>{row.itemNumber}</td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span
                              className="text-[11px] font-semibold px-2 py-0.5 rounded-md"
                              style={{ background: 'rgba(200,16,46,0.07)', color: '#c8102e' }}
                            >
                              {row.model}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-[13px]" style={{ color: '#1c1c1e' }}>
                            {row.description}
                            <span
                              className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-semibold"
                              style={{ background: 'rgba(0,0,0,0.05)', color: '#6e6e73' }}
                            >
                              {TYPE_LABELS[row.type] ?? row.type}
                            </span>
                          </td>
                          <td className="py-3 px-5 text-right text-[13px] font-semibold tabular-nums whitespace-nowrap" style={{ color: '#1c1c1e' }}>
                            {formatPrice(row.listPrice)}
                          </td>
                          <td className="py-3 px-4 text-right text-[13px] tabular-nums whitespace-nowrap" style={{ color: '#6e6e73' }}>
                            {row.leadTime != null ? `${row.leadTime}d` : '—'}
                          </td>
                          <td className="py-3 px-3">
                            <button
                              onClick={(e) => onAddToQuote?.({
                                name: row.description, code: row.itemNumber, price: row.listPrice, leadTime: row.leadTime, type: row.type,
                                counterpart: counterpart ? { name: counterpart.description, code: counterpart.itemNumber, price: counterpart.listPrice, leadTime: counterpart.leadTime, type: counterpart.type } : undefined,
                              }, e.currentTarget.getBoundingClientRect())}
                              className="w-7 h-7 flex items-center justify-center rounded-full transition-all active:scale-90 focus:outline-none"
                              style={{ background: '#c8102e', color: 'white' }}
                              title="Add to quote"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            {totalPages > 1 && (
              <div
                className="px-5 py-3 flex items-center justify-between"
                style={{ borderTop: '1px solid rgba(0,0,0,0.06)', background: 'rgba(0,0,0,0.02)' }}
              >
                <span className="text-[11px]" style={{ color: '#6e6e73' }}>
                  Page {clampedPage} of {totalPages} &mdash; {((clampedPage - 1) * pageSize + 1).toLocaleString()}–{Math.min(clampedPage * pageSize, sortedRows.length).toLocaleString()} of {sortedRows.length.toLocaleString()}
                </span>
                <div className="flex items-center gap-1">
                  {[
                    { label: '«', action: () => setPage(1), disabled: clampedPage === 1 },
                    { label: '‹', action: () => setPage(p => Math.max(1, p - 1)), disabled: clampedPage === 1 },
                    { label: '›', action: () => setPage(p => Math.min(totalPages, p + 1)), disabled: clampedPage === totalPages },
                    { label: '»', action: () => setPage(totalPages), disabled: clampedPage === totalPages },
                  ].map(({ label, action, disabled }) => (
                    <button
                      key={label}
                      onClick={action}
                      disabled={disabled}
                      className="w-7 h-7 flex items-center justify-center rounded-[7px] text-[12px] font-medium transition-all focus:outline-none disabled:opacity-25"
                      style={{
                        background: 'rgba(0,0,0,0.05)',
                        border: '1px solid rgba(0,0,0,0.08)',
                        color: '#1c1c1e',
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
