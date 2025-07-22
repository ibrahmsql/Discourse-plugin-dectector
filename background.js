// DiscourseMap Plugin Detector - Background Script

class BackgroundService {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupContextMenus();
    }
    
    setupEventListeners() {
        // Extension installation
        chrome.runtime.onInstalled.addListener((details) => {
            if (details.reason === 'install') {
                this.onInstall();
            } else if (details.reason === 'update') {
                this.onUpdate(details.previousVersion);
            }
        });
        
        // Tab updates
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            if (changeInfo.status === 'complete' && tab.url) {
                this.onTabComplete(tabId, tab);
            }
        });
        
        // Message handling
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            this.handleMessage(request, sender, sendResponse);
            return true; // Keep message channel open for async responses
        });
        
        // Action button click
        chrome.action.onClicked.addListener((tab) => {
            this.onActionClick(tab);
        });
    }
    
    setupContextMenus() {
        chrome.contextMenus.create({
            id: 'scan-discourse',
            title: 'Scan for Discourse Plugins',
            contexts: ['page'],
            documentUrlPatterns: ['http://*/*', 'https://*/*']
        });
        
        chrome.contextMenus.create({
            id: 'open-discoursemap',
            title: 'Open DiscourseMap Tool',
            contexts: ['page']
        });
        
        chrome.contextMenus.onClicked.addListener((info, tab) => {
            this.handleContextMenu(info, tab);
        });
    }
    
    onInstall() {
        console.log('DiscourseMap Plugin Detector installed');
        
        // Set default settings
        chrome.storage.sync.set({
            autoScan: true,
            showNotifications: true,
            scanDelay: 2000,
            exportFormat: 'json'
        });
        
        // Show welcome page
        chrome.tabs.create({
            url: chrome.runtime.getURL('welcome.html')
        });
    }
    
    onUpdate(previousVersion) {
        console.log(`DiscourseMap updated from ${previousVersion} to ${chrome.runtime.getManifest().version}`);
        
        // Handle version-specific updates
        if (this.compareVersions(previousVersion, '1.0.0') < 0) {
            // Migration logic for versions before 1.0.0
            this.migrateSettings();
        }
    }
    
    async onTabComplete(tabId, tab) {
        try {
            // Get settings
            const settings = await chrome.storage.sync.get(['autoScan', 'scanDelay']);
            
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
            await chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['content.js']
            });
            
            // Request scan
            chrome.tabs.sendMessage(tabId, { action: 'runDetection' }, (response) => {
                if (!chrome.runtime.lastError && response && response.isDiscourse) {
                    this.handleAutoScanResults(tabId, response);
                }
            });
        } catch (error) {
            // Silently fail for pages where we can't inject scripts
            console.log('Could not auto-scan tab:', error.message);
        }
    }
    
    async handleAutoScanResults(tabId, results) {
        try {
            const settings = await chrome.storage.sync.get(['showNotifications']);
            
            if (settings.showNotifications && results.summary.vulnerablePlugins > 0) {
                // Show notification for vulnerable plugins
                chrome.notifications.create({
                    type: 'basic',
                    iconUrl: 'icons/icon48.png',
                    title: 'DiscourseMap: Vulnerabilities Found',
                    message: `Found ${results.summary.vulnerablePlugins} vulnerable plugins on this Discourse forum.`
                });
            }
            
            // Update badge
            this.updateBadge(tabId, results);
            
            // Store results
            await chrome.storage.local.set({
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
            chrome.action.setBadgeText({ text: '', tabId: tabId });
            return;
        }
        
        const vulnerableCount = results.summary.vulnerablePlugins;
        const highRiskCount = results.summary.highRiskPlugins;
        
        if (vulnerableCount > 0) {
            chrome.action.setBadgeText({ 
                text: vulnerableCount.toString(), 
                tabId: tabId 
            });
            chrome.action.setBadgeBackgroundColor({ 
                color: highRiskCount > 0 ? '#dc3545' : '#ffc107', 
                tabId: tabId 
            });
        } else {
            chrome.action.setBadgeText({ text: '✓', tabId: tabId });
            chrome.action.setBadgeBackgroundColor({ color: '#28a745', tabId: tabId });
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
            const settings = await chrome.storage.sync.get({
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
            await chrome.storage.sync.set(settings);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    async getStoredResults(tabId) {
        try {
            const data = await chrome.storage.local.get([`scan_${tabId}`]);
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
        console.log('Action button clicked for tab:', tab.id);
    }
    
    handleContextMenu(info, tab) {
        switch (info.menuItemId) {
            case 'scan-discourse':
                this.scanCurrentTab(tab.id);
                break;
                
            case 'open-discoursemap':
                chrome.tabs.create({
                    url: 'https://github.com/ibrahmsql/discoursemap'
                });
                break;
        }
    }
    
    async scanCurrentTab(tabId) {
        try {
            await chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['content.js']
            });
            
            chrome.tabs.sendMessage(tabId, { action: 'runDetection' });
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
            const data = await chrome.storage.local.get();
            const cutoff = Date.now() - 86400000; // 24 hours
            
            const keysToRemove = [];
            for (const [key, value] of Object.entries(data)) {
                if (key.startsWith('scan_') && value.timestamp < cutoff) {
                    keysToRemove.push(key);
                }
            }
            
            if (keysToRemove.length > 0) {
                await chrome.storage.local.remove(keysToRemove);
                console.log(`Cleaned up ${keysToRemove.length} old scan results`);
            }
        } catch (error) {
            console.error('Error cleaning up storage:', error);
        }
    }
}

// Initialize background service
const backgroundService = new BackgroundService();

// Cleanup storage periodically
setInterval(() => {
    backgroundService.cleanupStorage();
}, 3600000); // Every hour

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BackgroundService;
}