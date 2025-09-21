const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (typeof uri !== 'string' || uri.trim() === '') {
      console.error(
        'Error: MONGO_URI environment variable is not set.\n' +
          'Please add a `.env` file in the BACKEND folder with a line like:\n' +
          'MONGO_URI="mongodb://localhost:27017/your-db-name"'
      );
      // Exit with failure so the app doesn't pass undefined to mongoose
      process.exit(1);
    }

    // Connect without deprecated options — Mongoose v6+ uses sensible defaults
    await mongoose.connect(uri);

    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err && err.message ? err.message : err);
    process.exit(1);
  }
};

module.exports = connectDB;
// This module exports a function to connect to MongoDB using Mongoose.
// It now validates that `MONGO_URI` is present and prints a clear error if it's missing,
// preventing the `uri must be a string` error from Mongoose.