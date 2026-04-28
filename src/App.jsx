import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import BottomNav from './components/BottomNav'
import AuthPage from './pages/AuthPage'
import Accueil from './pages/Accueil'
import Exercices from './pages/Exercices'
import Classement from './pages/Classement'
import Amis from './pages/Amis'
import Historique from './pages/Historique'


import Progression from './pages/Progression'
import NouvelleSeance from './pages/NouvelleSeance'

export default function App() {
  const { user, profile, loading, signIn, signUp } = useAuth()
  const [page, setPage] = useState('accueil')

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#080d1a',
      }}>
        <p style={{ color: '#6b7fa3' }}>Chargement…</p>
      </div>
    )
  }

  if (!user || !profile) {
    return <AuthPage onSignIn={signIn} onSignUp={signUp} />
  }

  const pages = {
    accueil: <Accueil profile={profile} onNavigate={setPage} />, 
    exercices: <Exercices profile={profile} />, 
    classement: <Classement profile={profile} />, 
    progression: <Progression profile={profile} />, 
    amis: <Amis profile={profile} />, 
    historique: <Historique profile={profile} />, 
    'nouvelle-seance': <NouvelleSeance profile={profile} onNavigate={setPage} />, 
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh', background: '#080d1a' }}>
      {pages[page]}
      <BottomNav active={page} onChange={setPage} />
    </div>
  )
}
