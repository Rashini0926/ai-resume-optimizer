import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/health', healthRoutes);

export default app;