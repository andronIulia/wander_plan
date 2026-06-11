require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const tripRoutes = require('./routes/trips');
const activityRoutes = require('./routes/activities');
const packingRoutes = require('./routes/packing');
const userRoutes = require('./routes/users');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/packing', packingRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'WanderPlan API is running' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ Connected to MongoDB Atlas');
    } catch (err) {
      console.error('❌ MongoDB connection error:', err.message);
      process.exit(1);
    }
  }
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

if (require.main === module) {
  startServer();
}

module.exports = app;
