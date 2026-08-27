import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Pomodoro from './pages/Pomodoro';
import StudySessions from './pages/StudySessions';
import Subjects from './pages/Subjects';
import Goals from './pages/Goals';
import StudyPlans from './pages/StudyPlans';
import Analytics from './pages/Analytics';
import AIAdvisor from './pages/AIAdvisor';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="study-sessions" element={<StudySessions />} />
            <Route path="pomodoro" element={<Pomodoro />} />
            <Route path="subjects" element={<Subjects />} />
            <Route path="goals" element={<Goals />} />
            <Route path="study-plans" element={<StudyPlans />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="ai-advisor" element={<AIAdvisor />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
