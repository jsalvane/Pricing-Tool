import { useState } from 'react'
import PinGate from './components/PinGate.jsx'
import Layout from './components/Layout.jsx'

const SESSION_KEY = 'chesterton_auth'
const CORRECT_PIN = '1884'

export default function App() {
  const [authenticated, setAuthenticated] = useState(() => {
    return sessionStorage.getItem(SESSION_KEY) === 'true'
  })
  const [exiting, setExiting] = useState(false)
  const [activeSection, setActiveSection] = useState('mechanical-seals')

  function handleAuthenticated() {
    sessionStorage.setItem(SESSION_KEY, 'true')
    setExiting(true)
    setTimeout(() => {
      setAuthenticated(true)
      setExiting(false)
    }, 520)
  }

  function handleLogout() {
    sessionStorage.removeItem(SESSION_KEY)
    setAuthenticated(false)
  }

  if (!authenticated) {
    return (
      <PinGate
        correctPin={CORRECT_PIN}
        onAuthenticated={handleAuthenticated}
        exiting={exiting}
      />
    )
  }

  return (
    <div className="app-fade-in h-full">
      <Layout
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={handleLogout}
      />
    </div>
  )
}
