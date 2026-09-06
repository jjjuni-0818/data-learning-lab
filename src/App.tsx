import { supabase } from './lib/supabaseClient'
import { useUser } from './hooks/useUser'
import AuthScreen from './pages/AuthScreen'
import Chapter1 from './pages/Chapter1'
import CurriculumSidebar from './components/CurriculumSidebar'
import './App.css'

function App() {
  const user = useUser()

  if (!user) {
    return <AuthScreen />
  }

  return (
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
          <Chapter1 />
        </main>
      </div>
    </div>
  )
}

export default App
