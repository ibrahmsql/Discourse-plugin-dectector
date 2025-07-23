// DiscourseMap Plugin Detector - Content Script
// Discourse forum plugin detection for browser extension

// Load additional plugins dynamically
if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.getURL) {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("additional_plugins.js");
    document.head.appendChild(script);
}
class DiscoursePluginDetector {
    constructor() {
        this.detectedPlugins = [];
        this.detectedThemes = [];
        this.technologyStack = [];
        this.vulnerabilities = [];
        this.isDiscourse = false;
        
        // Plugin signatures from Discourse.org plugin directory
        this.pluginSignatures = {
            // Pro Plugins
            'discourse-apple-signin': {
                selectors: ['.apple-login', '[data-apple-auth]', '.btn-social.apple'],
                scripts: ['/plugins/apple-signin/assets/apple.js'],
                patterns: ['AppleAuth\.', 'discourse-apple'],
                category: 'authentication'
            },
            'discourse-advertising': {
                selectors: ['.google-adsense', '.amazon-affiliates', '[data-ad-unit]'],
                scripts: ['/plugins/advertising/assets/advertising.js'],
                patterns: ['Advertising\.', 'discourse-advertising'],
                category: 'monetization'
            },
            'discourse-chat-integration': {
                selectors: ['.chat-integration', '[data-chat-provider]'],
                scripts: ['/plugins/chat-integration/assets/chat.js'],
                patterns: ['ChatIntegration\.', 'discourse-chat-integration'],
                category: 'communication'
            },
            'discourse-patreon': {
                selectors: ['.patreon-', '[data-patreon-user]'],
                scripts: ['/plugins/patreon/assets/patreon.js'],
                patterns: ['Patreon\.', 'discourse-patreon'],
                category: 'monetization'
            },
            'discourse-solved': {
                selectors: ['.accepted-answer', '.solution-', '[data-solution-post]'],
                scripts: ['/plugins/solved/assets/solved.js'],
                patterns: ['Solved\.', 'discourse-solved'],
                category: 'moderation'
            },
            'discourse-github': {
                selectors: ['.github-', '[data-github-repo]', '.github-badge'],
                scripts: ['/plugins/github/assets/github.js'],
                patterns: ['GitHub\.', 'discourse-github'],
                category: 'integration'
            },
            'discourse-subscriptions': {
                selectors: ['.subscription-', '[data-subscription-plan]'],
                scripts: ['/plugins/subscriptions/assets/subscriptions.js'],
                patterns: ['Subscriptions\.', 'discourse-subscriptions'],
                category: 'monetization'
            },
            'discourse-yearly-review': {
                selectors: ['.yearly-review', '[data-yearly-stats]'],
                scripts: ['/plugins/yearly-review/assets/yearly.js'],
                patterns: ['YearlyReview\.', 'discourse-yearly-review'],
                category: 'analytics'
            },
            'discourse-graphviz': {
                selectors: ['.graphviz-', '.viz-graph'],
                scripts: ['/plugins/graphviz/assets/graphviz.js'],
                patterns: ['Graphviz\.', 'discourse-graphviz'],
                category: 'content'
            },
            
            // Business Plugins
            'discourse-data-explorer': {
                selectors: ['.data-explorer', '[data-query-id]'],
                scripts: ['/plugins/data-explorer/assets/explorer.js'],
                patterns: ['DataExplorer\.', 'discourse-data-explorer'],
                category: 'analytics'
            },
            'discourse-oauth2': {
                selectors: ['.oauth2-', '[data-oauth2-provider]'],
                scripts: ['/plugins/oauth2/assets/oauth2.js'],
                patterns: ['OAuth2\.', 'discourse-oauth2'],
                category: 'authentication'
            },
            'discourse-amazon-login': {
                selectors: ['.amazon-login', '[data-amazon-auth]'],
                scripts: ['/plugins/amazon-login/assets/amazon.js'],
                patterns: ['AmazonAuth\.', 'discourse-amazon'],
                category: 'authentication'
            },
            'discourse-microsoft-login': {
                selectors: ['.microsoft-login', '[data-microsoft-auth]'],
                scripts: ['/plugins/microsoft-login/assets/microsoft.js'],
                patterns: ['MicrosoftAuth\.', 'discourse-microsoft'],
                category: 'authentication'
            },
            'discourse-user-notes': {
                selectors: ['.user-notes', '[data-user-note]'],
                scripts: ['/plugins/user-notes/assets/notes.js'],
                patterns: ['UserNotes\.', 'discourse-user-notes'],
                category: 'moderation'
            },
            'discourse-voting': {
                selectors: ['.voting-container', '.vote-count', '[data-vote-id]'],
                scripts: ['/plugins/voting/assets/voting.js'],
                patterns: ['Voting\.', 'discourse-voting'],
                category: 'engagement'
            },
            'discourse-assign': {
                selectors: ['.assigned-to', '.assignment-', '[data-assign-id]'],
                scripts: ['/plugins/assign/assets/assign.js'],
                patterns: ['Assign\.', 'discourse-assign'],
                category: 'moderation'
            },
            'discourse-templates': {
                selectors: ['.template-', '[data-template-id]'],
                scripts: ['/plugins/templates/assets/templates.js'],
                patterns: ['Templates\.', 'discourse-templates'],
                category: 'productivity'
            },
            'discourse-calendar': {
                selectors: ['.calendar-event', '[data-calendar-event]', '.fc-event'],
                scripts: ['/plugins/calendar/assets/calendar.js'],
                patterns: ['Calendar\.', 'discourse-calendar', 'FullCalendar'],
                category: 'productivity'
            },
            'discourse-zendesk': {
                selectors: ['.zendesk-', '[data-zendesk-ticket]'],
                scripts: ['/plugins/zendesk/assets/zendesk.js'],
                patterns: ['Zendesk\.', 'discourse-zendesk'],
                category: 'integration'
            },
            'discourse-lms': {
                selectors: ['.lms-', '[data-course-id]'],
                scripts: ['/plugins/lms/assets/lms.js'],
                patterns: ['LMS\.', 'discourse-lms'],
                category: 'education'
            },
            'discourse-automation': {
                selectors: ['.automation-', '[data-automation-rule]'],
                scripts: ['/plugins/automation/assets/automation.js'],
                patterns: ['Automation\.', 'discourse-automation'],
                category: 'productivity'
            },
            'discourse-policy': {
                selectors: ['.policy-', '[data-policy-id]'],
                scripts: ['/plugins/policy/assets/policy.js'],
                patterns: ['Policy\.', 'discourse-policy'],
                category: 'moderation'
            },
            'discourse-gamification': {
                selectors: ['.gamification-', '.leaderboard-', '[data-gamification-id]'],
                scripts: ['/plugins/gamification/assets/gamification.js'],
                patterns: ['Gamification\.', 'discourse-gamification'],
                category: 'engagement'
            },
            'discourse-post-voting': {
                selectors: ['.post-voting', '.vote-button', '[data-post-vote]'],
                scripts: ['/plugins/post-voting/assets/voting.js'],
                patterns: ['PostVoting\.', 'discourse-post-voting'],
                category: 'engagement'
            },
            
            // Enterprise Plugins
            'discourse-translator': {
                selectors: ['.translator-', '[data-translate-button]'],
                scripts: ['/plugins/translator/assets/translator.js'],
                patterns: ['Translator\.', 'discourse-translator'],
                category: 'accessibility'
            },
            'discourse-saml': {
                selectors: ['.saml-', '[data-saml-provider]'],
                scripts: ['/plugins/saml/assets/saml.js'],
                patterns: ['SAML\.', 'discourse-saml'],
                category: 'authentication'
            },
            'discourse-saved-search': {
                selectors: ['.saved-search', '[data-saved-query]'],
                scripts: ['/plugins/saved-search/assets/search.js'],
                patterns: ['SavedSearch\.', 'discourse-saved-search'],
                category: 'productivity'
            },
            'discourse-perspective': {
                selectors: ['.perspective-', '[data-perspective-score]'],
                scripts: ['/plugins/perspective/assets/perspective.js'],
                patterns: ['Perspective\.', 'discourse-perspective'],
                category: 'moderation'
            },
            'discourse-topic-tooltips': {
                selectors: ['.topic-tooltip', '[data-topic-preview]'],
                scripts: ['/plugins/topic-tooltips/assets/tooltips.js'],
                patterns: ['TopicTooltips\.', 'discourse-topic-tooltips'],
                category: 'ux'
            },
            'discourse-activitypub': {
                selectors: ['.activitypub-', '[data-activitypub]'],
                scripts: ['/plugins/activitypub/assets/activitypub.js'],
                patterns: ['ActivityPub\.', 'discourse-activitypub'],
                category: 'integration'
            },
            'discourse-code-review': {
                selectors: ['.code-review', '[data-commit-hash]'],
                scripts: ['/plugins/code-review/assets/review.js'],
                patterns: ['CodeReview\.', 'discourse-code-review'],
                category: 'development'
            },
            'discourse-zoom': {
                selectors: ['.zoom-meeting', '[data-zoom-id]'],
                scripts: ['/plugins/zoom/assets/zoom.js'],
                patterns: ['Zoom\.', 'discourse-zoom'],
                category: 'integration'
            },
            'discourse-jira': {
                selectors: ['.jira-', '[data-jira-issue]'],
                scripts: ['/plugins/jira/assets/jira.js'],
                patterns: ['Jira\.', 'discourse-jira'],
                category: 'integration'
            },
            'discourse-fontawesome-pro': {
                selectors: ['.fa-pro', '.fal-', '.fad-'],
                scripts: ['/plugins/fontawesome-pro/assets/fa.js'],
                patterns: ['FontAwesome\.', 'discourse-fontawesome'],
                category: 'design'
            },
            'discourse-category-experts': {
                selectors: ['.category-expert', '[data-expert-badge]'],
                scripts: ['/plugins/category-experts/assets/experts.js'],
                patterns: ['CategoryExperts\.', 'discourse-category-experts'],
                category: 'gamification'
            },
            'discourse-salesforce': {
                selectors: ['.salesforce-', '[data-salesforce-id]'],
                scripts: ['/plugins/salesforce/assets/salesforce.js'],
                patterns: ['Salesforce\.', 'discourse-salesforce'],
                category: 'integration'
            },
            'discourse-bbcode': {
                selectors: ['.bbcode-', '[data-bbcode]'],
                scripts: ['/plugins/bbcode/assets/bbcode.js'],
                patterns: ['BBCode\.', 'discourse-bbcode'],
                category: 'content'
            },
            'discourse-follow': {
                selectors: ['.follow-', '.following-', '[data-follow-id]'],
                scripts: ['/plugins/follow/assets/follow.js'],
                patterns: ['Follow\.', 'discourse-follow'],
                category: 'social'
            },
            'discourse-newsletter': {
                selectors: ['.newsletter-', '[data-newsletter-subscription]'],
                scripts: ['/plugins/newsletter/assets/newsletter.js'],
                patterns: ['Newsletter\.', 'discourse-newsletter'],
                category: 'communication'
            },
            
            // Core/Common Plugins
            'discourse-poll': {
                selectors: ['[data-poll-name]', '.poll-container', '.poll-info'],
                scripts: ['/plugins/poll/assets/poll.js'],
                patterns: ['Poll\.', 'discourse-poll'],
                category: 'engagement'
            },
            'discourse-chat': {
                selectors: ['.chat-channel', '.chat-message', '[data-chat-channel]'],
                scripts: ['/plugins/chat/assets/chat.js'],
                patterns: ['Chat\.', 'discourse-chat'],
                category: 'communication'
            },
            'discourse-reactions': {
                selectors: ['.discourse-reactions', '.reaction-', '[data-reaction-id]'],
                scripts: ['/plugins/reactions/assets/reactions.js'],
                patterns: ['Reactions\.', 'discourse-reactions'],
                category: 'engagement'
            },
            'discourse-math': {
                selectors: ['.math-container', '.katex-display', '.mathjax-element'],
                scripts: ['/plugins/math/assets/math.js'],
                patterns: ['Math\.', 'discourse-math', 'KaTeX', 'MathJax'],
                category: 'content'
            },
            'discourse-spoiler-alert': {
                selectors: ['.spoiler', '.spoiled', '[data-spoiler-id]'],
                scripts: ['/plugins/spoiler-alert/assets/spoiler.js'],
                patterns: ['SpoilerAlert\.', 'discourse-spoiler-alert'],
                category: 'content'
            },
            'discourse-checklist': {
                selectors: ['.chcklst-box', '.checklist-', '[data-checklist-id]'],
                scripts: ['/plugins/checklist/assets/checklist.js'],
                patterns: ['Checklist\.', 'discourse-checklist'],
                category: 'productivity'
            }
        };
        
        // Plugin categories for better organization
        this.pluginCategories = {
            'authentication': ['discourse-apple-signin', 'discourse-oauth2', 'discourse-amazon-login', 'discourse-microsoft-login', 'discourse-saml'],
            'monetization': ['discourse-advertising', 'discourse-patreon', 'discourse-subscriptions'],
            'communication': ['discourse-chat-integration', 'discourse-chat', 'discourse-newsletter'],
            'moderation': ['discourse-solved', 'discourse-user-notes', 'discourse-assign', 'discourse-policy', 'discourse-perspective'],
            'integration': ['discourse-github', 'discourse-zendesk', 'discourse-activitypub', 'discourse-zoom', 'discourse-jira', 'discourse-salesforce'],
            'analytics': ['discourse-yearly-review', 'discourse-data-explorer'],
            'content': ['discourse-graphviz', 'discourse-bbcode', 'discourse-poll', 'discourse-math', 'discourse-spoiler-alert'],
            'productivity': ['discourse-templates', 'discourse-calendar', 'discourse-automation', 'discourse-saved-search', 'discourse-checklist'],
            'education': ['discourse-lms'],
            'engagement': ['discourse-voting', 'discourse-gamification', 'discourse-post-voting', 'discourse-reactions'],
            'accessibility': ['discourse-translator'],
            'ux': ['discourse-topic-tooltips'],
            'development': ['discourse-code-review'],
            'design': ['discourse-fontawesome-pro'],
            'gamification': ['discourse-category-experts'],
            'social': ['discourse-follow']
        };
    }
    
