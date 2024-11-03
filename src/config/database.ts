import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log("Database URL:", process.env.DATABASE_URL); 

export const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL || '');
    console.log('Database connected');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};
