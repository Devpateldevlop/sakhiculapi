import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://deva:devpatel1234@cluster0.pf0qwiv.mongodb.net/";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

// Global is used here to maintain a cached connection across hot reloads in dev
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // fail fast if no DB
      socketTimeoutMS: 45000,
      keepAlive: true,
    }).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
