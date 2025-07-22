/**
 * 805 LifeGuard - Professional Website JavaScript
 * Handles all interactive functionality and animations
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all components
    initMobileMenu();
    initTestimonialSlider();
    initSmoothScrolling();
    initHeaderEffects();
    initAnimationObserver();
    initNewsletterForm();
    initPerformanceMonitoring();
    initAccessibilityFeatures();
    
});

/**
 * Mobile Menu Toggle Functionality
 */
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const hamburgerLines = document.querySelectorAll('.hamburger-line');
    
    if (!mobileMenuBtn || !navLinks) return;
    
    mobileMenuBtn.addEventListener('click', function() {
        const isActive = navLinks.classList.contains('active');
        
        // Toggle menu
        navLinks.classList.toggle('active');
        
        // Animate hamburger to X
        hamburgerLines.forEach((line, index) => {
            if (isActive) {
                // Return to hamburger
                line.style.transform = '';
                line.style.opacity = '1';
            } else {
                // Transform to X
                switch(index) {
                    case 0:
                        line.style.transform = 'rotate(45deg) translate(6px, 6px)';
                        break;
                    case 1:
                        line.style.opacity = '0';
                        break;
                    case 2:
                        line.style.transform = 'rotate(-45deg) translate(6px, -6px)';
                        break;
                }
            }
        });
        
        // Prevent body scrolling when menu is open
        document.body.style.overflow = isActive ? 'auto' : 'hidden';
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.navbar') && navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Close menu when clicking on nav links
    const navLinkElements = document.querySelectorAll('.nav-link');
    navLinkElements.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    function closeMobileMenu() {
        navLinks.classList.remove('active');
        hamburgerLines.forEach(line => {
            line.style.transform = '';
            line.style.opacity = '1';
        });
        document.body.style.overflow = 'auto';
    }
}

/**
 * Testimonial Slider Functionality
 */
function initTestimonialSlider() {
    const testimonialTrack = document.getElementById('testimonialTrack');
    const testimonials = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dots = document.querySelectorAll('.dot');
    
    if (!testimonialTrack || testimonials.length === 0) return;
    
    let currentIndex = 0;
    let isAutoPlaying = true;
    let autoPlayInterval;
    
    // Calculate how many cards to show based on screen width
    function getCardsToShow() {
        const screenWidth = window.innerWidth;
        if (screenWidth >= 1200) return 3;
        if (screenWidth >= 768) return 2;
        return 1;
    }
    
    // Setup testimonial widths and positioning
    function setupTestimonials() {
        const containerWidth = document.querySelector('.testimonials-container').offsetWidth;
        const cardsToShow = getCardsToShow();
        const cardWidth = containerWidth / cardsToShow;
        
        testimonials.forEach(testimonial => {
            testimonial.style.minWidth = `${cardWidth - 30}px`; // Account for margin
        });
    }
    
    // Move to specific slide
    function moveToSlide(index) {
        const cardsToShow = getCardsToShow();
        const maxIndex = Math.max(0, testimonials.length - cardsToShow);
        
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        
        const slideWidth = testimonials[0].offsetWidth + 30; // Include margin
        testimonialTrack.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }
    
    // Previous button
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            pauseAutoPlay();
            moveToSlide(currentIndex - 1);
        });
    }
    
    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            pauseAutoPlay();
            moveToSlide(currentIndex + 1);
        });
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            pauseAutoPlay();
            moveToSlide(index);
        });
    });
    
    // Auto-play functionality
    function startAutoPlay() {
        if (!isAutoPlaying) return;
        
        autoPlayInterval = setInterval(() => {
            const cardsToShow = getCardsToShow();
            const maxIndex = Math.max(0, testimonials.length - cardsToShow);
            
            if (currentIndex >= maxIndex) {
                moveToSlide(0);
            } else {
                moveToSlide(currentIndex + 1);
            }
        }, 5000);
    }
    
    function pauseAutoPlay() {
        isAutoPlaying = false;
        clearInterval(autoPlayInterval);
        
        // Resume after 10 seconds of inactivity
        setTimeout(() => {
            isAutoPlaying = true;
            startAutoPlay();
        }, 10000);
    }
    
    // Touch/swipe support
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    testimonialTrack.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        isDragging = true;
        pauseAutoPlay();
    });
    
    testimonialTrack.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
        e.preventDefault();
    });
    
    testimonialTrack.addEventListener('touchend', function() {
        if (!isDragging) return;
        
        const diff = startX - currentX;
        const threshold = 50;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                moveToSlide(currentIndex + 1);
            } else {
                moveToSlide(currentIndex - 1);
            }
        }
        
        isDragging = false;
    });
    
    // Initialize
    setupTestimonials();
    moveToSlide(0);
    startAutoPlay();
    
    // Update on window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            setupTestimonials();
            moveToSlide(Math.min(currentIndex, testimonials.length - getCardsToShow()));
        }, 250);
    });
}

