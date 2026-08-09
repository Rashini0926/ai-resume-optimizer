import mongoose from 'mongoose';

const connectMongo = async (mongoUri: string): Promise<void> => {
  if (!mongoUri) {
    console.warn('MONGODB_URI is not provided. Database functionality will be unavailable.');
    return;
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(mongoUri, {
    autoIndex: true,
    serverSelectionTimeoutMS: 5000,
  });
  console.log('MongoDB connected successfully');
};

export default connectMongo;

