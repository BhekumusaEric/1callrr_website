/*
 * 1 Call Rapid Response - Cookie Management System
 * Author: Bhekumusa Eric Ntshwenya
 * Version: 1.0.0
 */

class CookieManager {
    constructor() {
        this.apiBase = '/api';
        this.init();
    }

    // Initialize cookie manager
    async init() {
        await this.loadUserPreferences();
        await this.checkCookieConsent();
        this.setupFormAutoSave();
    }

    // ==================== BASIC COOKIE OPERATIONS ====================

    /**
     * Set a cookie
     * @param {string} name - Cookie name
     * @param {string} value - Cookie value
     * @param {Object} options - Cookie options
     */
    setCookie(name, value, options = {}) {
        const defaults = {
            path: '/',
            maxAge: 24 * 60 * 60, // 24 hours in seconds
            sameSite: 'lax'
        };

        const cookieOptions = { ...defaults, ...options };
        let cookieString = `${name}=${encodeURIComponent(value)}`;

        if (cookieOptions.maxAge) {
            cookieString += `; Max-Age=${cookieOptions.maxAge}`;
        }

        if (cookieOptions.expires) {
            cookieString += `; Expires=${cookieOptions.expires.toUTCString()}`;
        }

        if (cookieOptions.domain) {
            cookieString += `; Domain=${cookieOptions.domain}`;
        }

        if (cookieOptions.path) {
            cookieString += `; Path=${cookieOptions.path}`;
        }

        if (cookieOptions.secure) {
            cookieString += `; Secure`;
        }

        if (cookieOptions.sameSite) {
            cookieString += `; SameSite=${cookieOptions.sameSite}`;
        }

        document.cookie = cookieString;
    }