/**
 * Smooth Scrolling for Anchor Links
 */
function initSmoothScrolling() {
    // Smooth scrolling for internal anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just '#'
            if (href === '#') {
                e.preventDefault();
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Scroll to top functionality for hero scroll indicator
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const servicesSection = document.getElementById('services');
            if (servicesSection) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = servicesSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
}

/**
 * Header Effects on Scroll
 */
function initHeaderEffects() {
    const header = document.querySelector('header');
    if (!header) return;
    
    let lastScrollTop = 0;
    let isScrolling = false;
    
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class for styling
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header based on scroll direction
        if (Math.abs(scrollTop - lastScrollTop) > 5) {
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                // Scrolling down
                header.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                header.style.transform = 'translateY(0)';
            }
            lastScrollTop = scrollTop;
        }
    }
    
    // Throttle scroll events
    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            window.requestAnimationFrame(handleScroll);
            isScrolling = true;
        }
        setTimeout(() => {
            isScrolling = false;
        }, 10);
    });
}

/**
 * Intersection Observer for Animations
 */
function initAnimationObserver() {
    // Check if animations should be reduced
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add staggered animation delays for multiple elements
                const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                entry.target.style.animationDelay = `${delay}ms`;
                entry.target.classList.add('fade-in-up');
                
                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all elements with fade-in-up class
    document.querySelectorAll('.fade-in-up').forEach(el => {
        observer.observe(el);
    });
    
    // Counter animation for hero stats
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
}

/**
 * Animate Counter Numbers
 */
function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/\D/g, ''));
    const suffix = element.textContent.replace(/[\d]/g, '');
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 16);
}

/**
 * Newsletter Form Handling
 */
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = this.querySelector('.newsletter-input');
        const submitBtn = this.querySelector('.newsletter-btn');
        const email = emailInput.value.trim();
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        // Disable button and show loading state
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;
        
        // Simulate API call (replace with actual implementation)
        setTimeout(() => {
            showNotification('Thank you for subscribing to our newsletter!', 'success');
            emailInput.value = '';
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
        }, 1500);
    });
}

/**
 * Show Notification Messages
 */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" aria-label="Close notification">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

/**
 * Performance Monitoring
 */
function initPerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', () => {
        if ('performance' in window) {
            const navigation = performance.getEntriesByType('navigation')[0];
            const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
            
            // Log performance metrics (in production, send to analytics)
            console.log('Page Performance:', {
                loadTime: `${Math.round(loadTime)}ms`,
                domContentLoaded: `${Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart)}ms`,
                firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 'N/A'
            });
        }
    });
    
    // Preload critical images
    const criticalImages = [
        '/images/805-lifeguard-logo.png',
        '/api/placeholder/1920/1080',
        '/api/placeholder/400/300'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

/**
 * Accessibility Features
 */
function initAccessibilityFeatures() {
    // Add skip link functionality
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: white;
        padding: 8px;
        border-radius: 4px;
        text-decoration: none;
        z-index: 10001;
        transition: top 0.2s;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content landmark
    const mainContent = document.querySelector('.hero') || document.querySelector('main');
    if (mainContent && !mainContent.id) {
        mainContent.id = 'main-content';
    }
    
    // Keyboard navigation for testimonial slider
    const testimonialContainer = document.querySelector('.testimonials-container');
    if (testimonialContainer) {
        testimonialContainer.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                document.getElementById('prevBtn')?.click();
            } else if (e.key === 'ArrowRight') {
                document.getElementById('nextBtn')?.click();
            }
        });
    }
    
    // Announce dynamic content changes to screen readers
    const announceToScreenReader = (message) => {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    };
    
    // Make the announceToScreenReader function globally available
    window.announceToScreenReader = announceToScreenReader;
}

/**
 * Utility Functions
 */

// Debounce function for performance optimization
function debounce(func, wait) {
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

// Throttle function for scroll events
function throttle(func, limit) {
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

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        debounce,
        throttle,
        isInViewport
    };
}