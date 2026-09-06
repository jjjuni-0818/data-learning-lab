import { NavLink } from 'react-router-dom'
import { CURRICULUM } from '../curriculum'
import './CurriculumSidebar.css'

function CurriculumSidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-title">커리큘럼</div>
      {CURRICULUM.map((mod) => {
        const hasBuiltChapter = mod.chapters.some((ch) => ch.built)
        return (
          <div className="sidebar-module" key={mod.id}>
            <div className={`sidebar-module-label ${hasBuiltChapter ? '' : 'disabled'}`}>
              <span className="sidebar-module-label-text">{mod.label}</span>
              {!hasBuiltChapter && <span className="sidebar-badge">준비중</span>}
            </div>
            {mod.chapters.map((ch) => (
              <NavLink
                key={ch.id}
                to={`/chapter/${ch.id}`}
                className={({ isActive }) =>
                  `sidebar-chapter ${isActive ? 'active' : ''} ${ch.built ? '' : 'upcoming'}`
                }
              >
                <span className="sidebar-chapter-label">{ch.label}</span>
                {!ch.built && <span className="sidebar-chapter-tag">예정</span>}
              </NavLink>
            ))}
          </div>
        )
      })}
    </aside>
  )
}

export default CurriculumSidebar
