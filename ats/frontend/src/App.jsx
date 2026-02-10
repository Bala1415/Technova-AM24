import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import CareerPath from './pages/CareerPath';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import ResumeBuilder from './pages/ResumeBuilder';
import Login from './pages/Login';
import Register from './pages/Register';

// Check if these components exist, if not create placeholders
const Practice = () => <div className="p-8"><h1 className="text-2xl font-bold">Practice Area</h1><p>Coming Soon...</p></div>;
const Learn = () => <div className="p-8"><h1 className="text-2xl font-bold">Learning Path</h1><p>Coming Soon...</p></div>;

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 text-gray-800">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/practice" element={
              <ProtectedRoute>
                <CareerPath />
              </ProtectedRoute>
            } />
            <Route path="/career-path" element={
              <ProtectedRoute>
                <CareerPath />
              </ProtectedRoute>
            } />
            <Route path="/learn" element={
              <ProtectedRoute>
                <Learn />
              </ProtectedRoute>
            } />
            <Route path="/resume-analyzer" element={
              <ProtectedRoute>
                <ResumeAnalyzer />
              </ProtectedRoute>
            } />
            <Route path="/resume-builder" element={
              <ProtectedRoute>
                <ResumeBuilder />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
