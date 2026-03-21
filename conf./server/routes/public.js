const express = require('express');
const db = require('../config/database');

const router = express.Router();

// @route   GET /api/conference/settings
// @desc    Get conference settings
// @access  Public
router.get('/conference/settings', async (req, res) => {
    try {
        const result = await db.query('SELECT key, value FROM conference_settings WHERE is_active = true');
        const settings = {};
        
        result.rows.forEach(row => {
            settings[row.key] = row.value;
        });
        
        res.json(settings);
    } catch (error) {
        console.error('Get conference settings error:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des paramètres' });
    }
});

// @route   GET /api/speakers
// @desc    Get all speakers
// @access  Public
router.get('/speakers', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM speakers WHERE is_active = true ORDER BY order_priority, name');
        res.json(result.rows);
    } catch (error) {
        console.error('Get speakers error:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des conférenciers' });
    }
});

// @route   GET /api/speakers/keynotes
// @desc    Get keynote speakers only
// @access  Public
router.get('/speakers/keynotes', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM speakers WHERE is_active = true AND is_keynote = true ORDER BY order_priority, name');
        res.json(result.rows);
    } catch (error) {
        console.error('Get keynote speakers error:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des conférenciers principaux' });
    }
});

// @route   GET /api/committees
// @desc    Get all committees
// @access  Public
router.get('/committees', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM committees WHERE is_active = true ORDER BY committee_type, order_priority, name');
        res.json(result.rows);
    } catch (error) {
        console.error('Get committees error:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des comités' });
    }
});

// @route   GET /api/committees/:type
// @desc    Get committees by type
// @access  Public
router.get('/committees/:type', async (req, res) => {
    try {
        const { type } = req.params;
        const result = await db.query('SELECT * FROM committees WHERE is_active = true AND committee_type = $1 ORDER BY order_priority, name', [type]);
        res.json(result.rows);
    } catch (error) {
        console.error('Get committees by type error:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des comités' });
    }
});

