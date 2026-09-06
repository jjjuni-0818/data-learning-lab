import './CurriculumSidebar.css'

interface ChapterItem {
  label: string
  active?: boolean
}

interface ModuleItem {
  label: string
  chapters: ChapterItem[]
}

const MODULES: ModuleItem[] = [
  { label: '0. 환경설정', chapters: [] },
  {
    label: '1. Pandas 데이터 분석',
    chapters: [{ label: 'DataFrame이란?', active: true }],
  },
  { label: '2. 데이터 시각화', chapters: [] },
  { label: '3. DB / SQL 활용', chapters: [] },
  { label: '4. 종합 프로젝트', chapters: [] },
]

function CurriculumSidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-title">커리큘럼</div>
      {MODULES.map((mod) => (
        <div className="sidebar-module" key={mod.label}>
          <div className={`sidebar-module-label ${mod.chapters.length === 0 ? 'disabled' : ''}`}>
            <span>{mod.label}</span>
            {mod.chapters.length === 0 && <span className="sidebar-badge">준비중</span>}
          </div>
          {mod.chapters.map((ch) => (
            <span className={`sidebar-chapter ${ch.active ? 'active' : ''}`} key={ch.label}>
              {ch.label}
            </span>
          ))}
        </div>
      ))}
    </aside>
  )
}

export default CurriculumSidebar
