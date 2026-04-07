const PRODUCTS = [
  {
    id: 'compressor',
    name: 'Compressor Oils',
    code: '615 / 620 Series',
    description: 'Synthetic and mineral-based compressor lubricants for rotary screw, reciprocating, and centrifugal compressors.',
    tags: ['Compressor', 'Synthetic', 'Rotary screw'],
    specs: 'ISO VG 32–320 · Up to 400°F · Long drain intervals',
  },
  {
    id: 'gear',
    name: 'Gear Lubricants',
    code: '605 Series',
    description: 'Heavy-duty gear oils for enclosed and open gear systems in demanding industrial applications.',
    tags: ['Gear', 'EP additive', 'Enclosed/Open'],
    specs: 'ISO VG 68–1500 · AGMA rated · Extreme pressure',
  },
  {
    id: 'bearing',
    name: 'Bearing Greases',
    code: '725 / 730 Series',
    description: 'High-performance greases for rolling element bearings across wide temperature ranges.',
    tags: ['Grease', 'Bearing', 'High-temp'],
    specs: 'NLGI 1–3 · -60°F to 450°F · Water resistant',
  },
  {
    id: 'chain',
    name: 'Chain & Wire Rope',
    code: '640 Series',
    description: 'Penetrating lubricants for roller chains, conveyor chains, and wire rope applications.',
    tags: ['Chain', 'Wire rope', 'Penetrating'],
    specs: 'NSF H1 grades available · Food-safe options',
  },
  {
    id: 'slideway',
    name: 'Slideway Oils',
    code: '660 Series',
    description: 'Machine tool slideway lubricants providing stick-slip elimination and precision positioning.',
    tags: ['Slideway', 'Machine tool', 'Precision'],
    specs: 'ISO VG 32–220 · Stick-slip free · Tackiness additive',
  },
  {
    id: 'cleaner',
    name: 'Specialty Cleaners',
    code: '410 / 415 Series',
    description: 'Industrial cleaners and degreasers formulated for use with lubricated equipment.',
    tags: ['Cleaner', 'Degreaser', 'Industrial'],
    specs: 'Solvent-based and water-based options · VOC compliant',
  },
]

export default function IL() {
  return (
    <div className="step-enter">
      <div className="mb-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-cool-gray mb-2">Product Line</p>
            <h2 className="text-2xl font-bold text-brand-black tracking-tight">Industrial Lubricants</h2>
            <p className="text-sm text-cool-gray mt-1.5 max-w-lg">
              High-performance lubricants and specialty fluids engineered for demanding industrial equipment and processes.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-5">
          {['All', 'Compressor', 'Gear', 'Bearing', 'Synthetic', 'NSF H1', 'Food-safe'].map(tag => (
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
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
