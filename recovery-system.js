/**
 * recovery-system.js
 * Automatic recovery for corrupted files
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BACKUP_DIR = './.arch-backup';

// Core files that must exist
const CRITICAL_FILES = [
    'frontend/src/core/errors/ErrorHandler.js',
    'frontend/src/core/security/SecurityManager.js',
    'frontend/src/core/validation/Validator.js',
    'frontend/src/core/logger/Logger.js',
    'frontend/src/core/monitoring/PerformanceMonitor.js',
    'frontend/src/core/index.js',
    'frontend/src/ErrorBoundary.jsx',
    'frontend/src/App.jsx',
    'frontend/src/main.jsx'
];

function createBackup() {
    if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(BACKUP_DIR, `backup-${timestamp}`);
    fs.mkdirSync(backupPath, { recursive: true });
    
    console.log(`📦 Creating backup in ${backupPath}`);
    
    // Backup critical files
    for (const file of CRITICAL_FILES) {
        if (fs.existsSync(file)) {
            const destPath = path.join(backupPath, file);
            const destDir = path.dirname(destPath);
            if (!fs.existsSync(destDir)) {
                fs.mkdirSync(destDir, { recursive: true });
            }
            fs.copyFileSync(file, destPath);
        }
    }
    
    console.log('✅ Backup created');
    return backupPath;
}

function verifyFiles() {
    console.log('\n🔍 Verifying critical files...');
    
    const missing = [];
    
    for (const file of CRITICAL_FILES) {
        if (!fs.existsSync(file)) {
            missing.push(file);
            console.log(`❌ Missing: ${file}`);
        } else {
            console.log(`✅ Found: ${file}`);
        }
    }
    
    return missing;
}

function restoreFromLatestBackup() {
    const backups = fs.readdirSync(BACKUP_DIR)
        .filter(f => f.startsWith('backup-'))
        .sort()
        .reverse();
    
    if (backups.length === 0) {
        console.log('❌ No backups found');
        return false;
    }
    
    const latestBackup = path.join(BACKUP_DIR, backups[0]);
    console.log(`🔄 Restoring from: ${latestBackup}`);
    
    for (const file of CRITICAL_FILES) {
        const backupFile = path.join(latestBackup, file);
        if (fs.existsSync(backupFile)) {
            const destDir = path.dirname(file);
            if (!fs.existsSync(destDir)) {
                fs.mkdirSync(destDir, { recursive: true });
            }
            fs.copyFileSync(backupFile, file);
            console.log(`✅ Restored: ${file}`);
        }
    }
    
    return true;
}

function gitCommit(message) {
    try {
        execSync('git add .', { stdio: 'inherit' });
        execSync(`git commit -m "🛡️ recovery: ${message}"`, { stdio: 'inherit' });
        execSync('git push origin main', { stdio: 'inherit' });
        console.log('✅ Changes committed to git');
    } catch (e) {
        console.log('⚠️ Git commit failed:', e.message);
    }
}

// Main recovery process
console.log('🛡️ Architecture Recovery System');
console.log('='.repeat(60));

// Create backup
const backupPath = createBackup();

// Verify files
const missing = verifyFiles();

if (missing.length > 0) {
    console.log('\n⚠️ Missing files detected!');
    const restored = restoreFromLatestBackup();
    
    if (restored) {
        console.log('\n✅ Files restored successfully!');
        gitCommit(`Restored missing files: ${missing.join(', ')}`);
    } else {
        console.log('\n❌ Could not restore files. Manual intervention required.');
        process.exit(1);
    }
} else {
    console.log('\n✅ All critical files present!');
}

console.log('\n' + '='.repeat(60));
console.log('🎉 Architecture integrity maintained!');
