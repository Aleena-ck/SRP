const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lifeblood_connect');
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        
        // Check if we need to create default admin
        await checkAndCreateDefaultAdmin();
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

// Create default admin if not exists
const checkAndCreateDefaultAdmin = async () => {
    try {
        const User = require('../models/User');
        const Admin = require('../models/Admin');
        
        const existingAdmin = await User.findOne({ 
            email: process.env.DEFAULT_ADMIN_EMAIL,
            role: 'admin' 
        });
        
        if (!existingAdmin) {
            console.log('⚙️ Creating default admin user...');
            // Admin creation will be handled through registration endpoint
        }
    } catch (error) {
        console.error('Error checking default admin:', error);
    }
};

module.exports = connectDB;