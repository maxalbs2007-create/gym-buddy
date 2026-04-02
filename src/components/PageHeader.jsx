export default function PageHeader({ icon: Icon, title, iconColor = '#00e5ff', action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 46, height: 46, borderRadius: 14,
          background: '#131e35',
          border: '1px solid #1a2a45',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={22} color={iconColor} strokeWidth={1.8} />
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#f0f4ff' }}>
          {title}
        </h1>
      </div>
      {action}
    </div>
  )
}

