import { useState, useMemo } from 'react'
import { SEAL_DATA } from '../../data/sealData'

const TYPE_LABELS = {
  SA: 'Seal Assembly',
  SPK: 'Spare Parts Kit',
  COMP: 'Components',
}

const FILTER_DEFS = [
  { key: 'type',      label: 'Type',       optionLabel: v => TYPE_LABELS[v] ?? v },
  { key: 'model',     label: 'Model',      optionLabel: v => v },
  { key: 'size',      label: 'Size',       optionLabel: v => formatSize(v) },
  { key: 'face',      label: 'Face',       optionLabel: v => v },
  { key: 'elastomer', label: 'Elastomer',  optionLabel: v => v },
]

function formatSize(s) {
  const n = parseFloat(s)
  if (n >= 25) return `${Math.round(n)}mm`
  // Round to 3 decimal places to eliminate floating-point noise
  const rounded = Math.round(n * 1000) / 1000
  return `${rounded}"`
}

function formatPrice(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

// Sort sizes numerically
function sortedSizes(vals) {
  return [...vals].sort((a, b) => parseFloat(a) - parseFloat(b))
}

export default function MechanicalSeals() {
  const [search, setSearch]     = useState('')
  const [filters, setFilters]   = useState({ type: '', model: '', size: '', face: '', elastomer: '' })

  // Build cascading filter options: each filter's options are derived from data
  // matching all OTHER currently-set filters (not itself), so choosing one
  // filter narrows the options in the others.
  const optionsFor = useMemo(() => {
    const result = {}
    FILTER_DEFS.forEach(({ key }) => {
      // Apply all filters EXCEPT this one
      const subset = SEAL_DATA.filter(row =>
        FILTER_DEFS.every(f => {
          if (f.key === key) return true         // skip self
          if (!filters[f.key]) return true       // not set
          return String(row[f.key]) === filters[f.key]
        })
      )
      const vals = [...new Set(subset.map(r => String(r[key])))]
      result[key] = key === 'size' ? sortedSizes(vals) : vals.sort()
    })
    return result
  }, [filters])

  const setFilter = (key, val) => {
    setFilters(prev => {
      const next = { ...prev, [key]: prev[key] === val ? '' : val }
      // Clear downstream filters whose current value is no longer valid
      // Rebuild options with the new filter state for dependent keys
      return next
    })
  }

  // Final filtered + searched rows
  const visibleRows = useMemo(() => {
    const q = search.trim().toLowerCase()
    return SEAL_DATA.filter(row => {
      // Apply dropdown filters
      for (const { key } of FILTER_DEFS) {
        if (filters[key] && String(row[key]) !== filters[key]) return false
      }
      // Wildcard search across item number, description
      if (q) {
        const haystack = `${row.itemNumber} ${row.description}`.toLowerCase()
        // Support * as wildcard by splitting on it
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
  }, [filters, search])

  const activeCount = Object.values(filters).filter(Boolean).length

  return (
    <div className="step-enter">
      {/* Section header */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-cool-gray mb-2">Product Line</p>
            <h2 className="text-2xl font-bold text-brand-black tracking-tight">Mechanical Seals</h2>
            <p className="text-sm text-cool-gray mt-1.5 max-w-lg">
              Split seal price list — 442, 442C, and 442HP models.
            </p>
          </div>
          <div className="hidden xl:flex flex-col gap-1.5 shrink-0 text-right">
            <div className="flex items-center gap-2 justify-end">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-cool-gray">API 682</span>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
            </div>
            <div className="flex items-center gap-2 justify-end">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-cool-gray">ISO 21049</span>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 mb-4">
        <div className="flex flex-wrap gap-3 items-end">
          {FILTER_DEFS.map(({ key, label, optionLabel }) => (
            <div key={key} className="flex flex-col gap-1 min-w-[110px]">
              <label className="text-[10px] font-semibold uppercase tracking-widest text-cool-gray">
                {label}
              </label>
              <select
                value={filters[key]}
                onChange={e => setFilter(key, e.target.value)}
                className={`text-xs rounded border px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/30 transition-colors cursor-pointer
                  ${filters[key]
                    ? 'border-brand-accent text-brand-black font-semibold'
                    : 'border-gray-200 text-cool-gray'
                  }`}
              >
                <option value="">All</option>
                {optionsFor[key]?.map(v => (
                  <option key={v} value={v}>{optionLabel(v)}</option>
                ))}
              </select>
            </div>
          ))}

          {/* Search */}
          <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
            <label className="text-[10px] font-semibold uppercase tracking-widest text-cool-gray">
              Search
            </label>
            <div className="relative">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Item #, description… (* wildcard)"
                className="w-full text-xs pl-7 pr-3 py-1.5 rounded border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent transition-colors placeholder:text-gray-300"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-black"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Clear filters */}
          {activeCount > 0 && (
            <button
              onClick={() => setFilters({ type: '', model: '', size: '', face: '', elastomer: '' })}
              className="text-[11px] font-semibold text-brand-accent hover:text-brand-accent-dark flex items-center gap-1 pb-0.5 self-end"
            >
              Clear ({activeCount})
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-[11px] text-cool-gray">
          {visibleRows.length.toLocaleString()} {visibleRows.length === 1 ? 'result' : 'results'}
        </span>
        {(activeCount > 0 || search) && (
          <span className="text-[11px] text-cool-gray">
            of {SEAL_DATA.length.toLocaleString()} total items
          </span>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left py-2.5 px-4 font-semibold text-cool-gray uppercase tracking-wider text-[10px] w-[130px]">
                  Item Number
                </th>
                <th className="text-left py-2.5 px-4 font-semibold text-cool-gray uppercase tracking-wider text-[10px]">
                  Description
                </th>
                <th className="text-right py-2.5 px-4 font-semibold text-cool-gray uppercase tracking-wider text-[10px] w-[100px]">
                  List Price
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {visibleRows.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-cool-gray text-xs">
                    No items match the selected filters.
                  </td>
                </tr>
              ) : (
                visibleRows.slice(0, 500).map((row, i) => (
                  <tr
                    key={`${row.itemNumber}-${i}`}
                    className="hover:bg-brand-accent-light/40 transition-colors"
                  >
                    <td className="py-2 px-4 font-mono text-[11px] text-brand-black whitespace-nowrap">
                      {row.itemNumber}
                    </td>
                    <td className="py-2 px-4 text-brand-black">
                      {row.description}
                      <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold bg-gray-100 text-cool-gray">
                        {TYPE_LABELS[row.type] ?? row.type}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-right font-semibold text-brand-black tabular-nums whitespace-nowrap">
                      {formatPrice(row.listPrice)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Row cap notice */}
        {visibleRows.length > 500 && (
          <div className="border-t border-gray-100 px-4 py-2.5 text-[11px] text-cool-gray bg-gray-50 text-center">
            Showing first 500 of {visibleRows.length.toLocaleString()} results — use filters or search to narrow down.
          </div>
        )}
      </div>
    </div>
  )
}
