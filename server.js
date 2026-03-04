import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import favoritesRoutes from './routes/favorites.js';

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/favorites', favoritesRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB Vault!'))
  .catch((error) => console.error('Database connection error:', error));

app.get('/', (req, res) => {
  res.send('The Weather Backend is awake and connected!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});