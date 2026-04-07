const PRODUCTS = [
  {
    id: 'unitized',
    name: 'Unitized Seal Support',
    code: 'USS Series',
    description: 'Pre-engineered seal support systems for API Plan compliance.',
    tags: ['API Plan 52', 'API Plan 53', 'Barrier fluid'],
    specs: 'Plans 52, 53A/B/C · 316 SS construction',
  },
  {
    id: 'flush',
    name: 'Flush & Quench Systems',
    code: 'FQS Series',
    description: 'Clean fluid injection and quench systems for extended seal life.',
    tags: ['Flush', 'Quench', 'API Plan 11/13'],
    specs: 'API Plans 11, 13, 32, 62 · Various materials',
  },
  {
    id: 'coolers',
    name: 'Seal Coolers',
    code: 'SC-100 / SC-200',
    description: 'Heat exchangers for maintaining optimal barrier fluid temperature.',
    tags: ['Heat exchanger', 'Cooling'],
    specs: 'Plate & frame or tube-in-shell · Up to 300 GPH',
  },
  {
    id: 'reservoirs',
    name: 'Barrier Fluid Reservoirs',
    code: 'BFR Series',
    description: 'Pressurized and non-pressurized reservoirs for dual seal support.',
    tags: ['Pressurized', 'Non-pressurized'],
    specs: '2L, 4L, 8L volumes · API 682 compliant',
  },
  {
    id: 'monitoring',
    name: 'Seal Monitoring Panels',
    code: 'SMP Series',
    description: 'Instrumented panels for real-time seal condition monitoring and alarming.',
    tags: ['Monitoring', 'Alarms', 'Instrumentation'],
    specs: 'Pressure, temperature, flow · 4–20 mA output',
  },
  {
    id: 'custom',
    name: 'Custom Engineered Systems',
    code: 'CES',
    description: 'Fully engineered seal support systems for critical and specialty applications.',
    tags: ['Custom', 'Engineered', 'Critical service'],
    specs: 'Full P&ID · FAT included · Field commissioning',
  },
]

export default function EPS() {
  return (
    <div className="step-enter">
      <div className="mb-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-cool-gray mb-2">Product Line</p>
            <h2 className="text-2xl font-bold text-brand-black tracking-tight">EPS</h2>
            <p className="text-sm text-cool-gray mt-1.5 max-w-lg">
              Equipment Protection Systems — engineered seal support, flush plans, and monitoring solutions for extended seal life.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-5">
          {['All', 'API 682', 'Flush', 'Cooling', 'Monitoring', 'Custom'].map(tag => (
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
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
