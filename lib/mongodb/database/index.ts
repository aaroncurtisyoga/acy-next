import mongoose from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI;

// Hold a cached connection to the db
let cached = (global as any).mongoose || {
  conn: null,
  promise: null,
};

export const connectToDatabase = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing");
  }

  // Connect to already existing cached connection. Or, create a new connection
  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URI, {
      dbName: "acy",
      bufferCommands: false,
    });

  cached.conn = await cached.promise;

  return cached.conn;
};
