const BaseLocators = {
    modals: {
        closeButtons: [
            'button[aria-label="Close Modal"]',
            'button:has-text("Decline offer")',
            '#button3',
            'button[aria-label="Close"]',
            '.fb_lightbox button.close',
            '[class*="close-button"]',
            '.fb_lightbox-overlay',
            '.preloaded_lightbox [aria-label="Close"]'
        ],
        overlays: [
            '[id*="lightbox"]',
            '[class*="lightbox"]',
            '[class*="overlay-fixed"]',
            '[id*="sidebar-overlay"]',
            '.fb_lightbox',
            '.fb_lightbox-overlay'
        ]
    },
    cookieConsent: {
        acceptButtons: [
            '#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll',
            '#CybotCookiebotDialogBodyButtonAccept',
            '#CybotCookiebotDialogBodyLevelButtonAccept',
            'a#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll',
            'button:has-text("Accept All")',
            'button:has-text("Accept all")',
            'button:has-text("Allow All")',
            'button:has-text("Allow all")',
            '#onetrust-accept-btn-handler',
            'button#accept-recommended-btn-handler',
            'button[id*="cookie"][id*="accept"]',
            'button[class*="cookie"][class*="accept"]',
            'button[aria-label*="Accept"]',
            'button[aria-label*="cookie"]',
            'button:has-text("Decline")',
            'a:has-text("Decline")'
        ],
        overlays: [
            '#CybotCookiebotDialog',
            '#CybotCookiebotDialogBodyUnderlay',
            '[id*="cookie"][id*="overlay"]',
            '[class*="cookie"][class*="overlay"]',
            '[id*="CookieConsent"]',
            '.cookie-banner',
            '.cookie-consent'
        ]
    }
};

module.exports = { BaseLocators };
