import express, { Request, Response } from 'express';
import { Favorite } from '../models/Favorite';
import { authenticateToken } from '../middleware/auth';
import { sendResponse } from '../utlis/responseHelper';

const router = express.Router();

interface AuthenticatedRequest extends Request {
  user?: any;
}

// Get all favorites for the authenticated user
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;
    
    const favorites = await Favorite.find({ userId })
      .sort({ addedAt: -1 }) // Most recently added first
      .lean();

    sendResponse(res, {
      success: true,
      message: 'Favorites retrieved successfully',
      data: favorites
    });
  } catch (error: any) {
    console.error('Error fetching favorites:', error);
    sendResponse(res, { 
      success: false, 
      message: 'Failed to fetch favorites' 
    });
  }
});

// Add a movie to favorites
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;
    const { 
      movieId, 
      movieTitle, 
      moviePoster, 
      movieOverview, 
      movieReleaseDate, 
      movieRating 
    } = req.body;

    // Validate required fields
    if (!movieId || !movieTitle || !movieOverview || !movieReleaseDate || movieRating === undefined) {
      sendResponse(res, { 
        success: false, 
        message: 'Missing required movie information' 
      });
      return;
    }

    // Check if movie is already in favorites
    const existingFavorite = await Favorite.findOne({ userId, movieId });
    if (existingFavorite) {
      sendResponse(res, { 
        success: false, 
        message: 'Movie is already in favorites' 
      });
      return;
    }

    // Create new favorite
    const favorite = new Favorite({
      userId,
      movieId,
      movieTitle,
      moviePoster,
      movieOverview,
      movieReleaseDate,
      movieRating
    });

    await favorite.save();

    sendResponse(res, {
      success: true,
      message: 'Movie added to favorites successfully',
      data: favorite
    });
  } catch (error: any) {
    console.error('Error adding to favorites:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      sendResponse(res, { 
        success: false, 
        message: 'Movie is already in favorites' 
      });
    } else {
      sendResponse(res, { 
        success: false, 
        message: 'Failed to add movie to favorites' 
      });
    }
  }
});

// Remove a movie from favorites
router.delete('/:movieId', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;
    const movieId = parseInt(req.params.movieId);

    if (isNaN(movieId)) {
      sendResponse(res, { 
        success: false, 
        message: 'Invalid movie ID' 
      });
      return;
    }

    const deletedFavorite = await Favorite.findOneAndDelete({ userId, movieId });

    if (!deletedFavorite) {
      sendResponse(res, { 
        success: false, 
        message: 'Movie not found in favorites' 
      });
      return;
    }

    sendResponse(res, {
      success: true,
      message: 'Movie removed from favorites successfully',
      data: { movieId }
    });
  } catch (error: any) {
    console.error('Error removing from favorites:', error);
    sendResponse(res, { 
      success: false, 
      message: 'Failed to remove movie from favorites' 
    });
  }
});

// Check if a movie is in favorites
router.get('/check/:movieId', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;
    const movieId = parseInt(req.params.movieId);

    if (isNaN(movieId)) {
      sendResponse(res, { 
        success: false, 
        message: 'Invalid movie ID' 
      });
      return;
    }

    const favorite = await Favorite.findOne({ userId, movieId });

    sendResponse(res, {
      success: true,
      message: 'Favorite status checked successfully',
      data: { 
        isFavorite: !!favorite,
        favoriteId: favorite?._id || null 
      }
    });
  } catch (error: any) {
    console.error('Error checking favorite status:', error);
    sendResponse(res, { 
      success: false, 
      message: 'Failed to check favorite status' 
    });
  }
});

// Get favorites count for user
router.get('/count', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;
    
    const count = await Favorite.countDocuments({ userId });

    sendResponse(res, {
      success: true,
      message: 'Favorites count retrieved successfully',
      data: { count }
    });
  } catch (error: any) {
    console.error('Error getting favorites count:', error);
    sendResponse(res, { 
      success: false, 
      message: 'Failed to get favorites count' 
    });
  }
});

export default router;