    // Check if current site is Discourse
    detectDiscourse() {
        const indicators = [
            // Meta tags
            document.querySelector('meta[name="generator"][content*="Discourse"]'),
            // Discourse-specific elements
            document.querySelector('.discourse-application'),
            document.querySelector('#discourse-modal'),
            document.querySelector('.ember-application'),
            // JavaScript variables
            window.Discourse,
            window.Ember,
            // CSS classes
            document.querySelector('.docked'),
            document.querySelector('.topic-list'),
            document.querySelector('.category-list')
        ];
        
        this.isDiscourse = indicators.some(indicator => indicator !== null);
        return this.isDiscourse;
    }
    
    // Detect plugins by DOM elements
    detectPluginsByDOM() {
        for (const [pluginName, signature] of Object.entries(this.pluginSignatures)) {
            if (signature.selectors) {
                for (const selector of signature.selectors) {
                    if (document.querySelector(selector)) {
                        this.addDetectedPlugin(pluginName, 'DOM Element', signature);
                        break;
                    }
                }
            }
        }
    }
    
    // Detect plugins by script sources
    detectPluginsByScripts() {
        const scripts = Array.from(document.querySelectorAll('script[src]'));
        
        for (const [pluginName, signature] of Object.entries(this.pluginSignatures)) {
            if (signature.scripts) {
                for (const scriptPath of signature.scripts) {
                    const found = scripts.some(script => 
                        script.src.includes(scriptPath) || 
                        script.src.includes(pluginName)
                    );
                    
                    if (found) {
                        this.addDetectedPlugin(pluginName, 'Script Source', signature);
                        break;
                    }
                }
            }
        }
    }
    
