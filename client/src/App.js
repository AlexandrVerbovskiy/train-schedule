import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import SchedulePage from './pages/SchedulePage';
import ProfileView from './components/Auth/ProfileView';
import AdminLayout from './components/Admin/AdminLayout';
import TrainManager from './components/Admin/TrainManager';
import StationManager from './components/Admin/StationManager';
import ProtectedRoute from './components/Common/ProtectedRoute';
import './App.css';

function App() {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-blue-500 animate-pulse font-black text-xl tracking-widest">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-950 flex flex-col items-center p-4 font-sans text-slate-100 overflow-x-hidden">
        
        {/* 🏔️ Header/Nav (Optional, but let's keep it simple for now) */}
        <Routes>
          <Route path="/" element={<SchedulePage />} />
          <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/profile" />} />

          <Route path="/profile" element={
            <ProtectedRoute>
              <div className="pt-20">
                 <ProfileView user={user} onLogout={logout} />
              </div>
            </ProtectedRoute>
          } />

          <Route 
            path="/admin" 
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="trains" replace />} />
            <Route path="trains" element={<TrainManager />} />
            <Route path="stations" element={<StationManager />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
