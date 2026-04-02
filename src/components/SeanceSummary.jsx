import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const SeanceSummary = ({ summary, onPrev, onSaved, profile, onNavigate }) => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  if (!summary || !profile) return null;

  // Calcul volume total
  const allSets = summary.setsData.flatMap(ex => ex.series.map(s => ({ ...s, exId: ex.exId, name: ex.name })));
  const totalVolume = allSets.reduce((sum, s) => sum + (Number(s.reps) * Number(s.weight)), 0);

  async function saveSession() {
    setSaving(true); setError('');
    try {
      const name = `Séance du ${new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}`;
      const { data: session, error: err1 } = await supabase.from('sessions').insert({
        user_id: profile.id,
        name,
        total_volume_kg: totalVolume,
        started_at: new Date().toISOString(),
        ended_at: new Date().toISOString(),
      }).select().single();
      if (err1 || !session) throw err1 || new Error('Erreur création session');
      // Ajout des sets
      const setsToInsert = [];
      summary.setsData.forEach(ex => {
        ex.series.forEach((s, idx) => {
          setsToInsert.push({
            session_id: session.id,
            exercise_id: ex.exId,
            set_index: idx + 1,
            reps: Number(s.reps),
            weight: Number(s.weight),
          });
        });
      });
      const { error: err2 } = await supabase.from('session_sets').insert(setsToInsert);
      if (err2) throw err2;
      if (onNavigate) onNavigate('historique');
      if (onSaved) onSaved();
    } catch (e) {
      setError('Erreur lors de la sauvegarde.');
    }
    setSaving(false);
  }

  return (
    <div className="seance-summary" style={{ padding: 20 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 18 }}>Résumé de la séance</h2>
      <div style={{ background: '#131e35', borderRadius: 16, padding: 16, marginBottom: 18 }}>
        <p style={{ color: '#f0f4ff', fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Volume total : <span style={{ color: '#00e5ff' }}>{totalVolume} kg</span></p>
        <ul style={{ color: '#f0f4ff', fontSize: 15, margin: 0, padding: 0, listStyle: 'none' }}>
          {summary.setsData.map(ex => (
            <li key={ex.exId} style={{ marginBottom: 10 }}>
              <span style={{ color: '#00e5ff', fontWeight: 600 }}>{ex.name}</span>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {ex.series.map((s, i) => (
                  <li key={i} style={{ color: '#6b7fa3', fontSize: 14 }}>
                    Série {i + 1} : {s.reps} reps × {s.weight} kg
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
      {error && <p style={{ color: '#ff3d9a', marginBottom: 10 }}>{error}</p>}
      <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
        <button onClick={onPrev} className="btn-secondary" style={{ flex: 1, padding: '14px 0', borderRadius: 14, background: '#1a2a45', color: '#fff', fontWeight: 700, fontSize: 15 }}>Retour</button>
        <button onClick={saveSession} className="btn-primary" disabled={saving} style={{ flex: 2, padding: '14px 0', borderRadius: 14, background: 'linear-gradient(135deg, #006064, #00acc1)', color: '#fff', fontWeight: 700, fontSize: 15, opacity: saving ? 0.6 : 1 }}>{saving ? 'Sauvegarde…' : 'Sauvegarder'}</button>
      </div>
    </div>
  );
};

export default SeanceSummary;
