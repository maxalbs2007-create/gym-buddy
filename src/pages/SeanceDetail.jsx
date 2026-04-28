import { useState, useEffect } from 'react'
import { ArrowLeft, Dumbbell, Clock, Weight, Trash2, ChevronDown, ChevronUp, Flame } from 'lucide-react'
import { supabase } from '../lib/supabase'

const MUSCLE_COLORS = {
  Pectoraux: '#ff3d9a', Dos: '#00e5ff', Épaules: '#ff6b35',
  Biceps: '#00f5a0', Triceps: '#ffb800', Jambes: '#b39ddb',
  Abdos: '#ff8a65', Cardio: '#ef5350',
}
const getMuscleColor = (g) => MUSCLE_COLORS[g] || '#6b7fa3'

function formatDuration(start, end) {
  if (!end) return 'En cours'
  const mins = Math.round((new Date(end) - new Date(start)) / 60000)
  if (mins < 60) return `${mins} min`
  return `${Math.floor(mins / 60)}h${mins % 60 > 0 ? String(mins % 60).padStart(2, '0') + 'min' : ''}`
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })
}

function ExerciseBlock({ exName, muscleGroup, sets }) {
  const [open, setOpen] = useState(true)
  const color = getMuscleColor(muscleGroup)
  const totalVol = sets.reduce((s, r) => s + (r.reps || 0) * (r.weight || 0), 0)
  const bestSet = sets.reduce((best, s) => {
    const val = (s.reps || 0) * (s.weight || 0)
    return val > (best.reps || 0) * (best.weight || 0) ? s : best
  }, sets[0] || {})

  return (
    <div className="detail-ex-block">
      <button className="detail-ex-header" onClick={() => setOpen(o => !o)}>
        <div className="detail-ex-icon" style={{ background: color + '22' }}>
          <Dumbbell size={16} color={color} />
        </div>
        <div className="detail-ex-info">
          <span className="detail-ex-name">{exName}</span>
          <span className="detail-ex-tag" style={{ background: color + '22', color }}>{muscleGroup}</span>
        </div>
        <div className="detail-ex-summary">
          <span className="detail-ex-vol">{totalVol > 0 ? `${totalVol} kg` : '—'}</span>
          {open ? <ChevronUp size={16} color="#3a4a6a" /> : <ChevronDown size={16} color="#3a4a6a" />}
        </div>
      </button>

      {open && (
        <div className="detail-sets-table">
          <div className="detail-sets-header">
            <span>Série</span><span>Reps</span><span>Poids</span><span>Volume</span>
          </div>
          {sets.map((s, i) => {
            const isBest = s === bestSet && sets.length > 1 && s.weight > 0
            return (
              <div key={i} className={`detail-set-row${isBest ? ' best' : ''}`}>
                <span className="detail-set-num">{i + 1}</span>
                <span>{s.reps ?? '—'}</span>
                <span>{s.weight != null ? `${s.weight} kg` : '—'}</span>
                <span className="detail-set-vol" style={{ color }}>
                  {s.reps && s.weight ? `${s.reps * s.weight} kg` : '—'}
                </span>
                {isBest && <span className="detail-set-badge">🏆</span>}
              </div>
            )
          })}
          <div className="detail-sets-footer">
            <span>{sets.length} série{sets.length > 1 ? 's' : ''}</span>
            <span>Total : <strong style={{ color }}>{totalVol} kg</strong></span>
          </div>
        </div>
      )}
    </div>
  )
}

export default function SeanceDetail({ sessionId, onBack }) {
  const [session, setSession] = useState(null)
  const [exercisesData, setExercisesData] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => { if (sessionId) fetchDetail() }, [sessionId])

  async function fetchDetail() {
    setLoading(true)
    const { data: sess } = await supabase
      .from('sessions').select('*').eq('id', sessionId).single()
    if (!sess) { setLoading(false); return }
    setSession(sess)

    const { data: sets } = await supabase
      .from('session_sets')
      .select('*, exercises(name, muscle_group)')
      .eq('session_id', sessionId)
      .order('set_index', { ascending: true })

    const grouped = {}
    ;(sets || []).forEach(s => {
      const key = s.exercise_id
      if (!grouped[key]) {
        grouped[key] = {
          exId: key,
          name: s.exercises?.name || 'Exercice inconnu',
          muscleGroup: s.exercises?.muscle_group || '—',
          sets: []
        }
      }
      grouped[key].sets.push({ reps: s.reps, weight: s.weight, setIndex: s.set_index })
    })
    setExercisesData(Object.values(grouped))
    setLoading(false)
  }

  async function handleDelete() {
    if (!confirm('Supprimer cette séance définitivement ?')) return
    setDeleting(true)
    await supabase.from('session_sets').delete().eq('session_id', sessionId)
    await supabase.from('sessions').delete().eq('id', sessionId)
    onBack()
  }

  if (loading) return (
    <main className="detail-dashboard">
      <div className="detail-loading">
        <div className="detail-spinner" />
        <p>Chargement…</p>
      </div>
    </main>
  )

  if (!session) return (
    <main className="detail-dashboard">
      <p style={{ color: '#3a4a6a', textAlign: 'center', marginTop: 60 }}>Séance introuvable.</p>
      <button className="detail-back-btn" onClick={onBack}>← Retour</button>
    </main>
  )

  const totalVolume = exercisesData.reduce((sum, ex) =>
    sum + ex.sets.reduce((s, r) => s + (r.reps || 0) * (r.weight || 0), 0), 0)
  const totalSets = exercisesData.reduce((s, ex) => s + ex.sets.length, 0)

  return (
    <main className="detail-dashboard">
      <div className="detail-header">
        <button className="detail-back-btn" onClick={onBack}><ArrowLeft size={18} /></button>
        <div className="detail-header-title">
          <h1>{session.name}</h1>
          <p className="detail-date">{formatDate(session.started_at)}</p>
        </div>
        <button className="detail-delete-btn" onClick={handleDelete} disabled={deleting}>
          <Trash2 size={16} color="#ff3d9a" />
        </button>
      </div>

      <div className="detail-stats-row">
        <div className="detail-stat">
          <Dumbbell size={18} color="#00e5ff" />
          <div><span className="detail-stat-val">{exercisesData.length}</span><span className="detail-stat-label">Exercices</span></div>
        </div>
        <div className="detail-stat">
          <Flame size={18} color="#ff3d9a" />
          <div><span className="detail-stat-val">{totalSets}</span><span className="detail-stat-label">Séries</span></div>
        </div>
        <div className="detail-stat">
          <Weight size={18} color="#00f5a0" />
          <div>
            <span className="detail-stat-val">
              {totalVolume >= 1000 ? `${(totalVolume / 1000).toFixed(1)}t` : `${totalVolume} kg`}
            </span>
            <span className="detail-stat-label">Volume</span>
          </div>
        </div>
        <div className="detail-stat">
          <Clock size={18} color="#ffb800" />
          <div><span className="detail-stat-val">{formatDuration(session.started_at, session.ended_at)}</span><span className="detail-stat-label">Durée</span></div>
        </div>
      </div>

      <div className="detail-exercises-list">
        {exercisesData.length === 0 ? (
          <div className="detail-empty">
            <Dumbbell size={36} color="#3a4a6a" />
            <p>Aucune donnée pour cette séance.</p>
          </div>
        ) : exercisesData.map(ex => (
          <ExerciseBlock key={ex.exId} exName={ex.name} muscleGroup={ex.muscleGroup} sets={ex.sets} />
        ))}
      </div>
    </main>
  )
}