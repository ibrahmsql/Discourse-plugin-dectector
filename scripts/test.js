#!/usr/bin/env node
// DiscourseMap Plugin Detector - Test Script

const fs = require('fs');
const path = require('path');

class ExtensionTester {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }
    
    async runTests() {
        console.log('🧪 Running extension tests...');
        
        await this.testManifestStructure();
        await this.testContentScript();
        await this.testPopupFiles();
        await this.testBackgroundScript();
        await this.testDetectorScript();
        await this.testPluginSignatures();
        
        this.printResults();
        
        if (this.failed > 0) {
            process.exit(1);
        }
    }
    
    test(name, testFn) {
        try {
            const result = testFn();
            if (result) {
                console.log(`✅ ${name}`);
                this.passed++;
            } else {
                console.log(`❌ ${name}`);
                this.failed++;
            }
        } catch (error) {
            console.log(`❌ ${name}: ${error.message}`);
            this.failed++;
        }
    }
    
    async testManifestStructure() {
        this.test('Manifest structure', () => {
            const manifestPath = path.join(__dirname, '..', 'manifest.json');
            const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
            
            return manifest.manifest_version === 3 &&
                   manifest.name &&
                   manifest.version &&
                   manifest.description &&
                   Array.isArray(manifest.permissions);
        });
    }
    
    async testContentScript() {
        this.test('Content script exists and has basic structure', () => {
            const contentPath = path.join(__dirname, '..', 'content.js');
            const content = fs.readFileSync(contentPath, 'utf8');
            
            return content.includes('DiscourseDetector') &&
                   content.includes('pluginSignatures') &&
                   content.includes('chrome.runtime.sendMessage');
        });
    }
    
    async testPopupFiles() {
        this.test('Popup HTML structure', () => {
            const popupPath = path.join(__dirname, '..', 'popup.html');
            const content = fs.readFileSync(popupPath, 'utf8');
            
            return content.includes('<html') &&
                   content.includes('popup.js') &&
                   content.includes('popup.css');
        });
        
        this.test('Popup JavaScript functionality', () => {
            const popupJsPath = path.join(__dirname, '..', 'popup.js');
            const content = fs.readFileSync(popupJsPath, 'utf8');
            
            return content.includes('PopupController') &&
                   content.includes('requestDetection') &&
                   content.includes('chrome.tabs.query');
        });
        
        this.test('Popup CSS exists', () => {
            const popupCssPath = path.join(__dirname, '..', 'popup.css');
            return fs.existsSync(popupCssPath);
        });
    }
    
    async testBackgroundScript() {
        this.test('Background script structure', () => {
            const backgroundPath = path.join(__dirname, '..', 'background.js');
            const content = fs.readFileSync(backgroundPath, 'utf8');
            
            return content.includes('BackgroundService') &&
                   content.includes('chrome.runtime.onInstalled') &&
                   content.includes('chrome.tabs.onUpdated');
        });
        
        this.test('Firefox background script exists', () => {
            const firefoxBgPath = path.join(__dirname, '..', 'background_firefox.js');
            return fs.existsSync(firefoxBgPath);
        });
    }
    
    async testDetectorScript() {
        this.test('Detector script structure', () => {
            const detectorPath = path.join(__dirname, '..', 'detector.js');
            const content = fs.readFileSync(detectorPath, 'utf8');
            
            return content.includes('DiscourseDetector') &&
                   content.includes('detectDiscourse') &&
                   content.includes('detectPlugins') &&
                   content.includes('postMessage');
        });
    }
    
    async testPluginSignatures() {
        this.test('Plugin signatures are comprehensive', () => {
            const contentPath = path.join(__dirname, '..', 'content.js');
            const content = fs.readFileSync(contentPath, 'utf8');
            
            // Check for common plugins
            const commonPlugins = [
                'discourse-solved',
                'discourse-chat',
                'discourse-poll',
                'discourse-calendar'
            ];
            
            return commonPlugins.every(plugin => content.includes(plugin));
        });
        
        this.test('Plugin categories are defined', () => {
            const contentPath = path.join(__dirname, '..', 'content.js');
            const content = fs.readFileSync(contentPath, 'utf8');
            
            const categories = [
                'authentication',
                'moderation',
                'communication',
                'content'
            ];
            
            return categories.some(category => content.includes(category));
        });
    }
    
    printResults() {
        console.log('\n📊 Test Results:');
        console.log(`✅ Passed: ${this.passed}`);
        console.log(`❌ Failed: ${this.failed}`);
        console.log(`📈 Total: ${this.passed + this.failed}`);
        
        if (this.failed === 0) {
            console.log('\n🎉 All tests passed!');
        } else {
            console.log(`\n💥 ${this.failed} test(s) failed`);
        }
    }
}

if (require.main === module) {
    const tester = new ExtensionTester();
    tester.runTests().catch(console.error);
}

module.exports = ExtensionTester;