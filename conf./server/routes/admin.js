const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Seuls les fichiers images sont autorisés'));
        }
    }
});

// @route   GET /api/admin/settings
// @desc    Get all conference settings
// @access  Private
router.get('/settings', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM conference_settings WHERE is_active = true ORDER BY key');
        res.json(result.rows);
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des paramètres' });
    }
});

// @route   PUT /api/admin/settings/:key
// @desc    Update conference setting
// @access  Private
router.put('/settings/:key', [
    body('value').notEmpty().withMessage('La valeur est requise')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { key } = req.params;
        const { value, type, description } = req.body;

        const result = await db.query(
            'UPDATE conference_settings SET value = $1, type = $2, description = $3, updated_at = CURRENT_TIMESTAMP WHERE key = $4 AND is_active = true RETURNING *',
            [value, type || 'text', description, key]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Paramètre non trouvé' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Update setting error:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la mise à jour du paramètre' });
    }
});

// @route   GET /api/admin/speakers
// @desc    Get all speakers
// @access  Private
router.get('/speakers', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM speakers WHERE is_active = true ORDER BY order_priority, name');
        res.json(result.rows);
    } catch (error) {
        console.error('Get speakers error:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des conférenciers' });
    }
});

// @route   POST /api/admin/speakers
// @desc    Create new speaker
// @access  Private
router.post('/speakers', upload.single('photo'), [
    body('name').notEmpty().withMessage('Le nom est requis'),
    body('title').optional(),
    body('institution').optional(),
    body('bio').optional(),
    body('is_keynote').isBoolean().withMessage('is_keynote doit être un booléen'),
    body('order_priority').isInt().withMessage('order_priority doit être un entier')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, title, institution, bio, is_keynote, order_priority } = req.body;
        const photo_url = req.file ? `/uploads/${req.file.filename}` : null;

        const result = await db.query(
            'INSERT INTO speakers (name, title, institution, bio, photo_url, is_keynote, order_priority) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [name, title, institution, bio, photo_url, is_keynote === 'true', order_priority || 0]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Create speaker error:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la création du conférencier' });
    }
});

// @route   PUT /api/admin/speakers/:id
// @desc    Update speaker
// @access  Private
router.put('/speakers/:id', upload.single('photo'), async (req, res) => {
    try {
        const { id } = req.params;
        const updates = { ...req.body };
        
        if (req.file) {
            updates.photo_url = `/uploads/${req.file.filename}`;
        }

        // Build dynamic update query
        const fields = Object.keys(updates);
        const values = Object.values(updates);
        const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');

        const result = await db.query(
            `UPDATE speakers SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${fields.length + 1} AND is_active = true RETURNING *`,
            [...values, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Conférencier non trouvé' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Update speaker error:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la mise à jour du conférencier' });
    }
});

// @route   DELETE /api/admin/speakers/:id
// @desc    Delete speaker (soft delete)
// @access  Private
router.delete('/speakers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await db.query(
            'UPDATE speakers SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Conférencier non trouvé' });
        }

        res.json({ message: 'Conférencier supprimé avec succès' });
    } catch (error) {
        console.error('Delete speaker error:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la suppression du conférencier' });
    }
});

// @route   GET /api/admin/committees
// @desc    Get all committees
// @access  Private
router.get('/committees', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM committees WHERE is_active = true ORDER BY committee_type, order_priority, name');
        res.json(result.rows);
    } catch (error) {
        console.error('Get committees error:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des comités' });
    }
});

// @route   POST /api/admin/committees
// @desc    Create new committee member
// @access  Private
router.post('/committees', upload.single('photo'), [
    body('name').notEmpty().withMessage('Le nom est requis'),
    body('position').optional(),
    body('institution').optional(),
    body('committee_type').notEmpty().withMessage('Le type de comité est requis'),
    body('order_priority').isInt().withMessage('order_priority doit être un entier')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, position, institution, bio, committee_type, order_priority } = req.body;
        const photo_url = req.file ? `/uploads/${req.file.filename}` : null;

        const result = await db.query(
            'INSERT INTO committees (name, position, institution, bio, photo_url, committee_type, order_priority) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [name, position, institution, bio, photo_url, committee_type, order_priority || 0]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Create committee error:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la création du membre du comité' });
    }
});

// @route   GET /api/admin/registrations
// @desc    Get all registrations
// @access  Private
router.get('/registrations', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM registrations ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Get registrations error:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des inscriptions' });
    }
});

// @route   GET /api/admin/submissions
// @desc    Get all submissions
// @access  Private
router.get('/submissions', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM submissions ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Get submissions error:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des soumissions' });
    }
});

// @route   PUT /api/admin/submissions/:id/status
// @desc    Update submission status
// @access  Private
router.put('/submissions/:id/status', [
    body('status').isIn(['pending', 'accepted', 'rejected', 'under_review']).withMessage('Statut invalide'),
    body('reviewer_comments').optional(),
    body('score').optional().isFloat({ min: 0, max: 10 }).withMessage('Le score doit être entre 0 et 10')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { status, reviewer_comments, score } = req.body;

        const result = await db.query(
            'UPDATE submissions SET status = $1, reviewer_comments = $2, score = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
            [status, reviewer_comments, score, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Soumission non trouvée' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Update submission status error:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la mise à jour du statut de la soumission' });
    }
});

// @route   GET /api/admin/sponsors
// @desc    Get all sponsors
// @access  Private
router.get('/sponsors', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM sponsors WHERE is_active = true ORDER BY sponsor_type, order_priority');
        res.json(result.rows);
    } catch (error) {
        console.error('Get sponsors error:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des sponsors' });
    }
});

// @route   POST /api/admin/sponsors
// @desc    Create new sponsor
// @access  Private
router.post('/sponsors', upload.single('logo'), [
    body('name').notEmpty().withMessage('Le nom est requis'),
    body('website_url').optional().isURL().withMessage('URL invalide'),
    body('sponsor_type').notEmpty().withMessage('Le type de sponsor est requis'),
    body('order_priority').isInt().withMessage('order_priority doit être un entier')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, website_url, sponsor_type, description, order_priority } = req.body;
        const logo_url = req.file ? `/uploads/${req.file.filename}` : null;

        const result = await db.query(
            'INSERT INTO sponsors (name, logo_url, website_url, sponsor_type, description, order_priority) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, logo_url, website_url, sponsor_type, description, order_priority || 0]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Create sponsor error:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la création du sponsor' });
    }
});

module.exports = router;