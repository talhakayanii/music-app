import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../hooks/useFavorites';
import { Movie } from '../types/movie';
import MovieCard from './MovieCard';
import '../styles/favorites.css';

const Favorites: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { favorites, loading, error, refreshFavorites } = useFavorites();

  // Convert FavoriteMovie to Movie format for consistency with MovieCard
  const convertFavoriteToMovie = (favorite: any): Movie => ({
    id: favorite.movieId,
    title: favorite.movieTitle,
    overview: favorite.movieOverview,
    poster_path: favorite.moviePoster,
    backdrop_path: null,
    release_date: favorite.movieReleaseDate,
    vote_average: favorite.movieRating,
    vote_count: 0,
    genre_ids: [],
    adult: false,
    original_language: '',
    original_title: favorite.movieTitle,
    popularity: 0,
    video: false
  });

  const handleMovieClick = (movie: Movie) => {
    navigate(`/movies/${movie.id}`);
  };

  const handleRetry = () => {
    refreshFavorites();
  };

  // Loading state
  if (loading) {
    return (
      <div className="favorites-container">
        <div className="favorites-content">
          <header className="favorites-header">
            <div className="favorites-header-content">
              <h1 className="favorites-title">My Favorites</h1>
              <p className="favorites-subtitle">Loading your favorite movies...</p>
            </div>
          </header>
          
          <div className="favorites-loading">
            <div className="loading-grid">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="loading-card">
                  <div className="loading-poster"></div>
                  <div className="loading-info">
                    <div className="loading-title"></div>
                    <div className="loading-meta"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="favorites-container">
        <div className="favorites-content">
          <header className="favorites-header">
            <div className="favorites-header-content">
              <h1 className="favorites-title">My Favorites</h1>
              <p className="favorites-subtitle">Something went wrong</p>
            </div>
          </header>
          
          <div className="favorites-error">
            <div className="error-content">
              <div className="error-icon">😞</div>
              <h2>Oops! Something went wrong</h2>
              <p>{error}</p>
              <button onClick={handleRetry} className="retry-btn">
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (favorites.length === 0) {
    return (
      <div className="favorites-container">
        <div className="favorites-content">
          <header className="favorites-header">
            <div className="favorites-header-content">
              <h1 className="favorites-title">My Favorites</h1>
              <p className="favorites-subtitle">Your personal movie collection</p>
            </div>
          </header>
          
          <div className="favorites-empty">
            <div className="empty-content">
              <div className="empty-icon">🎬</div>
              <h2>No favorites yet</h2>
              <p>Start building your movie collection by adding favorites!</p>
              <button 
                onClick={() => navigate('/movies')} 
                className="explore-btn"
              >
                Explore Movies
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main favorites display
  return (
    <div className="favorites-container">
      <div className="favorites-bg-overlay" />
      
      <div className="favorites-content">
        <div className="favorites-main-container">
          {/* Header section */}
          <header className="favorites-header">
            <div className="favorites-header-content">
              <h1 className="favorites-title">
                My Favorites
              </h1>
              <p className="favorites-subtitle">
                {user?.name}'s personal movie collection • {favorites.length} {favorites.length === 1 ? 'movie' : 'movies'}
              </p>
            </div>
          </header>

          {/* Back to movies button */}
          <div className="favorites-nav">
            <button 
              onClick={() => navigate('/movies')} 
              className="back-to-movies-btn"
            >
              ← Back to All Movies
            </button>
          </div>

          {/* Movies grid */}
          <div className="favorites-grid-section">
            <div className="favorites-grid">
              {favorites.map((favorite) => {
                const movie = convertFavoriteToMovie(favorite);
                return (
                  <MovieCard
                    key={favorite._id}
                    movie={movie}
                    onClick={handleMovieClick}
                    className="favorite-movie-card"
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade effect */}
      <div className="favorites-bottom-fade" />
    </div>
  );
};

export default Favorites;