import mongoose from 'mongoose';

const connectMongo = async (mongoUri: string): Promise<void> => {
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not provided');
  }

  mongoose.set('strictQuery', true);
  // Never queue database operations when Atlas is unreachable. Requests should
  // fail predictably instead of timing out after Mongoose's buffer period.
  mongoose.set('bufferCommands', false);

  await mongoose.connect(mongoUri, {
    autoIndex: true,
    serverSelectionTimeoutMS: 10000,
  });
  console.log('MongoDB connected successfully');
};

export default connectMongo;

