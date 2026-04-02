import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const MUSCLES = ['Tous', 'Pectoraux', 'Dos', 'Épaules', 'Biceps', 'Triceps', 'Jambes', 'Abdos', 'Cardio'];
const MUSCLE_COLORS = {
  Pectoraux: '#ff3d9a', Dos: '#00e5ff', Épaules: '#ff6b35',
  Biceps: '#00f5a0', Triceps: '#ffb800', Jambes: '#b39ddb',
  Abdos: '#ff8a65', Cardio: '#ef5350',
};

const ExerciceSelector = ({ selectedExercises, setSelectedExercises, onNext }) => {
  const [exercises, setExercises] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Tous');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchExercises(); }, []);

  async function fetchExercises() {
    setLoading(true);
    const { data } = await supabase.from('exercises').select('*').order('name');
    setExercises(data || []);
    setLoading(false);
  }

  const filtered = exercises.filter(ex => {
    const matchSearch = ex.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'Tous' || ex.muscle_group === filter;
    return matchSearch && matchFilter;
  });

  function toggleExercise(ex) {
    if (selectedExercises.some(e => e.id === ex.id)) {
      setSelectedExercises(selectedExercises.filter(e => e.id !== ex.id));
    } else {
      setSelectedExercises([...selectedExercises, ex]);
    }
  }

  return (
    <div className="exercice-selector" style={{ padding: 20 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 18 }}>Choisis tes exercices</h2>
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <input
          style={{ width: '100%', padding: '13px 16px', background: '#192038', border: '1px solid #1a2a45', borderRadius: 14, color: '#f0f4ff', fontSize: 14, paddingLeft: 16 }}
          placeholder="Rechercher un exercice..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 20 }}>
        {MUSCLES.map(m => (
          <button key={m} onClick={() => setFilter(m)} style={{
            padding: '8px 16px', borderRadius: 99, whiteSpace: 'nowrap',
            background: filter === m ? '#00e5ff' : '#131e35',
            color: filter === m ? '#000' : '#6b7fa3',
            border: filter === m ? 'none' : '1px solid #1a2a45',
            fontSize: 13, fontWeight: filter === m ? 600 : 400, cursor: 'pointer',
          }}>{m}</button>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 120 }}>
        {loading ? (
          <p style={{ color: '#6b7fa3', textAlign: 'center' }}>Chargement…</p>
        ) : filtered.length === 0 ? (
          <p style={{ color: '#3a4a6a', textAlign: 'center' }}>Aucun exercice trouvé</p>
        ) : filtered.map(ex => {
          const color = MUSCLE_COLORS[ex.muscle_group] || '#6b7fa3';
          const checked = selectedExercises.some(e => e.id === ex.id);
          return (
            <div key={ex.id} style={{
              background: checked ? '#00e5ff22' : '#131e35', borderRadius: 14,
              padding: '14px 16px', border: checked ? '2px solid #00e5ff' : '1px solid #1a2a45',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer',
            }} onClick={() => toggleExercise(ex)}>
              <div>
                <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 8, color: checked ? '#00e5ff' : '#f0f4ff' }}>{ex.name}</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{
                    padding: '3px 12px', borderRadius: 99, fontSize: 12, fontWeight: 500,
                    background: color + '22', color, border: `1px solid ${color}44`,
                  }}>{ex.muscle_group}</span>
                  <span style={{
                    padding: '3px 12px', borderRadius: 99, fontSize: 12,
                    background: '#192038', color: '#6b7fa3', border: '1px solid #1a2a45',
                  }}>{ex.equipment}</span>
                </div>
              </div>
              <input type="checkbox" checked={checked} readOnly style={{ width: 20, height: 20 }} />
            </div>
          );
        })}
      </div>
      <button
        onClick={onNext}
        className="btn-primary"
        disabled={selectedExercises.length === 0}
        style={{
          marginTop: 28, width: '100%', padding: '16px 0', borderRadius: 16,
          background: selectedExercises.length ? 'linear-gradient(135deg, #006064, #00acc1)' : '#1a2a45',
          color: '#fff', fontSize: 16, fontWeight: 700, border: 'none', opacity: selectedExercises.length ? 1 : 0.6,
        }}
      >Valider</button>
    </div>
  );
};

export default ExerciceSelector;
