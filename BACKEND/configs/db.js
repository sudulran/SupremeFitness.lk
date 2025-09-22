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
      process.exit(1); // Exit so mongoose doesn't get undefined
    }

    // Connect to MongoDB (Mongoose v6+ doesn't need deprecated options)
    await mongoose.connect(uri);

    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message || err);
    process.exit(1);
  }
};

module.exports = connectDB;
