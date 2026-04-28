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
    <main className="minuteur-dashboard">
      <h2 className="minuteur-title">Séance en cours</h2>
      <section className="minuteur-exo-card">
        <p className="minuteur-exo-name">{currentEx.name}</p>
        <p className="minuteur-exo-serie">Série {serieIdx + 1} / {totalSeries}</p>
        <div className="minuteur-exo-infos">
          <span className="minuteur-exo-info">Répétitions : {currentEx.series[serieIdx].reps}</span>
          <span className="minuteur-exo-info">Poids : {currentEx.series[serieIdx].weight} kg</span>
        </div>
      </section>
      <div className="minuteur-rest-config">
        <label htmlFor="rest-input" className="minuteur-rest-label">Repos entre séries :</label>
        <input
          id="rest-input"
          type="number"
          min={1}
          value={restConfig}
          onChange={e => {
            const val = Math.max(1, Number(e.target.value));
            setRestConfig(val);
          }}
          className="minuteur-rest-input"
        />
        <span className="minuteur-rest-unit">secondes</span>
      </div>
      <div className="minuteur-timer-block">
        <span className={`minuteur-timer${timer === 0 ? ' finished' : ''}`}>{timer}s</span>
        <button
          onClick={() => setRunning(r => !r)}
          className={`minuteur-timer-btn${running ? ' pause' : ''}`}
        >{running ? 'Pause' : 'Démarrer'}</button>
      </div>
      <div className="minuteur-actions">
        <button onClick={prevSerie} className="btn-secondary minuteur-action-btn">Précédent</button>
        <button onClick={nextSerie} className="btn-primary minuteur-action-btn next">Série suivante</button>
      </div>
    </main>
  );
};

export default MinuteurRepos;
