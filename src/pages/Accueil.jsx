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
    <main className="home-dashboard">
      <header className="home-header">
        <div className="avatar-gradient">{initial}</div>
        <div>
          <p className="welcome">Bienvenue</p>
          <h1 className="username">{profile?.username || '…'}</h1>
        </div>
      </header>
      <section className="stats-grid">
        <div className="stat-card">
          <Dumbbell size={28} color="#00e5ff" />
          <div>
            <div className="stat-label">Séances</div>
            <div className="stat-value">{stats.sessions}</div>
          </div>
        </div>
        <div className="stat-card">
          <Activity size={28} color="#00e5ff" />
          <div>
            <div className="stat-label">Volume total</div>
            <div className="stat-value">{stats.volume} <span className="stat-unit">tonnes</span></div>
          </div>
        </div>
        <div className="stat-card">
          <Flame size={28} color="#ff3d9a" />
          <div>
            <div className="stat-label">Série</div>
            <div className="stat-value">{stats.streak} <span className="stat-unit">jours</span></div>
          </div>
        </div>
        <div className="stat-card">
          <Trophy size={28} color="#ffb800" />
          <div>
            <div className="stat-label">Classement</div>
            <div className="stat-value">#{stats.rank}</div>
          </div>
        </div>
      </section>
      <button
        onClick={startNewSession}
        className="btn-primary home-btn"
      >
        <Plus size={24} strokeWidth={2.5} />
        Nouvelle séance
      </button>
    </main>
  )
}


