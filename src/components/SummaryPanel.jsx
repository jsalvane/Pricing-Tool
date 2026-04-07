export default function SummaryPanel({ activeSection, lineItems = [] }) {
  const total = lineItems.reduce((sum, item) => sum + (item.price || 0), 0)

  return (
    <aside className="w-72 shrink-0 hidden lg:flex flex-col border-l border-gray-100 bg-white print:hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-brand-black border-b border-gray-800">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-white/70">
          Quote Summary
        </p>
      </div>

      {/* Line items */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        {lineItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
            <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-brand-black">No items yet</p>
              <p className="text-[11px] text-cool-gray mt-0.5">Configure a product to<br />build your quote</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-0.5">
            {lineItems.map((item, i) => (
              <div
                key={i}
                className="w-full flex items-center justify-between py-1.5 px-2.5 rounded text-left transition-all hover:bg-gray-50"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold text-brand-black truncate">{item.name}</p>
                  {item.code && (
                    <p className="text-[10px] font-mono text-cool-gray mt-0.5">{item.code}</p>
                  )}
                </div>
                <p className="text-[11px] font-semibold text-brand-black tabular-nums ml-2 shrink-0">
                  ${item.price?.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Price totals */}
      <div className="px-3 py-3 border-t border-gray-100 bg-gray-50/50">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-cool-gray">Subtotal</span>
            <span className="text-[11px] text-cool-gray tabular-nums">
              {total > 0 ? `$${total.toFixed(2)}` : '—'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-cool-gray">Discount</span>
            <span className="text-[11px] text-cool-gray tabular-nums">—</span>
          </div>
          <div className="border-t-2 border-brand-accent pt-2 mt-1 flex items-center justify-between">
            <span className="text-xs font-semibold text-brand-black">Total</span>
            <span className="text-lg font-bold text-brand-black tabular-nums">
              {total > 0 ? `$${total.toFixed(2)}` : '—'}
            </span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-3 py-3 border-t border-gray-100">
        <button
          className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-action px-4 py-2.5
                     text-sm font-semibold text-brand-black transition-all
                     hover:bg-action-dark active:scale-[0.99]
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action/50
                     disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={lineItems.length === 0}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Generate Quote
        </button>
      </div>
    </aside>
  )
}
