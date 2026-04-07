const PRODUCTS = [
  {
    id: 'braided',
    name: 'Braided Packing',
    code: '1700 Series',
    description: 'Multi-service braided packing for valves, pumps, and rotating equipment.',
    tags: ['General service', 'Valve', 'Pump'],
    specs: 'pH 2–12 · Up to 650°F · Up to 3,000 PSI',
  },
  {
    id: 'dieformed',
    name: 'Die-Formed Rings',
    code: '1785 / 1790',
    description: 'Pre-formed compression packing rings for precise fit and consistent sealing.',
    tags: ['Pre-formed', 'Compression'],
    specs: 'Exact cross-section sizing · Valve service',
  },
  {
    id: 'ptfe',
    name: 'PTFE Packing',
    code: '1630 Series',
    description: 'Expanded PTFE packing offering chemically inert sealing across wide pH ranges.',
    tags: ['Chemical service', 'FDA', 'PTFE'],
    specs: 'pH 0–14 · -450°F to 550°F · CIP/SIP',
  },
  {
    id: 'graphite',
    name: 'Graphite Packing',
    code: '1620 Series',
    description: 'Flexible graphite packing for high-temperature and high-pressure applications.',
    tags: ['High-temp', 'High-pressure', 'Graphite'],
    specs: 'Up to 1,200°F · Up to 5,000 PSI · Fugitive emission rated',
  },
  {
    id: 'metallic',
    name: 'Metallic Packing',
    code: '1660 Series',
    description: 'Metal-based packing for extreme service conditions in valves and expansion joints.',
    tags: ['Metal', 'Extreme service'],
    specs: 'Up to 2,500°F · Steam and hot gases',
  },
  {
    id: 'carbon',
    name: 'Carbon Fiber Packing',
    code: '1640 Series',
    description: 'High-strength carbon fiber packing for demanding thermal and chemical environments.',
    tags: ['Carbon fiber', 'Thermal'],
    specs: 'Up to 900°F · Chemical resistant',
  },
]

export default function MP() {
  return (
    <div className="step-enter">
      {/* Section hero */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-cool-gray mb-2">Product Line</p>
            <h2 className="text-2xl font-bold text-brand-black tracking-tight">Metallic Packing</h2>
            <p className="text-sm text-cool-gray mt-1.5 max-w-lg">
              Compression packing solutions for valves, pumps, and rotating equipment across all process industries.
            </p>
          </div>
        </div>

        {/* Quick-filter pills */}
        <div className="flex flex-wrap gap-2 mt-5">
          {['All', 'Valve', 'Pump', 'PTFE', 'Graphite', 'High-Temp', 'FDA'].map(tag => (
            <button
              key={tag}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold border transition-all
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/30
                ${tag === 'All'
                  ? 'bg-brand-accent border-brand-accent text-white'
                  : 'border-gray-200 text-cool-gray hover:border-gray-300 hover:text-brand-black bg-white'
                }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {PRODUCTS.map((product, i) => (
          <button
            key={product.id}
            className="card-enter bg-white rounded-lg border border-gray-100 shadow-sm p-5 text-left
                       hover:border-brand-accent/30 hover:shadow-md transition-all active:scale-[0.99]
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/30
                       group"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h3 className="text-sm font-semibold text-brand-black group-hover:text-brand-accent transition-colors">
                  {product.name}
                </h3>
                <span className="text-[10px] font-mono font-semibold text-cool-gray bg-gray-100 rounded px-1.5 py-0.5 mt-1 inline-block">
                  {product.code}
                </span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-brand-accent-light border border-brand-accent/10 flex items-center justify-center shrink-0 group-hover:bg-brand-accent group-hover:border-brand-accent transition-all">
                <svg className="w-4 h-4 text-brand-accent group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <rect x="3" y="6" width="18" height="4" rx="1" />
                  <rect x="3" y="11" width="18" height="4" rx="1" />
                  <rect x="3" y="16" width="18" height="4" rx="1" />
                </svg>
              </div>
            </div>

            <p className="text-[11px] text-cool-gray leading-relaxed mb-3">{product.description}</p>

            <div className="flex flex-wrap gap-1 mb-3">
              {product.tags.map(tag => (
                <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-gray-100 bg-gray-50 text-cool-gray">
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-[10px] text-gray-400 font-mono">{product.specs}</p>

            <div className="flex items-center justify-end mt-4 pt-3 border-t border-gray-50">
              <span className="text-[11px] font-semibold text-brand-accent flex items-center gap-1 group-hover:gap-2 transition-all">
                Configure & Price
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
