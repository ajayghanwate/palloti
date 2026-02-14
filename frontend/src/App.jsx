import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './components/layout/DashboardLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AttendancePage from './pages/AttendancePage';
import AssessmentPage from './pages/AssessmentPage';
import LearningGapPage from './pages/LearningGapPage';
import ReportsPage from './pages/ReportsPage';
import EngagementPage from './pages/EngagementPage';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A]">
      <div className="spinner" />
    </div>
  );
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
      <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<DashboardPage />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="assessment" element={<AssessmentPage />} />
        <Route path="learning-gap" element={<LearningGapPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="engagement" element={<EngagementPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1E293B', color: '#F1F5F9', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '14px' },
            success: { iconTheme: { primary: '#10B981', secondary: '#F1F5F9' } },
            error: { iconTheme: { primary: '#F43F5E', secondary: '#F1F5F9' } },
          }}
        />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
