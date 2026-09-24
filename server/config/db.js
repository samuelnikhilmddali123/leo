import mongoose from 'mongoose';

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  const uri = process.env.MONGODB_URI;

  if (uri) {
    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
        serverSelectionTimeoutMS: 5000,
      };
      cached.promise = mongoose.connect(uri, opts).then((m) => {
        console.log(`[LEO DB] Connected to MongoDB Atlas/URI: ${m.connection.host}`);
        return m;
      });
    }
    try {
      cached.conn = await cached.promise;
      return cached.conn;
    } catch (e) {
      cached.promise = null;
      console.error('[LEO DB] Connection error to MONGODB_URI:', e.message);
      return null;
    }
  }

  // If in serverless (e.g. Vercel) and no MONGODB_URI provided
  if (process.env.VERCEL) {
    console.warn('[LEO DB] Running on Vercel without MONGODB_URI configured. Set MONGODB_URI in Vercel Environment Variables.');
    return null;
  }

  // Local development fallback: Local MongoDB or In-Memory MongoDB
  const localUri = 'mongodb://127.0.0.1:27017/leo';
  try {
    cached.conn = await mongoose.connect(localUri, { serverSelectionTimeoutMS: 2000 });
    console.log(`[LEO DB] Connected to local MongoDB at: ${localUri}`);
    return cached.conn;
  } catch (err) {
    console.warn(`[LEO DB] Local MongoDB unavailable (${err.message}). Starting In-Memory MongoDB...`);
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const memoryServer = await MongoMemoryServer.create();
      const memoryUri = memoryServer.getUri();
      cached.conn = await mongoose.connect(memoryUri);
      console.log(`[LEO DB] In-Memory MongoDB running at: ${memoryUri}`);
      return cached.conn;
    } catch (memErr) {
      console.error('[LEO DB] In-Memory DB startup failed:', memErr.message);
      return null;
    }
  }
};
