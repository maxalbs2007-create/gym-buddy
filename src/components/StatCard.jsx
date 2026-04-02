export default function StatCard({ icon: Icon, label, value, unit, color }) {
  const colors = {
    cyan:   'linear-gradient(135deg, #006064, #00acc1)',
    green:  'linear-gradient(135deg, #1b5e20, #2e7d32)',
    orange: 'linear-gradient(135deg, #bf360c, #e64a19)',
    amber:  'linear-gradient(135deg, #e65100, #f57c00)',
  }

  return (
    <div style={{
      background: colors[color] || colors.cyan,
      borderRadius: 20,
      padding: '18px 16px',
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 10,
        background: 'rgba(0,0,0,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 14,
      }}>
        <Icon size={17} color="#fff" strokeWidth={2} />
      </div>
      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginBottom: 4 }}>
        {label}
      </p>
      <p style={{ fontSize: 30, fontWeight: 800, color: '#fff', lineHeight: 1 }}>
        {value}
        {unit && <span style={{ fontSize: 14, fontWeight: 400, marginLeft: 4, opacity: 0.75 }}>{unit}</span>}
      </p>
    </div>
  )
}
