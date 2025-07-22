// DiscourseMap Plugin Detector - Firefox Background Script
// Compatible with Manifest V2

class FirefoxBackgroundService {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupContextMenus();
    }
    
    setupEventListeners() {
        // Extension installation
        browser.runtime.onInstalled.addListener((details) => {
            if (details.reason === 'install') {
                this.onInstall();
            } else if (details.reason === 'update') {
                this.onUpdate(details.previousVersion);
            }
        });
        
        // Tab updates
        browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            if (changeInfo.status === 'complete' && tab.url) {
                this.onTabComplete(tabId, tab);
            }
        });
        
        // Message handling
        browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
            this.handleMessage(request, sender, sendResponse);
            return true; // Keep message channel open for async responses
        });
        
        // Browser action click
        browser.browserAction.onClicked.addListener((tab) => {
            this.onActionClick(tab);
        });
    }
    
    setupContextMenus() {
        browser.contextMenus.create({
            id: 'scan-discourse',
            title: 'Scan for Discourse Plugins',
            contexts: ['page'],
            documentUrlPatterns: ['http://*/*', 'https://*/*']
        });
        
        browser.contextMenus.create({
            id: 'open-discoursemap',
            title: 'Open DiscourseMap Tool',
            contexts: ['page']
        });
        
        browser.contextMenus.onClicked.addListener((info, tab) => {
            this.handleContextMenu(info, tab);
        });
    }
    
    onInstall() {
        console.log('DiscourseMap Plugin Detector installed on Firefox');
        
        // Set default settings
        browser.storage.sync.set({
            autoScan: true,
            showNotifications: true,
            scanDelay: 2000,
            exportFormat: 'json'
        });
        
        // Show welcome page
        browser.tabs.create({
            url: browser.runtime.getURL('welcome.html')
        });
    }
    
    onUpdate(previousVersion) {
        console.log(`DiscourseMap updated from ${previousVersion} to ${browser.runtime.getManifest().version}`);
        
        // Handle version-specific updates
        if (this.compareVersions(previousVersion, '1.0.0') < 0) {
            this.migrateSettings();
        }
    }
    
    async onTabComplete(tabId, tab) {
        try {
            // Get settings
            const settings = await browser.storage.sync.get(['autoScan', 'scanDelay']);
            
            if (!settings.autoScan) {
                return;
            }
            
            // Check if URL looks like a Discourse forum
            if (this.isLikelyDiscourse(tab.url)) {
                // Wait for page to settle
                setTimeout(() => {
                    this.autoScanTab(tabId);
                }, settings.scanDelay || 2000);
            }
        } catch (error) {
            console.error('Error in onTabComplete:', error);
        }
    }
    
    async autoScanTab(tabId) {
        try {
            // Inject content script if not already present
            await browser.tabs.executeScript(tabId, {
                file: 'content.js'
            });
            
            // Request scan
            browser.tabs.sendMessage(tabId, { action: 'runDetection' }).then((response) => {
                if (response && response.isDiscourse) {
                    this.handleAutoScanResults(tabId, response);
                }
            }).catch(() => {
                // Silently handle errors
            });
        } catch (error) {
            // Silently fail for pages where we can't inject scripts
            console.log('Could not auto-scan tab:', error.message);
        }
    }
    
    async handleAutoScanResults(tabId, results) {
        try {
            const settings = await browser.storage.sync.get(['showNotifications']);
            
            if (settings.showNotifications && results.summary.vulnerablePlugins > 0) {
                // Show notification for vulnerable plugins
                browser.notifications.create({
                    type: 'basic',
                    iconUrl: 'icons/icon48.png',
                    title: 'DiscourseMap: Vulnerabilities Found',
                    message: `Found ${results.summary.vulnerablePlugins} vulnerable plugins on this Discourse forum.`
                });
            }
            
            // Update badge
            this.updateBadge(tabId, results);
            
            // Store results
            await browser.storage.local.set({
                [`scan_${tabId}`]: {
                    results: results,
                    timestamp: Date.now()
                }
            });
        } catch (error) {
            console.error('Error handling auto-scan results:', error);
        }
    }
    
    updateBadge(tabId, results) {
        if (!results.isDiscourse) {
            browser.browserAction.setBadgeText({ text: '', tabId: tabId });
            return;
        }
        
        const vulnerableCount = results.summary.vulnerablePlugins;
        const highRiskCount = results.summary.highRiskPlugins;
        
        if (vulnerableCount > 0) {
            browser.browserAction.setBadgeText({ 
                text: vulnerableCount.toString(), 
                tabId: tabId 
            });
            browser.browserAction.setBadgeBackgroundColor({ 
                color: highRiskCount > 0 ? '#dc3545' : '#ffc107', 
                tabId: tabId 
            });
        } else {
            browser.browserAction.setBadgeText({ text: '✓', tabId: tabId });
            browser.browserAction.setBadgeBackgroundColor({ color: '#28a745', tabId: tabId });
        }
    }
    
    handleMessage(request, sender, sendResponse) {
        switch (request.action) {
            case 'getSettings':
                this.getSettings().then(sendResponse);
                break;
                
            case 'saveSettings':
                this.saveSettings(request.settings).then(sendResponse);
                break;
                
            case 'exportResults':
                this.exportResults(request.results, request.format).then(sendResponse);
                break;
                
            case 'getStoredResults':
                this.getStoredResults(sender.tab.id).then(sendResponse);
                break;
                
            default:
                sendResponse({ error: 'Unknown action' });
        }
    }
    
    async getSettings() {
        try {
            const settings = await browser.storage.sync.get({
                autoScan: true,
                showNotifications: true,
                scanDelay: 2000,
                exportFormat: 'json'
            });
            return { success: true, settings };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    async saveSettings(settings) {
        try {
            await browser.storage.sync.set(settings);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    async getStoredResults(tabId) {
        try {
            const data = await browser.storage.local.get([`scan_${tabId}`]);
            const scanData = data[`scan_${tabId}`];
            
            if (scanData && Date.now() - scanData.timestamp < 300000) { // 5 minutes
                return { success: true, results: scanData.results };
            }
            
            return { success: false, error: 'No recent results found' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    onActionClick(tab) {
        // This is handled by the popup, but we can add fallback logic here
        console.log('Browser action clicked for tab:', tab.id);
    }
    
    handleContextMenu(info, tab) {
        switch (info.menuItemId) {
            case 'scan-discourse':
                this.scanCurrentTab(tab.id);
                break;
                
            case 'open-discoursemap':
                browser.tabs.create({
                    url: 'https://github.com/ibrahmsql/discoursemap'
                });
                break;
        }
    }
    
    async scanCurrentTab(tabId) {
        try {
            await browser.tabs.executeScript(tabId, {
                file: 'content.js'
            });
            
            browser.tabs.sendMessage(tabId, { action: 'runDetection' });
        } catch (error) {
            console.error('Error scanning current tab:', error);
        }
    }
    
    isLikelyDiscourse(url) {
        if (!url) return false;
        
        // Skip non-HTTP URLs
        if (!url.startsWith('http')) return false;
        
        // Skip common non-forum sites
        const skipDomains = [
            'google.com', 'youtube.com', 'facebook.com', 'twitter.com',
            'github.com', 'stackoverflow.com', 'reddit.com'
        ];
        
        const hostname = new URL(url).hostname.toLowerCase();
        return !skipDomains.some(domain => hostname.includes(domain));
    }
    
    compareVersions(a, b) {
        const aParts = a.split('.').map(Number);
        const bParts = b.split('.').map(Number);
        
        for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
            const aPart = aParts[i] || 0;
            const bPart = bParts[i] || 0;
            
            if (aPart < bPart) return -1;
            if (aPart > bPart) return 1;
        }
        
        return 0;
    }
    
    async migrateSettings() {
        // Migration logic for future versions
        console.log('Migrating settings...');
    }
    
    // Cleanup old stored results
    async cleanupStorage() {
        try {
            const data = await browser.storage.local.get();
            const cutoff = Date.now() - 86400000; // 24 hours
            
            const keysToRemove = [];
            for (const [key, value] of Object.entries(data)) {
                if (key.startsWith('scan_') && value.timestamp < cutoff) {
                    keysToRemove.push(key);
                }
            }
            
            if (keysToRemove.length > 0) {
                await browser.storage.local.remove(keysToRemove);
                console.log(`Cleaned up ${keysToRemove.length} old scan results`);
            }
        } catch (error) {
            console.error('Error cleaning up storage:', error);
        }
    }
}

// Initialize background service
const firefoxBackgroundService = new FirefoxBackgroundService();

// Cleanup storage periodically
setInterval(() => {
    firefoxBackgroundService.cleanupStorage();
}, 3600000); // Every hour

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FirefoxBackgroundService;
}