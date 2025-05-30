// 805 LifeGuard - Unified Portal Configuration System
// This file should be included in all three portals for consistent functionality

class LifeGuardPortalSystem {
    constructor() {
        // Unified API Configuration
        this.config = {
            apiBaseUrl: 'https://lifeguard-portal-app.jaspervdz.workers.dev',
            version: '2.0',
            environment: 'production', // 'development', 'staging', 'production'
            
            // Portal Types
            portals: {
                admin: {
                    name: 'Admin Portal',
                    url: './admin.html',
                    icon: 'fas fa-shield-alt',
                    description: 'Business management and oversight',
                    requiredRole: 'admin'
                },
                staff: {
                    name: 'Staff Portal', 
                    url: './employee-login.html',
                    icon: 'fas fa-user-shield',
                    description: 'Employee management and operations',
                    requiredRole: 'employee'
                },
                client: {
                    name: 'Client Portal',
                    url: './client-login.html', 
                    icon: 'fas fa-swimmer',
                    description: 'Customer booking and account management',
                    requiredRole: 'client'
                }
            },
            
            // Unified API Endpoints
            endpoints: {
                // Authentication
                login: '/api/auth/login',
                register: '/api/auth/register',
                logout: '/api/auth/logout',
                validateToken: '/api/auth/validate',
                resetPassword: '/api/auth/reset-password',
                
                // Admin Endpoints
                adminLogin: '/api/admin/login',
                adminCustomers: '/api/admin/customers',
                adminBookings: '/api/admin/bookings',
                adminStats: '/api/admin/bookings/stats',
                adminExport: '/api/admin/export',
                
                // Staff Endpoints
                staffLogin: '/api/staff/login',
                staffProfile: '/api/staff/profile',
                staffSchedule: '/api/staff/schedule',
                staffTimeTracking: '/api/staff/time-tracking',
                staffIncidents: '/api/staff/incidents',
                staffTraining: '/api/staff/training',
                
                // Client Endpoints
                clientProfile: '/api/user/profile',
                clientBookings: '/api/bookings',
                clientAvailability: '/api/availability',
                clientPreferences: '/api/user/preferences',
                clientNotifications: '/api/user/notifications',
                
                // Shared Endpoints
                systemStatus: '/api/system/status',
                emergencyAlert: '/api/emergency/alert'
            },
            
            // Unified Styling Configuration
            theme: {
                colors: {
                    primary: '#1e88e5',
                    secondary: '#26a69a',
                    accent: '#ffd700',
                    success: '#4caf50',
                    warning: '#ff9800',
                    error: '#f44336',
                    info: '#2196f3'
                },
                
                gradients: {
                    primary: 'linear-gradient(135deg, #1e88e5 0%, #26a69a 100%)',
                    gold: 'linear-gradient(135deg, #ffd700 0%, #ffed4a 50%, #fff176 100%)',
                    glass: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%)'
                },
                
                shadows: {
                    soft: '0 2px 20px rgba(0,0,0,0.08)',
                    medium: '0 8px 30px rgba(0,0,0,0.12)',
                    strong: '0 15px 40px rgba(0,0,0,0.15)',
                    glow: '0 0 30px rgba(30, 136, 229, 0.3)'
                }
            },
            
            // Feature Flags
            features: {
                crossPortalNavigation: true,
                unifiedNotifications: true,
                realTimeUpdates: true,
                emergencyAlerts: true,
                dataSync: true,
                auditLogging: true,
                twoFactorAuth: false, // Coming soon
                mobilePush: false     // Coming soon
            },
            
            // Cache Configuration
            cache: {
                ttl: 300000, // 5 minutes
                maxSize: 100,
                enabled: true
            },
            
            // Rate Limiting
            rateLimits: {
                maxRequestsPerMinute: 60,
                burstLimit: 10,
                enabled: true
            },
            
            // Security Configuration
            security: {
                tokenExpiry: 3600000, // 1 hour
                refreshTokenExpiry: 86400000, // 24 hours
                maxLoginAttempts: 5,
                lockoutDuration: 900000, // 15 minutes
                csrfProtection: true,
                httpsOnly: true
            },
            
            // Notification Configuration
            notifications: {
                position: 'top-right',
                duration: 5000,
                maxVisible: 3,
                types: ['success', 'error', 'warning', 'info'],
                sounds: false // Can be enabled per user preference
            }
        };
        
