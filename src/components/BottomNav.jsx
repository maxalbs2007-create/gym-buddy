import { Home, Dumbbell, Trophy, Users, History } from 'lucide-react'

const tabs = [
  { id: 'accueil', label: 'Accueil', icon: Home },
  { id: 'exercices', label: 'Exercices', icon: Dumbbell },
  { id: 'classement', label: 'Classement', icon: Trophy },
  { id: 'amis', label: 'Amis', icon: Users },
  { id: 'historique', label: 'Historique', icon: History },
]

export default function BottomNav({ active, onChange }) {
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: '#0a1020',
      borderTop: '1px solid #1a2a45',
      display: 'flex',
      height: '72px',
      zIndex: 100,
    }}>
      {tabs.map(({ id, label, icon: Icon }) => {
        const isActive = active === id
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              color: isActive ? '#00e5ff' : '#3a4a6a',
              fontSize: 10,
              fontWeight: isActive ? 500 : 400,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
            }}
          >
            <Icon size={20} strokeWidth={isActive ? 2.2 : 1.6} />
            <span>{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
