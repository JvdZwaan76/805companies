/**
 * 805 LifeGuard Production Portal System
 * Handles authentication, API calls, notifications, and shared functionality
 * across all portals (admin, client, employee)
 */

class LifeGuardPortalSystem {
    constructor() {
        this.authTokens = {
            admin: null,
            client: null,
            employee: null
        };
        this.apiBaseUrl = this.getApiBaseUrl();
        this.notifications = [];
        this.requestCache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
        
        this.init();
    }

    getApiBaseUrl() {
        // Determine API base URL based on environment
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:8787'; // Local development
        } else {
            // Production - replace with your actual Cloudflare Workers URL
            return 'https://your-worker-name.your-subdomain.workers.dev';
        }
    }

    init() {
        console.log('🌊 Initializing 805 LifeGuard Portal System...');
        
        // Load stored auth tokens
        this.loadStoredTokens();
        
        // Setup notification system
        this.setupNotificationSystem();
        
        // Setup request interceptors
        this.setupRequestInterceptors();
        
        console.log('✅ Portal System initialized successfully');
    }

    loadStoredTokens() {
        try {
            // Use sessionStorage for better security
            const storedTokens = sessionStorage.getItem('lifeguard_auth_tokens');
            if (storedTokens) {
                this.authTokens = { ...this.authTokens, ...JSON.parse(storedTokens) };
            }
        } catch (error) {
            console.error('Error loading stored tokens:', error);
        }
    }

    saveTokens() {
        try {
            sessionStorage.setItem('lifeguard_auth_tokens', JSON.stringify(this.authTokens));
        } catch (error) {
            console.error('Error saving tokens:', error);
        }
    }

    setupRequestInterceptors() {
        // Setup automatic token refresh
        this.tokenRefreshInterval = setInterval(() => {
            this.checkTokenExpiry();
        }, 60000); // Check every minute
    }

    checkTokenExpiry() {
        Object.keys(this.authTokens).forEach(portal => {
            const token = this.authTokens[portal];
            if (token && this.isTokenExpiringSoon(token)) {
                this.refreshToken(portal);
            }
        });
    }

    isTokenExpiringSoon(token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const exp = payload.exp * 1000; // Convert to milliseconds
            const now = Date.now();
            const timeUntilExpiry = exp - now;
            return timeUntilExpiry < 5 * 60 * 1000; // 5 minutes
        } catch (error) {
            return true; // If we can't parse, assume it's expiring
        }
    }

    async refreshToken(portal) {
        try {
            const response = await this.apiCall(`/api/auth/refresh`, 'POST', null, { portal });
            if (response.success && response.token) {
                this.setAuthToken(portal, response.token);
            }
        } catch (error) {
            console.error(`Token refresh failed for ${portal}:`, error);
            this.clearAuthToken(portal);
        }
    }

    // Authentication Management
    setAuthToken(portal, token) {
        this.authTokens[portal] = token;
        this.saveTokens();
        console.log(`🔐 Auth token set for ${portal} portal`);
    }

    getAuthToken(portal) {
        return this.authTokens[portal];
    }

    clearAuthToken(portal) {
        this.authTokens[portal] = null;
        this.saveTokens();
        console.log(`🚪 Auth token cleared for ${portal} portal`);
    }

    clearAllTokens() {
        this.authTokens = { admin: null, client: null, employee: null };
        this.saveTokens();
        console.log('🧹 All auth tokens cleared');
    }

    // Enhanced API Call Management
    async apiCall(endpoint, method = 'GET', data = null, options = {}) {
        console.log(`📡 API Call: ${method} ${endpoint}`, { data: data ? 'present' : 'none', options });

        const portal = options.portal || this.detectPortalFromEndpoint(endpoint);
        
        // Check cache for GET requests
        if (method === 'GET' && options.cache !== false) {
            const cacheKey = `${endpoint}_${JSON.stringify(data)}`;
            const cached = this.getFromCache(cacheKey);
            if (cached) {
                console.log(`📋 Returning cached response for ${endpoint}`);
                return cached;
            }
        }

        try {
            const config = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...this.getAuthHeaders(portal)
                },
                credentials: 'omit' // For CORS
            };

            if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
                config.body = JSON.stringify(data);
            }

            const url = `${this.apiBaseUrl}${endpoint}`;
            console.log(`🌐 Making request to: ${url}`);

            const response = await this.fetchWithTimeout(url, config, 30000);
            
            if (!response.ok) {
                const errorText = await response.text();
                let errorData;
                try {
                    errorData = JSON.parse(errorText);
                } catch {
                    errorData = { message: errorText || `HTTP ${response.status}` };
                }
                throw new Error(errorData.message || `HTTP ${response.status}`);
            }

            const result = await response.json();
            
            // Cache successful GET requests
            if (method === 'GET' && result.success && options.cache !== false) {
                const cacheKey = `${endpoint}_${JSON.stringify(data)}`;
                this.setCache(cacheKey, result);
            }

            console.log(`✅ API ${method} ${endpoint} - Success`);
            return result;
            
        } catch (error) {
            console.error(`❌ API ${method} ${endpoint} - Error:`, error);
            
            // Handle authentication errors
            if (error.message.includes('401') || error.message.includes('Unauthorized')) {
                this.clearAuthToken(portal);
                this.showNotification('Session expired. Please log in again.', 'warning');
                // Redirect to login based on portal
                this.redirectToLogin(portal);
            }
            
            // Handle network errors
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Network error. Please check your connection and try again.');
            }
            
            throw error;
        }
    }

    async fetchWithTimeout(url, config, timeout = 30000) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        try {
            const response = await fetch(url, {
                ...config,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error('Request timeout. Please try again.');
            }
            throw error;
        }
    }

    redirectToLogin(portal) {
        const loginUrls = {
            admin: '/admin.html',
            client: '/client-login.html',
            employee: '/employee-login.html'
        };
        
        setTimeout(() => {
            window.location.href = loginUrls[portal] || '/';
        }, 2000);
    }

    detectPortalFromEndpoint(endpoint) {
        if (endpoint.includes('admin') || endpoint.includes('Admin')) return 'admin';
        if (endpoint.includes('client') || endpoint.includes('Client')) return 'client';
        if (endpoint.includes('employee') || endpoint.includes('staff') || endpoint.includes('Employee')) return 'employee';
        return 'client'; // Default to client
    }

    getAuthHeaders(portal) {
        const token = this.getAuthToken(portal);
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }

    // Cache Management
    getFromCache(key) {
        const cached = this.requestCache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }
        this.requestCache.delete(key);
        return null;
    }

    setCache(key, data) {
        this.requestCache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    clearCache() {
        this.requestCache.clear();
    }

    // Notification System
    setupNotificationSystem() {
        if (!document.getElementById('notification-container')) {
            const container = document.createElement('div');
            container.id = 'notification-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 20000;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }
    }

    showNotification(message, type = 'info', options = {}) {
        const notification = {
            id: `notification_${Date.now()}`,
            message,
            type,
            title: options.title || '',
            subtitle: options.subtitle || '',
            duration: options.duration || 5000,
            actions: options.actions || []
        };

        this.notifications.push(notification);
        this.renderNotification(notification);

        if (notification.duration > 0) {
            setTimeout(() => {
                this.removeNotification(notification.id);
            }, notification.duration);
        }

        console.log(`🔔 Notification: ${type.toUpperCase()} - ${message}`);
    }

    renderNotification(notification) {
        const container = document.getElementById('notification-container');
        if (!container) return;

        const notificationEl = document.createElement('div');
        notificationEl.id = notification.id;
        notificationEl.className = `notification ${notification.type}`;
        notificationEl.style.cssText = `
            background: ${this.getNotificationColor(notification.type)};
            color: white;
            padding: 16px 20px;
            border-radius: 12px;
            margin-bottom: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.12);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
            max-width: 400px;
            pointer-events: auto;
            transform: translateX(100%);
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            position: relative;
            overflow: hidden;
        `;

        let content = '';
        
        if (notification.title) {
            content += `<div style="font-weight: 700; font-size: 16px; margin-bottom: 4px;">${this.escapeHtml(notification.title)}</div>`;
        }
        
        content += `<div style="font-size: 14px; opacity: 0.95;">${this.escapeHtml(notification.message)}</div>`;
        
        if (notification.subtitle) {
            content += `<div style="font-size: 12px; opacity: 0.8; margin-top: 4px;">${this.escapeHtml(notification.subtitle)}</div>`;
        }

        if (notification.actions && notification.actions.length > 0) {
            content += '<div style="margin-top: 12px; display: flex; gap: 8px;">';
            notification.actions.forEach((action, index) => {
                content += `<button onclick="window.notificationActions['${notification.id}_${index}']()" style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); color: white; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; font-weight: 600;">${this.escapeHtml(action.text)}</button>`;
                
                // Store action function globally
                if (!window.notificationActions) window.notificationActions = {};
                window.notificationActions[`${notification.id}_${index}`] = action.action;
            });
            content += '</div>';
        }

        content += `<button onclick="portalSystem.removeNotification('${notification.id}')" style="position: absolute; top: 8px; right: 8px; background: none; border: none; color: rgba(255,255,255,0.8); font-size: 16px; cursor: pointer; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='none'">×</button>`;

        notificationEl.innerHTML = content;
        container.appendChild(notificationEl);

        // Animate in
        requestAnimationFrame(() => {
            notificationEl.style.transform = 'translateX(0)';
        });

        // Add progress bar if duration is set
        if (notification.duration > 0) {
            const progressBar = document.createElement('div');
            progressBar.style.cssText = `
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: rgba(255,255,255,0.3);
                border-radius: 0 0 12px 12px;
                transition: width ${notification.duration}ms linear;
                width: 100%;
            `;
            notificationEl.appendChild(progressBar);

            requestAnimationFrame(() => {
                progressBar.style.width = '0%';
            });
        }
    }

    getNotificationColor(type) {
        switch (type) {
            case 'success': return 'linear-gradient(135deg, rgba(76, 175, 80, 0.95) 0%, rgba(129, 199, 132, 0.95) 100%)';
            case 'error': return 'linear-gradient(135deg, rgba(244, 67, 54, 0.95) 0%, rgba(239, 83, 80, 0.95) 100%)';
            case 'warning': return 'linear-gradient(135deg, rgba(255, 152, 0, 0.95) 0%, rgba(255, 183, 77, 0.95) 100%)';
            case 'info':
            default: return 'linear-gradient(135deg, rgba(30, 136, 229, 0.95) 0%, rgba(66, 165, 245, 0.95) 100%)';
        }
    }

    removeNotification(notificationId) {
        const notificationEl = document.getElementById(notificationId);
        if (notificationEl) {
            notificationEl.style.transform = 'translateX(100%)';
            notificationEl.style.opacity = '0';
            
            setTimeout(() => {
                if (notificationEl.parentNode) {
                    notificationEl.parentNode.removeChild(notificationEl);
                }
            }, 400);
        }

        // Remove from array
        this.notifications = this.notifications.filter(n => n.id !== notificationId);
        
        // Clean up action functions
        if (window.notificationActions) {
            Object.keys(window.notificationActions).forEach(key => {
                if (key.startsWith(notificationId)) {
                    delete window.notificationActions[key];
                }
            });
        }
    }

    // Utility Functions
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    }

    formatDateTime(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        }).format(new Date(date));
    }

    // Data Validation
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validatePhone(phone) {
        const phoneRegex = /^\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})$/;
        return phoneRegex.test(phone);
    }

    // Secure Storage Helpers (for non-auth data)
    setLocalData(key, data) {
        try {
            sessionStorage.setItem(`lifeguard_${key}`, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving local data:', error);
        }
    }

    getLocalData(key) {
        try {
            const data = sessionStorage.getItem(`lifeguard_${key}`);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading local data:', error);
            return null;
        }
    }

    clearLocalData(key) {
        try {
            sessionStorage.removeItem(`lifeguard_${key}`);
        } catch (error) {
            console.error('Error clearing local data:', error);
        }
    }

    // System Health Check
    healthCheck() {
        const health = {
            system: 'LifeGuard Portal System',
            version: '2.0.0',
            status: 'operational',
            timestamp: new Date().toISOString(),
            auth: {
                admin: !!this.getAuthToken('admin'),
                client: !!this.getAuthToken('client'),
                employee: !!this.getAuthToken('employee')
            },
            notifications: this.notifications.length,
            apiBaseUrl: this.apiBaseUrl,
            cacheSize: this.requestCache.size
        };

        console.log('🏥 System Health Check:', health);
        return health;
    }

    // Error Handling
    handleGlobalError(error, context = 'Unknown') {
        console.error(`🚨 Global Error in ${context}:`, error);
        
        this.showNotification(
            'An unexpected error occurred. Please try again or contact support if the issue persists.',
            'error',
            {
                title: 'System Error',
                duration: 8000
            }
        );
    }

    // Cleanup
    destroy() {
        if (this.tokenRefreshInterval) {
            clearInterval(this.tokenRefreshInterval);
        }
        this.clearCache();
        this.clearAllTokens();
        
        // Remove notification container
        const container = document.getElementById('notification-container');
        if (container) {
            container.remove();
        }
        
        console.log('🧹 Portal System destroyed');
    }
}

// Initialize the portal system and make it globally available
window.LifeGuardPortalSystem = new LifeGuardPortalSystem();
window.portalSystem = window.LifeGuardPortalSystem; // Shorthand reference

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LifeGuardPortalSystem;
}

// Global error handling
window.addEventListener('error', (event) => {
    if (window.portalSystem) {
        window.portalSystem.handleGlobalError(event.error, 'Window Error');
    }
});

window.addEventListener('unhandledrejection', (event) => {
    if (window.portalSystem) {
        window.portalSystem.handleGlobalError(event.reason, 'Unhandled Promise');
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.portalSystem) {
        window.portalSystem.destroy();
    }
});

console.log('🌊 805 LifeGuard Production Portal System loaded and ready!');
