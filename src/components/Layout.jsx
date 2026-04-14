import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import Header from './Header.jsx'
import Sidebar, { SECTIONS } from './Sidebar.jsx'
import SummaryPanel from './SummaryPanel.jsx'
import ComingSoon from './ComingSoon.jsx'
import { generateQuote } from '../utils/generateQuote.js'

const MechanicalSeals = lazy(() => import('./sections/MechanicalSeals.jsx'))

const SECTION_COMPONENTS = {
  'mechanical-seals': MechanicalSeals,
}

const STORAGE_KEY = 'chesterton_quote_items'

function loadSavedItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch { /* ignore */ }
  return []
}

function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'rgba(200,16,46,0.2)', borderTopColor: '#c8102e' }}
        />
        <p className="text-[12px] font-medium" style={{ color: '#6e6e73' }}>Loading...</p>
      </div>
    </div>
  )
}

export default function Layout({ activeSection, onSectionChange, onLogout }) {
  const [renderKey, setRenderKey] = useState(0)
  const [lineItems, setLineItems] = useState(loadSavedItems)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const prevSection = useRef(activeSection)

  // Persist quote to localStorage
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(lineItems)) } catch { /* ignore */ }
  }, [lineItems])

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

  const handleMobileGenerate = () => {
    if (lineItems.length === 0) return
    generateQuote(lineItems)
  }

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
            <Suspense fallback={<SectionLoader />}>
              {(() => {
                const SectionComponent = SECTION_COMPONENTS[activeSection]
                return SectionComponent
                  ? <SectionComponent key={`${activeSection}-${renderKey}`} onAddToQuote={handleAddToQuote} />
                  : <ComingSoon key={`${activeSection}-${renderKey}`} title={currentSection?.label ?? ''} />
              })()}
            </Suspense>
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
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="flex items-center gap-2"
        >
          <div>
            <p className="text-[11px] font-medium text-left" style={{ color: '#6e6e73' }}>
              Quote Total
              {lineItems.length > 0 && (
                <span className="ml-1.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: '#c8102e', color: 'white' }}>
                  {lineItems.length}
                </span>
              )}
            </p>
            <p className="text-[15px] font-bold text-brand-black tabular-nums">
              {total > 0 ? `$${total.toFixed(2)}` : '—'}
            </p>
          </div>
          <svg className="w-4 h-4" style={{ color: '#6e6e73' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <button
          onClick={handleMobileGenerate}
          disabled={lineItems.length === 0}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 text-[13px] font-semibold rounded-xl
                     transition-all active:scale-[0.99] focus-visible:outline-none
                     disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: '#c8102e', color: 'white' }}
        >
          Generate Quote
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Mobile quote drawer */}
      {mobileDrawerOpen && (
        <SummaryPanel
          mobile
          activeSection={activeSection}
          lineItems={lineItems}
          onUpdateQty={handleUpdateQty}
          onClose={() => setMobileDrawerOpen(false)}
        />
      )}
    </div>
  )
}
