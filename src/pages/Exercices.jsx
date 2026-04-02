import { useState, useEffect } from 'react'
import { Search, ChevronRight, Plus } from 'lucide-react'
import { supabase } from '../lib/supabase'

const MUSCLES = ['Tous', 'Pectoraux', 'Dos', 'Épaules', 'Biceps', 'Triceps', 'Jambes', 'Abdos', 'Cardio']

const MUSCLE_COLORS = {
  Pectoraux: '#ff3d9a', Dos: '#00e5ff', Épaules: '#ff6b35',
  Biceps: '#00f5a0', Triceps: '#ffb800', Jambes: '#b39ddb',
  Abdos: '#ff8a65', Cardio: '#ef5350',
}

export default function Exercices({ profile }) {
  const [exercises, setExercises] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Tous')
  const [showAdd, setShowAdd] = useState(false)
  const [newEx, setNewEx] = useState({ name: '', muscle_group: 'Pectoraux', equipment: '' })

  useEffect(() => { fetchExercises() }, [])

  async function fetchExercises() {
    const { data } = await supabase.from('exercises').select('*').order('name')
    setExercises(data || [])
  }

  async function addExercise() {
    if (!newEx.name || !newEx.equipment) return
    await supabase.from('exercises').insert({ ...newEx, created_by: profile.id })
    setNewEx({ name: '', muscle_group: 'Pectoraux', equipment: '' })
    setShowAdd(false)
    fetchExercises()
  }

  const filtered = exercises.filter(ex => {
    const matchSearch = ex.name.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'Tous' || ex.muscle_group === filter
    return matchSearch && matchFilter
  })

  const inputStyle = {
    width: '100%', padding: '13px 16px',
    background: '#192038', border: '1px solid #1a2a45',
    borderRadius: 14, color: '#f0f4ff', fontSize: 14,
  }

  return (
    <div style={{ padding: '24px 20px 100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#f0f4ff' }}>Exercices</h1>
        <button onClick={() => setShowAdd(!showAdd)} style={{
          width: 38, height: 38, borderRadius: 12,
          background: '#00e5ff', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Plus size={18} color="#000" strokeWidth={2.5} />
        </button>
      </div>

      {showAdd && (
        <div style={{ background: '#131e35', borderRadius: 20, padding: 20, marginBottom: 20, border: '1px solid #1a2a45' }}>
          <h3 style={{ fontSize: 16, marginBottom: 14, color: '#f0f4ff' }}>Nouvel exercice</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input style={inputStyle} placeholder="Nom de l'exercice" value={newEx.name}
              onChange={e => setNewEx({ ...newEx, name: e.target.value })} />
            <select style={{ ...inputStyle, cursor: 'pointer' }} value={newEx.muscle_group}
              onChange={e => setNewEx({ ...newEx, muscle_group: e.target.value })}>
              {MUSCLES.slice(1).map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <input style={inputStyle} placeholder="Équipement (Barre, Haltères, Machine…)" value={newEx.equipment}
              onChange={e => setNewEx({ ...newEx, equipment: e.target.value })} />
            <button onClick={addExercise} style={{
              padding: '12px 0', borderRadius: 14,
              background: '#00e5ff', color: '#000',
              fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer',
            }}>
              Ajouter
            </button>
          </div>
        </div>
      )}

      <div style={{ position: 'relative', marginBottom: 16 }}>
        <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#3a4a6a' }} />
        <input style={{ ...inputStyle, paddingLeft: 42 }} placeholder="Rechercher un exercice..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 20 }}>
        {MUSCLES.map(m => (
          <button key={m} onClick={() => setFilter(m)} style={{
            padding: '8px 16px', borderRadius: 99, whiteSpace: 'nowrap',
            background: filter === m ? '#00e5ff' : '#131e35',
            color: filter === m ? '#000' : '#6b7fa3',
            border: filter === m ? 'none' : '1px solid #1a2a45',
            fontSize: 13, fontWeight: filter === m ? 600 : 400, cursor: 'pointer',
          }}>
            {m}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(ex => {
          const color = MUSCLE_COLORS[ex.muscle_group] || '#6b7fa3'
          return (
            <div key={ex.id} style={{
              background: '#131e35', borderRadius: 14,
              padding: '16px 18px', border: '1px solid #1a2a45',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 8, color: '#f0f4ff' }}>
                  {ex.name}
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{
                    padding: '3px 12px', borderRadius: 99, fontSize: 12, fontWeight: 500,
                    background: color + '22', color, border: `1px solid ${color}44`,
                  }}>
                    {ex.muscle_group}
                  </span>
                  <span style={{
                    padding: '3px 12px', borderRadius: 99, fontSize: 12,
                    background: '#192038', color: '#6b7fa3', border: '1px solid #1a2a45',
                  }}>
                    {ex.equipment}
                  </span>
                </div>
              </div>
              <ChevronRight size={18} color="#3a4a6a" />
            </div>
          )
        })}
        {filtered.length === 0 && (
          <p style={{ textAlign: 'center', color: '#3a4a6a', padding: '40px 0', fontSize: 14 }}>
            Aucun exercice trouvé
          </p>
        )}
      </div>
    </div>
  )
}
