// utils/favoritesApi.ts
import { Movie } from '../types/movie';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  const token = localStorage.getItem('token');
  return token;
};

// Helper function to make authenticated API calls
const makeAuthenticatedRequest = async (
  endpoint: string, 
  options: RequestInit = {}
): Promise<any> => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
};

export interface FavoriteMovie {
  _id: string;
  userId: string;
  movieId: number;
  movieTitle: string;
  moviePoster: string | null;
  movieOverview: string;
  movieReleaseDate: string;
  movieRating: number;
  addedAt: string;
}

export const favoritesAPI = {
  // Get all favorites for the current user
  getFavorites: async (): Promise<FavoriteMovie[]> => {
    const response = await makeAuthenticatedRequest('/favorites');
    return response.data;
  },

  // Add a movie to favorites
  addToFavorites: async (movie: Movie): Promise<FavoriteMovie> => {
    const movieData = {
      movieId: movie.id,
      movieTitle: movie.title,
      moviePoster: movie.poster_path,
      movieOverview: movie.overview,
      movieReleaseDate: movie.release_date,
      movieRating: movie.vote_average
    };

    const response = await makeAuthenticatedRequest('/favorites', {
      method: 'POST',
      body: JSON.stringify(movieData),
    });

    return response.data;
  },

  // Remove a movie from favorites
  removeFromFavorites: async (movieId: number): Promise<void> => {
    await makeAuthenticatedRequest(`/favorites/${movieId}`, {
      method: 'DELETE',
    });
  },

  // Check if a movie is in favorites
  checkFavoriteStatus: async (movieId: number): Promise<{ isFavorite: boolean; favoriteId: string | null }> => {
    const response = await makeAuthenticatedRequest(`/favorites/check/${movieId}`);
    return response.data;
  },

  // Get favorites count
  getFavoritesCount: async (): Promise<number> => {
    const response = await makeAuthenticatedRequest('/favorites/count');
    return response.data.count;
  }
};

export default favoritesAPI;