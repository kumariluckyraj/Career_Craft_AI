// lib/connectDB.js
import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI ||
 "mongodb+srv://kumariluckyraj:lucky@cluster0.kyuiv5o.mongodb.net/?appName=Cluster0";
if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI is not defined in environment variables.");
}

// Optional: Set Mongoose to use strictQuery mode (recommended in Mongoose 6+)
mongoose.set("strictQuery", true);

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("🟢 Connecting to MongoDB...");
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      dbName: "buy", // Optional: if db name not in URI
    });
  }

  cached.conn = await cached.promise;
  console.log("✅ MongoDB connected.");
  return cached.conn;
}

export default connectDB;
