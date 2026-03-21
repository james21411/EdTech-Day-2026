const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register new admin user
// @access  Private (Admin only)
router.post('/register', [
    body('username').isLength({ min: 3 }).withMessage('Le nom d\'utilisateur doit contenir au moins 3 caractères'),
    body('email').isEmail().withMessage('Veuillez saisir un email valide'),
    body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await db.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
        
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'Un utilisateur avec ce nom d\'utilisateur ou email existe déjà' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const result = await db.query(
            'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role',
            [username, email, hashedPassword, 'admin']
        );

        const user = result.rows[0];

        // Create JWT
        const payload = {
            userId: user.id,
            username: user.username,
            role: user.role
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        role: user.role
                    }
                });
            }
        );

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Erreur serveur lors de l\'inscription' });
    }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
    body('username').notEmpty().withMessage('Le nom d\'utilisateur est requis'),
    body('password').notEmpty().withMessage('Le mot de passe est requis')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;
        console.log('Login attempt for username:', username);

        // Find user
        const result = await db.query('SELECT * FROM users WHERE username = $1 AND is_active = true', [username]);
        console.log('Database query result:', result.rows.length, 'rows found');
        
        if (result.rows.length === 0) {
            console.log('User not found or inactive');
            return res.status(400).json({ error: 'Identifiants invalides' });
        }

        const user = result.rows[0];
        console.log('Found user:', user.username, 'ID:', user.id);

        // Check password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        console.log('Password match result:', isMatch);
        
        if (!isMatch) {
            console.log('Password mismatch');
            return res.status(400).json({ error: 'Identifiants invalides' });
        }

        // Create JWT
        const payload = {
            userId: user.id,
            username: user.username,
            role: user.role
        };

        const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
        console.log('JWT Secret:', jwtSecret === 'your-secret-key' ? 'Using default secret' : 'Using environment secret');
        console.log('JWT Payload:', payload);

        jwt.sign(
            payload,
            jwtSecret,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) {
                    console.error('JWT sign error:', err);
                    throw err;
                }
                console.log('JWT token generated successfully');
                res.json({
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        role: user.role
                    }
                });
            }
        );

    } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Erreur serveur lors de la connexion', details: error.message });
        }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', async (req, res) => {
    try {
        // The auth middleware should have already verified the token and added user to req
        if (!req.user) {
            return res.status(401).json({ error: 'Utilisateur non authentifié' });
        }

        res.json({
            user: {
                id: req.user.id,
                username: req.user.username,
                email: req.user.email,
                role: req.user.role
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération de l\'utilisateur' });
    }
});

// @route   POST /api/auth/refresh
// @desc    Refresh JWT token
// @access  Private
router.post('/refresh', async (req, res) => {
    try {
        // The auth middleware should have already verified the token and added user to req
        if (!req.user) {
            return res.status(401).json({ error: 'Utilisateur non authentifié' });
        }

        // Create new JWT
        const payload = {
            userId: req.user.id,
            username: req.user.username,
            role: req.user.role
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );

    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(500).json({ error: 'Erreur serveur lors du rafraîchissement du token' });
    }
});

module.exports = router;