import 'dotenv/config';
import app from './app';
import connectMongo from './config/database';

const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-resume-optimizer';

const startServer = async (): Promise<void> => {
  try {
    console.log('Mongo URI:', MONGODB_URI);

    await connectMongo(MONGODB_URI);

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    console.warn('Server starting without active MongoDB connection.');
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();