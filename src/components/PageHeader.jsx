export default function PageHeader({ icon: Icon, title, iconColor = '#00e5ff', action }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 26,
      padding: '8px 0',
      borderRadius: 18,
      background: 'rgba(19,30,53,0.85)',
      boxShadow: '0 4px 18px 0 rgba(0,229,255,0.06)',
      border: '1.5px solid #1a2a45',
      backdropFilter: 'blur(4px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 46, height: 46, borderRadius: 14,
          background: '#515c75',
          border: '1.5px solid #1a2a45',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px 0 rgba(0,229,255,0.08)'
        }}>
          <Icon size={22} color={iconColor} strokeWidth={2.1} />
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 750, color: '#f0f4ff', letterSpacing: 0.2 }}>
          {title}
        </h1>
      </div>
      {action}
    </div>
  )
}