// @route   GET /api/program
// @desc    Get program schedule
// @access  Public
router.get('/program', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT ps.*, s.name as speaker_name, s.title as speaker_title 
            FROM program_schedule ps 
            LEFT JOIN speakers s ON ps.speaker_id = s.id 
            WHERE ps.is_active = true 
            ORDER BY ps.day_number, ps.start_time
        `);
        res.json(result.rows);
    } catch (error) {
        console.error('Get program error:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération du programme' });
    }
});

// @route   GET /api/program/day/:day
// @desc    Get program for specific day
// @access  Public
router.get('/program/day/:day', async (req, res) => {
    try {
        const { day } = req.params;
        const result = await db.query(`
            SELECT ps.*, s.name as speaker_name, s.title as speaker_title 
            FROM program_schedule ps 
            LEFT JOIN speakers s ON ps.speaker_id = s.id 
            WHERE ps.is_active = true AND ps.day_number = $1 
            ORDER BY ps.start_time
        `, [parseInt(day)]);
        res.json(result.rows);
    } catch (error) {
        console.error('Get program by day error:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération du programme' });
    }
});

// @route   GET /api/sponsors
// @desc    Get all sponsors
// @access  Public
router.get('/sponsors', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM sponsors WHERE is_active = true ORDER BY sponsor_type, order_priority');
        res.json(result.rows);
    } catch (error) {
        console.error('Get sponsors error:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des sponsors' });
    }
});

// @route   GET /api/sponsors/:type
// @desc    Get sponsors by type
// @access  Public
router.get('/sponsors/:type', async (req, res) => {
    try {
        const { type } = req.params;
        const result = await db.query('SELECT * FROM sponsors WHERE is_active = true AND sponsor_type = $1 ORDER BY order_priority', [type]);
        res.json(result.rows);
    } catch (error) {
        console.error('Get sponsors by type error:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des sponsors' });
    }
});

// @route   POST /api/registrations
// @desc    Create new registration
// @access  Public
router.post('/registrations', async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            email,
            institution,
            category,
            days_attending,
            comments
        } = req.body;

        // Basic validation
        if (!first_name || !last_name || !email || !institution || !category) {
            return res.status(400).json({ error: 'Tous les champs requis doivent être remplis' });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Email invalide' });
        }

        // Category validation
        const validCategories = ['student', 'professional', 'group'];
        if (!validCategories.includes(category)) {
            return res.status(400).json({ error: 'Catégorie invalide' });
        }

        // Calculate payment amount
        let paymentAmount = 0;
        if (category === 'student') {
            paymentAmount = 25000;
        } else if (category === 'professional') {
            paymentAmount = 75000;
        } else if (category === 'group') {
            paymentAmount = 75000 * 0.85; // 15% discount
        }

        const result = await db.query(
            `INSERT INTO registrations 
            (first_name, last_name, email, institution, category, days_attending, comments, payment_amount) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
            RETURNING *`,
            [first_name, last_name, email, institution, category, JSON.stringify(days_attending), comments, paymentAmount]
        );

        res.status(201).json({
            message: 'Inscription créée avec succès',
            registration: result.rows[0],
            payment_amount: paymentAmount
        });
    } catch (error) {
        console.error('Create registration error:', error);
        
        // Check for unique constraint violation
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Une inscription avec cet email existe déjà' });
        }
        
        res.status(500).json({ error: 'Erreur serveur lors de la création de l\'inscription' });
    }
});

// @route   POST /api/submissions
// @desc    Create new submission
// @access  Public
router.post('/submissions', async (req, res) => {
    try {
        const {
            title,
            abstract,
            authors,
            email,
            institution,
            submission_type,
            keywords
        } = req.body;

        // Basic validation
        if (!title || !abstract || !authors || !email || !institution || !submission_type) {
            return res.status(400).json({ error: 'Tous les champs requis doivent être remplis' });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Email invalide' });
        }

        // Submission type validation
        const validTypes = ['full_paper', 'short_paper', 'poster'];
        if (!validTypes.includes(submission_type)) {
            return res.status(400).json({ error: 'Type de soumission invalide' });
        }

        const result = await db.query(
            `INSERT INTO submissions 
            (title, abstract, authors, email, institution, submission_type, keywords) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING *`,
            [title, abstract, authors, email, institution, submission_type, keywords]
        );

        res.status(201).json({
            message: 'Soumission créée avec succès',
            submission: result.rows[0]
        });
    } catch (error) {
        console.error('Create submission error:', error);
        
        // Check for unique constraint violation
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Une soumission avec ce titre existe déjà' });
        }
        
        res.status(500).json({ error: 'Erreur serveur lors de la création de la soumission' });
    }
});

// @route   GET /api/content/:key
// @desc    Get content block by key
// @access  Public
router.get('/content/:key', async (req, res) => {
    try {
        const { key } = req.params;
        const result = await db.query('SELECT * FROM content_blocks WHERE block_key = $1 AND is_active = true', [key]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Contenu non trouvé' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Get content error:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération du contenu' });
    }
});

// @route   GET /api/content
// @desc    Get all content blocks
// @access  Public
router.get('/content', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM content_blocks WHERE is_active = true ORDER BY block_key');
        res.json(result.rows);
    } catch (error) {
        console.error('Get content blocks error:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des contenus' });
    }
});

// @route   GET /api/public/registrations
// @desc    Get all registrations
// @access  Public
router.get('/public/registrations', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM registrations ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Get registrations error:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des inscriptions' });
    }
});

// @route   GET /api/public/submissions
// @desc    Get all submissions
// @access  Public
router.get('/public/submissions', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM submissions ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Get submissions error:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des soumissions' });
    }
});

// @route   GET /api/stats
// @desc    Get conference statistics
// @access  Public
router.get('/stats', async (req, res) => {
    try {
        const stats = {};

        // Count registrations
        const regResult = await db.query('SELECT COUNT(*) as total FROM registrations');
        stats.total_registrations = parseInt(regResult.rows[0].total);

        // Count submissions
        const subResult = await db.query('SELECT COUNT(*) as total FROM submissions');
        stats.total_submissions = parseInt(subResult.rows[0].total);

        // Count accepted submissions
        const accSubResult = await db.query('SELECT COUNT(*) as total FROM submissions WHERE status = \'accepted\'');
        stats.accepted_submissions = parseInt(accSubResult.rows[0].total);

        // Count speakers
        const speakerResult = await db.query('SELECT COUNT(*) as total FROM speakers WHERE is_active = true');
        stats.total_speakers = parseInt(speakerResult.rows[0].total);

        // Count keynote speakers
        const keynoteResult = await db.query('SELECT COUNT(*) as total FROM speakers WHERE is_active = true AND is_keynote = true');
        stats.total_keynotes = parseInt(keynoteResult.rows[0].total);

        // Count sponsors
        const sponsorResult = await db.query('SELECT COUNT(*) as total FROM sponsors WHERE is_active = true');
        stats.total_sponsors = parseInt(sponsorResult.rows[0].total);

        res.json(stats);
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des statistiques' });
    }
});

module.exports = router;