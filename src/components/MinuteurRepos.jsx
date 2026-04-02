import React, { useState, useRef, useEffect } from 'react';

const REST_OPTIONS = [60, 90, 120];

function playBeep() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'sine';
  o.frequency.value = 880;
  o.connect(g); g.connect(ctx.destination);
  g.gain.value = 0.2;
  o.start();
  setTimeout(() => { o.stop(); ctx.close(); }, 350);
}

const MinuteurRepos = ({ setsData, restConfig, setRestConfig, onFinish, onPrev }) => {
  // Navigation: exerciceIdx, serieIdx
  const [exIdx, setExIdx] = useState(0);
  const [serieIdx, setSerieIdx] = useState(0);
  const [timer, setTimer] = useState(restConfig);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef();

  const currentEx = setsData[exIdx];
  const totalExercises = setsData.length;
  const totalSeries = currentEx.series.length;

  useEffect(() => { setTimer(restConfig); }, [restConfig, exIdx, serieIdx]);

  useEffect(() => {
    if (running && timer > 0) {
      intervalRef.current = setTimeout(() => setTimer(t => t - 1), 1000);
    } else if (running && timer === 0) {
      setRunning(false);
      playBeep();
    }
    return () => clearTimeout(intervalRef.current);
  }, [running, timer]);

  function nextSerie() {
    if (serieIdx < totalSeries - 1) {
      setSerieIdx(serieIdx + 1);
    } else if (exIdx < totalExercises - 1) {
      setExIdx(exIdx + 1); setSerieIdx(0);
    } else {
      onFinish({ setsData });
    }
    setTimer(restConfig); setRunning(false);
  }

  function prevSerie() {
    if (serieIdx > 0) {
      setSerieIdx(serieIdx - 1);
    } else if (exIdx > 0) {
      setExIdx(exIdx - 1);
      setSerieIdx(setsData[exIdx - 1].series.length - 1);
    } else {
      onPrev();
    }
    setTimer(restConfig); setRunning(false);
  }

  return (
    <div className="minuteur-repos" style={{ padding: 20 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 18 }}>Séance en cours</h2>
      <div style={{ background: '#131e35', borderRadius: 16, padding: 16, marginBottom: 18 }}>
        <p style={{ fontWeight: 600, fontSize: 16, color: '#00e5ff', marginBottom: 8 }}>{currentEx.name}</p>
        <p style={{ color: '#f0f4ff', fontSize: 15, marginBottom: 8 }}>Série {serieIdx + 1} / {totalSeries}</p>
        <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
          <span style={{ background: '#192038', borderRadius: 8, padding: '6px 14px', color: '#fff', fontWeight: 600, fontSize: 15 }}>Répétitions : {currentEx.series[serieIdx].reps}</span>
          <span style={{ background: '#192038', borderRadius: 8, padding: '6px 14px', color: '#fff', fontWeight: 600, fontSize: 15 }}>Poids : {currentEx.series[serieIdx].weight} kg</span>
        </div>
      </div>
      <div style={{ marginBottom: 18 }}>
        <label style={{ color: '#6b7fa3', fontSize: 14, marginRight: 10 }}>Repos entre séries :</label>
        <select
          value={restConfig}
          onChange={e => setRestConfig(Number(e.target.value))}
          style={{ padding: '8px 14px', borderRadius: 10, background: '#192038', color: '#fff', border: '1px solid #1a2a45', fontSize: 15 }}
        >
          {REST_OPTIONS.map(opt => <option key={opt} value={opt}>{opt} sec</option>)}
        </select>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 18 }}>
        <span style={{ fontSize: 48, fontWeight: 800, color: timer === 0 ? '#00e5ff' : '#fff', letterSpacing: 2 }}>{timer}s</span>
        <button
          onClick={() => setRunning(r => !r)}
          style={{ marginTop: 10, padding: '10px 28px', borderRadius: 14, background: running ? '#ff3d9a' : 'linear-gradient(135deg, #006064, #00acc1)', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none' }}
        >{running ? 'Pause' : 'Démarrer'}</button>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
        <button onClick={prevSerie} className="btn-secondary" style={{ flex: 1, padding: '14px 0', borderRadius: 14, background: '#1a2a45', color: '#fff', fontWeight: 700, fontSize: 15 }}>Précédent</button>
        <button onClick={nextSerie} className="btn-primary" style={{ flex: 2, padding: '14px 0', borderRadius: 14, background: 'linear-gradient(135deg, #006064, #00acc1)', color: '#fff', fontWeight: 700, fontSize: 15 }}>Série suivante</button>
      </div>
    </div>
  );
};

export default MinuteurRepos;
