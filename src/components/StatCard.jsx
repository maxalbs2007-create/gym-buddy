export default function StatCard({ icon: Icon, label, value, unit, color }) {
  const colors = {
    cyan:   'linear-gradient(135deg, #006064, #00acc1)',
    green:  'linear-gradient(135deg, #1b5e20, #2e7d32)',
    orange: 'linear-gradient(135deg, #bf360c, #e64a19)',
    amber:  'linear-gradient(135deg, #e65100, #f57c00)',
  }

  return (
    <div
      className="stat-card card"
      style={{
        position: 'relative',
        borderRadius: 26,
        padding: '28px 20px',
        overflow: 'hidden',
        boxShadow: '0 8px 32px 0 rgba(0,229,255,0.10)',
        border: '1.5px solid #1a2a45',
        background: 'rgba(19,30,53,0.85)',
        backdropFilter: 'blur(8px)',
        transition: 'box-shadow 0.18s, transform 0.12s',
        marginBottom: 2,
      }}
    >
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: 26,
        zIndex: 0,
        background: (colors[color] || colors.cyan),
        opacity: 0.82,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'relative',
        zIndex: 1,
        width: 38, height: 38, borderRadius: 12,
        background: 'rgba(0,0,0,0.18)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 16,
        boxShadow: '0 2px 8px 0 rgba(0,229,255,0.08)'
      }}>
        <Icon size={19} color="#fff" strokeWidth={2.2} />
      </div>
      <p style={{ position: 'relative', zIndex: 1, fontSize: 13, color: 'rgba(255,255,255,0.80)', marginBottom: 5, fontWeight: 700, letterSpacing: 0.2 }}>{label}</p>
      <p style={{ position: 'relative', zIndex: 1, fontSize: 34, fontWeight: 900, color: '#fff', lineHeight: 1 }}>
        {value}
        {unit && <span style={{ fontSize: 15, fontWeight: 400, marginLeft: 4, opacity: 0.75 }}>{unit}</span>}
      </p>
    </div>
  )
}
