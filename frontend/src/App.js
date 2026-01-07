import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import GrievanceList from './components/GrievanceList';
import BookmarksList from './components/BookmarksList';
import UserProfile from './components/UserProfile';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isGuest } = useAuth();
  // Allow both authenticated users and guests
  if (isAuthenticated) {
    return children;
  }
  // Check localStorage in case context hasn't loaded yet
  const storedGuest = localStorage.getItem('isGuest');
  const storedToken = localStorage.getItem('token');
  if (storedGuest === 'true' || storedToken) {
    return children;
  }
  return <Navigate to="/login" />;
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
            <Route
              path="/bookmarks"
              element={
                <PrivateRoute>
                  <BookmarksList />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <UserProfile />
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