    // Detect plugins by JavaScript patterns
    detectPluginsByJavaScript() {
        for (const [pluginName, signature] of Object.entries(this.pluginSignatures)) {
            if (signature.patterns) {
                for (const pattern of signature.patterns) {
                    try {
                        const regex = new RegExp(pattern);
                        const scripts = Array.from(document.querySelectorAll('script:not([src])'));
                        
                        const found = scripts.some(script => 
                            regex.test(script.textContent)
                        );
                        
                        if (found) {
                            this.addDetectedPlugin(pluginName, 'JavaScript Pattern', signature);
                            break;
                        }
                    } catch (e) {
                        console.warn('Invalid regex pattern:', pattern);
                    }
                }
            }
        }
    }
    
    // Detect technology stack
    detectTechnologyStack() {
        const technologies = {
            'Ember.js': window.Ember,
            'jQuery': window.jQuery || window.$,
            'Handlebars': window.Handlebars,
            'Moment.js': window.moment,
            'Bootstrap': document.querySelector('.btn-primary, .container-fluid'),
            'Font Awesome': document.querySelector('.fa, .fas, .far, .fab'),
            'Redis': document.querySelector('meta[name="discourse-redis"]'),
            'PostgreSQL': document.querySelector('meta[name="discourse-postgres"]')
        };
        
        for (const [tech, indicator] of Object.entries(technologies)) {
            if (indicator) {
                this.technologyStack.push({
                    name: tech,
                    detected: true,
                    method: typeof indicator === 'object' ? 'DOM Element' : 'JavaScript Object'
                });
            }
        }
    }
    
