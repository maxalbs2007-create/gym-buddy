import { useState, useEffect } from 'react'
import { CalendarDays, Dumbbell, Clock, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import PageHeader from '../components/PageHeader'

export default function Historique({ profile }) {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { if (profile) fetchSessions() }, [profile])

  async function fetchSessions() {
    const { data } = await supabase
      .from('sessions')
      .select('*, session_sets(count)')
      .eq('user_id', profile.id)
      .order('started_at', { ascending: false })
    setSessions(data || [])
    setLoading(false)
  }

  async function deleteSession(id) {
    await supabase.from('sessions').delete().eq('id', id)
    fetchSessions()
  }

  const grouped = {}
  sessions.forEach(s => {
    const key = new Date(s.started_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }).toUpperCase()
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(s)
  })

  function formatDuration(start, end) {
    if (!end) return 'En cours'
    const mins = Math.round((new Date(end) - new Date(start)) / 60000)
    if (mins < 60) return `${mins} min`
    return `${Math.floor(mins / 60)}h${mins % 60 > 0 ? mins % 60 + 'min' : ''}`
  }

  return (
    <div style={{ padding: '24px 20px 100px' }}>
      <PageHeader icon={CalendarDays} title="Historique" iconColor="#00f5a0" />

      {loading ? (
        <p style={{ textAlign: 'center', color: '#3a4a6a', padding: 40 }}>Chargement…</p>
      ) : sessions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#131e35', borderRadius: 20, border: '1px solid #1a2a45' }}>
          <CalendarDays size={40} color="#3a4a6a" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: '#3a4a6a', fontSize: 15 }}>Aucune séance enregistrée</p>
          <p style={{ color: '#3a4a6a', fontSize: 13, marginTop: 6 }}>Commence par créer une nouvelle séance !</p>
        </div>
      ) : (
        Object.entries(grouped).map(([month, list]) => (
          <div key={month} style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#3a4a6a', letterSpacing: '0.1em', marginBottom: 12 }}>
              {month}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {list.map(s => {
                const day = new Date(s.started_at).getDate().toString().padStart(2, '0')
                const sets = s.session_sets?.[0]?.count || 0
                const vol = s.total_volume_kg ? `${(s.total_volume_kg / 1000).toFixed(1)}t` : '—'
                return (
                  <div key={s.id} style={{ background: '#131e35', borderRadius: 14, padding: '16px 18px', border: '1px solid #1a2a45', display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: '#192038', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 800, color: '#00e5ff', flexShrink: 0 }}>
                      {day}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 6, color: '#f0f4ff' }}>{s.name}</p>
                      <div style={{ display: 'flex', gap: 12 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#3a4a6a' }}>
                          <Dumbbell size={12} /> {sets} exercices
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#3a4a6a' }}>
                          <Clock size={12} /> {formatDuration(s.started_at, s.ended_at)}
                        </span>
                      </div>
                    </div>
                    <span style={{ fontSize: 16, fontWeight: 800, color: '#00e5ff', marginRight: 8 }}>{vol}</span>
                    <button onClick={() => deleteSession(s.id)} style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(255,61,154,0.1)', border: '1px solid rgba(255,61,154,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <Trash2 size={14} color="#ff3d9a" />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

