// routes/dashboard.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const jwt = require('jsonwebtoken');

// Middleware to check authentication
router.use((req, res, next) => {
    const token = req.session.token;
    if (!token) {
        return res.redirect('/auth/login');
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.redirect('/auth/login');
        }
        req.userId = decoded.id;
        next();
    });
});

// Dashboard route
router.get('/', (req, res) => {
    res.render('dashboard');
});

// Transfer money route
router.post('/transfer', async (req, res) => {
    const { toAddress, amount } = req.body;
    // Logic to transfer money
    res.send('Transfer successful');
});

module.exports = router;
