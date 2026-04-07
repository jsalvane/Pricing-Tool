import { useState, useEffect, useRef } from 'react'
import Header from './Header.jsx'
import Sidebar, { SECTIONS } from './Sidebar.jsx'
import SummaryPanel from './SummaryPanel.jsx'
import ComingSoon from './ComingSoon.jsx'
import MechanicalSeals from './sections/MechanicalSeals.jsx'

const SECTION_COMPONENTS = {
  'mechanical-seals': MechanicalSeals,
}

export default function Layout({ activeSection, onSectionChange, onLogout }) {
  const [renderKey, setRenderKey] = useState(0)
  const prevSection = useRef(activeSection)

  // Re-mount section component on change to retrigger animations
  useEffect(() => {
    if (prevSection.current !== activeSection) {
      setRenderKey(k => k + 1)
      prevSection.current = activeSection
    }
  }, [activeSection])

  const currentSection = SECTIONS.find(s => s.id === activeSection)

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <Header activeSection={activeSection} onLogout={onLogout} />

      <div className="flex flex-1 min-h-0 max-w-[1280px] mx-auto w-full">
        <Sidebar activeSection={activeSection} onSectionChange={onSectionChange} />

        {/* Main workspace */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          {/* Mobile section picker */}
          <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-100 px-4 py-2 flex gap-2 overflow-x-auto scrollbar-none">
            {SECTIONS.map(section => (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all whitespace-nowrap
                  ${activeSection === section.id
                    ? 'bg-brand-accent border-brand-accent text-white'
                    : 'border-gray-200 text-cool-gray hover:border-gray-300 bg-white'
                  }`}
              >
                {section.label}
              </button>
            ))}
          </div>

          <div className="px-6 py-6 pb-10">
            {(() => {
              const SectionComponent = SECTION_COMPONENTS[activeSection]
              return SectionComponent
                ? <SectionComponent key={`${activeSection}-${renderKey}`} />
                : <ComingSoon key={`${activeSection}-${renderKey}`} title={currentSection?.label ?? ''} />
            })()}
          </div>
        </main>

        <SummaryPanel activeSection={activeSection} />
      </div>

      {/* Mobile bottom bar — summary CTA */}
      <div className="lg:hidden sticky bottom-0 z-30 bg-white border-t border-gray-100 px-4 py-3 flex items-center justify-between gap-4 print:hidden">
        <div>
          <p className="text-xs font-semibold text-brand-black">Quote Total</p>
          <p className="text-sm font-bold text-brand-black tabular-nums">—</p>
        </div>
        <button
          className="inline-flex items-center gap-1.5 rounded-lg bg-action px-5 py-2.5 text-sm font-semibold
                     text-brand-black transition-all hover:bg-action-dark active:scale-[0.99]
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-action/50"
        >
          Generate Quote
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
