require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./src/routes/auth');
const adminRoutes = require('./src/routes/admin');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Health check with demo info
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Seva Connect Demo Backend is running!',
    timestamp: new Date().toISOString(),
    demoCredentials: {
      admin: {
        email: 'admin@sevaconnect.com',
        password: 'admin123'
      }
    }
  });
});

// Demo credentials endpoint
app.get('/api/demo-credentials', (req, res) => {
  res.json({
    success: true,
    credentials: [
      {
        role: 'admin',
        email: 'admin@sevaconnect.com',
        password: 'admin123',
        description: 'Full admin access'
      }
    ]
  });
});

// Handle undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('');
  console.log('=================================');
  console.log('🚀 SEVA CONNECT DEMO BACKEND');
  console.log('📍 Port: ' + PORT);
  console.log('📍 Health: http://localhost:' + PORT + '/api/health');
  console.log('=================================');
  console.log('');
  console.log('👑 DEMO LOGIN CREDENTIALS:');
  console.log('   📧 Email: admin@sevaconnect.com');
  console.log('   🔑 Password: admin123');
  console.log('');
  console.log('💡 This is a demo backend using localStorage.');
  console.log('   No database required!');
  console.log('');
});
