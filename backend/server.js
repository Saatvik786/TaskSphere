const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorMiddleware');

dotenv.config();

connectDB();

const app = express();

app.use(passport.initialize());

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map(url => url.trim())
  : ['http://localhost:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

if (process.env.NODE_ENV === 'development') {
  app.get('/api/debug/oauth', (req, res) => {
    const callbackUrl = process.env.GOOGLE_CALLBACK_URL;
    res.json({
      hasClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      callbackUrl: callbackUrl,
      clientUrl: process.env.CLIENT_URL,
      nodeEnv: process.env.NODE_ENV,
    });
  });
}

app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found',
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'production') {
  const requiredVars = [
    'MONGODB_URL',
    'JWT_SECRET_KEY',
    'CLIENT_URL',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_CALLBACK_URL',
  ];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars.join(', '));
    console.error('Please set all required environment variables before starting the server.');
    process.exit(1);
  }

  console.log('Server starting in production mode');
}

app.listen(PORT, () => {
  if (process.env.NODE_ENV === 'production') {
    console.log(`Server running on port ${PORT}`);
  } else {
    console.log(`Server running in development mode on port ${PORT}`);
  }
});

