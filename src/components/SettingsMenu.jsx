import { useState } from 'react'
import { Settings, X, LogOut, Headphones } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function SettingsMenu() {
  const [open, setOpen] = useState(false)

  async function handleSignOut() {
    await supabase.auth.signOut()
    window.location.reload()
  }

  return (
    <>
      {/* Bouton engrenage */}
      <button
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed', top: 16, right: 16, zIndex: 1000,
          width: 40, height: 40, borderRadius: 12,
          background: '#131e35', border: '1px solid #1a2a45',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <Settings size={18} color="#6b7fa3" />
      </button>

      {/* Overlay + panneau */}
      {open && (
        <>
          {/* Fond sombre */}
          <div
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 1001,
              background: 'rgba(0,0,0,0.6)',
            }}
          />

          {/* Panneau */}
          <div style={{
            position: 'fixed', top: 0, right: 0, bottom: 0,
            width: 280, zIndex: 1002,
            background: '#0d1526',
            borderLeft: '1px solid #1a2a45',
            display: 'flex', flexDirection: 'column',
            padding: 24,
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
              <h2 style={{ color: '#f0f4ff', fontWeight: 700, fontSize: 20 }}>Paramètres</h2>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={22} color="#6b7fa3" />
              </button>
            </div>

            {/* Support */}
            
              href="mailto:support@gymbuddy.app"
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '16px', borderRadius: 14,
                background: '#131e35', border: '1px solid #1a2a45',
                textDecoration: 'none', marginBottom: 12,
                cursor: 'pointer',
              }}
            <a>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: '#00e5ff22',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Headphones size={18} color="#00e5ff" />
              </div>
              <div>
                <p style={{ color: '#f0f4ff', fontWeight: 600, fontSize: 15 }}>Support</p>
                <p style={{ color: '#3a4a6a', fontSize: 12 }}>Nous contacter</p>
              </div>
            </a>

            {/* Déconnexion */}
            <button
              onClick={handleSignOut}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '16px', borderRadius: 14,
                background: '#1a0a14', border: '1px solid #ff3d9a33',
                cursor: 'pointer', width: '100%', textAlign: 'left',
              }}
            >
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: '#ff3d9a22',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <LogOut size={18} color="#ff3d9a" />
              </div>
              <div>
                <p style={{ color: '#ff3d9a', fontWeight: 600, fontSize: 15 }}>Déconnexion</p>
                <p style={{ color: '#3a4a6a', fontSize: 12 }}>Changer de compte</p>
              </div>
            </button>
          </div>
        </>
      )}
    </>
  )
}