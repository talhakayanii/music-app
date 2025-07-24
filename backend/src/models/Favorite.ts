import mongoose, { Document, Schema } from 'mongoose';

export interface IFavorite extends Document {
  userId: mongoose.Types.ObjectId;
  movieId: number;
  movieTitle: string;
  moviePoster: string | null;
  movieOverview: string;
  movieReleaseDate: string;
  movieRating: number;
  addedAt: Date;
}

const favoriteSchema = new Schema<IFavorite>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    index: true
  },
  movieId: {
    type: Number,
    required: [true, 'Movie ID is required'],
    index: true
  },
  movieTitle: {
    type: String,
    required: [true, 'Movie title is required'],
    trim: true
  },
  moviePoster: {
    type: String,
    default: null
  },
  movieOverview: {
    type: String,
    required: [true, 'Movie overview is required']
  },
  movieReleaseDate: {
    type: String,
    required: [true, 'Movie release date is required']
  },
  movieRating: {
    type: Number,
    required: [true, 'Movie rating is required'],
    min: 0,
    max: 10
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure a user can't favorite the same movie twice
favoriteSchema.index({ userId: 1, movieId: 1 }, { unique: true });

export const Favorite = mongoose.model<IFavorite>('Favorite', favoriteSchema);