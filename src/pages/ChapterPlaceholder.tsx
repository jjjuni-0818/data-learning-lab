interface ChapterPlaceholderProps {
  label: string
}

function ChapterPlaceholder({ label }: ChapterPlaceholderProps) {
  return (
    <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--color-text-muted)' }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>🚧</div>
      <h1 style={{ fontSize: 18, marginBottom: 8, color: 'var(--color-text)' }}>{label}</h1>
      <p style={{ fontSize: 14 }}>아직 준비 중인 챕터예요. 곧 만나요!</p>
    </div>
  )
}

export default ChapterPlaceholder
