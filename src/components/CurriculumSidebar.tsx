import './CurriculumSidebar.css'

interface ChapterItem {
  label: string
  /** 실제로 학습 콘텐츠가 만들어진 챕터인지 (false면 "예정" 표시) */
  built?: boolean
  active?: boolean
}

interface ModuleItem {
  label: string
  chapters: ChapterItem[]
}

const MODULES: ModuleItem[] = [
  {
    label: '1. 데이터 표현 이해',
    chapters: [
      { label: '벡터와 행렬로 데이터 표현하기' },
      { label: '가중합과 계산 이해하기' },
      { label: '함수와 그래프 이해하기' },
      { label: '데이터 요약과 통계' },
    ],
  },
  {
    label: '2. 데이터 시각화',
    chapters: [
      { label: 'DataFrame이란?', built: true, active: true },
      { label: '데이터 불러오기와 정제' },
      { label: '데이터 탐색과 분석' },
      { label: '데이터 시각화' },
      { label: '프로젝트 기반 학습' },
    ],
  },
  {
    label: '3. 데이터베이스(DB) 기초',
    chapters: [
      { label: '데이터베이스 기본 개념 이해' },
      { label: 'SQL 기초 및 데이터 조회' },
      { label: 'Python + DB 연동 경험' },
      { label: 'ORM(SQLAlchemy)과 모델링' },
      { label: 'NoSQL(MongoDB) 이해와 활용' },
      { label: '프로젝트 기반 실습' },
    ],
  },
]

function CurriculumSidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-title">커리큘럼</div>
      {MODULES.map((mod) => {
        const hasBuiltChapter = mod.chapters.some((ch) => ch.built)
        return (
          <div className="sidebar-module" key={mod.label}>
            <div className={`sidebar-module-label ${hasBuiltChapter ? '' : 'disabled'}`}>
              <span className="sidebar-module-label-text">{mod.label}</span>
              {!hasBuiltChapter && <span className="sidebar-badge">준비중</span>}
            </div>
            {mod.chapters.map((ch) => (
              <span
                className={`sidebar-chapter ${ch.active ? 'active' : ''} ${ch.built ? '' : 'upcoming'}`}
                key={ch.label}
              >
                <span className="sidebar-chapter-label">{ch.label}</span>
                {!ch.built && <span className="sidebar-chapter-tag">예정</span>}
              </span>
            ))}
          </div>
        )
      })}
    </aside>
  )
}

export default CurriculumSidebar
