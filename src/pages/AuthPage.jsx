import { useState } from 'react'
import { Dumbbell } from 'lucide-react'

export default function AuthPage({ onSignIn, onSignUp }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const inputStyle = {
    width: '100%', padding: '14px 16px',
    background: '#192038', border: '1px solid #1a2a45',
    borderRadius: 14, color: '#f0f4ff',
    fontSize: 15, fontFamily: 'sans-serif',
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') await onSignIn(email, password)
      else await onSignUp(email, password, username)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 24, background: '#080d1a',
    }}>
      <div style={{ marginBottom: 40, textAlign: 'center' }}>
        <div style={{
          width: 64, height: 64, borderRadius: 20, margin: '0 auto 16px',
          background: 'linear-gradient(135deg, #006064, #00acc1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Dumbbell size={30} color="#00e5ff" />
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f0f4ff' }}>
          Gym Buddy
        </h1>
        <p style={{ color: '#6b7fa3', marginTop: 6, fontSize: 14 }}>
          Suis tes séances, bats tes records
        </p>
      </div>

      <div style={{
        width: '100%', maxWidth: 380,
        background: '#0e1628', borderRadius: 28,
        border: '1px solid #1a2a45', padding: 28,
      }}>
        <div style={{ display: 'flex', background: '#192038', borderRadius: 14, padding: 4, marginBottom: 24 }}>
          {['login', 'signup'].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, padding: '10px 0', borderRadius: 10,
              background: mode === m ? '#131e35' : 'transparent',
              color: mode === m ? '#00e5ff' : '#6b7fa3',
              fontSize: 14, fontWeight: 500,
              border: mode === m ? '1px solid #1a2a45' : 'none',
              cursor: 'pointer',
            }}>
              {m === 'login' ? 'Connexion' : 'Inscription'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {mode === 'signup' && (
            <input style={inputStyle} placeholder="Pseudo" value={username}
              onChange={e => setUsername(e.target.value)} required />
          )}
          <input style={inputStyle} type="email" placeholder="Email" value={email}
            onChange={e => setEmail(e.target.value)} required />
          <input style={inputStyle} type="password" placeholder="Mot de passe" value={password}
            onChange={e => setPassword(e.target.value)} required />

          {error && (
            <p style={{ color: '#ff4d6d', fontSize: 13, textAlign: 'center' }}>{error}</p>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '15px 0', borderRadius: 14, marginTop: 6,
            background: 'linear-gradient(135deg, #006064, #00acc1)',
            color: '#fff', fontSize: 15, fontWeight: 600,
            border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}>
            {loading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : "S'inscrire"}
          </button>
        </form>
      </div>
    </div>
  )
}

