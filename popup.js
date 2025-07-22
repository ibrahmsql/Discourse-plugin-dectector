// DiscourseMap Plugin Detector - Popup Script

class PopupController {
    constructor() {
        this.currentResults = null;
        this.currentTab = 'plugins';
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.requestDetection();
    }
    
    bindEvents() {
        // Scan button
        document.getElementById('scan-btn').addEventListener('click', () => {
            this.runDetection();
        });
        
        // Export button
        document.getElementById('export-btn').addEventListener('click', () => {
            this.exportResults();
        });
        
        // Tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });
        
        // Footer links
        document.getElementById('github-link').addEventListener('click', () => {
            chrome.tabs.create({ url: 'https://github.com/ibrahmsql/discoursemap' });
        });
        
        document.getElementById('docs-link').addEventListener('click', () => {
            chrome.tabs.create({ url: 'https://github.com/ibrahmsql/discoursemap/wiki' });
        });
        
        document.getElementById('report-link').addEventListener('click', () => {
            chrome.tabs.create({ url: 'https://github.com/ibrahmsql/discoursemap/issues' });
        });
    }
    
    async requestDetection() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            // Send message to content script
            chrome.tabs.sendMessage(tab.id, { action: 'runDetection' }, (response) => {
                if (chrome.runtime.lastError) {
                    console.log('Content script not ready, injecting...');
                    this.injectContentScript(tab.id);
                } else {
                    this.handleResults(response);
                }
            });
        } catch (error) {
            console.error('Error requesting detection:', error);
            this.showError('Failed to communicate with page');
        }
    }
    
    async injectContentScript(tabId) {
        try {
            await chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['content.js']
            });
            
            // Wait a bit then try again
            setTimeout(() => {
                chrome.tabs.sendMessage(tabId, { action: 'runDetection' }, (response) => {
                    if (!chrome.runtime.lastError) {
                        this.handleResults(response);
                    } else {
                        this.showError('Unable to analyze this page');
                    }
                });
            }, 1000);
        } catch (error) {
            console.error('Error injecting content script:', error);
            this.showError('Unable to analyze this page');
        }
    }
    
    runDetection() {
        this.showLoading();
        this.requestDetection();
    }
    
    handleResults(results) {
        this.hideLoading();
        this.currentResults = results;
        
        if (!results || !results.isDiscourse) {
            this.showNoResults();
            this.updateStatus('Not a Discourse forum', 'not-discourse');
            return;
        }
        
        this.updateStatus('Discourse forum detected', 'discourse');
        this.showResults(results);
        this.updateSummary(results.summary);
        this.populatePlugins(results.detectedPlugins);
        this.populateTechnology(results.technologyStack);
        
        // Enable export button
        document.getElementById('export-btn').disabled = false;
    }
    
    updateStatus(text, className) {
        const statusText = document.querySelector('.status-text');
        statusText.textContent = text;
        statusText.className = `status-text ${className}`;
    }
    
    showLoading() {
        document.getElementById('loading').style.display = 'block';
        document.getElementById('results-section').style.display = 'none';
        document.getElementById('no-results').style.display = 'none';
    }
    
    hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }
    
    showResults(results) {
        document.getElementById('results-section').style.display = 'block';
        document.getElementById('no-results').style.display = 'none';
    }
    
    showNoResults() {
        document.getElementById('no-results').style.display = 'block';
        document.getElementById('results-section').style.display = 'none';
    }
    
    showError(message) {
        this.hideLoading();
        this.updateStatus(message, 'not-discourse');
        this.showNoResults();
    }
    
    updateSummary(summary) {
        document.getElementById('total-plugins').textContent = summary.totalPlugins || 0;
        document.getElementById('discourse-version').textContent = summary.discourseVersion || 'Unknown';
        document.getElementById('ruby-version').textContent = summary.rubyVersion || 'Unknown';
        
        // Update technology count if element exists
        const techCountElement = document.getElementById('total-technologies');
        if (techCountElement) {
            techCountElement.textContent = summary.totalTechnologies || 0;
        }
    }
    
    populatePlugins(plugins) {
        const container = document.getElementById('plugins-list');
        container.innerHTML = '';
        
        if (!plugins || plugins.length === 0) {
            container.innerHTML = '<p class="no-items">No plugins detected</p>';
            return;
        }
        
        // Group plugins by category
        const groupedPlugins = {};
        plugins.forEach(plugin => {
            const category = plugin.category || 'other';
            if (!groupedPlugins[category]) {
                groupedPlugins[category] = [];
            }
            groupedPlugins[category].push(plugin);
        });
        
        // Display plugins grouped by category
        Object.entries(groupedPlugins).forEach(([category, categoryPlugins]) => {
            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'category-header';
            categoryHeader.innerHTML = `
                <h4>${category.charAt(0).toUpperCase() + category.slice(1)} (${categoryPlugins.length})</h4>
            `;
            container.appendChild(categoryHeader);
            
            categoryPlugins.forEach(plugin => {
                const item = document.createElement('div');
                item.className = 'plugin-item';
                const confidence = plugin.confidence || 'Medium';
                const confidenceClass = this.getConfidenceClass(confidence);
                
                item.innerHTML = `
                    <div class="plugin-header">
                        <span class="plugin-name">${plugin.name}</span>
                        ${plugin.version ? `<span class="plugin-version">v${plugin.version}</span>` : '<span class="plugin-version">Unknown</span>'}
                    </div>
                    <div class="plugin-details">
                        <span class="plugin-method">Detected via: ${plugin.detection_method}</span>
                        <span class="plugin-confidence ${confidenceClass}">Confidence: ${confidence}</span>
                    </div>
                `;
                
                container.appendChild(item);
            });
        });
    }
    
    getConfidenceClass(confidence) {
        switch(confidence.toLowerCase()) {
            case 'high':
                return 'confidence-high';
            case 'medium':
                return 'confidence-medium';
            case 'low':
                return 'confidence-low';
            default:
                return 'confidence-medium';
        }
    }
    

    
    populateTechnology(technologies) {
        const container = document.getElementById('technology-list');
        container.innerHTML = '';
        
        if (!technologies || technologies.length === 0) {
            container.innerHTML = '<p class="no-items">No technology stack detected</p>';
            return;
        }
        
        // Group technologies by category
        const groupedTech = {};
        technologies.forEach(tech => {
            const category = tech.category || 'other';
            if (!groupedTech[category]) {
                groupedTech[category] = [];
            }
            groupedTech[category].push(tech);
        });
        
        // Display technologies grouped by category
        Object.entries(groupedTech).forEach(([category, categoryTech]) => {
            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'tech-category-header';
            categoryHeader.innerHTML = `
                <h4>${category.charAt(0).toUpperCase() + category.slice(1)}</h4>
            `;
            container.appendChild(categoryHeader);
            
            categoryTech.forEach(tech => {
                const item = document.createElement('div');
                item.className = 'tech-item';
                
                const iconClass = this.getTechIcon(tech.name.toLowerCase());
                
                item.innerHTML = `
                    <div class="tech-header">
                        <span class="tech-icon ${iconClass}"></span>
                        <span class="tech-name">${tech.name}</span>
                        <span class="tech-version">${tech.version || 'Unknown'}</span>
                    </div>
                    ${tech.confidence ? `<div class="tech-confidence">Confidence: ${tech.confidence}</div>` : ''}
                `;
                
                container.appendChild(item);
            });
        });
    }
    
    getTechIcon(techName) {
        const iconMap = {
            'discourse': '💬',
            'ruby': '💎',
            'rails': '🚂',
            'postgresql': '🐘',
            'redis': '🔴',
            'nginx': '🌐',
            'javascript': '📜',
            'jquery': '📚'
        };
        
        for (const [key, icon] of Object.entries(iconMap)) {
            if (techName.includes(key)) {
                return `tech-icon-${key}`;
            }
        }
        return 'tech-icon-default';
    }
    
    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update tab panes
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
        
        this.currentTab = tabName;
    }
    
    exportResults() {
        if (!this.currentResults) {
            return;
        }
        
        const exportData = {
            ...this.currentResults,
            exportedAt: new Date().toISOString(),
            exportedBy: 'DiscourseMap Browser Extension v1.0.0'
        };
        
        // Create and download JSON file
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `discoursemap-scan-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Show success message
        const exportBtn = document.getElementById('export-btn');
        const originalText = exportBtn.innerHTML;
        exportBtn.innerHTML = '<span class="btn-icon">✓</span>Exported';
        exportBtn.disabled = true;
        
        setTimeout(() => {
            exportBtn.innerHTML = originalText;
            exportBtn.disabled = false;
        }, 2000);
    }
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'detectionResults') {
        // Handle automatic detection results
        if (window.popupController) {
            window.popupController.handleResults(request.results);
        }
    }
});

// Initialize popup when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.popupController = new PopupController();
    });
} else {
    window.popupController = new PopupController();
}

// Add some utility styles
const style = document.createElement('style');
style.textContent = `
    .no-items {
        text-align: center;
        color: #6c757d;
        font-style: italic;
        padding: 20px;
    }
    
    .plugin-item:hover {
        transform: translateY(-1px);
    }
    

    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);