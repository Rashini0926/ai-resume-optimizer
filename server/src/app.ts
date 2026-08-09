import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health';
import analyzeRoutes from './routes/analyze';
import authRoutes from './routes/auth';
import analyticsRoutes from './routes/analytics';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/health', healthRoutes);
app.use('/api/analyze', analyzeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);

export default app;