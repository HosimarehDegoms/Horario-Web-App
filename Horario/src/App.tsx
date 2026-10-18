import { Outlet, Route, Routes } from 'react-router-dom'
import { Sidebar } from './components/layout/Sidebar'
import { MobileTopBar } from './components/layout/MobileTopBar'
import { BottomNav } from './components/layout/BottomNav'
import { ThemedBackgroundPattern } from './components/layout/ThemedBackgroundPattern'
import { ProtectedRoute } from './app/routes/ProtectedRoute'
import { PublicOnlyRoute } from './app/routes/PublicOnlyRoute'
import { DashboardPage } from './features/dashboard/DashboardPage'
import { SchedulePage } from './features/schedule/SchedulePage'
import { TasksPage } from './features/tasks/TasksPage'
import { FocusPage } from './features/focus/FocusPage'
import { SettingsPage } from './features/settings/SettingsPage'
import { SpotifyCallbackPage } from './features/spotify/SpotifyCallbackPage'
import { LoginPage } from './features/auth/LoginPage'
import { SignupPage } from './features/auth/SignupPage'
import { useReminderNotifications } from './hooks/useReminderNotifications'
import { useThemePreferences } from './hooks/useThemePreferences'
import { ActiveThemeContext } from './app/theme/activeThemeContext'

function AppLayout() {
  useReminderNotifications()
  const { activePreset } = useThemePreferences()

  return (
    <ActiveThemeContext.Provider value={activePreset}>
      <ThemedBackgroundPattern />
      <Sidebar />
      <MobileTopBar />
      <div className="pb-20 lg:pb-0 lg:pl-60 print:pb-0 print:pl-0">
        <Outlet />
      </div>
      <BottomNav />
    </ActiveThemeContext.Provider>
  )
}

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicOnlyRoute>
            <SignupPage />
          </PublicOnlyRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/focus" element={<FocusPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/spotify/callback" element={<SpotifyCallbackPage />} />
      </Route>
    </Routes>
  )
}

export default App
