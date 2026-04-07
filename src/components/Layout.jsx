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
  const [lineItems, setLineItems] = useState([])
  const prevSection = useRef(activeSection)

  const handleAddToQuote = (item) => {
    setLineItems(prev => {
      const existing = prev.findIndex(i => i.code === item.code)
      if (existing !== -1) {
        return prev.map((i, idx) => idx === existing ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...prev, { ...item, qty: 1 }]
    })
  }

  const handleUpdateQty = (idx, delta) => {
    setLineItems(prev => {
      const next = prev.map((item, i) => i === idx ? { ...item, qty: item.qty + delta } : item)
      return next.filter(item => item.qty > 0)
    })
  }

  useEffect(() => {
    if (prevSection.current !== activeSection) {
      setRenderKey(k => k + 1)
      prevSection.current = activeSection
    }
  }, [activeSection])

  const currentSection = SECTIONS.find(s => s.id === activeSection)
  const total = lineItems.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 1), 0)

  return (
    <div className="flex flex-col h-full" style={{ background: '#f2f2f7' }}>
      <Header activeSection={activeSection} onLogout={onLogout} />

      <div className="flex flex-1 min-h-0 max-w-[1280px] mx-auto w-full">
        <Sidebar activeSection={activeSection} onSectionChange={onSectionChange} />

        {/* Main workspace */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          {/* Mobile section picker */}
          <div
            className="lg:hidden sticky top-0 z-30 px-4 py-2.5 flex gap-2 overflow-x-auto"
            style={{
              background: 'rgba(242,242,247,0.9)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              borderBottom: '1px solid rgba(0,0,0,0.07)',
            }}
          >
            {SECTIONS.map(section => (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className="shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all whitespace-nowrap focus-visible:outline-none"
                style={{
                  background: activeSection === section.id ? '#c8102e' : 'rgba(255,255,255,0.7)',
                  color: activeSection === section.id ? 'white' : '#6e6e73',
                  border: activeSection === section.id ? '1px solid transparent' : '1px solid rgba(0,0,0,0.08)',
                }}
              >
                {section.shortLabel}
              </button>
            ))}
          </div>

          <div className="px-6 py-6 pb-12">
            {(() => {
              const SectionComponent = SECTION_COMPONENTS[activeSection]
              return SectionComponent
                ? <SectionComponent key={`${activeSection}-${renderKey}`} onAddToQuote={handleAddToQuote} />
                : <ComingSoon key={`${activeSection}-${renderKey}`} title={currentSection?.label ?? ''} />
            })()}
          </div>
        </main>

        <SummaryPanel activeSection={activeSection} lineItems={lineItems} onUpdateQty={handleUpdateQty} />
      </div>

      {/* Mobile bottom bar */}
      <div
        className="lg:hidden sticky bottom-0 z-30 px-4 py-3 flex items-center justify-between gap-4 print:hidden"
        style={{
          background: 'rgba(242,242,247,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(0,0,0,0.08)',
        }}
      >
        <div>
          <p className="text-[11px] font-medium" style={{ color: '#6e6e73' }}>Quote Total</p>
          <p className="text-[15px] font-bold text-brand-black tabular-nums">
            {total > 0 ? `$${total.toFixed(2)}` : '—'}
          </p>
        </div>
        <button
          className="inline-flex items-center gap-1.5 px-5 py-2.5 text-[13px] font-semibold rounded-xl
                     transition-all active:scale-[0.99] focus-visible:outline-none"
          style={{ background: '#c8102e', color: 'white' }}
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
