/**
 * 805 LifeGuard - Luxury Estate Theme Scripts
 * Production-ready JavaScript for luxury aquatic services website
 * Compatible with Cloudflare Workers and D1 Database
 */

class LuxuryWebsite {
    constructor() {
        this.config = {
            // API Configuration
            api: {
                baseUrl: '/api', // Cloudflare Worker endpoints
                timeout: 10000,
                retryAttempts: 3
            },
            
            // Animation & UI Configuration
            ui: {
                scrollOffset: 100,
                transitionDuration: 400,
                debounceDelay: 250
            },
            
            // Feature Flags
            features: {
                analytics: true,
                loadingStates: true,
                mobileMenu: true,
                formValidation: true
            }
        };
        
        this.state = {
            isLoading: false,
            currentPage: this.getCurrentPage(),
            isMobile: window.innerWidth <= 768,
            scrollPosition: 0
        };
        
        this.init();
    }
    
    /**
     * Initialize all website functionality
     */
    init() {
        this.bindEvents();
        this.initializeComponents();
        this.setupAccessibility();
        
        // Log initialization for debugging
        console.log('805 LifeGuard - Luxury Website Initialized', {
            page: this.state.currentPage,
            isMobile: this.state.isMobile,
            timestamp: new Date().toISOString()
        });
    }
    
    /**
     * Bind all event listeners
     */
    bindEvents() {
        // DOM Content Loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
        } else {
            this.onDOMReady();
        }
        
        // Window Events
        window.addEventListener('scroll', this.debounce(() => this.handleScroll(), this.config.ui.debounceDelay));
        window.addEventListener('resize', this.debounce(() => this.handleResize(), this.config.ui.debounceDelay));
        window.addEventListener('load', () => this.handleWindowLoad());
        
