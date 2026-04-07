import { useState } from 'react'

export default function SummaryPanel({ activeSection, lineItems = [], onUpdateQty }) {
  const [open, setOpen] = useState(true)
  const total = lineItems.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 1), 0)

  return (
    <div className="hidden lg:flex shrink-0 print:hidden relative">
      {/* Toggle tab */}
      <button
        onClick={() => setOpen(o => !o)}
        className="absolute -left-5 top-1/2 -translate-y-1/2 z-10
                   w-5 h-12 flex items-center justify-center
                   transition-colors focus-visible:outline-none"
        style={{
          background: '#1c1c1e',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRight: 'none',
          borderRadius: '6px 0 0 6px',
          color: 'rgba(255,255,255,0.4)',
        }}
        aria-label={open ? 'Hide quote summary' : 'Show quote summary'}
      >
        <svg
          className={`w-3 h-3 transition-transform duration-300 ${open ? 'rotate-0' : 'rotate-180'}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Panel */}
      <aside
        className={`flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${open ? 'w-72' : 'w-0'}`}
        style={{ background: '#1c1c1e' }}
      >
        {/* Header */}
        <div
          className="px-4 pt-5 pb-3 shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Quote Summary
          </p>
        </div>

        {/* Line items */}
        <div className="flex-1 overflow-y-auto px-3 py-3">
          {lineItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <svg className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.2)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-[12px] font-medium whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.5)' }}>No items yet</p>
                <p className="text-[11px] mt-0.5 whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.25)' }}>
                  Add a product to<br />build your quote
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-0.5">
              {lineItems.map((item, i) => (
                <div
                  key={i}
                  className="w-full py-2.5 px-2.5 rounded-xl transition-all"
                  style={{ background: 'transparent' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-medium truncate leading-tight whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.85)' }}>{item.name}</p>
                      {item.code && (
                        <p className="text-[10px] font-mono mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{item.code}</p>
                      )}
                    </div>
                    <p className="text-[12px] font-semibold tabular-nums shrink-0" style={{ color: 'rgba(255,255,255,0.9)' }}>
                      ${((item.price || 0) * (item.qty || 1)).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onUpdateQty?.(i, -1)}
                      className="w-5 h-5 flex items-center justify-center rounded-md transition-all"
                      style={{
                        background: 'rgba(255,255,255,0.07)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.5)',
                      }}
                      title={item.qty === 1 ? 'Remove' : 'Decrease quantity'}
                    >
                      {item.qty === 1
                        ? <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        : <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
                      }
                    </button>
                    <span className="text-[11px] font-semibold tabular-nums w-5 text-center" style={{ color: 'rgba(255,255,255,0.8)' }}>{item.qty}</span>
                    <button
                      onClick={() => onUpdateQty?.(i, 1)}
                      className="w-5 h-5 flex items-center justify-center rounded-md transition-all"
                      style={{
                        background: 'rgba(255,255,255,0.07)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.5)',
                      }}
                      title="Increase quantity"
                    >
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Totals */}
        <div
          className="px-4 py-4 shrink-0"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,0,0,0.2)' }}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.35)' }}>Subtotal</span>
              <span className="text-[11px] tabular-nums" style={{ color: 'rgba(255,255,255,0.35)' }}>
                {total > 0 ? `$${total.toFixed(2)}` : '—'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.35)' }}>Discount</span>
              <span className="text-[11px] tabular-nums" style={{ color: 'rgba(255,255,255,0.35)' }}>—</span>
            </div>
            <div
              className="pt-3 mt-1 flex items-center justify-between"
              style={{ borderTop: '1px solid rgba(200,16,46,0.4)' }}
            >
              <span className="text-[12px] font-semibold whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.7)' }}>Total</span>
              <span className="text-[20px] font-bold tabular-nums text-white">
                {total > 0 ? `$${total.toFixed(2)}` : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="px-3 py-3 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            className="w-full inline-flex items-center justify-center gap-2 py-3 text-[13px] font-semibold
                       transition-all active:scale-[0.99] focus-visible:outline-none
                       disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap rounded-xl"
            style={{
              background: lineItems.length > 0 ? '#c8102e' : 'rgba(255,255,255,0.08)',
              color: lineItems.length > 0 ? 'white' : 'rgba(255,255,255,0.3)',
            }}
            disabled={lineItems.length === 0}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Generate Quote
          </button>
        </div>
      </aside>
    </div>
  )
}
