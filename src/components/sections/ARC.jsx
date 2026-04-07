const PRODUCTS = [
  {
    id: 'brushable',
    name: 'Brushable Ceramic',
    code: '858',
    description: 'Ceramic-filled polymer for rebuilding worn metal surfaces. Superior hardness and abrasion resistance.',
    tags: ['Ceramic', 'Wear protection', 'Metal rebuild'],
    specs: 'Hardness 70 Shore D · Up to 250°F',
  },
  {
    id: 'flowable',
    name: 'Flowable Ceramic',
    code: '855',
    description: 'Low-viscosity ceramic composite for filling cavities, pits, and complex geometries.',
    tags: ['Ceramic', 'Flowable', 'Pit repair'],
    specs: 'Shore D 85 · Bonds to all metals',
  },
  {
    id: 'carbide',
    name: 'Titanium Carbide Coating',
    code: '891',
    description: 'Titanium carbide-filled epoxy for extreme wear and corrosion environments.',
    tags: ['Titanium carbide', 'Extreme wear', 'Corrosion'],
    specs: 'Service to 300°F · Chemical resistant',
  },
  {
    id: 'underwater',
    name: 'Underwater Repair',
    code: '862',
    description: 'Epoxy compound that cures underwater. Suitable for wet and submerged surface repairs.',
    tags: ['Underwater', 'Wet cure', 'Marine'],
    specs: 'Cures underwater · Bonds to steel, concrete',
  },
  {
    id: 'hightemp',
    name: 'High-Temperature Coating',
    code: '900 Series',
    description: 'Ceramic-reinforced coating system for protection up to 500°F continuous service.',
    tags: ['High-temp', 'Ceramic', 'Thermal'],
    specs: 'Up to 500°F continuous · Up to 750°F peak',
  },
  {
    id: 'novolac',
    name: 'Novolac Lining',
    code: '930',
    description: 'Vinyl ester novolac lining for tank and vessel protection against concentrated acids.',
    tags: ['Novolac', 'Tank lining', 'Acid resistant'],
    specs: 'H2SO4 rated · NSF approved grades available',
  },
]

export default function ARC() {
  return (
    <div className="step-enter">
      <div className="mb-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-cool-gray mb-2">Product Line</p>
            <h2 className="text-2xl font-bold text-brand-black tracking-tight">ARC Composites</h2>
            <p className="text-sm text-cool-gray mt-1.5 max-w-lg">
              Advanced Repair Composites — high-performance polymer coatings and repair compounds for metal restoration and protection.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-5">
          {['All', 'Ceramic', 'Wear', 'Corrosion', 'High-Temp', 'Tank Lining', 'Underwater'].map(tag => (
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
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
