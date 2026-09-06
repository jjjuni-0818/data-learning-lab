import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom'
import { supabase } from './lib/supabaseClient'
import { useUser } from './hooks/useUser'
import AuthScreen from './pages/AuthScreen'
import ChapterPage from './pages/ChapterPage'
import ChapterPlaceholder from './pages/ChapterPlaceholder'
import CurriculumSidebar from './components/CurriculumSidebar'
import { DEFAULT_CHAPTER_ID, findChapter } from './curriculum'
import { dataframeBasics } from './chapters/dataframeBasics'
import { dataLoadingCleaning } from './chapters/dataLoadingCleaning'
import { dataExploration } from './chapters/dataExploration'
import { dataVisualization } from './chapters/dataVisualization'
import { projectBasedLearning } from './chapters/projectBasedLearning'
import type { ChapterContent } from './types/chapter'
import './App.css'

// 실제로 콘텐츠(데이터)가 만들어진 챕터만 여기에 등록합니다.
// 나머지 챕터는 curriculum.ts에서 built: false 로 표시되어 있고,
// 여기 등록이 없으면 자동으로 ChapterPlaceholder("준비중")가 보입니다.
const CHAPTER_CONTENT: Record<string, ChapterContent> = {
  '01_dataframe_basics': dataframeBasics,
  '02_data_loading_cleaning': dataLoadingCleaning,
  '03_data_exploration': dataExploration,
  '04_data_visualization': dataVisualization,
  '05_project_based_learning': projectBasedLearning,
}

function ChapterRoute() {
  const { chapterId } = useParams<{ chapterId: string }>()
  const found = chapterId ? findChapter(chapterId) : undefined

  if (!found) {
    return <Navigate to={`/chapter/${DEFAULT_CHAPTER_ID}`} replace />
  }

  const content = CHAPTER_CONTENT[found.chapter.id]
  if (!content) {
    return <ChapterPlaceholder label={found.chapter.label} />
  }
  return <ChapterPage {...content} />
}

function App() {
  const user = useUser()

  if (!user) {
    return <AuthScreen />
  }

  return (
    <BrowserRouter>
      <div>
        <header className="app-header">
          <div className="logo">
            <span className="logo-dot" />
            Data Learning Lab
          </div>
          <div className="user-info">
            <span className="user-email">{user.email}</span>
            <button className="logout-button" onClick={() => supabase.auth.signOut()}>
              로그아웃
            </button>
          </div>
        </header>

        <div className="app-body">
          <CurriculumSidebar />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<Navigate to={`/chapter/${DEFAULT_CHAPTER_ID}`} replace />} />
              <Route path="/chapter/:chapterId" element={<ChapterRoute />} />
              <Route path="*" element={<Navigate to={`/chapter/${DEFAULT_CHAPTER_ID}`} replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