    /**
     * Get a cookie value
     * @param {string} name - Cookie name
     * @returns {string|null} Cookie value or null if not found
     */
    getCookie(name) {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [cookieName, cookieValue] = cookie.trim().split('=');
            if (cookieName === name) {
                return decodeURIComponent(cookieValue);
            }
        }
        return null;
    }

    /**
     * Delete a cookie
     * @param {string} name - Cookie name
     * @param {Object} options - Cookie options
     */
    deleteCookie(name, options = {}) {
        this.setCookie(name, '', {
            ...options,
            maxAge: 0,
            expires: new Date(0)
        });
    }

    /**
     * Check if a cookie exists
     * @param {string} name - Cookie name
     * @returns {boolean} True if cookie exists
     */
    hasCookie(name) {
        return this.getCookie(name) !== null;
    }

    // ==================== USER PREFERENCES ====================

    /**
     * Load user preferences from server
     */
    async loadUserPreferences() {
        try {
            const response = await fetch(`${this.apiBase}/preferences`);
            const data = await response.json();
            
            if (data.success) {
                this.preferences = data.preferences;
                this.applyPreferences();
            }
        } catch (error) {
            console.error('Failed to load user preferences:', error);
            this.preferences = this.getDefaultPreferences();
        }
    }

    /**
     * Save user preferences to server
     * @param {Object} preferences - User preferences object
     */
    async saveUserPreferences(preferences) {
        try {
            const response = await fetch(`${this.apiBase}/preferences`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(preferences)
            });

            const data = await response.json();
            
            if (data.success) {
                this.preferences = data.preferences;
                this.applyPreferences();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to save user preferences:', error);
            return false;
        }
    }

    /**
     * Get default preferences
     * @returns {Object} Default preferences
     */
    getDefaultPreferences() {
        return {
            theme: 'light',
            language: 'en',
            autoFill: true,
            notifications: true
        };
    }

    /**
     * Apply preferences to the UI
     */
    applyPreferences() {
        if (!this.preferences) return;

        // Apply theme
        if (this.preferences.theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }

        // Apply language (if you have multi-language support)
        document.documentElement.lang = this.preferences.language;

        // Trigger custom event for other components
        window.dispatchEvent(new CustomEvent('preferencesLoaded', {
            detail: this.preferences
        }));
    }

    /**
     * Toggle theme between light and dark
     */
    async toggleTheme() {
        const newTheme = this.preferences.theme === 'light' ? 'dark' : 'light';
        const success = await this.saveUserPreferences({
            ...this.preferences,
            theme: newTheme
        });
        
        if (success) {
            this.showNotification(`Switched to ${newTheme} theme`);
        }
    }

    // ==================== FORM AUTO-SAVE ====================

    /**
     * Setup automatic form saving
     */
    setupFormAutoSave() {
        // Auto-save contact form
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            this.setupFormAutoSaveForForm(contactForm, 'contact');
        }

        // Auto-save quote form
        const quoteForm = document.getElementById('quoteForm');
        if (quoteForm) {
            this.setupFormAutoSaveForForm(quoteForm, 'quote');
        }
    }

    /**
     * Setup auto-save for a specific form
     * @param {HTMLFormElement} form - Form element
     * @param {string} formType - Form type identifier
     */
    setupFormAutoSaveForForm(form, formType) {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (this.preferences && this.preferences.autoFill) {
                    this.debounce(() => this.saveFormProgress(formType), 1000)();
                }
            });
        });

        // Load saved progress on page load
        this.loadFormProgress(formType);
    }

    /**
     * Save form progress
     * @param {string} formType - Form type identifier
     */
    async saveFormProgress(formType) {
        const form = document.getElementById(`${formType}Form`);
        if (!form) return;

        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            if (value.trim()) { // Only save non-empty values
                data[key] = value;
            }
        }

        // Only save if there's actual data
        if (Object.keys(data).length === 0) return;

        try {
            await fetch(`${this.apiBase}/form-progress`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    formType,
                    formData: data
                })
            });
        } catch (error) {
            console.error('Failed to save form progress:', error);
        }
    }

    /**
     * Load form progress
     * @param {string} formType - Form type identifier
     */
    async loadFormProgress(formType) {
        try {
            const response = await fetch(`${this.apiBase}/form-progress/${formType}`);
            const data = await response.json();
            
            if (data.success && data.progress) {
                this.restoreFormData(formType, data.progress.formData);
                this.showFormProgressNotification(formType);
            }
        } catch (error) {
            console.error('Failed to load form progress:', error);
        }
    }

    /**
     * Restore form data from saved progress
     * @param {string} formType - Form type identifier
     * @param {Object} formData - Saved form data
     */
    restoreFormData(formType, formData) {
        const form = document.getElementById(`${formType}Form`);
        if (!form) return;

        Object.entries(formData).forEach(([name, value]) => {
            const input = form.querySelector(`[name="${name}"]`);
            if (input) {
                input.value = value;
            }
        });
    }

    /**
     * Clear form progress
     * @param {string} formType - Form type identifier
     */
    async clearFormProgress(formType) {
        try {
            await fetch(`${this.apiBase}/form-progress/${formType}`, {
                method: 'DELETE'
            });
        } catch (error) {
            console.error('Failed to clear form progress:', error);
        }
    }

    /**
     * Show form progress notification
     * @param {string} formType - Form type identifier
     */
    showFormProgressNotification(formType) {
        const notification = document.createElement('div');
        notification.className = 'form-progress-notification';
        notification.innerHTML = `
            <div class="alert alert-info alert-dismissible fade show" role="alert">
                <i class="fas fa-info-circle"></i>
                We've restored your previous ${formType} form data.
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        const form = document.getElementById(`${formType}Form`);
        if (form) {
            form.parentNode.insertBefore(notification, form);
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                notification.remove();
            }, 5000);
        }
    }

    // ==================== COOKIE CONSENT ====================

    /**
     * Check cookie consent status
     */
    async checkCookieConsent() {
        try {
            const response = await fetch(`${this.apiBase}/cookie-consent`);
            const data = await response.json();
            
            if (data.success && !data.consent) {
                this.showCookieConsentBanner();
            } else if (data.consent) {
                this.consent = data.consent;
            }
        } catch (error) {
            console.error('Failed to check cookie consent:', error);
            this.showCookieConsentBanner();
        }
    }

    /**
     * Save cookie consent
     * @param {Object} consent - Consent preferences
     */
    async saveCookieConsent(consent) {
        try {
            const response = await fetch(`${this.apiBase}/cookie-consent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(consent)
            });

            const data = await response.json();
            
            if (data.success) {
                this.consent = data.consent;
                this.hideCookieConsentBanner();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to save cookie consent:', error);
            return false;
        }
    }

    /**
     * Show cookie consent banner
     */
    showCookieConsentBanner() {
        if (document.getElementById('cookieConsentBanner')) return;

        const banner = document.createElement('div');
        banner.id = 'cookieConsentBanner';
        banner.className = 'cookie-consent-banner';
        banner.innerHTML = `
            <div class="cookie-consent-content">
                <div class="cookie-consent-text">
                    <h5><i class="fas fa-cookie-bite"></i> Cookie Preferences</h5>
                    <p>We use cookies to enhance your experience, analyze site traffic, and personalize content. Choose your preferences below.</p>
                </div>
                <div class="cookie-consent-options">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="functionalCookies" checked disabled>
                        <label class="form-check-label" for="functionalCookies">
                            <strong>Functional</strong> - Required for basic site functionality
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="analyticsCookies">
                        <label class="form-check-label" for="analyticsCookies">
                            <strong>Analytics</strong> - Help us improve our website
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="marketingCookies">
                        <label class="form-check-label" for="marketingCookies">
                            <strong>Marketing</strong> - Personalized content and ads
                        </label>
                    </div>
                </div>
                <div class="cookie-consent-buttons">
                    <button type="button" class="btn btn-outline-secondary" onclick="cookieManager.acceptEssentialOnly()">
                        Essential Only
                    </button>
                    <button type="button" class="btn btn-primary" onclick="cookieManager.acceptSelectedCookies()">
                        Accept Selected
                    </button>
                    <button type="button" class="btn btn-success" onclick="cookieManager.acceptAllCookies()">
                        Accept All
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(banner);
        
        // Show banner with animation
        setTimeout(() => {
            banner.classList.add('show');
        }, 100);
    }

    /**
     * Hide cookie consent banner
     */
    hideCookieConsentBanner() {
        const banner = document.getElementById('cookieConsentBanner');
        if (banner) {
            banner.classList.remove('show');
            setTimeout(() => {
                banner.remove();
            }, 300);
        }
    }

    /**
     * Accept essential cookies only
     */
    async acceptEssentialOnly() {
        await this.saveCookieConsent({
            functional: true,
            analytics: false,
            marketing: false
        });
    }

    /**
     * Accept selected cookies
     */
    async acceptSelectedCookies() {
        const functional = true; // Always required
        const analytics = document.getElementById('analyticsCookies')?.checked || false;
        const marketing = document.getElementById('marketingCookies')?.checked || false;

        await this.saveCookieConsent({
            functional,
            analytics,
            marketing
        });
    }

    /**
     * Accept all cookies
     */
    async acceptAllCookies() {
        await this.saveCookieConsent({
            functional: true,
            analytics: true,
            marketing: true
        });
    }

    // ==================== UTILITY FUNCTIONS ====================

    /**
     * Debounce function to limit API calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Show notification to user
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, error, info)
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show" role="alert">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    /**
     * Get all cookies as an object
     * @returns {Object} All cookies
     */
    getAllCookies() {
        const cookies = {};
        document.cookie.split(';').forEach(cookie => {
            const [name, value] = cookie.trim().split('=');
            if (name && value) {
                cookies[name] = decodeURIComponent(value);
            }
        });
        return cookies;
    }

    /**
     * Clear all cookies (except essential ones)
     */
    clearAllCookies() {
        const cookies = this.getAllCookies();
        const essentialCookies = ['cookie_consent', 'user_preferences'];
        
        Object.keys(cookies).forEach(name => {
            if (!essentialCookies.includes(name)) {
                this.deleteCookie(name);
            }
        });
    }
}

// Initialize cookie manager when DOM is loaded
let cookieManager;
document.addEventListener('DOMContentLoaded', () => {
    cookieManager = new CookieManager();
    
    // Make it globally available
    window.cookieManager = cookieManager;
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CookieManager;
}