        // Before Unload (for unsaved forms)
        window.addEventListener('beforeunload', (e) => this.handleBeforeUnload(e));
    }
    
    /**
     * Handle DOM ready event
     */
    onDOMReady() {
        this.initHeader();
        this.initNavigation();
        this.initForms();
        this.initAnimations();
        this.initServiceNavigation();
        this.setupIntersectionObserver();
        
        // Page-specific initialization
        this.initPageSpecific();
    }
    
    /**
     * Initialize header functionality
     */
    initHeader() {
        const header = document.querySelector('.header');
        if (!header) return;
        
        // Initial header state
        this.updateHeaderState();
        
        // Mobile menu toggle
        this.initMobileMenu();
    }
    
    /**
     * Handle scroll events
     */
    handleScroll() {
        this.state.scrollPosition = window.pageYOffset;
        this.updateHeaderState();
        this.updateScrollIndicator();
    }
    
    /**
     * Update header appearance based on scroll position
     */
    updateHeaderState() {
        const header = document.querySelector('.header');
        if (!header) return;
        
        if (this.state.scrollPosition > this.config.ui.scrollOffset) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    /**
     * Initialize mobile menu
     */
    initMobileMenu() {
        if (!this.config.features.mobileMenu) return;
        
        // Create mobile menu toggle if it doesn't exist
        this.createMobileMenuToggle();
        
        const toggle = document.querySelector('.mobile-menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (toggle && navLinks) {
            toggle.addEventListener('click', () => this.toggleMobileMenu());
        }
    }
    
    /**
     * Create mobile menu toggle button
     */
    createMobileMenuToggle() {
        const navbar = document.querySelector('.navbar');
        if (!navbar || document.querySelector('.mobile-menu-toggle')) return;
        
        const toggle = document.createElement('button');
        toggle.className = 'mobile-menu-toggle';
        toggle.innerHTML = `
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
        `;
        toggle.setAttribute('aria-label', 'Toggle mobile menu');
        
        // Add mobile menu styles
        this.addMobileMenuStyles();
        
        navbar.appendChild(toggle);
    }
    
    /**
     * Add mobile menu styles dynamically
     */
    addMobileMenuStyles() {
        if (document.querySelector('#mobile-menu-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'mobile-menu-styles';
        styles.textContent = `
            .mobile-menu-toggle {
                display: none;
                flex-direction: column;
                background: none;
                border: none;
                cursor: pointer;
                padding: 10px;
            }
            
            .hamburger-line {
                width: 25px;
                height: 3px;
                background: var(--primary-navy);
                margin: 3px 0;
                transition: var(--transition-smooth);
                border-radius: 2px;
            }
            
            @media (max-width: 768px) {
                .mobile-menu-toggle {
                    display: flex;
                }
                
                .nav-links {
                    position: fixed;
                    top: 100%;
                    left: 0;
                    width: 100%;
                    background: var(--pearl-white);
                    flex-direction: column;
                    padding: 20px;
                    box-shadow: var(--shadow-luxury);
                    transform: translateX(-100%);
                    transition: var(--transition-luxury);
                    z-index: 999;
                }
                
                .nav-links.mobile-open {
                    transform: translateX(0);
                }
                
                .mobile-menu-toggle.active .hamburger-line:nth-child(1) {
                    transform: rotate(45deg) translate(5px, 5px);
                }
                
                .mobile-menu-toggle.active .hamburger-line:nth-child(2) {
                    opacity: 0;
                }
                
                .mobile-menu-toggle.active .hamburger-line:nth-child(3) {
                    transform: rotate(-45deg) translate(7px, -6px);
                }
            }
        `;
        
        document.head.appendChild(styles);
    }
    
    /**
     * Toggle mobile menu
     */
    toggleMobileMenu() {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (toggle && navLinks) {
            toggle.classList.toggle('active');
            navLinks.classList.toggle('mobile-open');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = navLinks.classList.contains('mobile-open') ? 'hidden' : '';
        }
    }
    
    /**
     * Initialize smooth scrolling navigation
     */
    initNavigation() {
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.handleAnchorClick(e));
        });
        
        // Active navigation state
        this.updateActiveNavigation();
    }
    
    /**
     * Handle anchor link clicks with smooth scrolling
     */
    handleAnchorClick(e) {
        e.preventDefault();
        
        const targetId = e.currentTarget.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            // Close mobile menu if open
            this.closeMobileMenu();
            
            // Calculate offset for fixed header
            const headerHeight = document.querySelector('.header')?.offsetHeight || 110;
            const targetPosition = target.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Update URL without triggering page reload
            history.pushState(null, null, targetId);
        }
    }
    
    /**
     * Close mobile menu
     */
    closeMobileMenu() {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (toggle && navLinks) {
            toggle.classList.remove('active');
            navLinks.classList.remove('mobile-open');
            document.body.style.overflow = '';
        }
    }
    
    /**
     * Initialize form handling
     */
    initForms() {
        // Contact forms
        document.querySelectorAll('#consultationForm, #loginForm').forEach(form => {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        });
        
        // Real-time validation
        if (this.config.features.formValidation) {
            this.initFormValidation();
        }
        
        // Forgot password links
        document.querySelectorAll('#forgotPasswordLink').forEach(link => {
            link.addEventListener('click', (e) => this.handleForgotPassword(e));
        });
    }
    
    /**
     * Handle form submissions
     */
    async handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formType = form.id;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn?.innerHTML;
        
        if (this.state.isLoading) return;
        
        try {
            this.state.isLoading = true;
            this.showLoadingState(submitBtn, formType);
            
            const formData = new FormData(form);
            const data = this.serializeFormData(formData, formType);
            
            let result;
            
            switch (formType) {
                case 'loginForm':
                    result = await this.handleLogin(data);
                    break;
                case 'consultationForm':
                    result = await this.handleConsultation(data);
                    break;
                default:
                    throw new Error('Unknown form type');
            }
            
            this.handleFormSuccess(form, result, formType);
            
        } catch (error) {
            console.error(`Form submission error (${formType}):`, error);
            this.handleFormError(form, error.message, formType);
        } finally {
            this.state.isLoading = false;
            this.hideLoadingState(submitBtn, originalText);
        }
    }
    
    /**
     * Serialize form data with additional metadata
     */
    serializeFormData(formData, formType) {
        const data = Object.fromEntries(formData);
        
        // Add metadata
        data.timestamp = new Date().toISOString();
        data.source = formType;
        data.userAgent = navigator.userAgent;
        data.page = this.state.currentPage;
        
        return data;
    }
    
    /**
     * Handle login form submission
     */
    async handleLogin(data) {
        // Demo credentials check
        if (data.email === 'demo@estate.com' && data.password === 'luxury2025') {
            // Simulate API delay
            await this.delay(2000);
            
            // Store session
            localStorage.setItem('805lg_demo_session', 'true');
            if (data.remember) {
                localStorage.setItem('805lg_remember', 'true');
            }
            
            return {
                success: true,
                message: 'Welcome back! Redirecting to your luxury dashboard...',
                redirect: true
            };
        }
        
        // In production, make API call to Cloudflare Worker
        /*
        const response = await this.apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        
        if (response.success) {
            localStorage.setItem('805lg_token', response.token);
            if (data.remember) {
                localStorage.setItem('805lg_remember', 'true');
            }
        }
        
        return response;
        */
        
        throw new Error('Invalid credentials. Please use the demo credentials provided above.');
    }
    
    /**
     * Handle consultation form submission
     */
    async handleConsultation(data) {
        // Simulate API delay
        await this.delay(2000);
        
        // In production, send to Cloudflare D1 via Worker
        /*
        return await this.apiCall('/consultation', {
            method: 'POST',
            body: JSON.stringify(data)
        });
        */
        
        // Demo response
        return {
            success: true,
            message: 'Thank you for your inquiry. A member of our concierge team will contact you within 4 business hours.'
        };
    }
    
    /**
     * Make API calls to Cloudflare Workers
     */
    async apiCall(endpoint, options = {}) {
        const url = `${this.config.api.baseUrl}${endpoint}`;
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: this.config.api.timeout
        };
        
        const mergedOptions = { ...defaultOptions, ...options };
        
        // Add retry logic
        for (let attempt = 1; attempt <= this.config.api.retryAttempts; attempt++) {
            try {
                const response = await fetch(url, mergedOptions);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                return await response.json();
                
            } catch (error) {
                console.warn(`API call attempt ${attempt} failed:`, error);
                
                if (attempt === this.config.api.retryAttempts) {
                    throw error;
                }
                
                // Exponential backoff
                await this.delay(Math.pow(2, attempt) * 1000);
            }
        }
    }
    
    /**
     * Show loading state
     */
    showLoadingState(button, formType) {
        if (!this.config.features.loadingStates || !button) return;
        
        const loadingText = formType === 'loginForm' ? 
            '<i class="fas fa-spinner fa-spin"></i> Authenticating...' :
            '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        button.innerHTML = loadingText;
        button.disabled = true;
        
        // Show overlay for login
        if (formType === 'loginForm') {
            const overlay = document.getElementById('loadingOverlay');
            if (overlay) {
                overlay.style.display = 'flex';
            }
        }
    }
    
    /**
     * Hide loading state
     */
    hideLoadingState(button, originalText) {
        if (!button) return;
        
        button.innerHTML = originalText;
        button.disabled = false;
        
        // Hide overlay
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }
    
    /**
     * Handle form success
     */
    handleFormSuccess(form, result, formType) {
        this.showMessage(result.message, 'success', formType);
        
        if (formType === 'consultationForm') {
            form.reset();
        }
        
        if (result.redirect) {
            setTimeout(() => {
                if (formType === 'loginForm') {
                    this.createDashboardPreview();
                }
            }, 2000);
        }
    }
    
    /**
     * Handle form errors
     */
    handleFormError(form, message, formType) {
        const errorMessage = message || 'An error occurred. Please try again.';
        this.showMessage(errorMessage, 'error', formType);
    }
    
    /**
     * Show message alerts
     */
    showMessage(message, type, context = '') {
        const messageDiv = document.getElementById('message-alert') || 
                          document.getElementById('form-message');
        
        if (!messageDiv) {
            console.warn('Message container not found');
            return;
        }
        
        const icon = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-triangle',
            warning: 'fas fa-info-circle'
        }[type] || 'fas fa-info-circle';
        
        messageDiv.innerHTML = `<i class="${icon}"></i> ${message}`;
        messageDiv.className = `message-alert ${type} show`;
        
        // Auto-hide non-success messages
        if (type !== 'success') {
            setTimeout(() => {
                messageDiv.classList.remove('show');
            }, 5000);
        }
        
        // Smooth scroll to message
        messageDiv.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest' 
        });
    }
    
    /**
     * Handle forgot password
     */
    handleForgotPassword(e) {
        e.preventDefault();
        
        const emailInput = document.getElementById('email');
        const email = emailInput?.value;
        
        if (!email) {
            this.showMessage('Please enter your email address first, then click "Forgot password?"', 'warning');
            emailInput?.focus();
            return;
        }
        
        // Simulate password reset
        this.showMessage(`Password reset link has been sent to ${email}. Please check your inbox.`, 'success');
        
        // Log for manual processing in demo
        console.log('Password reset requested for:', email);
    }
    
    /**
     * Initialize service navigation (for services page)
     */
    initServiceNavigation() {
        const serviceNavLinks = document.querySelectorAll('.service-nav-link');
        const serviceSections = document.querySelectorAll('.service-section');
        
        if (serviceNavLinks.length === 0 || serviceSections.length === 0) return;
        
        // Set up intersection observer for active states
        const observer = new IntersectionObserver(
            (entries) => this.handleServiceSectionIntersection(entries, serviceNavLinks),
            {
                threshold: 0.3,
                rootMargin: '-150px 0px -150px 0px'
            }
        );
        
        serviceSections.forEach(section => observer.observe(section));
    }
    
    /**
     * Handle service section intersection
     */
    handleServiceSectionIntersection(entries, navLinks) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    /**
     * Initialize animations and interactions
     */
    initAnimations() {
        // Fade-in animations
        this.setupFadeInAnimations();
        
        // Parallax effects (if enabled)
        this.setupParallaxEffects();
        
        // Service interest setter for exclusive cleaning
        window.setServiceInterest = (value) => {
            const select = document.getElementById('serviceInterest');
            if (select) {
                select.value = value;
                document.getElementById('consultationForm')?.scrollIntoView({ behavior: 'smooth' });
            }
        };
    }
    
    /**
     * Setup intersection observer for animations
     */
    setupIntersectionObserver() {
        const animatedElements = document.querySelectorAll('.service-card, .contact-card, .testimonial-card');
        
        if (animatedElements.length === 0) return;
        
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in');
                    }
                });
            },
            { threshold: 0.1 }
        );
        
        animatedElements.forEach(el => observer.observe(el));
    }
    
    /**
     * Setup fade-in animations
     */
    setupFadeInAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            .fade-in {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            .fade-in.visible {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * Create dashboard preview (for demo)
     */
    createDashboardPreview() {
        setTimeout(() => {
            const preview = document.createElement('div');
            preview.innerHTML = `
                <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: var(--primary-navy); color: var(--pearl-white); display: flex; align-items: center; justify-content: center; z-index: 10001;">
                    <div style="text-align: center; max-width: 600px; padding: 40px;">
                        <div style="width: 100px; height: 100px; background: var(--luxury-gold); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 30px; font-size: 2.5rem;">
                            <i class="fas fa-tachometer-alt"></i>
                        </div>
                        <h2 style="font-family: var(--font-primary); font-size: 2.5rem; margin-bottom: 20px;">Welcome to Your Dashboard</h2>
                        <p style="font-size: 1.2rem; margin-bottom: 30px; opacity: 0.9;">This would be your personalized member dashboard with:</p>
                        <ul style="list-style: none; font-size: 1.1rem; line-height: 2;">
                            <li><i class="fas fa-calendar-check" style="color: var(--luxury-gold); margin-right: 10px;"></i> Service scheduling & management</li>
                            <li><i class="fas fa-file-invoice-dollar" style="color: var(--luxury-gold); margin-right: 10px;"></i> Billing & payment portal</li>
                            <li><i class="fas fa-headset" style="color: var(--luxury-gold); margin-right: 10px;"></i> Concierge support chat</li>
                            <li><i class="fas fa-history" style="color: var(--luxury-gold); margin-right: 10px;"></i> Service history & reports</li>
                            <li><i class="fas fa-spa" style="color: var(--luxury-gold); margin-right: 10px;"></i> Exclusive maintenance access</li>
                        </ul>
                        <button onclick="location.reload()" style="background: var(--luxury-gold); color: var(--primary-navy); border: none; padding: 15px 30px; border-radius: 25px; font-weight: 600; margin-top: 30px; cursor: pointer; font-size: 1rem;">Return to Portal</button>
                    </div>
                </div>
            `;
            document.body.appendChild(preview);
        }, 3000);
    }
    
    /**
     * Initialize page-specific functionality
     */
    initPageSpecific() {
        switch (this.state.currentPage) {
            case 'login':
                this.initLoginPage();
                break;
            case 'contact':
                this.initContactPage();
                break;
            case 'services':
                this.initServicesPage();
                break;
            default:
                break;
        }
    }
    
    /**
     * Initialize login page specific features
     */
    initLoginPage() {
        // Auto-fill demo credentials notice
        setTimeout(() => {
            if (!localStorage.getItem('805lg_visited')) {
                this.showMessage('Welcome to the 805 LifeGuard Member Portal. Use the demo credentials above to explore our luxury client experience.', 'success');
                localStorage.setItem('805lg_visited', 'true');
            }
        }, 1000);
        
        // Remember me functionality
        if (localStorage.getItem('805lg_remember') === 'true') {
            const rememberCheckbox = document.getElementById('remember');
            if (rememberCheckbox) {
                rememberCheckbox.checked = true;
            }
        }
    }
    
    /**
     * Initialize contact page specific features
     */
    initContactPage() {
        // Set service interest from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const service = urlParams.get('service');
        
        if (service) {
            const serviceSelect = document.getElementById('serviceInterest');
            if (serviceSelect) {
                serviceSelect.value = service;
            }
        }
    }
    
    /**
     * Initialize services page specific features
     */
    initServicesPage() {
        // Pricing calculator or other service-specific features
        this.initPricingCalculator();
    }
    
    /**
     * Initialize basic pricing calculator
     */
    initPricingCalculator() {
        // This could be expanded for dynamic pricing
        console.log('Pricing calculator initialized');
    }
    
    /**
     * Setup accessibility features
     */
    setupAccessibility() {
        // Skip to main content link
        this.addSkipLink();
        
        // Keyboard navigation
        this.setupKeyboardNavigation();
        
        // ARIA labels and roles
        this.enhanceARIA();
    }
    
    /**
     * Add skip to main content link
     */
    addSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        
        // Add styles for skip link
        const style = document.createElement('style');
        style.textContent = `
            .skip-link {
                position: absolute;
                top: -40px;
                left: 6px;
                background: var(--primary-navy);
                color: var(--pearl-white);
                padding: 8px 12px;
                text-decoration: none;
                font-weight: 600;
                border-radius: 4px;
                z-index: 10000;
                transition: top 0.3s;
            }
            
            .skip-link:focus {
                top: 6px;
            }
        `;
        
        document.head.appendChild(style);
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
    
    /**
     * Setup keyboard navigation
     */
    setupKeyboardNavigation() {
        // ESC key to close mobile menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu();
            }
        });
    }
    
    /**
     * Enhance ARIA attributes
     */
    enhanceARIA() {
        // Add main content identifier
        const main = document.querySelector('main') || document.querySelector('.hero, .page-header').parentElement;
        if (main && !main.id) {
            main.id = 'main-content';
        }
        
        // Enhance form labels
        document.querySelectorAll('input, select, textarea').forEach(input => {
            if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
                const label = document.querySelector(`label[for="${input.id}"]`);
                if (label) {
                    input.setAttribute('aria-labelledby', label.id || `label-${input.id}`);
                    if (!label.id) label.id = `label-${input.id}`;
                }
            }
        });
    }
    
    /**
     * Handle window resize
     */
    handleResize() {
        const wasMobile = this.state.isMobile;
        this.state.isMobile = window.innerWidth <= 768;
        
        if (wasMobile !== this.state.isMobile) {
            // Mobile/desktop transition
            if (!this.state.isMobile) {
                this.closeMobileMenu();
            }
        }
    }
    
    /**
     * Handle window load
     */
    handleWindowLoad() {
        // Performance monitoring
        if (this.config.features.analytics) {
            this.trackPerformance();
        }
        
        // Remove loading states
        document.body.classList.add('loaded');
    }
    
    /**
     * Handle before unload
     */
    handleBeforeUnload(e) {
        // Check for unsaved form data
        const forms = document.querySelectorAll('form');
        for (const form of forms) {
            if (this.hasUnsavedData(form)) {
                e.preventDefault();
                e.returnValue = '';
                return '';
            }
        }
    }
    
    /**
     * Check if form has unsaved data
     */
    hasUnsavedData(form) {
        const inputs = form.querySelectorAll('input:not([type="hidden"]), textarea, select');
        return Array.from(inputs).some(input => {
            return input.value && input.value.trim() !== '' && !input.dataset.saved;
        });
    }
    
    /**
     * Track performance metrics
     */
    trackPerformance() {
        if (!window.performance) return;
        
        const perfData = performance.getEntriesByType('navigation')[0];
        const metrics = {
            loadTime: perfData.loadEventEnd - perfData.loadEventStart,
            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
            firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime,
            firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime
        };
        
        console.log('Performance Metrics:', metrics);
        
        // Send to analytics service
        // this.sendAnalytics('performance', metrics);
    }
    
    /**
     * Get current page identifier
     */
    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop().replace('.html', '') || 'index';
        
        // Map specific pages
        const pageMap = {
            'index': 'home',
            'client-login': 'login',
            'hoa-services': 'communities'
        };
        
        return pageMap[page] || page;
    }
    
    /**
     * Update active navigation based on current page
     */
    updateActiveNavigation() {
        const currentPage = this.state.currentPage;
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            const href = link.getAttribute('href');
            if (href) {
                const linkPage = href.split('/').pop().replace('.html', '').replace('#', '') || 'home';
                if (linkPage === currentPage || 
                    (currentPage === 'home' && href.includes('#'))) {
                    link.classList.add('active');
                }
            }
        });
    }
    
    /**
     * Update scroll indicator
     */
    updateScrollIndicator() {
        const indicator = document.querySelector('.scroll-indicator');
        if (indicator) {
            const opacity = Math.max(0, 1 - (this.state.scrollPosition / 300));
            indicator.style.opacity = opacity;
        }
    }
    
    /**
     * Setup parallax effects
     */
    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.hero, .page-header');
        
        if (parallaxElements.length === 0 || this.state.isMobile) return;
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            parallaxElements.forEach(element => {
                const rate = scrolled * -0.5;
                element.style.transform = `translate3d(0, ${rate}px, 0)`;
            });
        });
    }
    
    /**
     * Utility: Debounce function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    /**
     * Utility: Delay function
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * Utility: Throttle function
     */
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize the luxury website
const luxuryWebsite = new LuxuryWebsite();

// Global utilities for external access
window.LuxuryWebsite = {
    showMessage: (message, type) => luxuryWebsite.showMessage(message, type),
    setServiceInterest: (value) => window.setServiceInterest(value),
    instance: luxuryWebsite
};

// Service Worker registration (for production)
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(err => {
            console.log('Service Worker registration failed:', err);
        });
    });
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LuxuryWebsite;
}
