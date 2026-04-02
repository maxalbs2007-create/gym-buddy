import { useState, useEffect } from 'react'
import { Dumbbell, Activity, Flame, Trophy, Plus } from 'lucide-react'
import { supabase } from '../lib/supabase'
import StatCard from '../components/StatCard'

export default function Accueil({ profile, onNavigate }) {
  const [stats, setStats] = useState({ sessions: 0, volume: 0, streak: 0, rank: 1 })
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (profile) fetchStats()
  }, [profile])

  async function fetchStats() {
    const { data: sessions } = await supabase
      .from('sessions')
      .select('total_volume_kg, started_at')
      .eq('user_id', profile.id)
      .not('ended_at', 'is', null)

    if (!sessions) return

    const totalVolume = sessions.reduce((s, r) => s + (r.total_volume_kg || 0), 0)

    const dates = [...new Set(sessions.map(s => s.started_at.slice(0, 10)))].sort().reverse()
    let streak = 0
    for (let i = 0; i < dates.length; i++) {
      const expected = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10)
      if (dates[i] === expected) streak++
      else break
    }

    const { data: all } = await supabase.from('sessions').select('user_id, total_volume_kg')
    const volumeByUser = {}
    ;(all || []).forEach(s => {
      volumeByUser[s.user_id] = (volumeByUser[s.user_id] || 0) + (s.total_volume_kg || 0)
    })
    const sorted = Object.entries(volumeByUser).sort((a, b) => b[1] - a[1])
    const rank = sorted.findIndex(([uid]) => uid === profile.id) + 1 || 1

    setStats({ sessions: sessions.length, volume: Math.round(totalVolume / 1000), streak, rank })
  }

  function startNewSession() {
    onNavigate('nouvelle-seance')
  }

  const initial = profile?.username?.charAt(0).toUpperCase() || 'U'

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start',
      padding: '38px 0 100px',
      background: 'none',
    }}>
      <div style={{
        width: '100%', maxWidth: 420, margin: '0 auto 38px',
        display: 'flex', alignItems: 'center', gap: 18,
      }}>
        <div style={{
          width: 54, height: 54, borderRadius: '50%',
          background: 'linear-gradient(135deg, #006064, #00acc1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, fontWeight: 900, color: '#fff',
          boxShadow: '0 2px 8px 0 rgba(0,229,255,0.10)',
          border: '2.5px solid #0a192f',
        }}>{initial}</div>
        <div>
          <p style={{ color: '#6b7fa3', fontSize: 14, fontWeight: 600, marginBottom: 2 }}>Bienvenue</p>
          <p style={{ fontSize: 22, fontWeight: 900, color: '#f0f4ff', letterSpacing: 0.2, lineHeight: 1 }}>{profile?.username || '…'}</p>
        </div>
      </div>

      <div style={{
        width: '100%', maxWidth: 420, margin: '0 auto 38px',
        display: 'flex', flexDirection: 'column', gap: 22,
      }}>
        <div style={{
          background: 'rgba(19,30,53,0.92)',
          borderRadius: 18,
          boxShadow: '0 4px 18px 0 rgba(0,229,255,0.06)',
          border: '1.5px solid #1a2a45',
          padding: '22px 26px',
          display: 'flex', alignItems: 'center', gap: 18,
        }}>
          <Dumbbell size={28} color="#00e5ff" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ color: '#6b7fa3', fontSize: 13, fontWeight: 600, marginBottom: 2 }}>Séances</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: 0.2 }}>{stats.sessions}</div>
          </div>
        </div>
        <div style={{
          background: 'rgba(19,30,53,0.92)',
          borderRadius: 18,
          boxShadow: '0 4px 18px 0 rgba(0,229,255,0.06)',
          border: '1.5px solid #1a2a45',
          padding: '22px 26px',
          display: 'flex', alignItems: 'center', gap: 18,
        }}>
          <Activity size={28} color="#00e5ff" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ color: '#6b7fa3', fontSize: 13, fontWeight: 600, marginBottom: 2 }}>Volume total</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: 0.2 }}>{stats.volume} <span style={{ fontSize: 15, fontWeight: 400, opacity: 0.7 }}>tonnes</span></div>
          </div>
        </div>
        <div style={{
          background: 'rgba(19,30,53,0.92)',
          borderRadius: 18,
          boxShadow: '0 4px 18px 0 rgba(255,61,154,0.06)',
          border: '1.5px solid #1a2a45',
          padding: '22px 26px',
          display: 'flex', alignItems: 'center', gap: 18,
        }}>
          <Flame size={28} color="#ff3d9a" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ color: '#6b7fa3', fontSize: 13, fontWeight: 600, marginBottom: 2 }}>Série</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: 0.2 }}>{stats.streak} <span style={{ fontSize: 15, fontWeight: 400, opacity: 0.7 }}>jours</span></div>
          </div>
        </div>
        <div style={{
          background: 'rgba(19,30,53,0.92)',
          borderRadius: 18,
          boxShadow: '0 4px 18px 0 rgba(255,140,0,0.06)',
          border: '1.5px solid #1a2a45',
          padding: '22px 26px',
          display: 'flex', alignItems: 'center', gap: 18,
        }}>
          <Trophy size={28} color="#ffb800" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ color: '#6b7fa3', fontSize: 13, fontWeight: 600, marginBottom: 2 }}>Classement</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: 0.2 }}>#{stats.rank}</div>
          </div>
        </div>
      </div>

      <button
        onClick={startNewSession}
        className="btn-primary"
        style={{
          width: '100%', maxWidth: 420, padding: '20px 0', borderRadius: 22,
          fontSize: 18, fontWeight: 800, marginTop: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14,
          boxShadow: '0 4px 18px 0 rgba(0,229,255,0.10)',
          letterSpacing: 0.2,
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.03)'}
        onMouseOut={e => e.currentTarget.style.transform = 'none'}
      >
        <Plus size={24} strokeWidth={2.5} />
        Nouvelle séance
      </button>
    </div>
  )
}


