// hooks/useFavorites.ts
import React, { useState, useEffect, useCallback, useContext, createContext } from 'react';
import { Movie } from '../types/movie';
import { favoritesAPI, FavoriteMovie } from '../utils/favoritesApi';

interface FavoritesContextType {
  favorites: FavoriteMovie[];
  favoriteMovieIds: Set<number>;
  loading: boolean;
  error: string | null;
  addToFavorites: (movie: Movie) => Promise<void>;
  removeFromFavorites: (movieId: number) => Promise<void>;
  isFavorite: (movieId: number) => boolean;
  refreshFavorites: () => Promise<void>;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

interface FavoritesProviderProps {
  children: React.ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteMovie[]>([]);
  const [favoriteMovieIds, setFavoriteMovieIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load favorites on mount
  const refreshFavorites = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const favs = await favoritesAPI.getFavorites();
      setFavorites(favs);
      setFavoriteMovieIds(new Set(favs.map(fav => fav.movieId)));
    } catch (err: any) {
      console.error('Error fetching favorites:', err);
      setError(err.message || 'Failed to fetch favorites');
      setFavorites([]);
      setFavoriteMovieIds(new Set());
    } finally {
      setLoading(false);
    }
  }, []);

  // Add to favorites
  const addToFavorites = useCallback(async (movie: Movie) => {
    try {
      setError(null);
      const newFavorite = await favoritesAPI.addToFavorites(movie);
      
      setFavorites(prev => [newFavorite, ...prev]);
      setFavoriteMovieIds(prev => {
        const newSet = new Set(prev);
        newSet.add(movie.id);
        return newSet;
      });
    } catch (err: any) {
      console.error('Error adding to favorites:', err);
      setError(err.message || 'Failed to add to favorites');
      throw err; // Re-throw so UI can handle it
    }
  }, []);

  // Remove from favorites
  const removeFromFavorites = useCallback(async (movieId: number) => {
    try {
      setError(null);
      await favoritesAPI.removeFromFavorites(movieId);
      
      setFavorites(prev => prev.filter(fav => fav.movieId !== movieId));
      setFavoriteMovieIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(movieId);
        return newSet;
      });
    } catch (err: any) {
      console.error('Error removing from favorites:', err);
      setError(err.message || 'Failed to remove from favorites');
      throw err; // Re-throw so UI can handle it
    }
  }, []);

  // Check if movie is favorite
  const isFavorite = useCallback((movieId: number): boolean => {
    return favoriteMovieIds.has(movieId);
  }, [favoriteMovieIds]);

  // Load favorites on mount
  useEffect(() => {
    refreshFavorites();
  }, [refreshFavorites]);

  const value: FavoritesContextType = {
    favorites,
    favoriteMovieIds,
    loading,
    error,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    refreshFavorites,
    favoritesCount: favorites.length
  };

  return React.createElement(
    FavoritesContext.Provider,
    { value },
    children
  );
};

// Hook to use favorites context
export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export default useFavorites;