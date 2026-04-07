const SECTIONS = [
  {
    id: 'mechanical-seals',
    label: 'Mechanical Seals',
    shortLabel: 'Mech. Seals',
    description: 'Cartridge & component seals',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4" />
        <path strokeLinecap="round" d="M12 3v2M12 19v2M3 12h2M19 12h2" />
      </svg>
    ),
  },
  {
    id: 'mp',
    label: 'MP',
    shortLabel: 'MP',
    description: 'Metallic Packing',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <rect x="3" y="6" width="18" height="4" rx="1" />
        <rect x="3" y="11" width="18" height="4" rx="1" />
        <rect x="3" y="16" width="18" height="4" rx="1" />
      </svg>
    ),
  },
  {
    id: 'eps',
    label: 'EPS',
    shortLabel: 'EPS',
    description: 'Equipment Protection',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    id: 'arc',
    label: 'ARC',
    shortLabel: 'ARC',
    description: 'Advanced Repair Composites',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
      </svg>
    ),
  },
  {
    id: 'il',
    label: 'IL',
    shortLabel: 'IL',
    description: 'Industrial Lubricants',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
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
                <div className={`text-[10px] truncate mt-0.5 ${isActive ? 'text-cool-gray' : 'text-gray-400'}`}>
                  {section.description}
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
