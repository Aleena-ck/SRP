const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const donorRoutes = require('./routes/donor');
const adminRoutes = require('./routes/admin');
const bloodRequestRoutes = require('./routes/bloodRequest');
const inventoryRoutes = require('./routes/inventory');
const donationRoutes = require('./routes/donation');

// Initialize Express app
const app = express();

// Connect to MongoDB
console.log('🔗 Connecting to MongoDB...');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log(`   Database: ${mongoose.connection.name}`);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('⚠️ Running without database...');
  });

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/blood-requests', bloodRequestRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/donations', donationRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true,
    message: 'All routes are working!',
    routes: {
      auth: '/api/auth',
      donors: '/api/donors',
      admin: '/api/admin',
      bloodRequests: '/api/blood-requests',
      inventory: '/api/inventory',
      donations: '/api/donations'
    },
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const mongoState = mongoose.connection.readyState;
  let mongoStatus = 'disconnected';
  
  switch(mongoState) {
    case 0: mongoStatus = 'disconnected'; break;
    case 1: mongoStatus = 'connected'; break;
    case 2: mongoStatus = 'connecting'; break;
    case 3: mongoStatus = 'disconnecting'; break;
  }
  
  res.status(200).json({ 
    status: 'OK', 
    message: 'Lifeblood Connect API is running',
    timestamp: new Date().toISOString(),
    services: {
      express: 'running',
      mongodb: mongoStatus
    },
    routes: [
      '/api/auth',
      '/api/donors',
      '/api/admin',
      '/api/blood-requests',
      '/api/inventory',
      '/api/donations',
      '/api/health',
      '/api/test'
    ]
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: '🚀 Lifeblood Connect API',
    description: 'Blood Donation Management System',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      auth: '/api/auth',
      donors: '/api/donors',
      admin: '/api/admin',
      bloodRequests: '/api/blood-requests',
      inventory: '/api/inventory',
      donations: '/api/donations',
      health: '/api/health',
      test: '/api/test'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'API endpoint not found',
    requestedUrl: req.originalUrl,
    availableEndpoints: [
      'GET /',
      'GET /api/health',
      'GET /api/test',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/donors',
      'GET /api/admin',
      'GET /api/blood-requests',
      'GET /api/inventory',
      'GET /api/donations'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`🚀 LIFEBLOOD CONNECT - BACKEND SERVER`);
  console.log(`========================================`);
  console.log(`   Port: ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   API URL: http://localhost:${PORT}`);
  console.log(`   MongoDB: ${mongoose.connection.readyState === 1 ? '✅ Connected' : '⚠️ Not connected'}`);
  console.log(`\n   📍 Available Routes:`);
  console.log(`   • Home:        http://localhost:${PORT}/`);
  console.log(`   • Health:      http://localhost:${PORT}/api/health`);
  console.log(`   • Test:        http://localhost:${PORT}/api/test`);
  console.log(`   • Auth:        http://localhost:${PORT}/api/auth`);
  console.log(`   • Donors:      http://localhost:${PORT}/api/donors`);
  console.log(`   • Admin:       http://localhost:${PORT}/api/admin`);
  console.log(`   • Blood Req:   http://localhost:${PORT}/api/blood-requests`);
  console.log(`   • Inventory:   http://localhost:${PORT}/api/inventory`);
  console.log(`   • Donations:   http://localhost:${PORT}/api/donations`);
  console.log(`\n========================================\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing server gracefully...');
  server.close(() => {
    console.log('Server closed.');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed.');
      process.exit(0);
    });
  });
});

module.exports = app;