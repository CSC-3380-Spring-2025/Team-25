// lib/db.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in .env');
}

// Global cache to store the connection
let cached = global.mongoose as { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null; };

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDB() {
  // If we have an existing connection, use it
  if (cached.conn) {
    return cached.conn;
  }

  // If we don’t have a cached promise, create a new one
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