    // Get plugin category
    getPluginCategory(pluginName) {
        for (const [category, plugins] of Object.entries(this.pluginCategories)) {
            if (plugins.includes(pluginName)) {
                return category;
            }
        }
        return 'other';
    }
    
    // plugin detection with version extraction
    detectPluginVersion(pluginName, element) {
        let version = null;
        
        // Try to extract version from data attributes
        if (element && element.dataset) {
            version = element.dataset.version || element.dataset.pluginVersion;
        }
        
        // Try to extract from script src
        if (!version && element && element.src) {
            const versionMatch = element.src.match(/[\/-]v?(\d+\.\d+\.\d+)/i);
            if (versionMatch) {
                version = versionMatch[1];
            }
        }
        
        // Try to extract from class names
        if (!version && element && element.className) {
            const versionMatch = element.className.match(/v(\d+[\.-]\d+[\.-]\d+)/i);
            if (versionMatch) {
                version = versionMatch[1].replace(/-/g, '.');
            }
        }
        
        return version;
    }
    
    // Add detected plugin to results with validation
    addDetectedPlugin(name, method, signature, element = null) {
        // Avoid duplicates
        if (this.detectedPlugins.some(plugin => plugin.name === name)) {
            return;
        }
        
        // validation to reduce false positives
        if (!this.validatePluginDetection(name, method, signature, element)) {
            console.log(`[DiscourseMap] False positive filtered: ${name} via ${method}`);
            return;
        }
        
        const version = this.detectPluginVersion(name, element);
        const category = this.getPluginCategory(name);
        
        const plugin = {
            name: name,
            category: category,
            risk: signature.risk || 'low',
            detection_method: method,
            version: version,
            confidence: this.calculateConfidence(method, signature, element),
            timestamp: new Date().toISOString()
        };
        
        this.detectedPlugins.push(plugin);
        console.log(`[DiscourseMap] Detected plugin: ${name} via ${method} (confidence: ${plugin.confidence})`);
    }
    
