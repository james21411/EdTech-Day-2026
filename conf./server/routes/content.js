const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../config/database');

const router = express.Router();

// Configuration multer pour l'upload d'images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif|webp/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Seules les images (jpeg, jpg, png, gif, webp) sont autorisées'));
        }
    }
});

// GET /api/content/settings - Récupérer tous les paramètres
router.get('/settings', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM conference_settings WHERE is_active = true ORDER BY key');
        res.json(result.rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des paramètres:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// PUT /api/content/settings/:key - Modifier un paramètre
router.put('/settings/:key', async (req, res) => {
    try {
        const { key } = req.params;
        const { value, description } = req.body;
        
        const result = await db.query(
            'UPDATE conference_settings SET value = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE key = $3 RETURNING *',
            [value, description, key]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Paramètre non trouvé' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erreur lors de la modification du paramètre:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// GET /api/content/speakers - Récupérer tous les conférenciers
router.get('/speakers', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM speakers WHERE is_active = true ORDER BY order_priority');
        res.json(result.rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des conférenciers:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// POST /api/content/speakers - Ajouter un conférencier
router.post('/speakers', async (req, res) => {
    try {
        const { name, title, institution, bio, photo_url, is_keynote, order_priority } = req.body;
        
        const result = await db.query(
            'INSERT INTO speakers (name, title, institution, bio, photo_url, is_keynote, order_priority) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [name, title, institution, bio, photo_url, is_keynote || false, order_priority || 0]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erreur lors de l\'ajout du conférencier:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// PUT /api/content/speakers/:id - Modifier un conférencier
router.put('/speakers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, title, institution, bio, photo_url, is_keynote, order_priority, is_active } = req.body;
        
        const result = await db.query(
            `UPDATE speakers SET 
                name = $1, title = $2, institution = $3, bio = $4, 
                photo_url = $5, is_keynote = $6, order_priority = $7, 
                is_active = $8, updated_at = CURRENT_TIMESTAMP 
             WHERE id = $9 RETURNING *`,
            [name, title, institution, bio, photo_url, is_keynote, order_priority, is_active, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Conférencier non trouvé' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erreur lors de la modification du conférencier:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// DELETE /api/content/speakers/:id - Supprimer un conférencier
router.delete('/speakers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await db.query('UPDATE speakers SET is_active = false WHERE id = $1 RETURNING *', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Conférencier non trouvé' });
        }
        
        res.json({ message: 'Conférencier supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression du conférencier:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// GET /api/content/committees - Récupérer tous les comités
router.get('/committees', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM committees WHERE is_active = true ORDER BY committee_type, order_priority');
        res.json(result.rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des comités:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// POST /api/content/committees - Ajouter un membre de comité
router.post('/committees', async (req, res) => {
    try {
        const { name, position, institution, bio, photo_url, committee_type, order_priority } = req.body;
        
        const result = await db.query(
            'INSERT INTO committees (name, position, institution, bio, photo_url, committee_type, order_priority) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [name, position, institution, bio, photo_url, committee_type, order_priority || 0]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erreur lors de l\'ajout du membre de comité:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// GET /api/content/schedule - Récupérer le programme
router.get('/schedule', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT ps.*, s.name as speaker_name 
            FROM program_schedule ps 
            LEFT JOIN speakers s ON ps.speaker_id = s.id 
            WHERE ps.is_active = true 
            ORDER BY ps.day_number, ps.start_time
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Erreur lors de la récupération du programme:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// POST /api/content/schedule - Ajouter un élément au programme
router.post('/schedule', async (req, res) => {
    try {
        const { day_number, start_time, end_time, title, description, speaker_id, session_type, location } = req.body;
        
        const result = await db.query(
            'INSERT INTO program_schedule (day_number, start_time, end_time, title, description, speaker_id, session_type, location) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [day_number, start_time, end_time, title, description, speaker_id, session_type, location]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erreur lors de l\'ajout au programme:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// POST /api/content/upload - Upload d'image
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Aucun fichier fourni' });
        }
        
        const { alt_text, description, usage_context } = req.body;
        
        // Enregistrer dans la base de données
        const result = await db.query(
            'INSERT INTO images (filename, alt_text, description, usage_context, file_size, mime_type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [req.file.filename, alt_text, description, usage_context, req.file.size, req.file.mimetype]
        );
        
        res.json({
            message: 'Image uploadée avec succès',
            file: {
                url: `/uploads/${req.file.filename}`,
                ...result.rows[0]
            }
        });
    } catch (error) {
        console.error('Erreur lors de l\'upload:', error);
        res.status(500).json({ error: 'Erreur lors de l\'upload' });
    }
});

// GET /api/content/images - Récupérer toutes les images
router.get('/images', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM images WHERE is_active = true ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des images:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// DELETE /api/content/images/:id - Supprimer une image
router.delete('/images/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await db.query('UPDATE images SET is_active = false WHERE id = $1 RETURNING *', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Image non trouvée' });
        }
        
        res.json({ message: 'Image supprimée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'image:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = router;