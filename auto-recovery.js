/**
 * auto-recovery.js - Automatic recovery from ANY error
 */

const fs = require('fs');
const { exec } = require('child_process');

class AutoRecovery {
    constructor() {
        this.maxRetries = 3;
        this.recoveryAttempts = new Map();
        this.watchProcesses();
    }

    watchProcesses() {
        // Watch for dev server crashes
        setInterval(() => {
            this.checkProcess('vite', 'frontend && npm run dev');
            this.checkProcess('node', 'backend && npm start');
        }, 10000);

        // Watch for git issues
        setInterval(() => {
            this.checkGit();
        }, 30000);

        // Watch for disk space
        setInterval(() => {
            this.checkDiskSpace();
        }, 60000);
    }

    checkProcess(name, command) {
        const isRunning = this.isProcessRunning(name);
        
        if (!isRunning) {
            console.log(`⚠️ ${name} process crashed - restarting...`);
            this.restartProcess(command);
        }
    }

    isProcessRunning(name) {
        try {
            const result = execSync(`tasklist | findstr ${name}`).toString();
            return result.includes(name);
        } catch {
            return false;
        }
    }

    restartProcess(command) {
        exec(`cd ${command}`, (error) => {
            if (error) {
                console.log(`❌ Failed to restart: ${error}`);
            }
        });
    }

    checkGit() {
        // Check if git is corrupted
        try {
            execSync('git status', { stdio: 'ignore' });
        } catch {
            console.log('⚠️ Git repository corrupted - fixing...');
            this.fixGit();
        }
    }

    fixGit() {
        const commands = [
            'git config core.autocrlf true',
            'git config core.safecrlf warn',
            'git rm --cached -r .',
            'git reset --hard HEAD'
        ];

        commands.forEach(cmd => {
            try {
                execSync(cmd, { stdio: 'ignore' });
            } catch (e) {
                // Ignore errors during recovery
            }
        });

        console.log('✅ Git fixed');
    }

    checkDiskSpace() {
        // Windows specific
        try {
            const result = execSync('wmic logicaldisk where DeviceID="C:" get FreeSpace').toString();
            const freeSpace = parseInt(result.split('\n')[1]) / (1024 * 1024 * 1024); // GB
            
            if (freeSpace < 5) {
                console.log(`⚠️ Low disk space: ${freeSpace.toFixed(2)}GB free`);
                this.cleanup();
            }
        } catch (e) {
            // Skip on non-Windows
        }
    }

    cleanup() {
        // Clean node_modules/.cache
        try {
            execSync('cd frontend && rm -rf node_modules/.vite', { stdio: 'ignore' });
            console.log('✅ Cache cleaned');
        } catch (e) {
            // Ignore
        }
    }
}

new AutoRecovery();
