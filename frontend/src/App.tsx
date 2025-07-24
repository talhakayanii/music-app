import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './hooks/useFavorites';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import MovieListing from './components/MovieListing';
import MovieDetails from './components/MovieDetails';
import Favorites from './components/Favorites';
import './App.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/movies" 
                element={
                  <ProtectedRoute>
                    <MovieListing />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/movies/:id" 
                element={
                  <ProtectedRoute>
                    <MovieDetails />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/favorites" 
                element={
                  <ProtectedRoute>
                    <Favorites />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </FavoritesProvider>
    </AuthProvider>
  );
};

export default App;