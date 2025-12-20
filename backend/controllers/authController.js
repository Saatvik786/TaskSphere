const jwt = require('jsonwebtoken');
const User = require('../models/User');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      proxy: false,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          user.googleId = profile.id;
          user.provider = 'google';
          await user.save();
          return done(null, user);
        }

        user = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          provider: 'google',
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      provider: 'local',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: 'Please login with Google',
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          provider: user.provider,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const googleAuth = (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.error('❌ Google OAuth not configured - missing CLIENT_ID or CLIENT_SECRET');
    return res.status(500).json({
      success: false,
      message: 'Google OAuth is not configured. Please contact support.',
    });
  }

  const callbackUrl = process.env.GOOGLE_CALLBACK_URL;
  
  if (!callbackUrl) {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Google OAuth not configured - missing CALLBACK_URL');
    }
    return res.status(500).json({
      success: false,
      message: 'Google OAuth callback URL is not configured.',
    });
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('🔐 Initiating Google OAuth');
  }
  
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })(req, res, next);
};

const googleCallback = (req, res, next) => {
  if (req.query.error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Google OAuth error:', req.query.error);
      if (req.query.error_description) {
        console.error('Error description:', req.query.error_description);
      }
    }
  }
  
  passport.authenticate('google', { session: false }, (err, user, info) => {
    try {
      if (err) {
        console.error('❌ Google OAuth error:', err);
        console.error('Error details:', err.message, err.stack);
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
        return res.redirect(`${clientUrl}/login?error=auth_failed&details=${encodeURIComponent(err.message)}`);
      }

      if (!user) {
        console.error('❌ Google OAuth: No user returned');
        console.error('Info:', info);
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
        return res.redirect(`${clientUrl}/login?error=auth_failed&reason=no_user`);
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Google OAuth successful for user:', user.email);
      }

      const token = generateToken(user._id);

      const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
      res.redirect(`${clientUrl}/auth/callback?token=${token}`);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error in Google OAuth callback:', error);
      }
      const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
      res.redirect(`${clientUrl}/login?error=auth_failed`);
    }
  })(req, res, next);
};

module.exports = {
  register,
  login,
  getMe,
  googleAuth,
  googleCallback,
};

