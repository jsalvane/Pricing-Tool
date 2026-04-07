import { useState, useEffect, useRef, useCallback } from 'react'

const KEYPAD = [
  ['1','2','3'],
  ['4','5','6'],
  ['7','8','9'],
  ['','0','⌫'],
]

export default function PinGate({ correctPin, onAuthenticated, exiting }) {
  const [pin, setPin] = useState('')
  const [shaking, setShaking] = useState(false)
  const [error, setError] = useState(false)
  const dotsRef = useRef(null)

  const handleKey = useCallback((digit) => {
    if (digit === '⌫') {
      setPin(p => p.slice(0, -1))
      setError(false)
      return
    }
    if (pin.length >= 4) return
    const next = pin + digit
    setPin(next)

    if (next.length === 4) {
      if (next === correctPin) {
        setTimeout(() => onAuthenticated(), 150)
      } else {
        setTimeout(() => {
          setShaking(true)
          setError(true)
          setTimeout(() => {
            setShaking(false)
            setPin('')
          }, 600)
        }, 80)
      }
    }
  }, [pin, correctPin, onAuthenticated])

  // Physical keyboard support
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key >= '0' && e.key <= '9') handleKey(e.key)
      if (e.key === 'Backspace') handleKey('⌫')
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleKey])

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-accent transition-opacity${exiting ? ' gate-fade-out' : ''}`}
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* Subtle grid overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative flex flex-col items-center gap-10 px-6 w-full max-w-xs">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-lg overflow-hidden backdrop-blur-sm">
            <img src="/logo.png" alt="Chesterton" className="w-14 h-14 object-contain mix-blend-multiply" />
          </div>
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50 mb-1">A.W. Chesterton</p>
            <h1 className="text-2xl font-bold text-white tracking-tight">Pricing Tool</h1>
            <p className="text-sm text-white/60 mt-1">Enter your PIN to continue</p>
          </div>
        </div>

        {/* PIN dots */}
        <div
          ref={dotsRef}
          className={`flex gap-4 ${shaking ? 'pin-shake' : ''}`}
        >
          {[0,1,2,3].map(i => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-150 ${
                i < pin.length
                  ? error
                    ? 'bg-red-200 border-red-200 scale-110'
                    : 'bg-white border-white scale-110'
                  : 'bg-transparent border-white/40'
              }`}
            />
          ))}
        </div>

        {/* Error message */}
        <div className={`text-sm font-medium text-white/70 -mt-6 transition-opacity duration-200 ${error ? 'opacity-100' : 'opacity-0'}`}>
          Incorrect PIN — try again
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 w-full">
          {KEYPAD.flat().map((key, i) => {
            if (key === '') return <div key={i} />
            return (
              <button
                key={i}
                onClick={() => handleKey(key)}
                className="h-14 rounded-2xl bg-white/10 border border-white/20 text-white text-xl font-semibold
                           hover:bg-white/20 active:bg-white/30 active:scale-95
                           transition-all select-none
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                aria-label={key === '⌫' ? 'Delete' : key}
              >
                {key}
              </button>
            )
          })}
        </div>

        {/* Footer */}
        <p className="text-[11px] text-white/30 text-center -mt-4">
          Internal use only · Authorized personnel only
        </p>
      </div>
    </div>
  )
}
