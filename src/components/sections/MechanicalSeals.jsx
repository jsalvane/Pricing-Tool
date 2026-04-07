import { useState, useMemo, useRef, useEffect } from 'react'
import { SEAL_DATA } from '../../data/sealData'

const TYPE_LABELS = {
  SA:   'Seal Assembly',
  SPK:  'Spare Parts Kit',
}

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

const emptyFilters = () => ({ model: new Set(), size: new Set(), face: new Set(), elastomer: new Set() })

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
          {/* All row */}
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

export default function MechanicalSeals({ onAddToQuote }) {
  const [search, setSearch]           = useState('')
  const [activeUnits, setActiveUnits] = useState(new Set(['inch', 'metric']))
  const [activeTypes, setActiveTypes] = useState(new Set(['SA', 'SPK']))
  const [filters, setFilters]         = useState(emptyFilters())
  const [page, setPage]               = useState(1)
  const [pageSize, setPageSize]       = useState(25)

  const resetPage = () => setPage(1)

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

  const typeCounts = useMemo(() => {
    const counts = { SA: 0, SPK: 0 }
    for (const row of visibleRows) if (row.type in counts) counts[row.type]++
    return counts
  }, [visibleRows])

  const isFiltered = Object.values(filters).some(s => s.size > 0) || search ||
    activeUnits.size < 2 || activeTypes.size < 2

  const clearAll = () => {
    setFilters(emptyFilters())
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
            <label className="text-[10px] font-semibold uppercase" style={{ color: '#6e6e73', letterSpacing: '0.1em' }}>Type</label>
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
      <div className="flex items-center justify-between mb-2.5 px-1">
        <span className="text-[12px]" style={{ color: '#6e6e73' }}>
          <span className="font-semibold text-brand-black">{visibleRows.length.toLocaleString()}</span>
          {' '}{visibleRows.length === 1 ? 'result' : 'results'}
          {isFiltered && (
            <span style={{ color: 'rgba(0,0,0,0.3)' }}> of {SEAL_DATA.length.toLocaleString()}</span>
          )}
        </span>
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

      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'white',
          border: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', background: 'rgba(0,0,0,0.02)' }}>
                <th className="text-left py-3 px-5 font-semibold uppercase w-[130px]" style={{ fontSize: '10px', color: '#6e6e73', letterSpacing: '0.1em' }}>Item Number</th>
                <th className="text-left py-3 px-4 font-semibold uppercase" style={{ fontSize: '10px', color: '#6e6e73', letterSpacing: '0.1em' }}>Description</th>
                <th className="text-right py-3 px-5 font-semibold uppercase w-[110px]" style={{ fontSize: '10px', color: '#6e6e73', letterSpacing: '0.1em' }}>List Price</th>
                <th className="w-[52px]" />
              </tr>
            </thead>
            <tbody>
              {visibleRows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-[13px]" style={{ color: '#6e6e73' }}>
                    No items match the selected filters.
                  </td>
                </tr>
              ) : (
                pagedRows.map((row, i) => (
                  <tr
                    key={`${row.itemNumber}-${i}`}
                    className="transition-colors group"
                    style={{ borderTop: i === 0 ? 'none' : '1px solid rgba(0,0,0,0.04)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(242,242,247,0.7)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td className="py-3 px-5 font-mono text-[11px] font-medium whitespace-nowrap" style={{ color: '#1c1c1e' }}>{row.itemNumber}</td>
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
                    <td className="py-3 px-3">
                      <button
                        onClick={() => onAddToQuote?.({ name: row.description, code: row.itemNumber, price: row.listPrice })}
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
                ))
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
              Page {clampedPage} of {totalPages} &mdash; {((clampedPage - 1) * pageSize + 1).toLocaleString()}–{Math.min(clampedPage * pageSize, visibleRows.length).toLocaleString()} of {visibleRows.length.toLocaleString()}
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
      </div>
    </div>
  )
}
