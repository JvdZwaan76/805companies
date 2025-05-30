/**
 * 805 LifeGuard Unified Portal System
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
        this.apiBaseUrl = '/api';
        this.mockMode = true; // Enable mock mode for demonstration
        this.notifications = [];
        
        this.init();
    }

    init() {
        console.log('🌊 Initializing 805 LifeGuard Portal System...');
        
        // Load stored auth tokens
        this.loadStoredTokens();
        
        // Setup notification system
        this.setupNotificationSystem();
        
        console.log('✅ Portal System initialized successfully');
    }

    loadStoredTokens() {
        try {
            // Note: Using sessionStorage instead of localStorage for demo
            // In production, you might want to use secure token storage
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

    // API Call Management
    async apiCall(endpoint, method = 'GET', data = null, options = {}) {
        console.log(`📡 API Call: ${method} ${endpoint}`, { data, options });

        // Determine portal type from endpoint or options
        const portal = options.portal || this.detectPortalFromEndpoint(endpoint);
        
        // Use mock mode for demonstration
        if (this.mockMode || options.mockMode) {
            return await this.mockApiCall(endpoint, method, data, portal);
        }

        // Real API call implementation
        try {
            const config = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeaders(portal)
                }
            };

            if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
                config.body = JSON.stringify(data);
            }

            const response = await fetch(`${this.apiBaseUrl}${endpoint}`, config);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API call failed:', error);
            throw error;
        }
    }

    detectPortalFromEndpoint(endpoint) {
        if (endpoint.includes('admin') || endpoint.includes('Admin')) return 'admin';
        if (endpoint.includes('client') || endpoint.includes('Client')) return 'client';
        if (endpoint.includes('employee') || endpoint.includes('staff') || endpoint.includes('Employee')) return 'employee';
        return 'admin'; // Default to admin
    }

    getAuthHeaders(portal) {
        const token = this.getAuthToken(portal);
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }

    // Mock API Implementation for Demo
    async mockApiCall(endpoint, method, data, portal) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));

        console.log(`🎭 Mock API: ${method} ${endpoint} for ${portal} portal`);

        // Mock authentication endpoints
        if (endpoint === 'adminLogin' || endpoint.includes('admin/login')) {
            return this.mockAdminLogin(method, data);
        }

        if (endpoint === 'clientLogin' || endpoint.includes('client/login')) {
            return this.mockClientLogin(method, data);
        }

        if (endpoint === 'employeeLogin' || endpoint.includes('employee/login')) {
            return this.mockEmployeeLogin(method, data);
        }

        // Mock data endpoints
        if (endpoint === 'adminCustomers') {
            return { success: true, customers: this.generateMockCustomers() };
        }

        if (endpoint === 'adminBookings') {
            return { success: true, bookings: this.generateMockBookings() };
        }

        if (endpoint === 'adminStats') {
            return { success: true, analytics: this.generateMockAnalytics() };
        }

        if (endpoint.includes('/api/admin/staff')) {
            return { success: true, staff: this.generateMockStaff() };
        }

        // Default success response
        return { success: true, message: 'Mock API call successful' };
    }

    mockAdminLogin(method, data) {
        if (method === 'GET') {
            // Token validation
            const token = this.getAuthToken('admin');
            if (token) {
                return {
                    success: true,
                    admin: {
                        id: 'admin_1',
                        name: 'System Administrator',
                        email: 'admin@805lifeguard.com',
                        role: 'admin'
                    }
                };
            }
            return { success: false, error: 'Invalid token' };
        }

        if (method === 'POST') {
            // Mock login validation - accept any email/password for demo
            if (data.email && data.password) {
                const mockToken = `admin_token_${Date.now()}`;
                return {
                    success: true,
                    token: mockToken,
                    admin: {
                        id: 'admin_1',
                        name: 'System Administrator',
                        email: data.email,
                        role: 'admin'
                    }
                };
            }
            return { success: false, error: 'Invalid credentials' };
        }

        return { success: false, error: 'Method not supported' };
    }

    mockClientLogin(method, data) {
        if (method === 'POST') {
            if (data.email && data.password) {
                const mockToken = `client_token_${Date.now()}`;
                return {
                    success: true,
                    token: mockToken,
                    client: {
                        id: 'client_1',
                        name: 'John Smith',
                        email: data.email,
                        plan: 'premium'
                    }
                };
            }
            return { success: false, error: 'Invalid credentials' };
        }
        return { success: false, error: 'Method not supported' };
    }

    mockEmployeeLogin(method, data) {
        if (method === 'POST') {
            if (data.email && data.password) {
                const mockToken = `employee_token_${Date.now()}`;
                return {
                    success: true,
                    token: mockToken,
                    employee: {
                        id: 'employee_1',
                        name: 'Alex Thompson',
                        email: data.email,
                        role: 'lifeguard'
                    }
                };
            }
            return { success: false, error: 'Invalid credentials' };
        }
        return { success: false, error: 'Method not supported' };
    }

    generateMockCustomers() {
        // This will be populated by the admin portal's generateSampleCustomers method
        // Return empty array here as placeholder
        return [];
    }

    generateMockBookings() {
        // This will be populated by the admin portal's generateSampleBookings method
        // Return empty array here as placeholder
        return [];
    }

    generateMockStaff() {
        // This will be populated by the admin portal's generateSampleStaff method
        // Return empty array here as placeholder
        return [];
    }

    generateMockAnalytics() {
        return {
            totalRevenue: 125000,
            monthlyRevenue: 15000,
            totalCustomers: 47,
            activeCustomers: 38,
            totalBookings: 156,
            completedBookings: 142,
            pendingBookings: 8,
            cancelledBookings: 6,
            averageBookingValue: 175,
            customerSatisfaction: 94
        };
    }

    // Notification System
    setupNotificationSystem() {
        // Create notification container if it doesn't exist
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

        // Auto-remove notification
        setTimeout(() => {
            this.removeNotification(notification.id);
        }, notification.duration);

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
            content += `<div style="font-weight: 700; font-size: 16px; margin-bottom: 4px;">${notification.title}</div>`;
        }
        
        content += `<div style="font-size: 14px; opacity: 0.95;">${notification.message}</div>`;
        
        if (notification.subtitle) {
            content += `<div style="font-size: 12px; opacity: 0.8; margin-top: 4px;">${notification.subtitle}</div>`;
        }

        if (notification.actions && notification.actions.length > 0) {
            content += '<div style="margin-top: 12px; display: flex; gap: 8px;">';
            notification.actions.forEach(action => {
                content += `<button onclick="${action.action}" style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); color: white; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; font-weight: 600;">${action.text}</button>`;
            });
            content += '</div>';
        }

        // Add close button
        content += `<button onclick="portalSystem.removeNotification('${notification.id}')" style="position: absolute; top: 8px; right: 8px; background: none; border: none; color: rgba(255,255,255,0.8); font-size: 16px; cursor: pointer; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='none'">×</button>`;

        notificationEl.innerHTML = content;
        container.appendChild(notificationEl);

        // Animate in
        requestAnimationFrame(() => {
            notificationEl.style.transform = 'translateX(0)';
        });

        // Add progress bar
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

        // Animate progress bar
        requestAnimationFrame(() => {
            progressBar.style.width = '0%';
        });
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
    }

    // Utility Functions
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

    // Local Storage Helpers (for non-auth data)
    setLocalData(key, data) {
        try {
            localStorage.setItem(`lifeguard_${key}`, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving local data:', error);
        }
    }

    getLocalData(key) {
        try {
            const data = localStorage.getItem(`lifeguard_${key}`);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading local data:', error);
            return null;
        }
    }

    clearLocalData(key) {
        try {
            localStorage.removeItem(`lifeguard_${key}`);
        } catch (error) {
            console.error('Error clearing local data:', error);
        }
    }

    // System Health Check
    healthCheck() {
        const health = {
            system: 'LifeGuard Portal System',
            version: '1.0.0',
            status: 'operational',
            timestamp: new Date().toISOString(),
            auth: {
                admin: !!this.getAuthToken('admin'),
                client: !!this.getAuthToken('client'),
                employee: !!this.getAuthToken('employee')
            },
            notifications: this.notifications.length,
            mockMode: this.mockMode
        };

        console.log('🏥 System Health Check:', health);
        return health;
    }
}

// Initialize the portal system and make it globally available
window.LifeGuardPortalSystem = new LifeGuardPortalSystem();
window.portalSystem = window.LifeGuardPortalSystem; // Shorthand reference

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LifeGuardPortalSystem;
}

console.log('🌊 805 LifeGuard Portal System loaded and ready!');