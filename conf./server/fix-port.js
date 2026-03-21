#!/usr/bin/env node

/**
 * Port Conflict Resolution Helper for CAITED 2026 Conference Server
 * This script helps identify and resolve port conflicts
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const TARGET_PORT = process.argv[2] || '3000';

console.log(`🔍 Checking port ${TARGET_PORT} usage...\n`);

try {
    // Check what's using the port
    console.log('📋 Process(es) using the port:');
    const processes = execSync(`lsof -ti :${TARGET_PORT}`, { encoding: 'utf8' })
        .toString()
        .trim()
        .split('\n')
        .filter(pid => pid);

    if (processes.length === 0) {
        console.log(`✅ Port ${TARGET_PORT} is available!`);
    } else {
        processes.forEach((pid, index) => {
            try {
                const processInfo = execSync(`ps -p ${pid} -o pid,ppid,cmd --no-headers`, { encoding: 'utf8' });
                console.log(`   ${index + 1}. PID: ${pid} - ${processInfo.trim()}`);
            } catch (error) {
                console.log(`   ${index + 1}. PID: ${pid} - Process not found`);
            }
        });

        console.log('\n🛠️  Solutions:');
        console.log(`   1. Kill the process(es): lsof -ti:${TARGET_PORT} | xargs kill`);
        console.log(`   2. Use a different port: PORT=3001 npm start`);
        console.log(`   3. Kill specific process: kill -9 ${processes[0]}`);
    }
} catch (error) {
    if (error.status === 1) {
        console.log(`✅ Port ${TARGET_PORT} is available!`);
    } else {
        console.log(`❌ Error checking port: ${error.message}`);
    }
}

console.log('\n🚀 Quick start commands:');
console.log(`   npm start                    # Start on default port (${TARGET_PORT})`);
console.log(`   PORT=3001 npm start          # Start on port 3001`);
console.log(`   PORT=8080 npm start          # Start on port 8080`);
console.log(`   npm run dev                   # Start with auto-restart`);

console.log('\n💡 Tip: Add "PORT=3001" to your .env file to permanently use port 3001');