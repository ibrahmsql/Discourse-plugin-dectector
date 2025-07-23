// DiscourseMap Plugin Detector - Detection Engine
// This script provides detection capabilities for Discourse forums

class DiscourseDetector {
    constructor() {
        this.detectionResults = {
            discourse: {
                version: "Unknown",
                confidence: "Low",
                method: "Unknown"
            },
            ruby: {
                version: "Unknown",
                confidence: "Low",
                method: "Unknown"
            },
            technologies: []
        };
    }

    // Main detection runner
    runDetection() {
        this.detectDiscourse();
        this.detectRuby();
        this.detectTechnologies();
        return this.detectionResults;
    }

    // Discourse detection
    detectDiscourse() {
        // Check meta tags first (most reliable)
        const metaGenerator = document.querySelector('meta[name="generator"]');
        if (metaGenerator && metaGenerator.content.includes('Discourse')) {
            const versionMatch = metaGenerator.content.match(/Discourse\s+([\d\.]+)/);
            if (versionMatch) {
                this.detectionResults.discourse = {
                    version: versionMatch[1],
                    confidence: "High",
                    method: "Meta Generator Tag"
                };
                return;
            }
        }

        // Check for Discourse JavaScript object
        if (window.Discourse && window.Discourse.VERSION) {
            this.detectionResults.discourse = {
                version: window.Discourse.VERSION,
                confidence: "High",
                method: "JavaScript Object"
            };
            return;
        }

        // Check for Discourse-specific DOM elements
        const discourseApp = document.querySelector('.discourse-application');
        const emberApp = document.querySelector('.ember-application');
        
        if (discourseApp || emberApp) {
            // Try to extract version from script tags
            const scripts = document.querySelectorAll('script[src*="discourse"]');
            for (const script of scripts) {
                const versionMatch = script.src.match(/discourse[\-\.]([\d\.]+)/);
                if (versionMatch) {
                    this.detectionResults.discourse = {
                        version: versionMatch[1],
                        confidence: "Medium",
                        method: "Script Source Analysis"
                    };
                    return;
                }
            }

            this.detectionResults.discourse = {
                version: "Detected",
                confidence: "Medium",
                method: "DOM Structure"
            };
        }
    }

    // Ruby version detection
    detectRuby() {
        // Check meta tags
        const rubyMeta = document.querySelector('meta[name="ruby-version"]');
        if (rubyMeta) {
            this.detectionResults.ruby = {
                version: rubyMeta.content,
                confidence: "High",
                method: "Meta Tag"
            };
            return;
        }

        // Check HTTP headers (if available through other means)
        const serverHeader = this.getServerHeader();
        if (serverHeader) {
            const rubyMatch = serverHeader.match(/Ruby\/(\d+\.\d+\.\d+)/);
            if (rubyMatch) {
                this.detectionResults.ruby = {
                    version: rubyMatch[1],
                    confidence: "High",
                    method: "Server Header"
                };
                return;
            }
        }

        // Check for Ruby-specific patterns in scripts
        const scripts = document.querySelectorAll('script');
        for (const script of scripts) {
            if (script.textContent && script.textContent.includes('ruby_version')) {
                const versionMatch = script.textContent.match(/ruby_version["']?:\s*["']([\d\.]+)["']/);
                if (versionMatch) {
                    this.detectionResults.ruby = {
                        version: versionMatch[1],
                        confidence: "Medium",
                        method: "JavaScript Configuration"
                    };
                    return;
                }
            }
        }
    }

    // Detect additional technologies
    detectTechnologies() {
        const technologies = [];

        // Rails detection
        const railsMeta = document.querySelector('meta[name="rails-version"]');
        if (railsMeta) {
            technologies.push({
                name: "Ruby on Rails",
                version: railsMeta.content,
                category: "web-framework",
                confidence: "High",
                method: "Meta Tag"
            });
        }

        // Ember.js detection
        if (window.Ember) {
            technologies.push({
                name: "Ember.js",
                version: window.Ember.VERSION || "Detected",
                category: "javascript-framework",
                confidence: "High",
                method: "JavaScript Object"
            });
        }

        // jQuery detection
        if (window.jQuery || window.$) {
            const version = window.jQuery ? window.jQuery.fn.jquery : "Detected";
            technologies.push({
                name: "jQuery",
                version: version,
                category: "javascript-library",
                confidence: "High",
                method: "JavaScript Object"
            });
        }

        // Bootstrap detection
        const bootstrapCSS = document.querySelector('link[href*="bootstrap"]');
        const bootstrapJS = document.querySelector('script[src*="bootstrap"]');
        if (bootstrapCSS || bootstrapJS || window.bootstrap) {
            let version = "Detected";
            if (window.bootstrap && window.bootstrap.Tooltip && window.bootstrap.Tooltip.VERSION) {
                version = window.bootstrap.Tooltip.VERSION;
            }
            technologies.push({
                name: "Bootstrap",
                version: version,
                category: "css-framework",
                confidence: "High",
                method: "CSS/JS Detection"
            });
        }

        // Font Awesome detection
        const fontAwesome = document.querySelector('link[href*="font-awesome"]') || 
                           document.querySelector('link[href*="fontawesome"]');
        if (fontAwesome) {
            technologies.push({
                name: "Font Awesome",
                version: "Detected",
                category: "font-library",
                confidence: "High",
                method: "CSS Link"
            });
        }

        // Moment.js detection
        if (window.moment) {
            technologies.push({
                name: "Moment.js",
                version: window.moment.version || "Detected",
                category: "javascript-library",
                confidence: "High",
                method: "JavaScript Object"
            });
        }

        // Handlebars detection
        if (window.Handlebars) {
            technologies.push({
                name: "Handlebars",
                version: window.Handlebars.VERSION || "Detected",
                category: "template-engine",
                confidence: "High",
                method: "JavaScript Object"
            });
        }

        this.detectionResults.technologies = technologies;
    }

    // Helper method to get server header (limited in browser context)
    getServerHeader() {
        // This is limited in browser context, but we can try to get it from
        // performance entries or other available sources
        try {
            const entries = performance.getEntriesByType('navigation');
            if (entries.length > 0) {
                // This won't give us the actual server header, but we can try
                // other detection methods
                return null;
            }
        } catch (e) {
            // Silently fail
        }
        return null;
    }

    // Post message to parent window (for iframe contexts)
    postMessage(data) {
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({
                type: 'discourse-detection',
                data: data
            }, '*');
        }
    }

    // Plugin detection helpers
    detectPlugins() {
        // This method can be extended to provide additional plugin detection
        // that complements the main detector in content.js
        const plugins = [];
        
        // Check for common plugin patterns
        const pluginScripts = document.querySelectorAll('script[src*="/plugins/"]');
        pluginScripts.forEach(script => {
            const pluginMatch = script.src.match(/\/plugins\/([^/]+)/);
            if (pluginMatch) {
                plugins.push({
                    name: pluginMatch[1],
                    method: "Script Source",
                    confidence: "High"
                });
            }
        });

        return plugins;
    }
}

// Make available globally
window.DiscourseDetector = DiscourseDetector;

// Auto-run detection and post results
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const detector = new DiscourseDetector();
        const results = detector.runDetection();
        detector.postMessage(results);
    });
} else {
    const detector = new DiscourseDetector();
    const results = detector.runDetection();
    detector.postMessage(results);
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DiscourseDetector;
}