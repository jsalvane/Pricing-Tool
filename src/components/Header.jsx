import { useState } from 'react'

export default function Header({ activeSection, onLogout, dark, onToggleDark }) {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [showPricing, setShowPricing] = useState(true)

  const sectionLabels = {
    'mechanical-seals': 'Mechanical Seals',
    'packing-gaskets': 'Packing & Gaskets',
    'polymer-seals': 'Polymer Seals',
    'protective-coatings': 'Protective Coatings',
    'il-mro': 'IL/MRO',
  }

  return (
    <header
      className="sticky top-0 z-40 print:hidden"
      style={{
        background: 'rgba(242,242,247,0.85)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
      }}
    >
      <div className="max-w-[1280px] mx-auto px-5 h-[52px] flex items-center justify-between gap-4">

        {/* Logo + wordmark */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-7 h-7 flex items-center justify-center shrink-0">
            <img src="/logo.png" alt="Chesterton" className="w-7 h-7 object-contain mix-blend-multiply" />
          </div>
          <div className="hidden sm:flex items-center gap-1.5 min-w-0">
            <span className="text-[13px] font-semibold text-brand-black tracking-tight">Chesterton</span>
            <span className="text-[13px] select-none" style={{ color: 'rgba(0,0,0,0.2)' }}>/</span>
            <span className="text-[13px] font-normal truncate" style={{ color: '#6e6e73' }}>Pricing Tool</span>
          </div>
        </div>

        {/* Center breadcrumb */}
        <div className="hidden lg:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          {activeSection && (
            <span className="text-[11px] font-medium tracking-wide" style={{ color: '#6e6e73' }}>
              {sectionLabels[activeSection] || activeSection}
            </span>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">

          {/* Print */}
          <button
            onClick={() => window.print()}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium
                       transition-all active:scale-[0.98] focus-visible:outline-none"
            style={{
              background: 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(0,0,0,0.1)',
              borderRadius: '10px',
              color: '#1c1c1e',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Quote
          </button>

          {/* Settings */}
          <div className="relative">
            <button
              onClick={() => setSettingsOpen(o => !o)}
              className="inline-flex items-center justify-center w-8 h-8 transition-all active:scale-[0.97] focus-visible:outline-none"
              style={{
                background: settingsOpen ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: '10px',
                color: '#6e6e73',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              }}
              aria-label="Settings"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            {settingsOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-52 py-1.5 z-50"
                style={{
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: '14px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
                }}
                onMouseLeave={() => setSettingsOpen(false)}
              >
                <div className="px-3 pt-1 pb-2 mb-1" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: '#6e6e73' }}>Preferences</p>
                </div>
                <button
                  onClick={() => setShowPricing(p => !p)}
                  className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 text-left transition-colors"
                  style={{ fontSize: '13px', color: '#1c1c1e' }}
                >
                  <span>Show Pricing</span>
                  {/* Toggle switch */}
                  <div
                    className="relative inline-flex h-[22px] w-[38px] shrink-0 rounded-full transition-colors duration-200"
                    style={{ background: showPricing ? '#c8102e' : 'rgba(0,0,0,0.15)' }}
                  >
                    <span
                      className="inline-block h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-transform duration-200 mt-[2px]"
                      style={{ transform: showPricing ? 'translateX(18px)' : 'translateX(2px)', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}
                    />
                  </div>
                </button>
                {/* Dark mode toggle */}
                <button
                  onClick={onToggleDark}
                  className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 text-left transition-colors"
                  style={{ fontSize: '13px', color: '#1c1c1e' }}
                >
                  <span>Dark Mode</span>
                  <div
                    className="relative inline-flex h-[22px] w-[38px] shrink-0 rounded-full transition-colors duration-200"
                    style={{ background: dark ? '#c8102e' : 'rgba(0,0,0,0.15)' }}
                  >
                    <span
                      className="inline-block h-[18px] w-[18px] rounded-full bg-white shadow-sm transition-transform duration-200 mt-[2px]"
                      style={{ transform: dark ? 'translateX(18px)' : 'translateX(2px)', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}
                    />
                  </div>
                </button>
                <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', marginTop: '4px', paddingTop: '4px' }}>
                  <button
                    onClick={() => { setSettingsOpen(false); onLogout() }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left transition-colors"
                    style={{ fontSize: '13px', color: '#c8102e' }}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Lock Tool
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
