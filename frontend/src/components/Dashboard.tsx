import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../hooks/useFavorites';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { favoritesCount, loading: favoritesLoading } = useFavorites();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome to Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
      
      <div className="dashboard-content">
        <div className="user-info">
          <h2>User Information</h2>
          <div className="info-card">
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Favorite Movies:</strong> {favoritesLoading ? 'Loading...' : favoritesCount}</p>
          </div>
        </div>

        <div className="dashboard-features">
          <h2>Dashboard Features</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <h3>Profile Management</h3>
              <p>Manage your profile information and settings.</p>
            </div>
            
            <div className="feature-card">
              <h3>Security</h3>
              <p>Update your password and security preferences.</p>
            </div>
            
            <div className="feature-card">
              <h3>Activity</h3>
              <p>View your recent activity and login history.</p>
            </div>
            
            <div className="feature-card">
              <h3>Movie Catalog</h3>
              <p>Browse our extensive collection of movies.</p>
              <Link 
                to="/movies" 
                className="explore-movies-btn"
              >
                Explore Movies
              </Link>
            </div>
            
            <div className="feature-card">
              <h3>My Favorites</h3>
              <p>View and manage your favorite movies collection.</p>
              <div className="favorites-info">
                
              </div>
              <Link 
                to="/favorites" 
                className="favorites-btn"
              >
                View Favorites
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;