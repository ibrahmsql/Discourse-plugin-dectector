#!/usr/bin/env node
// DiscourseMap Plugin Detector - Validation Script

const fs = require('fs');
const path = require('path');

class ManifestValidator {
    constructor() {
        this.errors = [];
        this.warnings = [];
    }
    
    validate() {
        console.log('🔍 Validating extension manifests...');
        
        this.validateChromeManifest();
        this.validateFirefoxManifest();
        this.validateRequiredFiles();
        this.validateIcons();
        
        this.printResults();
        
        if (this.errors.length > 0) {
            process.exit(1);
        }
    }
    
    validateChromeManifest() {
        const manifestPath = path.join(__dirname, '..', 'manifest.json');
        
        if (!fs.existsSync(manifestPath)) {
            this.errors.push('manifest.json not found');
            return;
        }
        
        try {
            const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
            
            // Required fields
            const required = ['manifest_version', 'name', 'version', 'description'];
            for (const field of required) {
                if (!manifest[field]) {
                    this.errors.push(`manifest.json missing required field: ${field}`);
                }
            }
            
            // Manifest version
            if (manifest.manifest_version !== 3) {
                this.warnings.push('Chrome manifest should use manifest_version 3');
            }
            
            // Validate permissions
            if (!manifest.permissions || !Array.isArray(manifest.permissions)) {
                this.warnings.push('manifest.json should have permissions array');
            }
            
            // Validate content scripts
            if (manifest.content_scripts) {
                for (const script of manifest.content_scripts) {
                    if (script.js) {
                        for (const jsFile of script.js) {
                            const filePath = path.join(__dirname, '..', jsFile);
                            if (!fs.existsSync(filePath)) {
                                this.errors.push(`Content script not found: ${jsFile}`);
                            }
                        }
                    }
                }
            }
            
            // Validate web accessible resources
            if (manifest.web_accessible_resources) {
                for (const resource of manifest.web_accessible_resources) {
                    if (resource.resources) {
                        for (const file of resource.resources) {
                            const filePath = path.join(__dirname, '..', file);
                            if (!fs.existsSync(filePath)) {
                                this.errors.push(`Web accessible resource not found: ${file}`);
                            }
                        }
                    }
                }
            }
            
            console.log('✅ Chrome manifest.json validated');
            
        } catch (error) {
            this.errors.push(`Invalid JSON in manifest.json: ${error.message}`);
        }
    }
    
    validateFirefoxManifest() {
        const manifestPath = path.join(__dirname, '..', 'manifest_firefox.json');
        
        if (!fs.existsSync(manifestPath)) {
            this.warnings.push('manifest_firefox.json not found');
            return;
        }
        
        try {
            const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
            
            // Firefox specific validations
            if (manifest.manifest_version !== 2) {
                this.warnings.push('Firefox manifest should use manifest_version 2');
            }
            
            if (!manifest.applications && !manifest.browser_specific_settings) {
                this.warnings.push('Firefox manifest should have browser_specific_settings');
            }
            
            console.log('✅ Firefox manifest_firefox.json validated');
            
        } catch (error) {
            this.errors.push(`Invalid JSON in manifest_firefox.json: ${error.message}`);
        }
    }
    
    validateRequiredFiles() {
        const requiredFiles = [
            'content.js',
            'popup.html',
            'popup.js',
            'popup.css',
            'background.js',
            'background_firefox.js',
            'detector.js'
        ];
        
        for (const file of requiredFiles) {
            const filePath = path.join(__dirname, '..', file);
            if (!fs.existsSync(filePath)) {
                this.errors.push(`Required file not found: ${file}`);
            }
        }
    }
    
    validateIcons() {
        const iconSizes = ['16', '32', '48', '128'];
        const iconDir = path.join(__dirname, '..', 'icons');
        
        if (!fs.existsSync(iconDir)) {
            this.errors.push('Icons directory not found');
            return;
        }
        
        for (const size of iconSizes) {
            const iconPath = path.join(iconDir, `icon${size}.svg`);
            if (!fs.existsSync(iconPath)) {
                this.warnings.push(`Icon not found: icons/icon${size}.svg`);
            }
        }
    }
    
    printResults() {
        console.log('\n📊 Validation Results:');
        
        if (this.errors.length === 0 && this.warnings.length === 0) {
            console.log('🎉 All validations passed!');
            return;
        }
        
        if (this.errors.length > 0) {
            console.log('\n❌ Errors:');
            this.errors.forEach(error => console.log(`  - ${error}`));
        }
        
        if (this.warnings.length > 0) {
            console.log('\n⚠️  Warnings:');
            this.warnings.forEach(warning => console.log(`  - ${warning}`));
        }
        
        console.log(`\n📈 Summary: ${this.errors.length} errors, ${this.warnings.length} warnings`);
    }
}

if (require.main === module) {
    const validator = new ManifestValidator();
    validator.validate();
}

module.exports = ManifestValidator;