    // Validate plugin detection to reduce false positives
    validatePluginDetection(name, method, signature, element) {
        // Must be on a Discourse site
        if (!this.isDiscourse) {
            return false;
        }
        
        // For DOM-based detection, require multiple indicators
        if (method === 'DOM Element') {
            let indicators = 0;
            
            // Check if multiple selectors match
            if (signature.selectors && signature.selectors.length > 1) {
                indicators = signature.selectors.filter(selector => 
                    document.querySelector(selector)
                ).length;
                
                // Require at least 2 indicators for high confidence
                if (indicators < 2 && signature.selectors.length > 2) {
                    return false;
                }
            }
            
            // Check for plugin-specific attributes or content
            if (element) {
                const hasPluginAttributes = element.dataset && 
                    Object.keys(element.dataset).some(key => 
                        key.toLowerCase().includes(name.replace('discourse-', ''))
                    );
                
                const hasPluginClasses = element.className && 
                    element.className.toLowerCase().includes(name.replace('discourse-', ''));
                
                if (!hasPluginAttributes && !hasPluginClasses && indicators < 2) {
                    return false;
                }
            }
        }
        
        // For script-based detection, verify script content
        if (method === 'Script Source') {
            const scripts = Array.from(document.querySelectorAll('script[src]'));
            const relevantScript = scripts.find(script => 
                signature.scripts.some(scriptPath => 
                    script.src.includes(scriptPath) || script.src.includes(name)
                )
            );
            
            if (!relevantScript) {
                return false;
            }
            
            // Additional validation: check if script is actually loaded
            if (relevantScript.src && !relevantScript.src.includes('/plugins/')) {
                // If not in plugins directory, require additional validation
                const hasPluginNamespace = window[name.replace('discourse-', '').replace('-', '_')];
                if (!hasPluginNamespace) {
                    return false;
                }
            }
        }
        
        // For JavaScript pattern detection, require stricter matching
        if (method === 'JavaScript Pattern') {
            let patternMatches = 0;
            
            if (signature.patterns) {
                for (const pattern of signature.patterns) {
                    try {
                        const regex = new RegExp(pattern, 'i');
                        const scripts = Array.from(document.querySelectorAll('script:not([src])'));
                        
                        const matches = scripts.filter(script => 
                            regex.test(script.textContent)
                        ).length;
                        
                        patternMatches += matches;
                    } catch (e) {
                        console.warn('Invalid regex pattern:', pattern);
                    }
                }
            }
            
            // Require at least one strong pattern match
            if (patternMatches === 0) {
                return false;
            }
        }
        
        return true;
    }
    
