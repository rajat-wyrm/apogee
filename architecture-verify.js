/**
 * architecture-verify.js
 * Verifies the entire architecture is intact
 */

const fs = require('fs');
const path = require('path');

const REQUIRED_STRUCTURE = {
    'frontend/src': {
        'core': {
            'errors': ['ErrorHandler.js'],
            'security': ['SecurityManager.js'],
            'validation': ['Validator.js'],
            'logger': ['Logger.js'],
            'monitoring': ['PerformanceMonitor.js'],
            'index.js': null
        },
        'config': {
            'environments': [],
            'features': [],
            'index.js': null
        },
        'services': {
            'api': [],
            'auth': [],
            'websocket': [],
            'storage': [],
            'analytics': []
        },
        'guards': [],
        'middleware': [],
        'decorators': [],
        'adapters': [],
        'providers': [],
        'workers': [],
        'tests': {
            'unit': [],
            'integration': [],
            'e2e': [],
            'mocks': []
        },
        'pages': ['Dashboard.jsx', 'Login.jsx'],
        'components': {
            'ui': [],
            'layout': [],
            'auth': [],
            'dashboard': []
        },
        'context': ['ThemeContext.jsx'],
        'hooks': [],
        'utils': ['security.js', 'analytics.js', 'performance.js', 'testing.js', 'index.js'],
        'constants': [],
        'types': [],
        'ErrorBoundary.jsx': null,
        'App.jsx': null,
        'main.jsx': null
    },
    'backend': {
        'src': {
            'controllers': [],
            'models': [],
            'routes': [],
            'middleware': [],
            'services': [],
            'utils': [],
            'config': []
        },
        'server.js': null
    }
};

function verifyStructure(basePath, structure, currentPath = '') {
    let errors = [];
    let warnings = [];

    for (const [name, content] of Object.entries(structure)) {
        const fullPath = path.join(basePath, currentPath, name);
        
        if (content === null) {
            // This is a file
            if (!fs.existsSync(fullPath)) {
                errors.push(`❌ Missing file: ${path.join(currentPath, name)}`);
            } else {
                console.log(`✅ Found file: ${path.join(currentPath, name)}`);
            }
        } else if (Array.isArray(content)) {
            // This is a folder with specific files
            const folderPath = path.join(basePath, currentPath, name);
            if (!fs.existsSync(folderPath)) {
                errors.push(`❌ Missing folder: ${path.join(currentPath, name)}`);
                continue;
            }
            
            // Check for required files in this folder
            for (const file of content) {
                const filePath = path.join(folderPath, file);
                if (!fs.existsSync(filePath)) {
                    warnings.push(`⚠️ Missing optional file: ${path.join(currentPath, name, file)}`);
                }
            }
        } else {
            // This is a folder with subfolders
            const folderPath = path.join(basePath, currentPath, name);
            if (!fs.existsSync(folderPath)) {
                errors.push(`❌ Missing folder: ${path.join(currentPath, name)}`);
                continue;
            }
            
            // Recursively verify subfolders
            const subErrors = verifyStructure(basePath, content, path.join(currentPath, name));
            errors = errors.concat(subErrors);
        }
    }

    return { errors, warnings };
}

console.log('🔍 Verifying project architecture...\n');

const { errors, warnings } = verifyStructure('.', REQUIRED_STRUCTURE);

console.log('\n' + '='.repeat(60));
if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ Architecture is 100% intact!');
} else {
    if (errors.length > 0) {
        console.log('❌ Critical errors found:');
        errors.forEach(e => console.log(`   ${e}`));
    }
    if (warnings.length > 0) {
        console.log('⚠️ Warnings found:');
        warnings.forEach(w => console.log(`   ${w}`));
    }
}
console.log('='.repeat(60));
