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
    <main className="historique-dashboard">
      <PageHeader icon={CalendarDays} title="Historique" iconColor="#00f5a0" />
      {loading ? (
        <p className="historique-loading">Chargement…</p>
      ) : sessions.length === 0 ? (
        <div className="historique-empty">
          <CalendarDays size={40} color="#3a4a6a" style={{ margin: '0 auto 16px' }} />
          <p>Aucune séance enregistrée</p>
          <span>Commence par créer une nouvelle séance !</span>
        </div>
      ) : (
        Object.entries(grouped).map(([month, list]) => (
          <section key={month} className="historique-month">
            <p className="historique-month-label">{month}</p>
            <div className="historique-list">
              {list.map(s => {
                const day = new Date(s.started_at).getDate().toString().padStart(2, '0')
                const sets = s.session_sets?.[0]?.count || 0
                const vol = s.total_volume_kg ? `${(s.total_volume_kg / 1000).toFixed(1)}t` : '—'
                return (
                  <div key={s.id} className="historique-card">
                    <div className="historique-day">{day}</div>
                    <div className="historique-info">
                      <p className="historique-title">{s.name}</p>
                      <div className="historique-details">
                        <span><Dumbbell size={12} /> {sets} exercices</span>
                        <span><Clock size={12} /> {formatDuration(s.started_at, s.ended_at)}</span>
                      </div>
                    </div>
                    <span className="historique-volume">{vol}</span>
                    <button onClick={() => deleteSession(s.id)} className="historique-delete">
                      <Trash2 size={14} color="#ff3d9a" />
                    </button>
                  </div>
                )
              })}
            </div>
          </section>
        ))
      )}
    </main>
  )
}

