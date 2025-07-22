#!/usr/bin/env node
// DiscourseMap Plugin Detector - Package Script

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

class ExtensionPackager {
    constructor() {
        this.distDir = path.join(__dirname, '..', 'dist');
        this.rootDir = path.join(__dirname, '..');
    }
    
    async package() {
        console.log('📦 Packaging extension...');
        
        // Create dist directory
        if (!fs.existsSync(this.distDir)) {
            fs.mkdirSync(this.distDir, { recursive: true });
        }
        
        await this.packageChrome();
        await this.packageFirefox();
        
        console.log('\n✅ Packaging complete!');
        console.log(`📁 Output directory: ${this.distDir}`);
    }
    
    async packageChrome() {
        console.log('\n🔵 Packaging Chrome extension...');
        
        const output = fs.createWriteStream(path.join(this.distDir, 'discourse-plugin-detector-chrome.zip'));
        const archive = archiver('zip', { zlib: { level: 9 } });
        
        return new Promise((resolve, reject) => {
            output.on('close', () => {
                console.log(`✅ Chrome package created: ${archive.pointer()} bytes`);
                resolve();
            });
            
            archive.on('error', reject);
            archive.pipe(output);
            
            // Add Chrome-specific files
            const chromeFiles = [
                'manifest.json',
                'content.js',
                'popup.html',
                'popup.js',
                'popup.css',
                'background.js',
                'detector.js'
            ];
            
            chromeFiles.forEach(file => {
                const filePath = path.join(this.rootDir, file);
                if (fs.existsSync(filePath)) {
                    archive.file(filePath, { name: file });
                    console.log(`  ✓ Added ${file}`);
                } else {
                    console.log(`  ⚠️  Missing ${file}`);
                }
            });
            
            // Add icons directory
            const iconsDir = path.join(this.rootDir, 'icons');
            if (fs.existsSync(iconsDir)) {
                archive.directory(iconsDir, 'icons');
                console.log('  ✓ Added icons/');
            }
            
            archive.finalize();
        });
    }
    
    async packageFirefox() {
        console.log('\n🦊 Packaging Firefox extension...');
        
        const output = fs.createWriteStream(path.join(this.distDir, 'discourse-plugin-detector-firefox.zip'));
        const archive = archiver('zip', { zlib: { level: 9 } });
        
        return new Promise((resolve, reject) => {
            output.on('close', () => {
                console.log(`✅ Firefox package created: ${archive.pointer()} bytes`);
                resolve();
            });
            
            archive.on('error', reject);
            archive.pipe(output);
            
            // Add Firefox-specific files
            const firefoxFiles = [
                { src: 'manifest_firefox.json', dest: 'manifest.json' },
                'content.js',
                'popup.html',
                'popup.js',
                'popup.css',
                'background_firefox.js',
                'detector.js'
            ];
            
            firefoxFiles.forEach(file => {
                const srcFile = typeof file === 'string' ? file : file.src;
                const destFile = typeof file === 'string' ? file : file.dest;
                const filePath = path.join(this.rootDir, srcFile);
                
                if (fs.existsSync(filePath)) {
                    archive.file(filePath, { name: destFile });
                    console.log(`  ✓ Added ${srcFile} as ${destFile}`);
                } else {
                    console.log(`  ⚠️  Missing ${srcFile}`);
                }
            });
            
            // Add icons directory
            const iconsDir = path.join(this.rootDir, 'icons');
            if (fs.existsSync(iconsDir)) {
                archive.directory(iconsDir, 'icons');
                console.log('  ✓ Added icons/');
            }
            
            archive.finalize();
        });
    }
    
    async createSourcePackage() {
        console.log('\n📄 Creating source package...');
        
        const output = fs.createWriteStream(path.join(this.distDir, 'discourse-plugin-detector-source.zip'));
        const archive = archiver('zip', { zlib: { level: 9 } });
        
        return new Promise((resolve, reject) => {
            output.on('close', () => {
                console.log(`✅ Source package created: ${archive.pointer()} bytes`);
                resolve();
            });
            
            archive.on('error', reject);
            archive.pipe(output);
            
            // Add all source files except node_modules and dist
            archive.glob('**/*', {
                cwd: this.rootDir,
                ignore: [
                    'node_modules/**',
                    'dist/**',
                    '.git/**',
                    '*.log',
                    '.DS_Store'
                ]
            });
            
            archive.finalize();
        });
    }
}

if (require.main === module) {
    const packager = new ExtensionPackager();
    packager.package().catch(console.error);
}

module.exports = ExtensionPackager;