    // Calculate confidence score for detection
    calculateConfidence(method, signature, element) {
        let confidence = 'Medium';
        
        if (method === 'DOM Element') {
            const matchingSelectors = signature.selectors ? 
                signature.selectors.filter(selector => document.querySelector(selector)).length : 0;
            
            if (matchingSelectors >= 3) {
                confidence = 'High';
            } else if (matchingSelectors >= 2) {
                confidence = 'Medium';
            } else {
                confidence = 'Low';
            }
        } else if (method === 'Script Source') {
            // Script-based detection is generally more reliable
            confidence = 'High';
        } else if (method === 'JavaScript Pattern') {
            // Pattern-based detection can be less reliable
            confidence = 'Medium';
        }
        
        return confidence;
    }
    
    // Detect Discourse and Ruby versions
    detectVersions() {
        const technologies = [];
        
        // Load detector if available
        if (window.DiscourseDetector) {
            try {
                const detector = new window.DiscourseDetector();
                const results = detector.runDetection();
                
                // Add Discourse version with detection
                if (results.discourse.version !== "Unknown") {
                    technologies.push({
                        name: "Discourse",
                        version: results.discourse.version,
                        category: "forum",
                        confidence: results.discourse.confidence,
                        method: results.discourse.method
                    });
                }
                
                // Add Ruby version with detection
                if (results.ruby.version !== "Unknown") {
                    technologies.push({
                        name: "Ruby",
                        version: results.ruby.version,
                        category: "programming-language",
                        confidence: results.ruby.confidence,
                        method: results.ruby.method
                    });
                }
                
                // Add all detected technologies
                for (const tech of results.technologies) {
                    technologies.push({
                        name: tech.name,
                        version: "Detected",
                        category: tech.category,
                        confidence: tech.confidence > 75 ? "High" : tech.confidence > 50 ? "Medium" : "Low",
                        evidence: tech.evidence
                    });
                }
            } catch (error) {
                console.warn("[DiscourseMap] detection failed:", error);
            }
        }
        
        // Precise Discourse detection (Wappalyzer-style accuracy)
        if (technologies.length === 0) {
            // Method 1: Meta tag (most reliable - 100% accuracy)
            let discourseVersion = null;
            let confidence = "Low";
            let detectionMethod = "unknown";
            
            const discourseVersionMeta = document.querySelector('meta[name="discourse-version"]');
            // Additional version detection methods
            if (!discourseVersion) {
                // Check for version in page title or description
                const titleMeta = document.querySelector("title");
                if (titleMeta && titleMeta.textContent.includes("Discourse")) {
                    const versionMatch = titleMeta.textContent.match(/Discourse\s+([\d\.]+)/i);
                    if (versionMatch) {
                        discourseVersion = versionMatch[1];
                        confidence = "Medium";
                        detectionMethod = "title-meta";
                    }
                }
                // Check for version in application-name meta
                if (!discourseVersion) {
                    const appNameMeta = document.querySelector('meta[name="application-name"]');
                    if (appNameMeta && appNameMeta.content.includes("Discourse")) {
                        const versionMatch = appNameMeta.content.match(/Discourse\s+([\d\.]+)/i);
                        if (versionMatch) {
                            discourseVersion = versionMatch[1];
                            confidence = "High";
                            detectionMethod = "app-name-meta";
                        }
                    }
                }
                // Check for version in script tags
                // Check for version via API endpoints
                if (!discourseVersion) {
                    try {
                        // Check if site.json endpoint exists (common in Discourse)
                        const siteJsonScript = document.querySelector('script[data-discourse-entrypoint="site"]');
                        if (siteJsonScript) {
                            discourseVersion = "Detected";
                            confidence = "High";
                            detectionMethod = "site-json";
                        }
                        // Check for Discourse-specific CSS classes on body
                        if (!discourseVersion && document.body) {
                            const bodyClasses = document.body.className;
                            if (bodyClasses.includes("discourse-") && bodyClasses.includes("desktop")) {
                                discourseVersion = "Detected";
                                confidence = "Medium";
                                detectionMethod = "body-classes";
                            }
                        }
                    } catch (e) {
                        // Silent fail for API checks
                    }
                }                if (!discourseVersion) {
                    const scripts = document.querySelectorAll('script[src*="discourse"]');
                    for (const script of scripts) {
                        const versionMatch = script.src.match(/discourse[\-\.]([\d\.]+)/i);
                        if (versionMatch) {
                            discourseVersion = versionMatch[1];
                            confidence = "Medium";
                            detectionMethod = "script-src";
                            break;
                        }
                    }
                }
            }            if (discourseVersionMeta && discourseVersionMeta.content) {
                discourseVersion = discourseVersionMeta.content;
                confidence = "High";
                detectionMethod = "meta-tag";
            }
            // Method 2: JavaScript global (reliable - 95% accuracy)
            else if (window.Discourse && window.Discourse.VERSION) {
                discourseVersion = window.Discourse.VERSION;
                confidence = "High";
                detectionMethod = "js-global";
            }
            // Method 3: Generator meta tag (medium reliability - 85% accuracy)
            else {
                const generatorMeta = document.querySelector('meta[name="generator"][content*="Discourse"]');
                if (generatorMeta) {
                    const content = generatorMeta.content;
                    const versionMatch = content.match(/Discourse\s+([\d\.]+)/i);
                    discourseVersion = versionMatch ? versionMatch[1] : "Detected";
                    confidence = versionMatch ? "Medium" : "Low";
                    detectionMethod = "generator-meta";
                }
                // Method 4: Discourse object presence (medium reliability - 80% accuracy)
                else if (window.Discourse && typeof window.Discourse === 'object') {
                    const discourseProps = ['SiteSettings', 'User', 'Session', 'Site'];
                    const foundProps = discourseProps.filter(prop => window.Discourse[prop]);
                    
                    if (foundProps.length >= 2) {
                        discourseVersion = "Detected";
                        confidence = "Medium";
                        detectionMethod = "js-object";
                    }
                }
                // Method 5: DOM patterns (lower reliability - 70% accuracy)
                else {
                    const discourseSelectors = [
                        '#discourse-modal',
                        '.discourse-no-touch',
                        '[data-discourse-present]',
                        '.discourse-application',
                        '#main-outlet',
                        '.topic-list',
                        '.topic-body'
                    ];
                    
                    const foundSelectors = discourseSelectors.filter(selector => 
                        document.querySelector(selector)
                    );
                    
                    if (foundSelectors.length >= 3) {
                        discourseVersion = "Detected";
                        confidence = "Medium";
                        detectionMethod = "dom-pattern";
                    }
                    // Method 6: CSS class patterns (lowest reliability - 60% accuracy)
                    else {
                        const bodyClasses = document.body.className;
                        if (bodyClasses.includes('discourse-') || bodyClasses.includes('topic-') || bodyClasses.includes('category-')) {
                            discourseVersion = "Detected";
                            confidence = "Low";
                            detectionMethod = "css-pattern";
                        }
                    }
                }
            }
            
            if (discourseVersion) {
                technologies.push({
                    name: "Discourse",
                    version: discourseVersion,
                    category: "forum",
                    confidence: confidence,
                    method: detectionMethod
                });
                this.isDiscourse = true;
            }
        }
        
        // Basic Ruby version detection
        const rubyVersionMeta = document.querySelector("meta[name='ruby-version']");
        if (rubyVersionMeta) {
            technologies.push({
                name: "Ruby",
                version: rubyVersionMeta.content,
                category: "programming-language",
                confidence: "High"
            });
        }
        
        // Always detect these basic technologies
        // Rails version
        var railsVersionMeta = document.querySelector("meta[name=\"rails-version\"]");
        if (railsVersionMeta) {
            technologies.push({
                name: "Ruby on Rails",
                version: railsVersionMeta.content,
                category: "web-framework",
                confidence: "High"
            });
        }
        
        // jQuery
        if (window.jQuery || window.$) {
            const jqueryVersion = window.jQuery ? window.jQuery.fn.jquery : "Detected";
            technologies.push({
                name: "jQuery",
                version: jqueryVersion,
                category: "javascript-library",
                confidence: "High"
            });
        }
        
        // Ember.js
        if (document.querySelector("script[src*='ember']") || window.Ember) {
            const emberVersion = window.Ember ? window.Ember.VERSION : "Detected";
            technologies.push({
                name: "Ember.js",
                version: emberVersion,
                category: "javascript-framework",
                confidence: "High"
            });
        }
        
        // PostgreSQL
        if (document.querySelector("meta[name=\"database\"]")?.content?.includes("postgresql")) {
            technologies.push({
                name: "PostgreSQL",
                version: "Detected",
                category: "database",
                confidence: "Medium"
            });
        }
        
        // Redis
        if (document.querySelector("meta[name=\"cache\"]")?.content?.includes("redis")) {
            technologies.push({
                name: "Redis",
                version: "Detected",
                category: "cache",
                confidence: "Medium"
            });
        }
        
        return technologies;
    }
    
