require('dotenv').config();
const express = require('express');
const session = require('express-session');
const flash = require('express-flash');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const compression = require('compression');

// Route imports
const static = require('./routes/static');
const baseController = require('./controllers/baseController');
const errorHandler = require('./middleware/errorHandler');
const errorRouter = require('./routes/errorRoute');
const accountRouter = require('./routes/accountRoute');
const inventoryRouter = require('./routes/inventoryRoute');

// Database and utilities
const pool = require('./database/');
const utilities = require('./utilities');
const connectPgSimple = require('connect-pg-simple')(session);

const app = express();

// ========================
// Security Middleware
// ========================
app.use(helmet());
app.disable('x-powered-by');

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// ========================
// Application Configuration
// ========================
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ========================
// Session Configuration
// ========================
const sessionConfig = {
  store: new connectPgSimple({
    createTableIfMissing: true,
    pool,
    pruneSessionInterval: 60 * 60
  }),
  secret: process.env.SESSION_SECRET || 'your-fallback-secret',
  resave: false,
  saveUninitialized: false,
  name: 'sessionId',
  cookie: {
    maxAge: 86400000,
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict'
  }
};

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
  sessionConfig.cookie.secure = true;
}

app.use(session(sessionConfig));

// ========================
// CSRF Protection
// ========================
app.use(csrf({ cookie: true }));

// ========================
// View Engine & Static Files
// ========================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// ========================
// Application Middleware
// ========================
app.use(flash());

// Template variables
app.use((req, res, next) => {
  res.locals = {
    messages: {
      notice: req.flash('notice'),
      error: req.flash('error'),
      success: req.flash('success')
    },
    currentPath: req.path,
    user: req.session.user || null,
    csrfToken: req.csrfToken(),
    env: process.env.NODE_ENV
  };
  next();
});

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// ========================
// Routes
// ========================
app.get('/', baseController.buildHome);
app.use('/account', accountRouter);
app.use('/inv/type', inventoryRouter);
app.use('/', errorRouter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).render('errors/404', {
    title: 'Page Not Found',
    nav: utilities.getNav()
  });
});

// ========================
// Error Handling
// ========================
app.use(errorHandler);
// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// ========================
// Server Startup
// ========================
const PORT = process.env.PORT || 5500;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Error handling for uncaught exceptions
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  server.close(() => process.exit(1));
});