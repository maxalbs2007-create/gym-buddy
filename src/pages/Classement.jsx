import { useState, useEffect } from 'react'
import { Trophy, TrendingUp, Flame } from 'lucide-react'
import { supabase } from '../lib/supabase'
import PageHeader from '../components/PageHeader'

const TABS = [
  { id: 'volume', label: 'Volume' },
  { id: 'seances', label: 'Séances' },
  { id: 'serie', label: 'Série' },
]

export default function Classement({ profile }) {
  const [tab, setTab] = useState('volume')
  const [rankings, setRankings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchRankings() }, [tab])

  async function fetchRankings() {
    setLoading(true)
    const { data: sessions } = await supabase
      .from('sessions')
      .select('user_id, total_volume_kg, started_at')
      .not('ended_at', 'is', null)

    const { data: profiles } = await supabase.from('profiles').select('id, username')

    if (!sessions || !profiles) { setLoading(false); return }

    const profileMap = Object.fromEntries(profiles.map(p => [p.id, p.username]))

    const byUser = {}
    sessions.forEach(s => {
      if (!byUser[s.user_id]) byUser[s.user_id] = { volume: 0, count: 0, dates: [] }
      byUser[s.user_id].volume += s.total_volume_kg || 0
      byUser[s.user_id].count++
      byUser[s.user_id].dates.push(s.started_at.slice(0, 10))
    })

    const result = Object.entries(byUser).map(([uid, d]) => {
      const sorted = [...new Set(d.dates)].sort().reverse()
      let streak = 0
      for (let i = 0; i < sorted.length; i++) {
        const exp = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10)
        if (sorted[i] === exp) streak++
        else break
      }
      return {
        uid,
        username: profileMap[uid] || 'Inconnu',
        volume: Math.round(d.volume / 1000 * 10) / 10,
        count: d.count,
        streak,
      }
    })

    const sorted = result.sort((a, b) => {
      if (tab === 'volume') return b.volume - a.volume
      if (tab === 'seances') return b.count - a.count
      return b.streak - a.streak
    })

    setRankings(sorted)
    setLoading(false)
  }

  const rankColors = ['#ffb800', '#c0c0c0', '#cd7f32']

  return (
    <div style={{ padding: '24px 20px 100px' }}>
      <PageHeader icon={Trophy} title="Classement" iconColor="#ffb800" />

      <div style={{ display: 'flex', background: '#131e35', borderRadius: 14, padding: 4, marginBottom: 24, border: '1px solid #1a2a45' }}>
        {TABS.map(({ id, label }) => (
          <button key={id} onClick={() => setTab(id)} style={{
            flex: 1, padding: '10px 0', borderRadius: 10, fontSize: 13, fontWeight: 500,
            background: tab === id ? '#192038' : 'transparent',
            color: tab === id ? '#00e5ff' : '#6b7fa3',
            border: tab === id ? '1px solid #1a2a45' : 'none',
            cursor: 'pointer',
          }}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#3a4a6a', padding: 40 }}>Chargement…</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {rankings.map((r, i) => {
            const isMe = r.uid === profile?.id
            const medal = rankColors[i]
            const value = tab === 'volume' ? `${r.volume}t` : tab === 'seances' ? `${r.count}` : `${r.streak}j`
            return (
              <div key={r.uid} style={{
                background: isMe ? 'rgba(0,229,255,0.07)' : '#131e35',
                borderRadius: 14, padding: '16px 18px',
                border: isMe ? '1px solid rgba(0,229,255,0.3)' : '1px solid #1a2a45',
                display: 'flex', alignItems: 'center', gap: 14,
              }}>
                <div style={{ width: 28, textAlign: 'center' }}>
                  {i < 3
                    ? <Trophy size={20} color={medal} />
                    : <span style={{ fontSize: 14, color: '#6b7fa3', fontWeight: 700 }}>#{i + 1}</span>
                  }
                </div>
                <div style={{
                  width: 38, height: 38, borderRadius: 12, background: '#192038',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, fontWeight: 700, color: isMe ? '#00e5ff' : '#6b7fa3',
                }}>
                  {r.username.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: 15, color: '#f0f4ff' }}>
                    {r.username} {isMe && <span style={{ color: '#00e5ff', fontSize: 12, fontWeight: 400 }}>(Vous)</span>}
                  </p>
                  <p style={{ fontSize: 12, color: '#3a4a6a' }}>{r.count} séances</p>
                </div>
                <span style={{ fontSize: 20, fontWeight: 800, color: isMe ? '#00e5ff' : '#f0f4ff' }}>
                  {value}
                </span>
              </div>
            )
          })}
          {rankings.length === 0 && (
            <p style={{ textAlign: 'center', color: '#3a4a6a', padding: 40 }}>Aucune donnée</p>
          )}
        </div>
      )}
    </div>
  )
}

