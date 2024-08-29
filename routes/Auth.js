const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../config/db');

// Register route
router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO tbl_users (username, password) VALUES (?, ?)', [username, hashedPassword]);
        res.redirect('/auth/login');
    } catch (error) {
        console.error('Registration error:', error); 
        res.status(500).send('Server error');
    }
});

// Login route
router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    try {
        const [rows] = await db.query('SELECT * FROM tbl_users WHERE username = ?', [username]);
        if (rows.length === 0) {
            return res.status(400).send('Invalid credentials');
        }
        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid credentials');
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        req.session.token = token;
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Login error:', error); // Log the error for debugging
        res.status(500).send('Server error');
    }
});

// Logout route
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).send('Server error');
        }
        res.redirect('/auth/login');
    });
});

module.exports = router;
