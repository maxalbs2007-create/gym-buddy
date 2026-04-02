import { useState, useEffect } from 'react'
import { Users, UserPlus, Check, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import PageHeader from '../components/PageHeader'

const TABS = ['Amis', 'Demandes', 'Envoyées']

export default function Amis({ profile }) {
  const [tab, setTab] = useState('Amis')
  const [friends, setFriends] = useState([])
  const [received, setReceived] = useState([])
  const [sent, setSent] = useState([])
  const [searchUser, setSearchUser] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [showSearch, setShowSearch] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => { if (profile) fetchAll() }, [profile])

  async function fetchAll() {
    const { data } = await supabase
      .from('friendships')
      .select('*, sender:sender_id(username), receiver:receiver_id(username)')
      .or(`sender_id.eq.${profile.id},receiver_id.eq.${profile.id}`)
    setFriends((data || []).filter(f => f.status === 'accepted'))
    setReceived((data || []).filter(f => f.status === 'pending' && f.receiver_id === profile.id))
    setSent((data || []).filter(f => f.status === 'pending' && f.sender_id === profile.id))
  }

  async function searchByUsername() {
    if (!searchUser.trim()) return
    const { data } = await supabase.from('profiles').select('*')
      .ilike('username', `%${searchUser}%`).neq('id', profile.id).limit(1).single()
    setSearchResult(data || null)
    if (!data) setMsg('Aucun utilisateur trouvé')
  }

  async function sendRequest() {
    if (!searchResult) return
    await supabase.from('friendships').insert({ sender_id: profile.id, receiver_id: searchResult.id })
    setMsg('Demande envoyée !')
    setSearchResult(null)
    setSearchUser('')
    fetchAll()
  }

  async function acceptRequest(id) {
    await supabase.from('friendships').update({ status: 'accepted' }).eq('id', id)
    fetchAll()
  }

  async function declineRequest(id) {
    await supabase.from('friendships').delete().eq('id', id)
    fetchAll()
  }

  const inputStyle = {
    flex: 1, padding: '13px 16px',
    background: '#192038', border: '1px solid #1a2a45',
    borderRadius: 14, color: '#f0f4ff', fontSize: 14,
  }

  const getFriendName = (f) => f.sender_id === profile.id ? f.receiver?.username : f.sender?.username

  return (
    <div style={{ padding: '24px 20px 100px' }}>
      <PageHeader icon={Users} title="Amis" iconColor="#00f5a0"
        action={
          <button onClick={() => setShowSearch(!showSearch)} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 16px', borderRadius: 14,
            background: '#00e5ff', color: '#000',
            fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer',
          }}>
            <UserPlus size={16} strokeWidth={2.5} />
            Ajouter
          </button>
        }
      />

      {showSearch && (
        <div style={{ background: '#131e35', borderRadius: 20, padding: 20, marginBottom: 20, border: '1px solid #1a2a45' }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <input style={inputStyle} placeholder="Rechercher un pseudo..." value={searchUser}
              onChange={e => { setSearchUser(e.target.value); setMsg(''); setSearchResult(null) }}
              onKeyDown={e => e.key === 'Enter' && searchByUsername()} />
            <button onClick={searchByUsername} style={{
              padding: '0 18px', borderRadius: 14,
              background: '#00e5ff', color: '#000', fontWeight: 700,
              border: 'none', cursor: 'pointer',
            }}>Chercher</button>
          </div>
          {msg && <p style={{ fontSize: 13, color: '#6b7fa3', marginBottom: 8 }}>{msg}</p>}
          {searchResult && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#192038', borderRadius: 14, padding: '12px 16px' }}>
              <span style={{ fontWeight: 600, color: '#f0f4ff' }}>@{searchResult.username}</span>
              <button onClick={sendRequest} style={{
                padding: '8px 16px', borderRadius: 10,
                background: '#00f5a0', color: '#000', fontWeight: 700,
                fontSize: 13, border: 'none', cursor: 'pointer',
              }}>Envoyer</button>
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', background: '#131e35', borderRadius: 14, padding: 4, marginBottom: 24, border: '1px solid #1a2a45' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: '10px 0', borderRadius: 10, fontSize: 13, fontWeight: 500,
            background: tab === t ? '#192038' : 'transparent',
            color: tab === t ? '#00e5ff' : '#6b7fa3',
            border: tab === t ? '1px solid #1a2a45' : 'none',
            cursor: 'pointer',
          }}>
            {t} {t === 'Demandes' && received.length > 0 && `(${received.length})`}
          </button>
        ))}
      </div>

      {tab === 'Amis' && (
        friends.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#131e35', borderRadius: 20, border: '1px solid #1a2a45' }}>
            <Users size={40} color="#3a4a6a" style={{ margin: '0 auto 16px' }} />
            <p style={{ color: '#3a4a6a', fontSize: 15 }}>Aucun ami pour le moment</p>
            <p style={{ color: '#3a4a6a', fontSize: 13, marginTop: 6 }}>Invitez vos partenaires d'entraînement !</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {friends.map(f => (
              <div key={f.id} style={{ background: '#131e35', borderRadius: 14, padding: '16px 18px', border: '1px solid #1a2a45', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: '#192038', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#00f5a0' }}>
                  {getFriendName(f)?.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontWeight: 600, fontSize: 15, color: '#f0f4ff' }}>{getFriendName(f)}</span>
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'Demandes' && (
        received.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#3a4a6a', padding: 40 }}>Aucune demande reçue</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {received.map(f => (
              <div key={f.id} style={{ background: '#131e35', borderRadius: 14, padding: '16px 18px', border: '1px solid #1a2a45', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: '#192038', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#00e5ff' }}>
                  {f.sender?.username?.charAt(0).toUpperCase()}
                </div>
                <span style={{ flex: 1, fontWeight: 600, color: '#f0f4ff' }}>{f.sender?.username}</span>
                <button onClick={() => acceptRequest(f.id)} style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(0,245,160,0.15)', border: '1px solid #00f5a0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Check size={16} color="#00f5a0" />
                </button>
                <button onClick={() => declineRequest(f.id)} style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(255,61,154,0.12)', border: '1px solid #ff3d9a', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <X size={16} color="#ff3d9a" />
                </button>
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'Envoyées' && (
        sent.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#3a4a6a', padding: 40 }}>Aucune demande envoyée</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {sent.map(f => (
              <div key={f.id} style={{ background: '#131e35', borderRadius: 14, padding: '16px 18px', border: '1px solid #1a2a45', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: '#192038', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#6b7fa3' }}>
                  {f.receiver?.username?.charAt(0).toUpperCase()}
                </div>
                <span style={{ flex: 1, fontWeight: 600, color: '#f0f4ff' }}>{f.receiver?.username}</span>
                <span style={{ fontSize: 12, color: '#ffb800', background: 'rgba(255,184,0,0.1)', padding: '4px 10px', borderRadius: 99, border: '1px solid rgba(255,184,0,0.3)' }}>En attente</span>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}
