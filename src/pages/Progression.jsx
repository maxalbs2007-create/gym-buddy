import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const Progression = ({ profile }) => {
  const [infos, setInfos] = useState({ poids: '', taille: '', age: '' });
  const [showForm, setShowForm] = useState(true);
  const [photo, setPhoto] = useState(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [progressData, setProgressData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Charger les infos si déjà enregistrées
    const saved = localStorage.getItem('progress-infos');
    if (saved) {
      setInfos(JSON.parse(saved));
      setShowForm(false);
    }
  }, []);

  function handleChange(e) {
    setInfos({ ...infos, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    localStorage.setItem('progress-infos', JSON.stringify(infos));
    setShowForm(false);
  }

  async function handlePhoto(e) {
    setError('');
    const file = e.target.files[0];
    setPhoto(file);
    if (!file || !profile) return;
    // Upload vers Supabase Storage
    const { data, error: uploadError } = await supabase.storage.from('progress-photos').upload(`${profile.id}/${Date.now()}_${file.name}`, file);
    if (!uploadError && data) {
      const url = supabase.storage.from('progress-photos').getPublicUrl(data.path).publicUrl;
      setPhotoUrl(url);
    } else {
      setError(uploadError?.message || 'Erreur upload');
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 18 }}>Progression</h2>
      {showForm ? (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 320 }}>
          <label>Poids (kg)
            <input type="number" name="poids" value={infos.poids} onChange={handleChange} required min={1} />
          </label>
          <label>Taille (cm)
            <input type="number" name="taille" value={infos.taille} onChange={handleChange} required min={1} />
          </label>
          <label>Âge
            <input type="number" name="age" value={infos.age} onChange={handleChange} required min={1} />
          </label>
          <button type="submit" className="btn-primary">Valider</button>
        </form>
      ) : (
        <div>
          <div style={{ marginBottom: 24 }}>
            <p>Poids : {infos.poids} kg</p>
            <p>Taille : {infos.taille} cm</p>
            <p>Âge : {infos.age} ans</p>
          </div>
          <div style={{ marginBottom: 24 }}>
            <label>Ajouter une photo de progression
              <input type="file" accept="image/*" onChange={handlePhoto} />
            </label>
            {photoUrl && <img src={photoUrl} alt="Progression" style={{ maxWidth: 200, marginTop: 12, borderRadius: 12 }} />}
            {error && <div style={{ color: '#ff3d9a', marginTop: 8 }}>{error}</div>}
          </div>
          {/* Graphe de progression à ajouter ici */}
        </div>
      )}
    </div>
  );
};

export default Progression;
