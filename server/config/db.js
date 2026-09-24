import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/leo';
  
  try {
    // Attempt standard connection with 2s timeout
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`[LEO DB] Connected to MongoDB: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    console.warn(`[LEO DB] Local MongoDB unavailable (${err.message}). Starting In-Memory MongoDB Server...`);
    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`[LEO DB] In-Memory MongoDB running at: ${memoryUri}`);
    } catch (memErr) {
      console.error(`[LEO DB] Error connecting to in-memory DB:`, memErr);
      process.exit(1);
    }
  }
};
