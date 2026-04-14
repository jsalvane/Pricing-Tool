import { useState, useEffect } from 'react'

const STORAGE_KEY = 'chesterton_dark_mode'

function getSystemPreference() {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
}

function loadPreference() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'true') return true
  if (stored === 'false') return false
  return getSystemPreference()
}

export function useDarkMode() {
  const [dark, setDark] = useState(loadPreference)

  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem(STORAGE_KEY, String(dark))
  }, [dark])

  // Sync with system preference changes when no explicit user preference stored
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)')
    if (!mq) return
    const handler = (e) => {
      if (localStorage.getItem(STORAGE_KEY) === null) {
        setDark(e.matches)
      }
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return [dark, setDark]
}
