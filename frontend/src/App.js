import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import TrackPage from './pages/TrackPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/admin/login" replace />;
  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<TrackPage />} />

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;