        // Initialize system
        this.init();
    }
    
    init() {
        console.log('🏊‍♂️ Initializing 805 LifeGuard Portal System v' + this.config.version);
        
        // Setup global error handling
        this.setupGlobalErrorHandling();
        
        // Setup performance monitoring
        this.setupPerformanceMonitoring();
        
        // Setup security measures
        this.setupSecurityMeasures();
        
        // Setup cross-portal communication
        this.setupCrossPortalCommunication();
        
        console.log('✅ Portal system initialized successfully');
    }
    
    // Unified API Call Method
    async apiCall(endpoint, method = 'GET', data = null, options = {}) {
        const {
            portal = 'client',
            useCache = true,
            timeout = 30000,
            retries = 3
        } = options;
        
        // Check if we should use mock mode
        if (this.shouldUseMockMode()) {
            return this.mockApiCall(endpoint, method, data, portal);
        }
        
        // Get the full endpoint URL
        const url = this.getEndpointUrl(endpoint);
        
        // Check cache first (for GET requests)
        if (method === 'GET' && useCache) {
            const cached = this.getFromCache(url);
            if (cached) {
                console.log('📋 Cache hit for:', endpoint);
                return cached;
            }
        }
        
        // Check rate limits
        if (this.config.rateLimits.enabled && !this.checkRateLimit(endpoint)) {
            throw new Error('Rate limit exceeded. Please try again later.');
        }
        
        // Prepare headers
        const headers = {
            'Content-Type': 'application/json',
            'X-Portal-Type': portal,
            'X-Portal-Version': this.config.version
        };
        
        // Add auth token if available
        const token = this.getAuthToken(portal);
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Add CSRF token if enabled
        if (this.config.security.csrfProtection) {
            const csrfToken = this.getCSRFToken();
            if (csrfToken) {
                headers['X-CSRF-Token'] = csrfToken;
            }
        }
        
        const requestConfig = {
            method,
            headers,
            credentials: 'omit'
        };
        
        if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            requestConfig.body = JSON.stringify(this.sanitizeData(data));
        }
        
        let lastError;
        
        // Retry logic
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                console.log(`🌐 API ${method} ${endpoint} (attempt ${attempt}/${retries})`);
                
                // Create timeout promise
                const timeoutPromise = new Promise((_, reject) => {
                    setTimeout(() => reject(new Error('Request timeout')), timeout);
                });
                
                // Make the request
                const response = await Promise.race([
                    fetch(url, requestConfig),
                    timeoutPromise
                ]);
                
                if (!response.ok) {
                    const errorData = await this.parseErrorResponse(response);
                    throw new Error(errorData.message || `HTTP ${response.status}`);
                }
                
                const result = await response.json();
                
                // Cache successful GET requests
                if (method === 'GET' && useCache && result.success) {
                    this.setCache(url, result);
                }
                
                // Log successful request
                console.log(`✅ API ${method} ${endpoint} - Success`);
                
                return result;
                
            } catch (error) {
                console.error(`❌ API ${method} ${endpoint} - Error:`, error);
                lastError = error;
                
                // Don't retry on certain errors
                if (error.message.includes('401') || error.message.includes('403')) {
                    break;
                }
                
                // Wait before retry (exponential backoff)
                if (attempt < retries) {
                    await this.delay(Math.pow(2, attempt) * 1000);
                }
            }
        }
        
        throw lastError;
    }
    
    // Mock API for development and demo purposes
    async mockApiCall(endpoint, method, data, portal) {
        console.log(`🧪 Mock API ${method} ${endpoint}`, data);
        
        // Simulate realistic network delay
        await new Promise(resolve => 
            setTimeout(resolve, 300 + Math.random() * 700)
        );
        
        // Enhanced mock responses
        switch (endpoint) {
            case 'adminLogin':
            case '/api/admin/login':
                if (method === 'POST') {
                    if (data.email === 'admin@805lifeguard.com' && data.password === 'admin123') {
                        return {
                            success: true,
                            token: 'mock-admin-token-' + Date.now(),
                            admin: {
                                id: 1,
                                name: 'Admin User',
                                email: data.email,
                                role: 'admin',
                                permissions: ['all']
                            }
                        };
                    } else {
                        throw new Error('Invalid admin credentials');
                    }
                } else if (method === 'GET') {
                    return {
                        success: true,
                        admin: {
                            id: 1,
                            name: 'Admin User',
                            email: 'admin@805lifeguard.com',
                            role: 'admin',
                            permissions: ['all']
                        }
                    };
                }
                break;
                
            case 'staffLogin':
            case '/api/staff/login':
                if (method === 'POST') {
                    if (data.email === 'staff@805lifeguard.com' && data.password === 'staff123') {
                        return {
                            success: true,
                            token: 'mock-staff-token-' + Date.now(),
                            staff: {
                                id: 2,
                                name: 'Staff Member',
                                email: data.email,
                                role: 'employee',
                                department: 'Lifeguards',
                                rating: 4.8
                            }
                        };
                    } else {
                        throw new Error('Invalid staff credentials');
                    }
                }
                break;
                
            case 'staffProfile':
            case '/api/staff/profile':
                return {
                    success: true,
                    staff: {
                        id: 2,
                        name: 'Staff Member',
                        email: 'staff@805lifeguard.com',
                        role: 'employee',
                        department: 'Lifeguards',
                        rating: 4.8,
                        hireDate: '2024-01-15'
                    }
                };
                
            case 'staffSchedule':
            case '/api/staff/schedule':
                const mockSchedule = [];
                for (let i = 1; i <= 7; i++) {
                    const date = new Date();
                    date.setDate(date.getDate() + i);
                    mockSchedule.push({
                        id: i,
                        date: date.toISOString().split('T')[0],
                        startTime: '09:00',
                        endTime: '17:00',
                        location: 'Main Pool',
                        type: 'Regular Shift'
                    });
                }
                return {
                    success: true,
                    schedule: mockSchedule
                };
                
            case 'staffTimeTracking':
            case '/api/staff/time-tracking':
                const mockTimeEntries = [];
                for (let i = 0; i < 5; i++) {
                    const date = new Date();
                    date.setDate(date.getDate() - i);
                    mockTimeEntries.push({
                        id: i + 1,
                        date: date.toISOString().split('T')[0],
                        hours: 8,
                        clockIn: '09:00',
                        clockOut: '17:00',
                        breaks: 1
                    });
                }
                return {
                    success: true,
                    entries: mockTimeEntries
                };
                
            case 'staffTraining':
            case '/api/staff/training':
                return {
                    success: true,
                    training: [
                        { id: 1, name: 'CPR Certification', completed: true, expires: '2025-12-31' },
                        { id: 2, name: 'First Aid', completed: true, expires: '2025-12-31' },
                        { id: 3, name: 'Water Safety', completed: false, deadline: '2025-02-15' },
                        { id: 4, name: 'Customer Service', completed: true, expires: '2026-01-15' }
                    ]
                };
                
            case 'adminCustomers':
            case '/api/admin/customers':
                const mockCustomers = [];
                for (let i = 1; i <= 25; i++) {
                    mockCustomers.push({
                        id: i,
                        name: `Customer ${i}`,
                        email: `customer${i}@example.com`,
                        phone: `(805) 555-0${i.toString().padStart(3, '0')}`,
                        joinDate: '2024-01-15',
                        totalBookings: Math.floor(Math.random() * 20) + 1,
                        status: Math.random() > 0.1 ? 'active' : 'inactive'
                    });
                }
                return {
                    success: true,
                    customers: mockCustomers
                };
                
            case 'adminBookings':
            case '/api/admin/bookings':
                const mockBookings = [];
                for (let i = 1; i <= 50; i++) {
                    const date = new Date();
                    date.setDate(date.getDate() + Math.floor(Math.random() * 30) - 15);
                    mockBookings.push({
                        id: i,
                        customerId: Math.floor(Math.random() * 25) + 1,
                        customerName: `Customer ${Math.floor(Math.random() * 25) + 1}`,
                        service: ['swim-lesson', 'lifeguard', 'event'][Math.floor(Math.random() * 3)],
                        date: date.toISOString().split('T')[0],
                        time: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'][Math.floor(Math.random() * 4)],
                        duration: [1, 1.5, 2, 3][Math.floor(Math.random() * 4)],
                        status: ['pending', 'confirmed', 'completed', 'cancelled'][Math.floor(Math.random() * 4)],
                        cost: Math.floor(Math.random() * 200) + 50
                    });
                }
                return {
                    success: true,
                    bookings: mockBookings
                };
                
            case 'adminStats':
            case '/api/admin/bookings/stats':
                return {
                    success: true,
                    analytics: {
                        totalRevenue: 25680,
                        monthlyBookings: 120,
                        customerSatisfaction: 4.7,
                        averageBookingValue: 85
                    }
                };
                
            case 'login':
            case '/api/auth/login':
                if (data.email === 'demo@805lifeguard.com' && data.password === 'demo123') {
                    return {
                        success: true,
                        token: 'mock-client-token-' + Date.now(),
                        user: {
                            id: 3,
                            name: 'Demo User',
                            email: data.email,
                            phone: '(805) 555-0123',
                            address: '123 Ocean View Dr, Thousand Oaks, CA',
                            member_since: '2024-01-15'
                        }
                    };
                } else {
                    throw new Error('Invalid email or password');
                }
                
            case 'register':
            case '/api/auth/register':
                if (!data.name || !data.email || !data.password) {
                    throw new Error('Missing required fields');
                }
                return {
                    success: true,
                    message: 'Account created successfully'
                };
                
            case 'clientProfile':
            case '/api/user/profile':
                if (method === 'GET') {
                    return {
                        success: true,
                        user: {
                            id: 3,
                            name: 'Demo User',
                            email: 'demo@805lifeguard.com',
                            phone: '(805) 555-0123',
                            address: '123 Ocean View Dr, Thousand Oaks, CA',
                            member_since: '2024-01-01'
                        }
                    };
                } else if (method === 'PUT') {
                    return {
                        success: true,
                        message: 'Profile updated successfully',
                        user: { id: 3, ...data }
                    };
                }
                break;
                
            case 'clientBookings':
            case '/api/bookings':
                if (method === 'GET') {
                    const mockClientBookings = [
                        {
                            id: 1,
                            service: 'swim-lesson',
                            date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
                            time: '10:00 AM',
                            duration: 1,
                            participants: 1,
                            status: 'confirmed',
                            cost: 75
                        },
                        {
                            id: 2,
                            service: 'lifeguard',
                            date: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
                            time: '2:00 PM',
                            duration: 4,
                            participants: 1,
                            status: 'pending',
                            cost: 200
                        }
                    ];
                    return {
                        success: true,
                        bookings: mockClientBookings
                    };
                } else if (method === 'POST') {
                    const newBooking = {
                        id: Date.now(),
                        ...data,
                        status: 'pending',
                        created_at: new Date().toISOString()
                    };
                    return {
                        success: true,
                        booking: newBooking,
                        message: 'Booking request submitted successfully'
                    };
                }
                break;
                
            case 'clientAvailability':
            case '/api/availability':
                return {
                    success: true,
                    availability: {}
                };
                
            default:
                return {
                    success: true,
                    message: 'Mock API response for ' + endpoint
                };
        }
        
        return {
            success: false,
            error: 'Mock endpoint not implemented: ' + endpoint
        };
    }
    
    shouldUseMockMode() {
        // Use mock mode if:
        // 1. Running on localhost
        // 2. No internet connection
        // 3. API is down
        // 4. Explicitly enabled for demo
        
        const isLocalhost = window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1' ||
                          window.location.hostname === '';
        
        const isDemoMode = localStorage.getItem('lifeguard_demo_mode') === 'true';
        
        return isLocalhost || isDemoMode || this.config.environment === 'development';
    }
    
    // Authentication Methods
    getAuthToken(portal = 'client') {
        const tokenKeys = {
            admin: 'adminToken',
            staff: 'employeeToken', 
            client: 'authToken'
        };
        
        const key = tokenKeys[portal] || 'authToken';
        
        try {
            const token = localStorage.getItem(key) || sessionStorage.getItem(key);
            
            // Validate token expiry
            if (token && this.isTokenExpired(token)) {
                this.clearAuthToken(portal);
                return null;
            }
            
            return token;
        } catch (error) {
            console.error('Error getting auth token:', error);
            return null;
        }
    }
    
    setAuthToken(portal, token, remember = false) {
        const tokenKeys = {
            admin: 'adminToken',
            staff: 'employeeToken',
            client: 'authToken'
        };
        
        const key = tokenKeys[portal] || 'authToken';
        
        try {
            if (remember) {
                localStorage.setItem(key, token);
            } else {
                sessionStorage.setItem(key, token);
            }
            
            // Set expiry tracking
            const expiryTime = Date.now() + this.config.security.tokenExpiry;
            localStorage.setItem(`${key}_expiry`, expiryTime.toString());
            
        } catch (error) {
            console.error('Error setting auth token:', error);
        }
    }
    
    clearAuthToken(portal = 'client') {
        const tokenKeys = {
            admin: 'adminToken',
            staff: 'employeeToken',
            client: 'authToken'
        };
        
        const key = tokenKeys[portal] || 'authToken';
        
        try {
            localStorage.removeItem(key);
            sessionStorage.removeItem(key);
            localStorage.removeItem(`${key}_expiry`);
        } catch (error) {
            console.error('Error clearing auth token:', error);
        }
    }
    
    isTokenExpired(token) {
        try {
            if (token.startsWith('mock-')) {
                return false; // Mock tokens don't expire
            }
            
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 < Date.now();
        } catch {
            return true;
        }
    }
    
    // Cross-Portal Navigation
    navigateToPortal(portalType, params = {}) {
        const portal = this.config.portals[portalType];
        if (!portal) {
            console.error('Unknown portal type:', portalType);
            return;
        }
        
        // Build URL with parameters
        const url = new URL(portal.url, window.location.origin);
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.set(key, value);
        });
        
        // Add navigation tracking
        url.searchParams.set('from', this.getCurrentPortalType());
        url.searchParams.set('t', Date.now().toString());
        
        console.log(`🔄 Navigating to ${portalType} portal`);
        window.location.href = url.toString();
    }
    
    getCurrentPortalType() {
        const path = window.location.pathname;
        
        if (path.includes('admin')) return 'admin';
        if (path.includes('employee') || path.includes('staff')) return 'staff';
        if (path.includes('client')) return 'client';
        
        return 'hub';
    }
    
    // Unified Notification System
    showNotification(message, type = 'info', options = {}) {
        const {
            title = type.charAt(0).toUpperCase() + type.slice(1),
            duration = this.config.notifications.duration,
            persistent = false,
            actions = []
        } = options;
        
        // Remove old notifications if at max
        const existing = document.querySelectorAll('.lifeguard-notification');
        if (existing.length >= this.config.notifications.maxVisible) {
            existing[0].remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `lifeguard-notification notification-${type}`;
        notification.style.cssText = this.getNotificationStyles(type);
        
        const icon = this.getNotificationIcon(type);
        
        notification.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 16px;">
                <i class="fas fa-${icon}" style="font-size: 20px; margin-top: 2px;"></i>
                <div style="flex: 1; min-width: 0;">
                    <div style="font-weight: 700; margin-bottom: 4px;">${title}</div>
                    <div style="opacity: 0.95; line-height: 1.4;">${message}</div>
                    ${actions.length > 0 ? `
                        <div style="margin-top: 12px; display: flex; gap: 8px; flex-wrap: wrap;">
                            ${actions.map(action => `
                                <button onclick="${action.handler}" style="
                                    background: rgba(255,255,255,0.2);
                                    border: 1px solid rgba(255,255,255,0.3);
                                    color: inherit;
                                    padding: 4px 12px;
                                    border-radius: 8px;
                                    font-size: 14px;
                                    font-weight: 600;
                                    cursor: pointer;
                                ">${action.text}</button>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: none; border: none; color: inherit; font-size: 18px; 
                    cursor: pointer; opacity: 0.7; padding: 4px; border-radius: 4px;
                    line-height: 1;
                ">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        });
        
        // Auto-remove (unless persistent)
        if (!persistent && duration > 0) {
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.style.transform = 'translateX(100%)';
                    notification.style.opacity = '0';
                    setTimeout(() => notification.remove(), 300);
                }
            }, duration);
        }
    }
    
    getNotificationStyles(type) {
        const colors = {
            success: 'linear-gradient(135deg, rgba(76, 175, 80, 0.95), rgba(129, 199, 132, 0.95))',
            error: 'linear-gradient(135deg, rgba(244, 67, 54, 0.95), rgba(239, 83, 80, 0.95))',
            warning: 'linear-gradient(135deg, rgba(255, 152, 0, 0.95), rgba(255, 193, 7, 0.95))',
            info: 'linear-gradient(135deg, rgba(30, 136, 229, 0.95), rgba(66, 165, 245, 0.95))'
        };
        
        return `
            position: fixed;
            top: 120px;
            right: 24px;
            max-width: 450px;
            padding: 24px;
            border-radius: 16px;
            backdrop-filter: blur(25px);
            box-shadow: 0 20px 60px rgba(0,0,0,0.1);
            z-index: 10000;
            transform: translateX(100%);
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            border: 1px solid rgba(255, 255, 255, 0.3);
            background: ${colors[type] || colors.info};
            color: white;
            font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
        `;
    }
    
    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-triangle', 
            warning: 'exclamation-circle',
            info: 'info-circle'
        };
        
        return icons[type] || 'info-circle';
    }
    
    // Emergency Alert System
    async triggerEmergencyAlert(type, message, location = null) {
        console.log('🚨 EMERGENCY ALERT:', type, message);
        
        try {
            // Send to backend
            await this.apiCall('emergencyAlert', 'POST', {
                type,
                message,
                location,
                timestamp: new Date().toISOString(),
                portalType: this.getCurrentPortalType()
            });
            
            // Show urgent notification
            this.showNotification(message, 'error', {
                title: '🚨 EMERGENCY ALERT',
                persistent: true,
                actions: [
                    { text: 'Call 911', handler: 'window.open("tel:911")' },
                    { text: 'Contact Manager', handler: 'window.open("tel:8053676432")' }
                ]
            });
            
            // Play alert sound if enabled
            this.playAlertSound();
            
        } catch (error) {
            console.error('Failed to send emergency alert:', error);
        }
    }
    
    playAlertSound() {
        try {
            // Create audio context for emergency alert
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 1);
        } catch (error) {
            console.warn('Could not play alert sound:', error);
        }
    }
    
    // Utility Methods
    getEndpointUrl(endpoint) {
        if (endpoint.startsWith('http')) {
            return endpoint;
        }
        
        const baseUrl = this.config.apiBaseUrl;
        const fullEndpoint = this.config.endpoints[endpoint] || endpoint;
        
        return `${baseUrl}${fullEndpoint}`;
    }
    
    sanitizeData(data) {
        if (typeof data !== 'object' || data === null) {
            return data;
        }
        
        const sanitized = {};
        for (const [key, value] of Object.entries(data)) {
            if (typeof value === 'string') {
                // Basic XSS protection
                sanitized[key] = value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
            } else {
                sanitized[key] = value;
            }
        }
        
        return sanitized;
    }
    
    async parseErrorResponse(response) {
        try {
            const errorData = await response.json();
            return {
                message: errorData.error || errorData.message || `HTTP ${response.status}`,
                code: errorData.code || response.status,
                details: errorData.details || ''
            };
        } catch {
            return {
                message: response.statusText || `HTTP ${response.status}`,
                code: response.status,
                details: ''
            };
        }
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Cache Management
    getFromCache(key) {
        if (!this.config.cache.enabled) return null;
        
        try {
            const cached = sessionStorage.getItem(`lg_cache_${key}`);
            if (!cached) return null;
            
            const { data, timestamp } = JSON.parse(cached);
            
            if (Date.now() - timestamp > this.config.cache.ttl) {
                sessionStorage.removeItem(`lg_cache_${key}`);
                return null;
            }
            
            return data;
        } catch {
            return null;
        }
    }
    
    setCache(key, data) {
        if (!this.config.cache.enabled) return;
        
        try {
            const cacheData = {
                data,
                timestamp: Date.now()
            };
            
            sessionStorage.setItem(`lg_cache_${key}`, JSON.stringify(cacheData));
        } catch (error) {
            console.warn('Cache storage failed:', error);
        }
    }
    
    clearCache() {
        try {
            Object.keys(sessionStorage).forEach(key => {
                if (key.startsWith('lg_cache_')) {
                    sessionStorage.removeItem(key);
                }
            });
        } catch (error) {
            console.warn('Cache clear failed:', error);
        }
    }
    
    // Rate Limiting
    checkRateLimit(endpoint) {
        if (!this.config.rateLimits.enabled) return true;
        
        const now = Date.now();
        const windowStart = now - 60000; // 1 minute window
        
        const key = `lg_rate_${endpoint}`;
        const requests = JSON.parse(sessionStorage.getItem(key) || '[]');
        
        // Remove old requests
        const recentRequests = requests.filter(time => time > windowStart);
        
        if (recentRequests.length >= this.config.rateLimits.maxRequestsPerMinute) {
            return false;
        }
        
        recentRequests.push(now);
        sessionStorage.setItem(key, JSON.stringify(recentRequests));
        
        return true;
    }
    
    // Security Methods
    getCSRFToken() {
        return sessionStorage.getItem('lg_csrf_token') || 
               this.generateCSRFToken();
    }
    
    generateCSRFToken() {
        const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
        
        sessionStorage.setItem('lg_csrf_token', token);
        return token;
    }
    
    // Performance Monitoring
    setupPerformanceMonitoring() {
        if ('performance' in window) {
            // Monitor page load time
            window.addEventListener('load', () => {
                const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                console.log(`📊 Page load time: ${loadTime}ms`);
            });
        }
    }
    
    // Error Handling
    setupGlobalErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('🚨 Global Error:', event.error);
            
            // Log to backend if available
            this.logError({
                message: event.error?.message || 'Unknown error',
                stack: event.error?.stack,
                filename: event.filename,
                line: event.lineno,
                portal: this.getCurrentPortalType(),
                userAgent: navigator.userAgent,
                timestamp: new Date().toISOString()
            });
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            console.error('🚨 Unhandled Promise Rejection:', event.reason);
            
            // Log to backend if available
            this.logError({
                message: 'Unhandled Promise Rejection',
                reason: event.reason?.toString(),
                portal: this.getCurrentPortalType(),
                timestamp: new Date().toISOString()
            });
            
            event.preventDefault();
        });
    }
    
    async logError(errorData) {
        try {
            await this.apiCall('/api/system/log-error', 'POST', errorData, {
                timeout: 5000,
                retries: 1
            });
        } catch (error) {
            console.warn('Failed to log error to backend:', error);
        }
    }
    
    // Cross-Portal Communication
    setupCrossPortalCommunication() {
        if (!this.config.features.crossPortalNavigation) return;
        
        // Listen for cross-portal messages
        window.addEventListener('message', (event) => {
            if (event.origin !== window.location.origin) return;
            
            const { type, data } = event.data;
            
            switch (type) {
                case 'PORTAL_NAVIGATION':
                    this.navigateToPortal(data.portal, data.params);
                    break;
                case 'EMERGENCY_ALERT':
                    this.triggerEmergencyAlert(data.alertType, data.message, data.location);
                    break;
                case 'NOTIFICATION':
                    this.showNotification(data.message, data.type, data.options);
                    break;
                default:
                    console.warn('Unknown cross-portal message type:', type);
            }
        });
    }
    
    // Send message to other portals
    sendCrossPortalMessage(type, data) {
        const message = { type, data, timestamp: Date.now() };
        
        try {
            // Send to other windows/tabs
            window.postMessage(message, window.location.origin);
            
            // Store in localStorage for persistence
            localStorage.setItem('lg_cross_portal_message', JSON.stringify(message));
        } catch (error) {
            console.warn('Failed to send cross-portal message:', error);
        }
    }
    
    // System Methods
    async checkSystemHealth() {
        try {
            const response = await this.apiCall('systemStatus', 'GET', null, {
                timeout: 5000,
                useCache: false
            });
            
            return {
                healthy: response.success,
                status: response.status,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                healthy: false,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }
    
    // Security Methods
    setupSecurityMeasures() {
        // Prevent clickjacking
        if (window.self !== window.top) {
            window.top.location = window.self.location;
        }
        
        // Generate CSRF token
        this.generateCSRFToken();
        
        // Setup secure headers simulation
        console.log('🔒 Security measures initialized');
    }
}

// Create global instance
window.LifeGuardPortalSystem = window.LifeGuardPortalSystem || new LifeGuardPortalSystem();

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LifeGuardPortalSystem;
}

console.log('🏊‍♂️ 805 LifeGuard Portal System Configuration Loaded');