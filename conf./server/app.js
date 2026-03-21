const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../')));

// Import routes (JSON-based only)
const registrationRoutes = require('./routes/registration');

// API Routes - JSON-based system only
app.use('/api/registration', registrationRoutes);

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'CAITED 2026 Conference API is running',
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Erreur serveur interne',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint non trouvé'
    });
});

// Start server with error handling
const server = app.listen(PORT, () => {
    console.log(`🚀 CAITED 2026 Conference Server running on port ${PORT}`);
    console.log(`📱 Frontend: http://localhost:${PORT}`);
    console.log(`🔗 API: http://localhost:${PORT}/api`);
    console.log(`📊 Health: http://localhost:${PORT}/health`);
});

// Handle server errors
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use!`);
        console.log(`💡 Try one of these solutions:`);
        console.log(`   1. Kill the process: lsof -ti:${PORT} | xargs kill`);
        console.log(`   2. Use a different port: PORT=3001 npm start`);
        console.log(`   3. Check what's using the port: lsof -i :${PORT}`);
        process.exit(1);
    } else {
        console.error('❌ Server error:', error);
        process.exit(1);
    }
});

module.exports = app;