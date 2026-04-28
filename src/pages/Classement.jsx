import { useState, useEffect } from 'react'
import { Trophy, TrendingUp, Flame } from 'lucide-react'
import { supabase } from '../lib/supabase'
import PageHeader from '../components/PageHeader'

const TABS = [
  { id: 'volume', label: 'Volume' },
  { id: 'seances', label: 'Séances' },
  { id: 'serie', label: 'Série' },
  { id: 'exercice', label: 'Par exercice' },
]

export default function Classement({ profile }) {
  const [tab, setTab] = useState('volume')
  const [rankings, setRankings] = useState([])
  const [loading, setLoading] = useState(true)
  const [exerciseRankings, setExerciseRankings] = useState([])
  const [friendIds, setFriendIds] = useState([])

  useEffect(() => {
    fetchFriends()
  }, [profile])

  useEffect(() => {
    if (tab === 'exercice') fetchExerciseRankings()
    else fetchRankings()
  }, [tab, friendIds])

  async function fetchFriends() {
    if (!profile) return
    const { data } = await supabase
      .from('friendships')
      .select('*')
      .or(`sender_id.eq.${profile.id},receiver_id.eq.${profile.id}`)
      .eq('status', 'accepted')
    const ids = new Set([profile.id])
    ;(data || []).forEach(f => {
      if (f.sender_id === profile.id) ids.add(f.receiver_id)
      else ids.add(f.sender_id)
    })
    setFriendIds([...ids])
  }

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

    // Filtre par amis
    const filtered = result.filter(r => friendIds.includes(r.uid))

    const sorted = filtered.sort((a, b) => {
      if (tab === 'volume') return b.volume - a.volume
      if (tab === 'seances') return b.count - a.count
      return b.streak - a.streak
    })

    setRankings(sorted)
    setLoading(false)
  }

  async function fetchExerciseRankings() {
    setLoading(true)
    const { data: exercises } = await supabase.from('exercises').select('id, name')
    const { data: sets } = await supabase.from('session_sets').select('exercise_id, weight, reps, session_id, user_id')
    const { data: profiles } = await supabase.from('profiles').select('id, username')
    if (!exercises || !sets || !profiles) { setExerciseRankings([]); setLoading(false); return }
    const profileMap = Object.fromEntries(profiles.map(p => [p.id, p.username]))
    // Pour chaque exercice, top 5 perfs (poids max)
    const byExercise = {}
    exercises.forEach(ex => {
      byExercise[ex.id] = { name: ex.name, perfs: [] }
    })
    sets.forEach(s => {
      if (byExercise[s.exercise_id] && friendIds.includes(s.user_id)) {
        byExercise[s.exercise_id].perfs.push({
          user_id: s.user_id,
          username: profileMap[s.user_id] || 'Inconnu',
          weight: s.weight,
          reps: s.reps,
        })
      }
    })
    // Pour chaque exercice, trie et garde le top 5
    const result = Object.values(byExercise).map(ex => ({
      name: ex.name,
      top: ex.perfs.sort((a, b) => b.weight - a.weight).slice(0, 5)
    }))
    setExerciseRankings(result)
    setLoading(false)
  }

  const rankColors = ['#ffb800', '#c0c0c0', '#cd7f32']

  return (
    <main className="classement-dashboard">
      <PageHeader icon={Trophy} title="Classement" iconColor="#ffb800" />
      <nav className="classement-tabs">
        {TABS.map(({ id, label }) => (
          <button key={id} onClick={() => setTab(id)} className={tab === id ? 'tab-active' : ''}>
            {label}
          </button>
        ))}
      </nav>
      {loading ? (
        <p className="classement-loading">Chargement…</p>
      ) : tab !== 'exercice' ? (
        <section className="classement-list">
          {rankings.map((r, i) => {
            const isMe = r.uid === profile?.id
            const medal = rankColors[i]
            const value = tab === 'volume' ? `${r.volume}t` : tab === 'seances' ? `${r.count}` : `${r.streak}j`
            return (
              <div key={r.uid} className={`classement-card${isMe ? ' me' : ''}`}>
                <div className="classement-rank">
                  {i < 3
                    ? <Trophy size={20} color={medal} />
                    : <span className="classement-rank-num">#{i + 1}</span>
                  }
                </div>
                <div className="classement-avatar" style={{ color: isMe ? '#00e5ff' : '#6b7fa3' }}>
                  {r.username.charAt(0).toUpperCase()}
                </div>
                <div className="classement-user">
                  <p className="classement-username">
                    {r.username} {isMe && <span className="classement-me">(Vous)</span>}
                  </p>
                  <p className="classement-user-detail">{r.count} séances</p>
                </div>
                <span className="classement-value" style={{ color: isMe ? '#00e5ff' : '#f0f4ff' }}>{value}</span>
              </div>
            )
          })}
          {rankings.length === 0 && (
            <p className="classement-empty">Aucune donnée</p>
          )}
        </section>
      ) : (
        <section className="classement-exos">
          {exerciseRankings.map(ex => (
            <div key={ex.name} className="classement-exo-card">
              <div className="classement-exo-title">{ex.name}</div>
              {ex.top.length === 0 ? (
                <p className="classement-exo-empty">Aucune performance</p>
              ) : (
                <ol className="classement-exo-list">
                  {ex.top.map((perf, idx) => (
                    <li key={perf.user_id + '-' + idx} className="classement-exo-perf" style={{ fontWeight: idx === 0 ? 800 : 600 }}>
                      {perf.username} — <span style={{ color: '#00e5ff', fontWeight: 800 }}>{perf.weight} kg</span> {perf.reps > 1 && <span style={{ color: '#6b7fa3', fontWeight: 400 }}>({perf.reps} reps)</span>}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          ))}
        </section>
      )}
    </main>
  )
}

