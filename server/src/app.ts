import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health';
import analyzeRoutes from './routes/analyze';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/health', healthRoutes);
app.use('/api/analyze', analyzeRoutes);

export default app;