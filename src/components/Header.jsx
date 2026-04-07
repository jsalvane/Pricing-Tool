import { useState } from 'react'

export default function Header({ activeSection, onLogout }) {
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
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 print:hidden">
      <div className="max-w-[1280px] mx-auto px-5 h-14 flex items-center justify-between gap-4">

        {/* Logo + Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 flex items-center justify-center shrink-0">
            <img src="/logo.png" alt="Chesterton" className="w-8 h-8 object-contain mix-blend-multiply" />
          </div>
          <div className="hidden sm:flex items-center gap-2 min-w-0">
            <span className="text-sm font-bold text-brand-black tracking-tight">Chesterton</span>
            <span className="text-gray-200 select-none">/</span>
            <span className="text-sm font-medium text-cool-gray truncate">Pricing Tool</span>
          </div>
        </div>

        {/* Center — breadcrumb on large screens */}
        <div className="hidden lg:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          {activeSection && (
            <>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-300">Section</span>
              <span className="text-[10px] text-gray-300">›</span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-cool-gray">
                {sectionLabels[activeSection] || activeSection}
              </span>
            </>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Print */}
          <button
            onClick={() => window.print()}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5
                       text-xs font-semibold text-cool-gray shadow-sm transition-all
                       hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98]
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/30"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Quote
          </button>

          {/* Settings */}
          <div className="relative">
            <button
              onClick={() => setSettingsOpen(o => !o)}
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200
                         bg-white text-cool-gray shadow-sm transition-all
                         hover:border-gray-300 hover:bg-gray-50 active:scale-[0.97]
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/30"
              aria-label="Settings"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            {settingsOpen && (
              <div
                className="absolute right-0 top-full mt-1.5 w-56 rounded-lg border border-gray-200 bg-white shadow-lg py-1.5 z-50"
                onMouseLeave={() => setSettingsOpen(false)}
              >
                <div className="px-3 py-1.5 border-b border-gray-100 mb-1">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-cool-gray">Preferences</p>
                </div>
                <button
                  onClick={() => setShowPricing(p => !p)}
                  className="w-full flex items-center justify-between gap-3 px-3.5 py-2 text-left text-sm text-brand-black hover:bg-gray-50 transition-colors"
                >
                  <span>Show Pricing</span>
                  <div className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors ${showPricing ? 'bg-brand-accent' : 'bg-gray-200'}`}>
                    <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform mt-0.5 ${showPricing ? 'translate-x-4 ml-0.5' : 'translate-x-0.5'}`} />
                  </div>
                </button>
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button
                    onClick={() => { setSettingsOpen(false); onLogout() }}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-left text-sm text-brand-accent hover:bg-brand-accent-light transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
