import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import authRoutes from './routes/auth';
import logger from './config/logger'; // Importing logger
import { sendResponse } from './utlis/responseHelper'; // Importing sendResponse
import favoritesRoutes from './routes/favorites';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // React app URL
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoritesRoutes);
// Health check route
app.get('/api/health', (req, res) => {
  sendResponse(res, { success: true, message: 'Server is running!' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(err.stack); // Replaced console.error with winston
  sendResponse(res, { success: false, message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`); // Replaced console.log with winston
});
