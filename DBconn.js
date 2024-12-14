import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// MongoDB connection function
const DBconn = async () => {
  try {
    // Get the MongoDB URI from environment variables
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1/Devi';

    // Connect to MongoDB
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,  // Ensures MongoDB URI is parsed correctly
      useUnifiedTopology: true, // Opt for the new topology engine (better performance)
      serverSelectionTimeoutMS: 5000, // Timeout if unable to connect to server
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Log error with the message
    console.error(`Error connecting to MongoDB: ${error.message}`);

    // Exit the process with failure
    process.exit(1);
  }
};

// Graceful shutdown handling
const gracefulShutdown = () => {
  mongoose.connection.on("SIGINT", () => {
    console.log("MongoDB connection closed due to application termination");
    mongoose.connection.close(() => {
      process.exit(0);
    });
  });
};

export { DBconn, gracefulShutdown };
