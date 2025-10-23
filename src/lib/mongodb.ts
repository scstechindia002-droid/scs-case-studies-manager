import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect("mongodb+srv://ravikumardhotre:NVUj9j41nKvI0OKa@cluster0.ncb3x.mongodb.net/case-study?retryWrites=true&w=majority&appName=Cluster0");
    console.log("✅ Connected to MongoDB: case-study");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
};

export default connectDB;
