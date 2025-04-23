import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.mjs';
import categoryRoutes from './routes/categoryRoutes.mjs';
import articleRoutes from './routes/articleRoutes.mjs';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
import fs from 'fs';
import path from 'path';
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/articles', articleRoutes);

export default app; 