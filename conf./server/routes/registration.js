const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

const REGISTRATIONS_FILE = path.join(__dirname, '../../data/registrations.json');

// Helper function to read registrations from JSON file
async function readRegistrations() {
    try {
        console.log('Reading from:', REGISTRATIONS_FILE);
        const data = await fs.readFile(REGISTRATIONS_FILE, 'utf8');
        console.log('File content length:', data.length);
        if (!data.trim()) {
            return [];
        }
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading registrations:', error);
        console.error('File path:', REGISTRATIONS_FILE);
        // If file doesn't exist, return empty array
        if (error.code === 'ENOENT') {
            return [];
        }
        return [];
    }
}

// Helper function to write registrations to JSON file
async function writeRegistrations(registrations) {
    try {
        console.log('Writing to:', REGISTRATIONS_FILE);
        console.log('Registrations count:', registrations.length);
        await fs.writeFile(REGISTRATIONS_FILE, JSON.stringify(registrations, null, 2));
        console.log('File written successfully');
        return true;
    } catch (error) {
        console.error('Error writing registrations:', error);
        console.error('File path:', REGISTRATIONS_FILE);
        console.error('Error code:', error.code);
        return false;
    }
}

// Ensure data directory exists
async function ensureDataDirectory() {
    const dataDir = path.dirname(REGISTRATIONS_FILE);
    try {
        await fs.access(dataDir);
    } catch (error) {
        if (error.code === 'ENOENT') {
            await fs.mkdir(dataDir, { recursive: true });
            console.log('Created data directory:', dataDir);
        } else {
            throw error;
        }
    }
}

// POST /api/registration - Submit registration
router.post('/', async (req, res) => {
    try {
        // Ensure data directory exists
        await ensureDataDirectory();
        
        const {
            firstName,
            lastName,
            email,
            institution,
            category,
            days,
            comments
        } = req.body;
        
        console.log('Received registration data:', { firstName, lastName, email, institution, category, days });

        // Validate required fields
        if (!firstName || !lastName || !email || !institution || !category) {
            console.log('Validation failed: missing required fields');
            return res.status(400).json({
                success: false,
                message: 'Tous les champs requis doivent être remplis'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Format d\'email invalide'
            });
        }

        // Validate category
        const validCategories = ['student', 'professional', 'group'];
        if (!validCategories.includes(category)) {
            return res.status(400).json({
                success: false,
                message: 'Catégorie invalide'
            });
        }

        // Check if email already exists
        const existingRegistrations = await readRegistrations();
        const emailExists = existingRegistrations.some(reg => reg.email === email);
        
        if (emailExists) {
            return res.status(409).json({
                success: false,
                message: 'Un enregistrement avec cet email existe déjà'
            });
        }

        // Create registration object
        const registration = {
            id: Date.now().toString(),
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim().toLowerCase(),
            institution: institution.trim(),
            category,
            days: Array.isArray(days) ? days : [],
            comments: comments ? comments.trim() : '',
            registrationDate: new Date().toISOString(),
            status: 'confirmed'
        };

        // Add to registrations
        existingRegistrations.push(registration);
        
        // Save to file
        const saved = await writeRegistrations(existingRegistrations);
        
        if (!saved) {
            console.log('Failed to save registration to file');
            return res.status(500).json({
                success: false,
                message: 'Erreur lors de l\'enregistrement dans la base de données'
            });
        }

        console.log('Registration saved successfully with ID:', registration.id);
        res.status(201).json({
            success: true,
            message: 'Inscription réussie ! Vous recevrez un email de confirmation.',
            registrationId: registration.id
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur interne'
        });
    }
});

// GET /api/registration - Get all registrations (for admin)
router.get('/', async (req, res) => {
    try {
        const registrations = await readRegistrations();
        
        // Remove sensitive data for public access
        const publicRegistrations = registrations.map(reg => ({
            id: reg.id,
            firstName: reg.firstName,
            lastName: reg.lastName,
            institution: reg.institution,
            category: reg.category,
            registrationDate: reg.registrationDate,
            status: reg.status
        }));

        res.json({
            success: true,
            data: publicRegistrations
        });
    } catch (error) {
        console.error('Error fetching registrations:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des enregistrements'
        });
    }
});

// GET /api/registration/stats - Get registration statistics
router.get('/stats', async (req, res) => {
    try {
        const registrations = await readRegistrations();
        
        const stats = {
            total: registrations.length,
            byCategory: {
                student: registrations.filter(r => r.category === 'student').length,
                professional: registrations.filter(r => r.category === 'professional').length,
                group: registrations.filter(r => r.category === 'group').length
            },
            byDay: {
                day1: registrations.filter(r => r.days.includes('day1')).length,
                day2: registrations.filter(r => r.days.includes('day2')).length,
                day3: registrations.filter(r => r.days.includes('day3')).length
            },
            recentRegistrations: registrations
                .sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate))
                .slice(0, 5)
                .map(reg => ({
                    name: `${reg.firstName} ${reg.lastName}`,
                    institution: reg.institution,
                    registrationDate: reg.registrationDate
                }))
        };

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des statistiques'
        });
    }
});

// GET /api/registration/test - Test endpoint
router.get('/test', async (req, res) => {
    try {
        console.log('Test endpoint called');
        console.log('Registrations file path:', REGISTRATIONS_FILE);
        
        // Test file access
        const stats = await fs.stat(REGISTRATIONS_FILE);
        console.log('File stats:', stats);
        
        // Test reading
        const registrations = await readRegistrations();
        console.log('Current registrations count:', registrations.length);
        
        res.json({
            success: true,
            message: 'Test endpoint working',
            filePath: REGISTRATIONS_FILE,
            fileExists: true,
            fileSize: stats.size,
            registrationsCount: registrations.length,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Test endpoint error:', error);
        res.status(500).json({
            success: false,
            message: 'Test failed',
            error: error.message,
            filePath: REGISTRATIONS_FILE
        });
    }
});

module.exports = router;