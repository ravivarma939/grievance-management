import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import GrievanceList from './components/GrievanceList';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/grievances"
              element={
                <PrivateRoute>
                  <GrievanceList />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/grievances" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

