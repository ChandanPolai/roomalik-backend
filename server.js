const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const adminRoutes = require('./routes/adminRoutes');
const logger = require('morgan');
const cors = require('cors');
const path = require('path');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: ['http://localhost:8081', 'exp://localhost:8081'],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// ✅✅ Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV === 'development') {
    app.use(logger('dev'));
}

app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

app.use('/api', adminRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    success: false,
    error: 'Internal server error' 
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));