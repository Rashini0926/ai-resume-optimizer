import 'dotenv/config';
import app from './app';
import connectMongo from './config/database';

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

const startServer = async (): Promise<void> => {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is required. Add it to server/.env before starting the server.');
  }

  await connectMongo(MONGODB_URI);
  console.log('MongoDB connected successfully');

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch((error: unknown) => {
  console.error('Server startup failed: MongoDB is unavailable.', error instanceof Error ? error.message : error);
  process.exit(1);
});
