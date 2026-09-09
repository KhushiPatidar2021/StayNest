const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/staynest');
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`\n❌ MongoDB Connection Error: ${error.message}`);
    console.error('========================================================================');

    if (error.message.includes('bad auth') || error.message.includes('authentication failed')) {
      console.error('🔐 AUTH FAILURE: Wrong username or password for MongoDB Atlas!');
      console.error('👉 Fix: Go to MongoDB Atlas → Database Access → Reset password for your DB user');
      console.error('👉 Then update MONGO_URI in backend/.env with the correct password');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('ETIMEDOUT')) {
      console.error('🌐 NETWORK ERROR: Cannot reach MongoDB Atlas — check your internet connection');
    } else {
      console.error('👉 Check your MONGO_URI in backend/.env');
      console.error('   Format: MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dbname');
    }

    console.error('========================================================================\n');
    process.exit(1);
  }
};

module.exports = connectDB;
