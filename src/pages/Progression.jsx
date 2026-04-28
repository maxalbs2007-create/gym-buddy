import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Progression() {
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { fetchPhotos(); }, []);

  async function fetchPhotos() {
    setError('');
    const user = supabase.auth.getUser();
    if (!user) return;
    const { data, error } = await supabase
      .from('progress_photos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setPhotos(data || []);
  }

  async function handleUpload(e) {
    setError('');
    setUploading(true);
    const file = e.target.files[0];
    if (!file) return;
    const user = supabase.auth.getUser();
    if (!user) return;
    const filePath = `${user.id}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('progress-photos')
      .upload(filePath, file);
    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }
    await supabase.from('progress_photos').insert({
      user_id: user.id,
      path: filePath,
      created_at: new Date().toISOString(),
    });
    setUploading(false);
    fetchPhotos();
  }

  return (
    <main className="progression-dashboard">
      <header className="progression-header">
        <h2>Progression physique</h2>
        <label className="upload-label-pro">
          <input type="file" accept="image/*" onChange={handleUpload} disabled={uploading} style={{ display: 'none' }} />
          <span className="upload-btn-pro">{uploading ? 'Envoi…' : 'Ajouter une photo'}</span>
        </label>
      </header>
      {error && <div className="error-msg-pro">{error}</div>}
      <section className="photos-grid-pro">
        {photos.length === 0 && <div className="empty-pro">Aucune photo pour l’instant.</div>}
        {photos.map(photo => (
          <div key={photo.id} className="photo-item-pro">
            <img src={supabase.storage.from('progress-photos').getPublicUrl(photo.path).data.publicUrl} alt="progression" />
            <div className="photo-date-pro">{new Date(photo.created_at).toLocaleDateString()}</div>
          </div>
        ))}
      </section>
    </main>
  );
}
