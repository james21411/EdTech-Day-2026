const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Authentication middleware
const auth = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.header('Authorization');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Accès refusé. Aucun token fourni.' });
        }

        // Extract token
        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        if (!token) {
            return res.status(401).json({ error: 'Accès refusé. Aucun token fourni.' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        // Get user from database
        const result = await db.query('SELECT id, username, email, role, is_active FROM users WHERE id = $1 AND is_active = true', [decoded.userId]);
        
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Token invalide ou utilisateur désactivé.' });
        }

        req.user = result.rows[0];
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Token invalide.' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expiré.' });
        }
        res.status(500).json({ error: 'Erreur serveur.' });
    }
};

// Admin role middleware
const adminAuth = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Accès interdit. Rôle administrateur requis.' });
    }
    next();
};

module.exports = { auth, adminAuth };