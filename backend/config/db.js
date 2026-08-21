const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/staynest');
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`\n❌ MongoDB Connection Error: ${error.message}`);
    console.error('========================================================================');
    console.error('👉 MongoDB is not running locally on port 27017!');
    console.error('👉 Solution: Paste your free MongoDB Atlas cloud connection URI into backend/.env:');
    console.error('   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/staynest');
    console.error('========================================================================\n');
    process.exit(1);
  }
};

module.exports = connectDB;
