import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import SchedulePage from './pages/SchedulePage';
import TrainManager from './pages/Admin/TrainManager';
import StationManager from './pages/Admin/StationManager';
import MainLayout from './components/Common/MainLayout';
import ProtectedRoute from './components/Common/ProtectedRoute';
import './App.css';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-blue-500 animate-pulse font-bold text-xl">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-950 flex flex-col items-center p-4 font-sans text-slate-100 overflow-x-hidden justify-center transition-all duration-500">
        <Routes>
          <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/" />} />

          <Route element={user ? <MainLayout /> : <Navigate to="/auth" />}>
            <Route path="/" element={<SchedulePage />} />
            
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute roles={['admin']}>
                  <Navigate to="/admin/trains" replace />
                </ProtectedRoute>
              }
            />
            
            <Route path="/admin/trains" element={
              <ProtectedRoute roles={['admin']}>
                <TrainManager />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/stations" element={
              <ProtectedRoute roles={['admin']}>
                <StationManager />
              </ProtectedRoute>
            } />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
