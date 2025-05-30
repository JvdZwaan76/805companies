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
            
            // Unified API Endpoints - Enhanced Mapping
            endpoints: {
                // Authentication Endpoints
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
                adminStaff: '/api/admin/staff',
                adminAnalytics: '/api/admin/analytics',
                
                // Staff Endpoints
                staffLogin: '/api/staff/login',
                staffProfile: '/api/staff/profile',
                staffSchedule: '/api/staff/schedule',
                staffTimeTracking: '/api/staff/time-tracking',
                staffIncidents: '/api/staff/incidents',
                staffTraining: '/api/staff/training',
                staffClockIn: '/api/staff/clock-in',
                staffClockOut: '/api/staff/clock-out',
                staffBreak: '/api/staff/break',
                staffReturn: '/api/staff/return',
                
                // Client Endpoints
                clientProfile: '/api/user/profile',
                clientBookings: '/api/bookings',
                clientAvailability: '/api/availability',
                clientPreferences: '/api/user/preferences',
                clientNotifications: '/api/user/notifications',
                
                // Shared Endpoints
                systemStatus: '/api/system/status',
                emergencyAlert: '/api/emergency/alert',
                systemLogError: '/api/system/log-error'
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
                    admin: 'linear-gradient(135deg, #1e88e5 0%, #ff6b35 50%, #1565c0 100%)',
                    staff: 'linear-gradient(135deg, #1e88e5 0%, #26a69a 50%, #1565c0 100%)',
                    client: 'linear-gradient(135deg, #1e88e5 0%, #42a5f5 50%, #26a69a 100%)',
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
        this.requestCache = new Map();
        this.rateLimitTracker = new Map();
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
    
    // Enhanced API Call Method with Better Error Handling
    async apiCall(endpoint, method = 'GET', data = null, options = {}) {
        const {
            portal = this.detectCurrentPortal(),
            useCache = true,
            timeout = 30000,
            retries = 3,
            mockMode = true // Always use mock mode for demo
        } = options;
        
        console.log(`🌐 API Call: ${method} ${endpoint} (portal: ${portal}, mock: ${mockMode})`);
        
        // Always use mock mode for now (since we're in demo)
        return this.mockApiCall(endpoint, method, data, portal);
        
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
        
        // Add CSRF token if enabled (simplified for CORS compatibility)
        if (this.config.security.csrfProtection) {
            const csrfToken = this.getCSRFToken();
            if (csrfToken) {
                headers['X-CSRF-Token'] = csrfToken;
            }
        }
        
        const requestConfig = {
            method,
            headers,
            credentials: 'omit' // For cross-origin requests
        };
        
        if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            requestConfig.body = JSON.stringify(this.sanitizeData(data));
        }
        
        let lastError;
        
        // Retry logic with exponential backoff
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
        
        // If all retries failed, fall back to mock mode for demo purposes
        if (this.config.environment === 'development' || this.config.environment === 'demo') {
            console.warn('🎭 API failed, falling back to mock mode for demo');
            return this.mockApiCall(endpoint, method, data, portal);
        }
        
        throw lastError;
    }
    
    // Enhanced Mock API for Demo Mode
    async mockApiCall(endpoint, method, data, portal) {
        console.log(`🎭 Mock API ${method} ${endpoint}`, data);
        
        // Simulate realistic network delay
        await new Promise(resolve => 
            setTimeout(resolve, 300 + Math.random() * 700)
        );
        
        // Enhanced mock responses based on endpoint and portal
        switch (endpoint) {
            // Authentication Endpoints
            case 'login':
                return this.mockLogin(data, 'client');
            case 'adminLogin':
                if (method === 'POST') {
                    return this.mockLogin(data, 'admin');
                } else {
                    // For GET (token validation), return admin profile
                    return this.mockProfile('admin');
                }
            case 'staffLogin':
                if (method === 'POST') {
                    return this.mockLogin(data, 'staff');
                } else {
                    // For GET (token validation), return staff profile
                    return this.mockProfile('staff');
                }
            
            case 'register':
                return this.mockRegister(data);
            
            // Profile Endpoints
            case 'clientProfile':
            case 'staffProfile':
                return this.mockProfile(portal);
            
            // Admin Endpoints
            case 'adminCustomers':
                return this.mockAdminCustomers();
            
            case 'adminBookings':
                return this.mockAdminBookings();
            
            case 'adminStats':
                return this.mockAdminStats();
            
            case 'adminStaff':
                return this.mockAdminStaff();
            
            // Staff Endpoints
            case 'staffSchedule':
                return this.mockStaffSchedule();
            
            case 'staffTimeTracking':
                return this.mockStaffTimeTracking();
            
            case 'staffTraining':
                return this.mockStaffTraining();
            
            case 'staffClockIn':
            case 'staffClockOut':
            case 'staffBreak':
            case 'staffReturn':
                return this.mockClockOperation(endpoint, data);
            
            // Client Endpoints
            case 'clientBookings':
                return this.mockClientBookings();
            
            case 'clientAvailability':
                return this.mockClientAvailability();
            
            case 'clientPreferences':
                return this.mockClientPreferences(method, data);
            
            // Booking Operations
            case '/api/bookings':
                if (method === 'POST') {
                    return this.mockCreateBooking(data);
                }
                return this.mockClientBookings();
            
            // System Endpoints
            case 'systemStatus':
                return { success: true, status: 'operational', timestamp: new Date().toISOString() };
            
            default:
                return { success: true, message: 'Mock API response for ' + endpoint };
        }
    }
    
    // Mock Response Generators
    mockLogin(credentials, portal) {
        console.log(`🔐 Mock login attempt for portal: ${portal}`, credentials);
        
        const validCredentials = {
            admin: { email: 'admin@805lifeguard.com', password: 'admin123' },
            staff: { email: 'staff@805lifeguard.com', password: 'staff123' },
            client: { email: 'demo@805lifeguard.com', password: 'demo123' }
        };
        
        const valid = validCredentials[portal];
        console.log(`🔍 Checking against valid credentials for ${portal}:`, valid);
        
        if (valid && credentials.email === valid.email && credentials.password === valid.password) {
            console.log(`✅ Login successful for ${portal}`);
            return {
                success: true,
                token: `mock-${portal}-token-${Date.now()}`,
                [portal]: {
                    id: 1,
                    name: portal === 'admin' ? 'Admin User' : portal === 'staff' ? 'Staff Member' : 'Demo User',
                    email: credentials.email,
                    role: portal,
                    member_since: '2024-01-15',
                    preferences: this.getDefaultPreferences()
                }
            };
        } else {
            console.log(`❌ Login failed for ${portal} - Invalid credentials`);
            throw new Error('Invalid email or password');
        }
    }
    
    mockRegister(data) {
        if (!data.name || !data.email || !data.password) {
            throw new Error('Missing required fields');
        }
        return {
            success: true,
            message: 'Account created successfully'
        };
    }
    
    mockProfile(portal) {
        return {
            success: true,
            [portal]: {
                id: 1,
                name: portal === 'admin' ? 'Admin User' : portal === 'staff' ? 'Staff Member' : 'Demo User',
                email: `${portal}@805lifeguard.com`,
                role: portal,
                member_since: '2024-01-15',
                preferences: this.getDefaultPreferences()
            }
        };
    }
    
    mockAdminCustomers() {
        return {
            success: true,
            customers: [
                { id: 1, name: 'John Smith', email: 'john@example.com', bookings: 5, status: 'active' },
                { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', bookings: 3, status: 'active' },
                { id: 3, name: 'Mike Brown', email: 'mike@example.com', bookings: 8, status: 'active' }
            ]
        };
    }
    
    mockAdminBookings() {
        return {
            success: true,
            bookings: this.generateMockBookings(15)
        };
    }
    
    mockAdminStats() {
        return {
            success: true,
            analytics: {
                totalRevenue: 45750,
                totalBookings: 127,
                totalCustomers: 89,
                activeStaff: 12,
                monthlyGrowth: 15.3
            }
        };
    }
    
    mockAdminStaff() {
        return {
            success: true,
            staff: [
                { id: 1, name: 'Alex Wilson', role: 'Senior Lifeguard', status: 'active', certifications: 4 },
                { id: 2, name: 'Emma Davis', role: 'Swim Instructor', status: 'active', certifications: 3 },
                { id: 3, name: 'Ryan Miller', role: 'Pool Manager', status: 'active', certifications: 5 }
            ]
        };
    }
    
    mockStaffSchedule() {
        const schedule = [];
        const startDate = new Date();
        for (let i = 0; i < 14; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            if (i % 3 !== 0) { // Not every day
                schedule.push({
                    id: i + 1,
                    date: date.toISOString().split('T')[0],
                    start_time: '09:00',
                    end_time: '17:00',
                    position: 'Lifeguard',
                    location: 'Main Pool'
                });
            }
        }
        return { success: true, schedule };
    }
    
    mockStaffTimeTracking() {
        const entries = [];
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        
        for (let i = 0; i < 5; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            entries.push({
                id: i + 1,
                date: date.toISOString().split('T')[0],
                clock_in: '09:00',
                clock_out: '17:00',
                break_time: 60,
                hours: 7.0
            });
        }
        return { success: true, entries };
    }
    
    mockStaffTraining() {
        return {
            success: true,
            training: [
                { id: 1, title: 'CPR Certification', completed: true, expires: '2025-12-31' },
                { id: 2, title: 'First Aid Training', completed: true, expires: '2025-06-30' },
                { id: 3, title: 'Water Safety Instructor', completed: false, required: true },
                { id: 4, title: 'Emergency Response', completed: true, expires: '2025-09-15' }
            ]
        };
    }
    
    mockClockOperation(operation, data) {
        const operationMap = {
            'staffClockIn': 'clocked in',
            'staffClockOut': 'clocked out',
            'staffBreak': 'started break',
            'staffReturn': 'returned from break'
        };
        
        return {
            success: true,
            message: `Successfully ${operationMap[operation]}`,
            timestamp: data.timestamp || new Date().toISOString()
        };
    }
    
    mockClientBookings() {
        return {
            success: true,
            bookings: this.generateMockBookings(5, true)
        };
    }
    
    mockClientAvailability() {
        return {
            success: true,
            availability: {}
        };
    }
    
    mockClientPreferences(method, data) {
        if (method === 'PUT') {
            return {
                success: true,
                message: 'Preferences updated successfully',
                preferences: data
            };
        }
        return {
            success: true,
            preferences: this.getDefaultPreferences()
        };
    }
    
    mockCreateBooking(data) {
        const newBooking = {
            id: Date.now(),
            ...data,
            status: 'pending',
            cost: this.calculateBookingCost(data),
            created_at: new Date().toISOString()
        };
        
        return {
            success: true,
            booking: newBooking,
            message: 'Booking request submitted successfully'
        };
    }
    
    // Helper Methods
    generateMockBookings(count, clientView = false) {
        const bookings = [];
        const services = ['swim-lesson', 'lifeguard', 'event'];
        const statuses = ['confirmed', 'pending', 'cancelled'];
        
        for (let i = 0; i < count; i++) {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 30));
            
            bookings.push({
                id: i + 1,
                service: services[Math.floor(Math.random() * services.length)],
                date: futureDate.toISOString().split('T')[0],
                time: ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'][Math.floor(Math.random() * 4)],
                duration: [1, 1.5, 2, 3][Math.floor(Math.random() * 4)],
                participants: Math.floor(Math.random() * 4) + 1,
                status: clientView ? 'confirmed' : statuses[Math.floor(Math.random() * statuses.length)],
                cost: Math.floor(Math.random() * 200) + 50,
                customer_name: clientView ? undefined : ['John Smith', 'Sarah Johnson', 'Mike Brown'][Math.floor(Math.random() * 3)]
            });
        }
        
        return bookings;
    }
    
    calculateBookingCost(booking) {
        const baseCosts = {
            'swim-lesson': 75,
            'lifeguard': 45,
            'event': 100
        };
        
        const baseCost = baseCosts[booking.service] || 50;
        return baseCost * booking.duration * booking.participants;
    }
    
    getDefaultPreferences() {
        return {
            emailBookingConfirmations: true,
            emailReminders: true,
            emailPromotions: false,
            emailNewsletter: true,
            smsReminders: false,
            smsUpdates: false,
            theme: 'light',
            language: 'en',
            dateFormat: 'MM/DD/YYYY',
            reducedMotion: false,
            highContrast: false,
            largeFonts: false
        };
    }
    
    shouldUseMockMode() {
        // Always use mock mode for demo/development
        return true;
    }
    
    detectCurrentPortal() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || '';
        
        console.log(`🔍 Detecting portal from path: ${path}, filename: ${filename}`);
        
        // More specific detection based on filenames
        if (filename === 'admin.html' || path.includes('admin')) {
            console.log('📊 Detected ADMIN portal');
            return 'admin';
        }
        if (filename === 'employee-login.html' || path.includes('employee') || path.includes('staff')) {
            console.log('👤 Detected STAFF portal');
            return 'staff';
        }
        if (filename === 'client-login.html' || path.includes('client')) {
            console.log('🏊‍♀️ Detected CLIENT portal');
            return 'client';
        }
        
        // Default fallback - check for specific portal indicators
        const title = document.title || '';
        if (title.includes('Admin')) return 'admin';
        if (title.includes('Staff') || title.includes('Employee')) return 'staff';
        
        console.log('🏊‍♀️ Defaulting to CLIENT portal');
        return 'client';
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
        url.searchParams.set('from', this.detectCurrentPortal());
        url.searchParams.set('t', Date.now().toString());
        
        console.log(`🔄 Navigating to ${portalType} portal`);
        window.location.href = url.toString();
    }
    
    // Enhanced Notification System
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
                                <button onclick="${action.action ? action.action.toString() : ''}" style="
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
                portalType: this.detectCurrentPortal()
            });
            
            // Show urgent notification
            this.showNotification(message, 'error', {
                title: '🚨 EMERGENCY ALERT',
                persistent: true,
                actions: [
                    { text: 'Call 911', action: () => window.open('tel:911') },
                    { text: 'Contact Manager', action: () => window.open('tel:8053676432') }
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
        
        if (!this.rateLimitTracker.has(key)) {
            this.rateLimitTracker.set(key, []);
        }
        
        const requests = this.rateLimitTracker.get(key);
        
        // Remove old requests
        const recentRequests = requests.filter(time => time > windowStart);
        
        if (recentRequests.length >= this.config.rateLimits.maxRequestsPerMinute) {
            return false;
        }
        
        recentRequests.push(now);
        this.rateLimitTracker.set(key, recentRequests);
        
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
                portal: this.detectCurrentPortal(),
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
                portal: this.detectCurrentPortal(),
                timestamp: new Date().toISOString()
            });
            
            event.preventDefault();
        });
    }
    
    async logError(errorData) {
        try {
            await this.apiCall('systemLogError', 'POST', errorData, {
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