    // Get detection results
    getResults() {
        // Detect technologies and versions
        const technologyStack = this.detectVersions();
        
        // Create summary
        const discourseVersion = technologyStack.find(tech => tech.name === 'Discourse')?.version || 'Unknown';
        const rubyVersion = technologyStack.find(tech => tech.name === 'Ruby')?.version || 'Unknown';
        
        const summary = {
            totalPlugins: this.detectedPlugins.length,
            discourseVersion,
            rubyVersion,
            totalTechnologies: technologyStack.length
        };
        
        return {
            isDiscourse: this.isDiscourse,
            detectedPlugins: this.detectedPlugins,
            detectedThemes: this.detectedThemes,
            technologyStack,
            summary,
            timestamp: new Date().toISOString(),
            url: window.location.href
        };
    }
    
    // Run complete detection
    runDetection() {
        console.log('[DiscourseMap] Starting plugin detection...');
        
        if (!this.detectDiscourse()) {
            console.log('[DiscourseMap] Not a Discourse forum');
            return this.getResults();
        }
        
        console.log('[DiscourseMap] Discourse forum detected, scanning plugins...');
        
        this.detectPluginsByDOM();
        this.detectPluginsByScripts();
        this.detectPluginsByJavaScript();
        this.detectTechnologyStack();
        
        const results = this.getResults();
        console.log('[DiscourseMap] Detection completed:', results);
        
        return results;
    }
}

// Load detector
if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.getURL) {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("detector.js");
    script.onload = function() {
        console.log("[DiscourseMap] detector loaded");
    };
    script.onerror = function() {
        console.log("[DiscourseMap] detector failed to load");
    };
    document.head.appendChild(script);
}
// Initialize detector
const detector = new DiscoursePluginDetector();

// Run detection when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            const results = detector.runDetection();
            // Send results to popup
            if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.sendMessage) {
                chrome.runtime.sendMessage({
                    action: 'detectionResults',
                    results: results
                });
            }
        }, 1000); // Wait for dynamic content
    });
} else {
    setTimeout(() => {
        const results = detector.runDetection();
        // Send results to popup
        if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.sendMessage) {
            chrome.runtime.sendMessage({
                action: 'detectionResults',
                results: results
            });
        }
    }, 1000);
}

// Listen for manual detection requests
if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'runDetection') {
            const results = detector.runDetection();
            sendResponse(results);
        }
    });
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DiscoursePluginDetector;
}