import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Check } from 'lucide-react';

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
    <div style={{
      position: 'fixed', inset: 0,
      background: '#080d1a',
      display: 'flex', flexDirection: 'column',
      maxWidth: 480, margin: '0 auto',
      zIndex: 999,
    }}>

      {/* BOUTON EN TOUT PREMIER */}
      <div style={{
        padding: '16px 20px 12px',
        background: '#080d1a',
        borderBottom: '1px solid #1a2a45',
        flexShrink: 0,
      }}>
        {selectedExercises.length > 0 && (
          <p style={{ color: '#00e5ff', fontSize: 13, fontWeight: 600, marginBottom: 8, textAlign: 'center' }}>
            {selectedExercises.length} exercice{selectedExercises.length > 1 ? 's' : ''} sélectionné{selectedExercises.length > 1 ? 's' : ''}
          </p>
        )}
        <button
          onClick={onNext}
          disabled={selectedExercises.length === 0}
          style={{
            width: '100%', padding: '14px 0', borderRadius: 16,
            background: selectedExercises.length ? 'linear-gradient(135deg, #006064, #00acc1)' : '#1a2a45',
            color: '#fff', fontSize: 16, fontWeight: 700, border: 'none',
            cursor: selectedExercises.length ? 'pointer' : 'not-allowed',
            opacity: selectedExercises.length ? 1 : 0.5,
          }}
        >
          Valider ({selectedExercises.length})
        </button>
      </div>

      {/* TITRE + RECHERCHE + FILTRES */}
      <div style={{ padding: '16px 20px 0', flexShrink: 0 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: '#f0f4ff' }}>
          Choisis tes exercices
        </h2>
        <input
          style={{
            width: '100%', padding: '13px 16px',
            background: '#192038', border: '1px solid #1a2a45',
            borderRadius: 14, color: '#f0f4ff', fontSize: 14,
            marginBottom: 12, boxSizing: 'border-box',
          }}
          placeholder="Rechercher un exercice..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8 }}>
          {MUSCLES.map(m => (
            <button key={m} onClick={() => setFilter(m)} style={{
              padding: '7px 14px', borderRadius: 99, whiteSpace: 'nowrap',
              background: filter === m ? '#00e5ff' : '#131e35',
              color: filter === m ? '#000' : '#6b7fa3',
              border: filter === m ? 'none' : '1px solid #1a2a45',
              fontSize: 13, fontWeight: filter === m ? 600 : 400, cursor: 'pointer',
              flexShrink: 0,
            }}>{m}</button>
          ))}
        </div>
      </div>

      {/* LISTE SCROLLABLE */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: '10px 20px 20px',
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        {loading ? (
          <p style={{ color: '#6b7fa3', textAlign: 'center', marginTop: 40 }}>Chargement…</p>
        ) : filtered.length === 0 ? (
          <p style={{ color: '#3a4a6a', textAlign: 'center', marginTop: 40 }}>Aucun exercice trouvé</p>
        ) : filtered.map(ex => {
          const color = MUSCLE_COLORS[ex.muscle_group] || '#6b7fa3';
          const checked = selectedExercises.some(e => e.id === ex.id);
          return (
            <div key={ex.id} onClick={() => toggleExercise(ex)} style={{
              background: checked ? '#00e5ff14' : '#131e35',
              borderRadius: 14, padding: '12px 14px',
              border: checked ? '1.5px solid #00e5ff55' : '1px solid #1a2a45',
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', cursor: 'pointer',
            }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 6, color: checked ? '#00e5ff' : '#f0f4ff' }}>
                  {ex.name}
                </p>
                <div style={{ display: 'flex', gap: 6 }}>
                  <span style={{
                    padding: '2px 10px', borderRadius: 99, fontSize: 12, fontWeight: 500,
                    background: color + '22', color, border: `1px solid ${color}44`,
                  }}>{ex.muscle_group}</span>
                  {ex.equipment && (
                    <span style={{
                      padding: '2px 10px', borderRadius: 99, fontSize: 12,
                      background: '#192038', color: '#6b7fa3', border: '1px solid #1a2a45',
                    }}>{ex.equipment}</span>
                  )}
                </div>
              </div>
              <div style={{
                width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                background: checked ? '#00e5ff' : '#192038',
                border: checked ? 'none' : '1.5px solid #1a2a45',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {checked && <Check size={13} color="#000" strokeWidth={3} />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExerciceSelector;
