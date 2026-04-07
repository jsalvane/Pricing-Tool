import { useState, useMemo } from 'react'
import { SEAL_DATA } from '../../data/sealData'

const TYPE_LABELS = {
  SA:   'Seal Assembly',
  SPK:  'Spare Parts Kit',
}

// Dropdowns (model, size, face, elastomer) — type is now a toggle
const FILTER_DEFS = [
  { key: 'model',     label: 'Model',     optionLabel: v => v },
  { key: 'size',      label: 'Size',      optionLabel: v => formatSize(v) },
  { key: 'face',      label: 'Face',      optionLabel: v => v },
  { key: 'elastomer', label: 'Elastomer', optionLabel: v => v },
]

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

const ALL_UNITS = ['inch', 'metric']
const ALL_TYPES = ['SA', 'SPK']

export default function MechanicalSeals({ onAddToQuote }) {
  const [search, setSearch]           = useState('')
  const [activeUnits, setActiveUnits] = useState(new Set(['inch', 'metric']))
  const [activeTypes, setActiveTypes] = useState(new Set(['SA', 'SPK']))
  const [filters, setFilters]         = useState({ model: '', size: '', face: '', elastomer: '' })
  const [page, setPage]               = useState(1)
  const [pageSize, setPageSize]       = useState(25)

  const resetPage = () => setPage(1)

  const toggleUnit = unit => {
    setActiveUnits(prev => {
      if (prev.size === 1 && prev.has(unit)) return prev
      const next = new Set(prev)
      next.has(unit) ? next.delete(unit) : next.add(unit)
      setFilters(f => ({ ...f, size: '' }))
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
          if (!filters[f.key]) return true
          return String(row[f.key]) === filters[f.key]
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
        if (filters[key] && String(row[key]) !== filters[key]) return false
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

  const isFiltered = Object.values(filters).some(Boolean) || search ||
    activeUnits.size < 2 || activeTypes.size < 2

  const clearAll = () => {
    setFilters({ model: '', size: '', face: '', elastomer: '' })
    setSearch('')
    setActiveUnits(new Set(['inch', 'metric']))
    setActiveTypes(new Set(['SA', 'SPK']))
    resetPage()
  }

  const totalPages = Math.max(1, Math.ceil(visibleRows.length / pageSize))
  const clampedPage = Math.min(page, totalPages)
  const pagedRows = visibleRows.slice((clampedPage - 1) * pageSize, clampedPage * pageSize)

  return (
    <div className="step-enter">
      {/* Section header */}
      <div className="mb-6">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-cool-gray mb-2">Product Line</p>
        <h2 className="text-2xl font-bold text-brand-black tracking-tight">Mechanical Seals</h2>
        <p className="text-sm text-cool-gray mt-1.5">Split seal price list — 442, 442C, and 442HP models.</p>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 mb-4 flex flex-col gap-3">

        {/* Row 1: Type + Units toggles */}
        <div className="flex flex-wrap gap-4 items-end">
          {/* Type toggle */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-cool-gray">Type</label>
            <div className="flex rounded border border-gray-200 overflow-hidden text-xs font-semibold">
              {ALL_TYPES.map((type, i) => (
                <button
                  key={type}
                  onClick={() => toggleType(type)}
                  className={`px-3 py-1.5 transition-colors focus:outline-none
                    ${i > 0 ? 'border-l border-gray-200' : ''}
                    ${activeTypes.has(type) ? 'bg-brand-accent text-white' : 'bg-white text-cool-gray hover:bg-gray-50'}`}
                >
                  {TYPE_LABELS[type]}
                </button>
              ))}
            </div>
          </div>

          {/* Units toggle */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-cool-gray">Units</label>
            <div className="flex rounded border border-gray-200 overflow-hidden text-xs font-semibold">
              {ALL_UNITS.map((unit, i) => (
                <button
                  key={unit}
                  onClick={() => toggleUnit(unit)}
                  className={`px-3 py-1.5 transition-colors focus:outline-none
                    ${i > 0 ? 'border-l border-gray-200' : ''}
                    ${activeUnits.has(unit) ? 'bg-brand-accent text-white' : 'bg-white text-cool-gray hover:bg-gray-50'}`}
                >
                  {unit === 'inch' ? 'Inch' : 'Metric'}
                </button>
              ))}
            </div>
          </div>

          {/* Clear all — pinned to row 1 right */}
          {isFiltered && (
            <button
              onClick={clearAll}
              className="text-[11px] font-semibold text-brand-accent hover:text-brand-accent-dark flex items-center gap-1 self-end ml-auto"
            >
              Clear all
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Row 2: Dropdown filters */}
        <div className="flex flex-wrap gap-3 items-end">
          {FILTER_DEFS.map(({ key, label, optionLabel }) => (
            <div key={key} className="flex flex-col gap-1 min-w-[110px]">
              <label className="text-[10px] font-semibold uppercase tracking-widest text-cool-gray">{label}</label>
              <select
                value={filters[key]}
                onChange={e => setFilter(key, e.target.value)}
                className={`text-xs rounded border px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/30 transition-colors cursor-pointer
                  ${filters[key] ? 'border-brand-accent text-brand-black font-semibold' : 'border-gray-200 text-cool-gray'}`}
              >
                <option value="">All</option>
                {optionsFor[key]?.map(v => (
                  <option key={v} value={v}>{optionLabel(v)}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Row 3: Search */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search item number or description — use * as wildcard (e.g. 442*RSC/CB*EP)"
            className="w-full text-xs pl-8 pr-8 py-2 rounded border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent transition-colors placeholder:text-gray-300"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-black">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

      </div>

      {/* Results count + page size */}
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-[11px] text-cool-gray">
          {visibleRows.length.toLocaleString()} {visibleRows.length === 1 ? 'result' : 'results'}
          {isFiltered && <span className="text-gray-400"> of {SEAL_DATA.length.toLocaleString()} total</span>}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-cool-gray">Show</span>
          {[25, 50, 100].map(n => (
            <button
              key={n}
              onClick={() => { setPageSize(n); setPage(1) }}
              className={`text-[11px] px-2 py-0.5 rounded border transition-colors focus:outline-none
                ${pageSize === n ? 'bg-brand-accent text-white border-brand-accent font-semibold' : 'border-gray-200 text-cool-gray hover:border-brand-accent hover:text-brand-black'}`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left py-2.5 px-4 font-semibold text-cool-gray uppercase tracking-wider text-[10px] w-[130px]">Item Number</th>
                <th className="text-left py-2.5 px-4 font-semibold text-cool-gray uppercase tracking-wider text-[10px]">Description</th>
                <th className="text-right py-2.5 px-4 font-semibold text-cool-gray uppercase tracking-wider text-[10px] w-[100px]">List Price</th>
                <th className="w-[44px]" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {visibleRows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-cool-gray text-xs">
                    No items match the selected filters.
                  </td>
                </tr>
              ) : (
                visibleRows.slice(0, 500).map((row, i) => (
                  <tr key={`${row.itemNumber}-${i}`} className="hover:bg-brand-accent-light/40 transition-colors">
                    <td className="py-2 px-4 font-mono text-[11px] text-brand-black whitespace-nowrap">{row.itemNumber}</td>
                    <td className="py-2 px-4 text-brand-black">
                      {row.description}
                      <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold bg-gray-100 text-cool-gray">
                        {TYPE_LABELS[row.type] ?? row.type}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-right font-semibold text-brand-black tabular-nums whitespace-nowrap">
                      {formatPrice(row.listPrice)}
                    </td>
                    <td className="py-2 px-2">
                      <button
                        onClick={() => onAddToQuote?.({ name: row.description, code: row.itemNumber, price: row.listPrice })}
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-brand-accent text-white hover:bg-brand-accent-dark transition-colors focus:outline-none"
                        title="Add to quote"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {visibleRows.length > 500 && (
          <div className="border-t border-gray-100 px-4 py-2.5 text-[11px] text-cool-gray bg-gray-50 text-center">
            Showing first 500 of {visibleRows.length.toLocaleString()} results — use filters or search to narrow down.
          </div>
        )}
      </div>
    </div>
  )
}
