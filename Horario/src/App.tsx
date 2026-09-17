import { Outlet, Route, Routes } from 'react-router-dom'
import { Sidebar } from './components/layout/Sidebar'
import { MobileTopBar } from './components/layout/MobileTopBar'
import { BottomNav } from './components/layout/BottomNav'
import { ProtectedRoute } from './app/routes/ProtectedRoute'
import { PublicOnlyRoute } from './app/routes/PublicOnlyRoute'
import { DashboardPage } from './features/dashboard/DashboardPage'
import { SchedulePage } from './features/schedule/SchedulePage'
import { TasksPage } from './features/tasks/TasksPage'
import { ScannerPage } from './features/scanner/ScannerPage'
import { LoginPage } from './features/auth/LoginPage'
import { SignupPage } from './features/auth/SignupPage'

function AppLayout() {
  return (
    <>
      <Sidebar />
      <MobileTopBar />
      <div className="pb-20 lg:pb-0 lg:pl-60">
        <Outlet />
      </div>
      <BottomNav />
    </>
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
        <Route path="/scan" element={<ScannerPage />} />
      </Route>
    </Routes>
  )
}

export default App
