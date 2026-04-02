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

  async function startNewSession() {
    setCreating(true)
    const name = `Séance du ${new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}`
    await supabase.from('sessions').insert({ user_id: profile.id, name })
    onNavigate('historique')
    setCreating(false)
  }

  const initial = profile?.username?.charAt(0).toUpperCase() || 'U'

  return (
    <div style={{ padding: '24px 20px 100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 16,
          background: 'linear-gradient(135deg, #006064, #00acc1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, fontWeight: 700, color: '#fff',
        }}>
          {initial}
        </div>
        <div>
          <p style={{ color: '#6b7fa3', fontSize: 13 }}>Bienvenue</p>
          <p style={{ fontSize: 18, fontWeight: 700, color: '#f0f4ff' }}>
            {profile?.username || '…'}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 28 }}>
        <StatCard icon={Dumbbell} label="Séances" value={stats.sessions} color="cyan" />
        <StatCard icon={Activity} label="Volume total" value={stats.volume} unit="tonnes" color="green" />
        <StatCard icon={Flame} label="Série" value={stats.streak} unit="jours" color="orange" />
        <StatCard icon={Trophy} label="Classement" value={`#${stats.rank}`} color="amber" />
      </div>

      <button
        onClick={startNewSession}
        disabled={creating}
        style={{
          width: '100%', padding: '18px 0', borderRadius: 20,
          background: 'linear-gradient(135deg, #006064, #00acc1)',
          color: '#fff', fontSize: 16, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          border: 'none', cursor: creating ? 'not-allowed' : 'pointer',
          opacity: creating ? 0.7 : 1,
        }}
      >
        <Plus size={20} strokeWidth={2.5} />
        Nouvelle séance
      </button>
    </div>
  )
}


