const SECTIONS = [
  {
    id: 'mechanical-seals',
    label: 'Mechanical Seals',
    shortLabel: 'Mech. Seals',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <ellipse cx="12" cy="6.5" rx="8" ry="2.5" />
        <ellipse cx="12" cy="12" rx="8" ry="2.5" />
        <ellipse cx="12" cy="17.5" rx="8" ry="2.5" />
      </svg>
    ),
  },
  {
    id: 'polymer-seals',
    label: 'Polymer Seals',
    shortLabel: 'Polymer',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 3v18M20 3v18M4 3h5M15 3h5M4 21h5M15 21h5M9 3v9a3 3 0 006 0V3" />
      </svg>
    ),
  },
  {
    id: 'protective-coatings',
    label: 'Protective Coatings',
    shortLabel: 'Coatings',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
  },
  {
    id: 'il-mro',
    label: 'IL/MRO',
    shortLabel: 'IL/MRO',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 22h8M7 10h8v12H7V10z" />
        <path strokeLinecap="round" d="M7 10c0-2 1.8-3.5 4-3.5s4 1.5 4 3.5" />
        <path strokeLinecap="round" d="M11 6.5V4.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 4.5h2.5v3H13" />
        <path strokeLinecap="round" d="M15.5 4l2-1.5M15.5 6h2M15.5 8l2 1.5" />
      </svg>
    ),
  },
]

export default function Sidebar({ activeSection, onSectionChange }) {
  return (
    <aside
      className="w-52 shrink-0 hidden lg:flex flex-col py-5 px-2.5 print:hidden"
      style={{ borderRight: '1px solid rgba(0,0,0,0.07)', background: 'transparent' }}
    >
      {/* Nav label */}
      <p
        className="text-[10px] font-semibold uppercase px-3 mb-2.5"
        style={{ color: '#6e6e73', letterSpacing: '0.1em' }}
      >
        Product Lines
      </p>

      <nav className="flex flex-col gap-0.5">
        {SECTIONS.map(section => {
          const isActive = activeSection === section.id
          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all
                         focus-visible:outline-none"
              style={{
                background: isActive ? 'rgba(200,16,46,0.07)' : 'transparent',
                color: isActive ? '#1c1c1e' : '#6e6e73',
              }}
            >
              {/* Left indicator bar */}
              <div
                className="absolute left-0 w-0.5 h-5 rounded-r-full transition-all duration-200"
                style={{
                  background: isActive ? '#c8102e' : 'transparent',
                  marginLeft: '0px',
                  position: 'relative',
                  flexShrink: 0,
                  display: 'none',
                }}
              />
              <div
                className="shrink-0 transition-colors"
                style={{ color: isActive ? '#c8102e' : '#aeaeb2' }}
              >
                {section.icon}
              </div>
              <span
                className="text-[13px] font-medium truncate flex-1"
                style={{ color: isActive ? '#1c1c1e' : '#6e6e73' }}
              >
                {section.label}
              </span>
              {isActive && (
                <div
                  className="shrink-0 w-1.5 h-1.5 rounded-full"
                  style={{ background: '#c8102e' }}
                />
              )}
            </button>
          )
        })}
      </nav>

      <div className="mt-auto pt-6 px-3">
        <p className="text-[10px] tabular-nums" style={{ color: 'rgba(0,0,0,0.2)' }}>v0.1.0 · Internal</p>
      </div>
    </aside>
  )
}

export { SECTIONS }
