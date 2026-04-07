const PRODUCTS = [
  {
    id: 'cartridge',
    name: 'Cartridge Seals',
    code: '442',
    description: 'Pre-set, pre-assembled cartridge seals for easy installation. Reduces seal installation errors.',
    tags: ['Single', 'Double', 'Tandem'],
    specs: 'Sizes: 1"– 4" shaft · Up to 400°F · Up to 200 PSI',
  },
  {
    id: 'component',
    name: 'Component Seals',
    code: '155 / 155C',
    description: 'Individual seal components for custom assembly. Ideal for retrofit applications.',
    tags: ['Balanced', 'Unbalanced'],
    specs: 'Sizes: 0.5"– 6" shaft · Up to 500°F',
  },
  {
    id: 'split',
    name: 'Split Seals',
    code: '442 Split',
    description: 'Two-piece design for in-place installation without equipment disassembly.',
    tags: ['Single', 'Cartridge'],
    specs: 'Sizes: 1.5"– 6" shaft · No dismantling required',
  },
  {
    id: 'agitator',
    name: 'Agitator Seals',
    code: '280',
    description: 'Designed for top-entry and side-entry agitator/mixer applications.',
    tags: ['Double', 'High-pressure'],
    specs: 'Sizes: 1.5"– 6" shaft · Up to 300 PSI',
  },
  {
    id: 'hightemp',
    name: 'High-Temperature Seals',
    code: 'HT Series',
    description: 'Engineered for extreme temperature applications in chemical and refinery services.',
    tags: ['Metal bellows', 'API 682'],
    specs: 'Up to 750°F · API 682 Category 1/2/3',
  },
  {
    id: 'dryrunning',
    name: 'Dry-Running Gas Seals',
    code: 'CGSC',
    description: 'Non-contacting gas-lubricated seals for compressor applications.',
    tags: ['Compressor', 'Gas-lubricated'],
    specs: 'High-speed · Low emissions · API 682',
  },
]

export default function MechanicalSeals() {
  return (
    <div className="step-enter">
      {/* Section hero */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-cool-gray mb-2">Product Line</p>
            <h2 className="text-2xl font-bold text-brand-black tracking-tight">Mechanical Seals</h2>
            <p className="text-sm text-cool-gray mt-1.5 max-w-lg">
              Industry-leading mechanical seals for pumps, mixers, compressors, and rotating equipment across all industries.
            </p>
          </div>
          {/* Mini specs strip */}
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

        {/* Quick-filter pills */}
        <div className="flex flex-wrap gap-2 mt-5">
          {['All', 'Single', 'Double', 'Cartridge', 'Component', 'API 682', 'High-Temp'].map(tag => (
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
            {/* Card header */}
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
                  <circle cx="12" cy="12" r="9" />
                  <circle cx="12" cy="12" r="4" />
                </svg>
              </div>
            </div>

            <p className="text-[11px] text-cool-gray leading-relaxed mb-3">{product.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-3">
              {product.tags.map(tag => (
                <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-gray-100 bg-gray-50 text-cool-gray">
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-[10px] text-gray-400 font-mono">{product.specs}</p>

            {/* Configure arrow */}
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
