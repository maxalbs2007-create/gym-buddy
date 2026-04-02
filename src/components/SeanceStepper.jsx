import React from 'react';

const defaultSerie = { reps: '', weight: '' };

const SeanceStepper = ({ exercises, setsData, setSetsData, onNext, onPrev }) => {
  // setsData: [{exId, series: [{reps, weight}]}]
  React.useEffect(() => {
    // Init setsData if vide ou si exercices changent
    if (!setsData.length && exercises.length) {
      setSetsData(exercises.map(ex => ({ exId: ex.id, name: ex.name, series: [ { ...defaultSerie } ] })));
    }
  }, [exercises]);

  function updateSerie(exId, idx, field, value) {
    setSetsData(setsData.map(ex =>
      ex.exId === exId
        ? { ...ex, series: ex.series.map((s, i) => i === idx ? { ...s, [field]: value } : s) }
        : ex
    ));
  }

  function addSerie(exId) {
    setSetsData(setsData.map(ex =>
      ex.exId === exId
        ? { ...ex, series: [ ...ex.series, { ...defaultSerie } ] }
        : ex
    ));
  }

  function removeSerie(exId, idx) {
    setSetsData(setsData.map(ex =>
      ex.exId === exId
        ? { ...ex, series: ex.series.filter((_, i) => i !== idx) }
        : ex
    ));
  }

  // Validation: chaque exercice doit avoir au moins une série complète
  const isValid = setsData.length === exercises.length && setsData.every(ex =>
    ex.series.length > 0 && ex.series.every(s => s.reps && s.weight)
  );

  return (
    <div className="seance-stepper" style={{ padding: 20 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 18 }}>Paramètre tes séries</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {exercises.map(ex => {
          const exData = setsData.find(e => e.exId === ex.id) || { series: [] };
          return (
            <div key={ex.id} style={{ background: '#131e35', borderRadius: 16, padding: 16 }}>
              <p style={{ fontWeight: 600, fontSize: 16, marginBottom: 10, color: '#00e5ff' }}>{ex.name}</p>
              {exData.series.map((serie, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                  <input
                    type="number"
                    min={1}
                    placeholder="Répétitions"
                    value={serie.reps}
                    onChange={e => updateSerie(ex.id, idx, 'reps', e.target.value)}
                    style={{ width: 90, padding: '8px 10px', borderRadius: 8, border: '1px solid #1a2a45', background: '#192038', color: '#f0f4ff', fontSize: 14 }}
                  />
                  <input
                    type="number"
                    min={0}
                    placeholder="Poids (kg)"
                    value={serie.weight}
                    onChange={e => updateSerie(ex.id, idx, 'weight', e.target.value)}
                    style={{ width: 110, padding: '8px 10px', borderRadius: 8, border: '1px solid #1a2a45', background: '#192038', color: '#f0f4ff', fontSize: 14 }}
                  />
                  {exData.series.length > 1 && (
                    <button onClick={() => removeSerie(ex.id, idx)} style={{ color: '#ff3d9a', background: 'none', border: 'none', fontSize: 18, fontWeight: 700, cursor: 'pointer' }}>×</button>
                  )}
                </div>
              ))}
              <button onClick={() => addSerie(ex.id)} style={{ marginTop: 4, color: '#00e5ff', background: 'none', border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>+ Ajouter une série</button>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 32 }}>
        <button onClick={onPrev} className="btn-secondary" style={{ flex: 1, padding: '14px 0', borderRadius: 14, background: '#1a2a45', color: '#fff', fontWeight: 700, fontSize: 15 }}>Retour</button>
        <button onClick={onNext} className="btn-primary" disabled={!isValid} style={{ flex: 2, padding: '14px 0', borderRadius: 14, background: isValid ? 'linear-gradient(135deg, #006064, #00acc1)' : '#1a2a45', color: '#fff', fontWeight: 700, fontSize: 15, opacity: isValid ? 1 : 0.6 }}>Suivant</button>
      </div>
    </div>
  );
};

export default SeanceStepper;
