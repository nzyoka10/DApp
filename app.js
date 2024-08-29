// app.js
const express = require('express');
const path = require('path');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const morgan = require('morgan');
require('dotenv').config();

const db = require('./config/db'); // Ensure this file correctly exports your database connection configuration
const authRoutes = require('./routes/auth'); // Ensure these route files exist and are correctly set up
const dashboardRoutes = require('./routes/dashboard'); // Ensure these route files exist and are correctly set up

const app = express();

// Setup view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Logging
app.use(morgan('dev')); // Log requests in development mode

// Session configuration
const sessionStore = new MySQLStore({
    expiration: 24 * 60 * 60 * 1000, // 24 hours
    createDatabaseTable: true,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
        httpOnly: true, // Prevent client-side JavaScript from accessing cookies
        maxAge: 24 * 60 * 60 * 1000 // Cookie expiration
    }
}));

// Routes
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);

// Home route
app.get('/', (req, res) => {
    res.redirect('/auth/login');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
