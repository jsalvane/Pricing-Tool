const SECTIONS = [
  {
    id: 'mechanical-seals',
    label: 'Mechanical Seals',
    shortLabel: 'Mech. Seals',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4" />
        <path strokeLinecap="round" d="M12 3v2M12 19v2M3 12h2M19 12h2" />
      </svg>
    ),
  },
  {
    id: 'packing-gaskets',
    label: 'Packing & Gaskets',
    shortLabel: 'Packing',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" d="M3 8c1.5,-2 3,-2 4.5,0c1.5,2 3,2 4.5,0c1.5,-2 3,-2 4.5,0c1.5,2 3,2 4.5,0" />
        <path strokeLinecap="round" d="M3 12c1.5,-2 3,-2 4.5,0c1.5,2 3,2 4.5,0c1.5,-2 3,-2 4.5,0c1.5,2 3,2 4.5,0" />
        <path strokeLinecap="round" d="M3 16c1.5,-2 3,-2 4.5,0c1.5,2 3,2 4.5,0c1.5,-2 3,-2 4.5,0c1.5,2 3,2 4.5,0" />
      </svg>
    ),
  },
  {
    id: 'polymer-seals',
    label: 'Polymer Seals',
    shortLabel: 'Polymer',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l8.5 4.75v9.5L12 22l-8.5-4.75v-9.5L12 3z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    id: 'protective-coatings',
    label: 'Protective Coatings',
    shortLabel: 'Coatings',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
  },
  {
    id: 'il-mro',
    label: 'IL/MRO',
    shortLabel: 'IL/MRO',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.736.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z" />
      </svg>
    ),
  },
]

export default function Sidebar({ activeSection, onSectionChange }) {
  return (
    <aside className="w-52 shrink-0 hidden lg:flex flex-col py-6 px-3 border-r border-gray-100 bg-white print:hidden">
      {/* Section nav label */}
      <p className="text-[10px] font-semibold uppercase tracking-widest text-cool-gray px-2 mb-3">
        Product Lines
      </p>

      <nav className="flex flex-col gap-0.5">
        {SECTIONS.map(section => {
          const isActive = activeSection === section.id
          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-left transition-all
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/30
                ${isActive
                  ? 'bg-brand-accent-light border border-brand-accent/20 text-brand-black shadow-sm'
                  : 'text-cool-gray hover:bg-gray-50 hover:text-brand-black border border-transparent'
                }`}
            >
              <div className={`shrink-0 transition-colors ${isActive ? 'text-brand-accent' : ''}`}>
                {section.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className={`text-xs font-semibold truncate ${isActive ? 'text-brand-black' : ''}`}>
                  {section.label}
                </div>
              </div>
              {isActive && (
                <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-brand-accent" />
              )}
            </button>
          )
        })}
      </nav>

      {/* Bottom spacer / version */}
      <div className="mt-auto pt-6 px-2">
        <p className="text-[10px] text-gray-300 tabular-nums">v0.1.0 · Internal</p>
      </div>
    </aside>
  )
}

export { SECTIONS }
