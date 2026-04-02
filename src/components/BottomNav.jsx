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
      background: 'rgba(10,16,32,0.98)',
      borderTop: '1.5px solid #1a2a45',
      display: 'flex',
      height: '70px',
      zIndex: 100,
      boxShadow: '0 -4px 24px 0 rgba(0,229,255,0.08)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      transition: 'box-shadow 0.18s',
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
              fontSize: 11,
              fontWeight: isActive ? 700 : 500,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              transition: 'color 0.18s, transform 0.12s',
              transform: isActive ? 'scale(1.08)' : 'none',
              letterSpacing: isActive ? 0.2 : 0,
            }}
          >
            <Icon size={23} strokeWidth={isActive ? 2.5 : 2} />
            {label}
          </button>
        )
      })}
    </nav>
  )
}
