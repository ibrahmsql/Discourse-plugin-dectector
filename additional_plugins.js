// Additional Official Discourse Plugins from discourse.org
const additionalPlugins = {
    // Pro Plugins
    'discourse-apple-signin': {
        selectors: ['.apple-signin', '[data-apple-auth]'],
        scripts: ['/plugins/apple-signin/assets/apple.js'],
        patterns: ['AppleAuth\.', 'discourse-apple-signin'],
        category: 'authentication'
    },
    'discourse-advertising': {
        selectors: ['.google-adsense', '.amazon-affiliates', '[data-ad-unit]'],
        scripts: ['/plugins/advertising/assets/advertising.js'],
        patterns: ['GoogleAdsense\.', 'AmazonAffiliates\.', 'discourse-advertising'],
        category: 'monetization'
    },
    'discourse-chat-integration': {
        selectors: ['.chat-integration', '[data-chat-provider]'],
        scripts: ['/plugins/chat-integration/assets/chat.js'],
        patterns: ['ChatIntegration\.', 'discourse-chat-integration'],
        category: 'integration'
    },
    'discourse-patreon': {
        selectors: ['.patreon-', '[data-patreon-tier]'],
        scripts: ['/plugins/patreon/assets/patreon.js'],
        patterns: ['Patreon\.', 'discourse-patreon'],
        category: 'monetization'
    },
    'discourse-solved': {
        selectors: ['.solved', '[data-solved]', '.accepted-answer'],
        scripts: ['/plugins/solved/assets/solved.js'],
        patterns: ['Solved\.', 'discourse-solved'],
        category: 'moderation'
    },
    'discourse-github': {
        selectors: ['.github-', '[data-github-repo]'],
        scripts: ['/plugins/github/assets/github.js'],
        patterns: ['GitHub\.', 'discourse-github'],
        category: 'integration'
    },
    'discourse-subscriptions': {
        selectors: ['.subscriptions', '[data-subscription-plan]'],
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
        selectors: ['.topic-voting', '[data-vote-count]'],
        scripts: ['/plugins/voting/assets/voting.js'],
        patterns: ['TopicVoting\.', 'discourse-voting'],
        category: 'engagement'
    },
    'discourse-assign': {
        selectors: ['.assigned-to', '[data-assigned-user]'],
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
        selectors: ['.calendar-', '[data-event-id]'],
        scripts: ['/plugins/calendar/assets/calendar.js'],
        patterns: ['Calendar\.', 'discourse-calendar'],
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
        selectors: ['.gamification-', '[data-points]', '.leaderboard'],
        scripts: ['/plugins/gamification/assets/gamification.js'],
        patterns: ['Gamification\.', 'discourse-gamification'],
        category: 'engagement'
    },
    'discourse-post-voting': {
        selectors: ['.post-voting', '[data-post-vote]'],
        scripts: ['/plugins/post-voting/assets/post-voting.js'],
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
        scripts: ['/plugins/code-review/assets/code-review.js'],
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
        selectors: ['.fa-pro', '[data-fa-pro]'],
        scripts: ['/plugins/fontawesome-pro/assets/fa-pro.js'],
        patterns: ['FontAwesomePro\.', 'discourse-fontawesome-pro'],
        category: 'customization'
    },
    'discourse-category-experts': {
        selectors: ['.category-experts', '[data-expert-badge]'],
        scripts: ['/plugins/category-experts/assets/experts.js'],
        patterns: ['CategoryExperts\.', 'discourse-category-experts'],
        category: 'engagement'
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
        selectors: ['.follow-user', '[data-follow-user]'],
        scripts: ['/plugins/follow/assets/follow.js'],
        patterns: ['Follow\.', 'discourse-follow'],
        category: 'engagement'
    },
    'discourse-newsletter': {
        selectors: ['.newsletter-', '[data-newsletter-subscription]'],
        scripts: ['/plugins/newsletter/assets/newsletter.js'],
        patterns: ['Newsletter\.', 'discourse-newsletter'],
        category: 'communication'
    },
    
    // Additional Community Plugins
    'discourse-akismet': {
        selectors: ['.akismet-', '[data-akismet]'],
        scripts: ['/plugins/akismet/assets/akismet.js'],
        patterns: ['Akismet\.', 'discourse-akismet'],
        category: 'moderation'
    },
    'discourse-backup-uploads-to-s3': {
        selectors: ['.s3-backup', '[data-s3-upload]'],
        scripts: ['/plugins/backup-uploads-to-s3/assets/s3.js'],
        patterns: ['S3Backup\.', 'discourse-backup-uploads-to-s3'],
        category: 'storage'
    },
    'discourse-brand-header': {
        selectors: ['.brand-header', '[data-brand-header]'],
        scripts: ['/plugins/brand-header/assets/brand.js'],
        patterns: ['BrandHeader\.', 'discourse-brand-header'],
        category: 'customization'
    },
    'discourse-cakeday': {
        selectors: ['.cakeday-', '[data-cakeday]'],
        scripts: ['/plugins/cakeday/assets/cakeday.js'],
        patterns: ['Cakeday\.', 'discourse-cakeday'],
        category: 'engagement'
    },
    'discourse-category-banners': {
        selectors: ['.category-banner', '[data-category-banner]'],
        scripts: ['/plugins/category-banners/assets/banners.js'],
        patterns: ['CategoryBanners\.', 'discourse-category-banners'],
        category: 'customization'
    },
    'discourse-category-icons': {
        selectors: ['.category-icon', '[data-category-icon]'],
        scripts: ['/plugins/category-icons/assets/icons.js'],
        patterns: ['CategoryIcons\.', 'discourse-category-icons'],
        category: 'customization'
    },
    'discourse-category-lockdown': {
        selectors: ['.category-lockdown', '[data-lockdown]'],
        scripts: ['/plugins/category-lockdown/assets/lockdown.js'],
        patterns: ['CategoryLockdown\.', 'discourse-category-lockdown'],
        category: 'moderation'
    },
    'discourse-clickable-topic': {
        selectors: ['.clickable-topic', '[data-clickable-topic]'],
        scripts: ['/plugins/clickable-topic/assets/clickable.js'],
        patterns: ['ClickableTopic\.', 'discourse-clickable-topic'],
        category: 'ux'
    },
    'discourse-custom-header-links': {
        selectors: ['.custom-header-links', '[data-custom-header]'],
        scripts: ['/plugins/custom-header-links/assets/header.js'],
        patterns: ['CustomHeaderLinks\.', 'discourse-custom-header-links'],
        category: 'customization'
    },
    'discourse-discord-bot': {
        selectors: ['.discord-bot', '[data-discord-webhook]'],
        scripts: ['/plugins/discord-bot/assets/discord.js'],
        patterns: ['DiscordBot\.', 'discourse-discord-bot'],
        category: 'integration'
    },
    'discourse-docs': {
        selectors: ['.docs-', '[data-docs-topic]'],
        scripts: ['/plugins/docs/assets/docs.js'],
        patterns: ['Docs\.', 'discourse-docs'],
        category: 'content'
    },
    'discourse-encrypt': {
        selectors: ['.encrypt-', '[data-encrypted]'],
        scripts: ['/plugins/encrypt/assets/encrypt.js'],
        patterns: ['Encrypt\.', 'discourse-encrypt'],
        category: 'security'
    },
    'discourse-events': {
        selectors: ['.event-', '[data-event-id]'],
        scripts: ['/plugins/events/assets/events.js'],
        patterns: ['Events\.', 'discourse-events'],
        category: 'engagement'
    },
    'discourse-footnote': {
        selectors: ['.footnote', '[data-footnote]'],
        scripts: ['/plugins/footnote/assets/footnote.js'],
        patterns: ['Footnote\.', 'discourse-footnote'],
        category: 'content'
    },
    'discourse-group-tracker': {
        selectors: ['.group-tracker', '[data-group-tracker]'],
        scripts: ['/plugins/group-tracker/assets/tracker.js'],
        patterns: ['GroupTracker\.', 'discourse-group-tracker'],
        category: 'analytics'
    },
    'discourse-hashtag-autocomplete': {
        selectors: ['.hashtag-autocomplete', '[data-hashtag]'],
        scripts: ['/plugins/hashtag-autocomplete/assets/hashtag.js'],
        patterns: ['HashtagAutocomplete\.', 'discourse-hashtag-autocomplete'],
        category: 'ux'
    },
    'discourse-kanban-board': {
        selectors: ['.kanban-board', '[data-kanban]'],
        scripts: ['/plugins/kanban-board/assets/kanban.js'],
        patterns: ['KanbanBoard\.', 'discourse-kanban-board'],
        category: 'productivity'
    },
    'discourse-locations': {
        selectors: ['.location-', '[data-location]'],
        scripts: ['/plugins/locations/assets/locations.js'],
        patterns: ['Locations\.', 'discourse-locations'],
        category: 'content'
    },
    'discourse-multilingual': {
        selectors: ['.multilingual-', '[data-language]'],
        scripts: ['/plugins/multilingual/assets/multilingual.js'],
        patterns: ['Multilingual\.', 'discourse-multilingual'],
        category: 'accessibility'
    },
    'discourse-no-bump': {
        selectors: ['.no-bump', '[data-no-bump]'],
        scripts: ['/plugins/no-bump/assets/nobump.js'],
        patterns: ['NoBump\.', 'discourse-no-bump'],
        category: 'moderation'
    },
    'discourse-openid-connect': {
        selectors: ['.openid-connect', '[data-oidc]'],
        scripts: ['/plugins/openid-connect/assets/oidc.js'],
        patterns: ['OpenIDConnect\.', 'discourse-openid-connect'],
        category: 'authentication'
    },
    'discourse-prometheus': {
        selectors: ['.prometheus-', '[data-prometheus]'],
        scripts: ['/plugins/prometheus/assets/prometheus.js'],
        patterns: ['Prometheus\.', 'discourse-prometheus'],
        category: 'analytics'
    },
    'discourse-push-notifications': {
        selectors: ['.push-notifications', '[data-push-notification]'],
        scripts: ['/plugins/push-notifications/assets/push.js'],
        patterns: ['PushNotifications\.', 'discourse-push-notifications'],
        category: 'engagement'
    },
    'discourse-quick-messages': {
        selectors: ['.quick-messages', '[data-quick-message]'],
        scripts: ['/plugins/quick-messages/assets/messages.js'],
        patterns: ['QuickMessages\.', 'discourse-quick-messages'],
        category: 'communication'
    },
    'discourse-retort': {
        selectors: ['.retort-', '[data-retort]'],
        scripts: ['/plugins/retort/assets/retort.js'],
        patterns: ['Retort\.', 'discourse-retort'],
        category: 'engagement'
    },
    'discourse-rss-polling': {
        selectors: ['.rss-polling', '[data-rss-feed]'],
        scripts: ['/plugins/rss-polling/assets/rss.js'],
        patterns: ['RSSPolling\.', 'discourse-rss-polling'],
        category: 'integration'
    },
    'discourse-sitemap': {
        selectors: ['.sitemap-', '[data-sitemap]'],
        scripts: ['/plugins/sitemap/assets/sitemap.js'],
        patterns: ['Sitemap\.', 'discourse-sitemap'],
        category: 'seo'
    },
    'discourse-slack-official': {
        selectors: ['.slack-official', '[data-slack-webhook]'],
        scripts: ['/plugins/slack-official/assets/slack.js'],
        patterns: ['SlackOfficial\.', 'discourse-slack-official'],
        category: 'integration'
    },
    'discourse-staff-notes': {
        selectors: ['.staff-notes', '[data-staff-note]'],
        scripts: ['/plugins/staff-notes/assets/notes.js'],
        patterns: ['StaffNotes\.', 'discourse-staff-notes'],
        category: 'moderation'
    },
    'discourse-steam-login': {
        selectors: ['.steam-login', '[data-steam-auth]'],
        scripts: ['/plugins/steam-login/assets/steam.js'],
        patterns: ['SteamAuth\.', 'discourse-steam-login'],
        category: 'authentication'
    },
    'discourse-table-builder': {
        selectors: ['.table-builder', '[data-table-builder]'],
        scripts: ['/plugins/table-builder/assets/table.js'],
        patterns: ['TableBuilder\.', 'discourse-table-builder'],
        category: 'content'
    },
    'discourse-teambuild': {
        selectors: ['.teambuild-', '[data-team]'],
        scripts: ['/plugins/teambuild/assets/team.js'],
        patterns: ['TeamBuild\.', 'discourse-teambuild'],
        category: 'engagement'
    },
    'discourse-theme-creator': {
        selectors: ['.theme-creator', '[data-theme-creator]'],
        scripts: ['/plugins/theme-creator/assets/creator.js'],
        patterns: ['ThemeCreator\.', 'discourse-theme-creator'],
        category: 'customization'
    },
    'discourse-topic-list-previews': {
        selectors: ['.topic-list-previews', '[data-topic-preview]'],
        scripts: ['/plugins/topic-list-previews/assets/previews.js'],
        patterns: ['TopicListPreviews\.', 'discourse-topic-list-previews'],
        category: 'ux'
    },
    'discourse-user-card-badges': {
        selectors: ['.user-card-badges', '[data-user-badge]'],
        scripts: ['/plugins/user-card-badges/assets/badges.js'],
        patterns: ['UserCardBadges\.', 'discourse-user-card-badges'],
        category: 'engagement'
    },
    'discourse-webhooks': {
        selectors: ['.webhooks-', '[data-webhook]'],
        scripts: ['/plugins/webhooks/assets/webhooks.js'],
        patterns: ['Webhooks\.', 'discourse-webhooks'],
        category: 'integration'
    },
    'discourse-whos-online': {
        selectors: ['.whos-online', '[data-online-users]'],
        scripts: ['/plugins/whos-online/assets/online.js'],
        patterns: ['WhosOnline\.', 'discourse-whos-online'],
        category: 'engagement'
    }
};

// Export for use in content.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = additionalPlugins;
}