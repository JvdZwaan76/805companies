/**
 * Contact Page Specific JavaScript
 * Handles contact forms, booking system, and page interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize contact page components
    initContactForm();
    initBookingTabs();
    initBookingForms();
    initPricingCalculator();
    initLiveChat();
    initFormValidation();
    initSummaryUpdates();
});

/**
 * Contact Form Handling
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateContactForm()) {
            return;
        }
        
        const submitBtn = document.getElementById('submitBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        // Show loading state
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-flex';
        submitBtn.disabled = true;
        
        try {
            // Simulate API call (replace with actual implementation)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Success
            showNotification('Your message has been sent successfully! We\'ll get back to you within 24 hours.', 'success');
            contactForm.reset();
            clearFormErrors();
            
        } catch (error) {
            // Error
            showNotification('Sorry, there was an error sending your message. Please try again or call us directly.', 'error');
            
        } finally {
            // Reset button state
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;
        }
    });
}

/**
 * Form Validation
 */
function initFormValidation() {
    // Real-time validation for contact form
    const inputs = document.querySelectorAll('#contactForm .form-control');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            // Clear error state on input
            this.classList.remove('error');
            const errorElement = document.getElementById(this.id + '-error');
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.classList.remove('show');
            }
        });
    });
}

function validateContactForm() {
    let isValid = true;
    
    // Required field validation
    const requiredFields = [
        { id: 'firstName', message: 'First name is required' },
        { id: 'lastName', message: 'Last name is required' },
        { id: 'email', message: 'Email address is required' },
        { id: 'phone', message: 'Phone number is required' },
        { id: 'subject', message: 'Subject is required' },
        { id: 'message', message: 'Message is required' }
    ];
    
    requiredFields.forEach(field => {
        const element = document.getElementById(field.id);
        if (!element.value.trim()) {
            showFieldError(field.id, field.message);
            isValid = false;
        } else {
            clearFieldError(field.id);
        }
    });
    
    // Email validation
    const emailField = document.getElementById('email');
    if (emailField.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
            showFieldError('email', 'Please enter a valid email address');
            isValid = false;
        }
    }
    
    // Phone validation
    const phoneField = document.getElementById('phone');
    if (phoneField.value.trim()) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = phoneField.value.replace(/[\s\-\(\)\.]/g, '');
        if (!phoneRegex.test(cleanPhone) || cleanPhone.length < 10) {
            showFieldError('phone', 'Please enter a valid phone number');
            isValid = false;
        }
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldId = field.id;
    
    // Clear previous errors
    clearFieldError(fieldId);
    
    // Required field check
    if (field.hasAttribute('required') && !value) {
        showFieldError(fieldId, 'This field is required');
        return false;
    }
    
    // Specific validations
    switch (fieldId) {
        case 'email':
            if (value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    showFieldError(fieldId, 'Please enter a valid email address');
                    return false;
                }
            }
            break;
            
        case 'phone':
            if (value) {
                const cleanPhone = value.replace(/[\s\-\(\)\.]/g, '');
                const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                if (!phoneRegex.test(cleanPhone) || cleanPhone.length < 10) {
                    showFieldError(fieldId, 'Please enter a valid phone number');
                    return false;
                }
            }
            break;
    }
    
    return true;
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + '-error');
    
    if (field) {
        field.classList.add('error');
    }
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + '-error');
    
    if (field) {
        field.classList.remove('error');
    }
    
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
}

function clearFormErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    const errorFields = document.querySelectorAll('.form-control.error');
    
    errorElements.forEach(el => {
        el.textContent = '';
        el.classList.remove('show');
    });
    
    errorFields.forEach(field => {
        field.classList.remove('error');
    });
}

/**
 * Booking Tab System
 */
function initBookingTabs() {
    const bookingTabs = document.querySelectorAll('.booking-tab');
    const bookingContents = document.querySelectorAll('.booking-content');
    
    bookingTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const target = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            bookingTabs.forEach(t => t.classList.remove('active'));
            bookingContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            const targetContent = document.getElementById(target + '-content');
            if (targetContent) {
                targetContent.classList.add('active');
            }
            
            // Announce to screen readers
            if (window.announceToScreenReader) {
                window.announceToScreenReader(`Switched to ${this.textContent.trim()} booking form`);
            }
        });
    });
}

/**
 * Booking Forms
 */
function initBookingForms() {
    // Lifeguard booking form
    const lifeguardForm = document.getElementById('lifeguardForm');
    if (lifeguardForm) {
        lifeguardForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await submitBookingForm('lifeguard', this);
        });
    }
    
    // Swimming lessons form
    const swimmingForm = document.getElementById('swimmingForm');
    if (swimmingForm) {
        swimmingForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await submitBookingForm('swimming', this);
        });
    }
}

async function submitBookingForm(type, form) {
    const submitBtn = form.querySelector('.booking-submit');
    const confirmation = document.getElementById(type + 'Confirmation');
    
    // Show loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Hide form and show confirmation
        form.style.display = 'none';
        if (confirmation) {
            confirmation.classList.add('active');
        }
        
        // Generate booking ID
        const bookingId = generateBookingId(type);
        const bookingIdElement = confirmation.querySelector('.booking-id');
        if (bookingIdElement) {
            bookingIdElement.textContent = bookingId;
        }
        
        // Show success notification
        showNotification(`Your ${type === 'lifeguard' ? 'lifeguard service' : 'swimming lesson'} request has been submitted successfully!`, 'success');
        
        // Scroll to confirmation
        confirmation.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
    } catch (error) {
        showNotification('Sorry, there was an error processing your booking. Please try again or call us directly.', 'error');
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

function generateBookingId(type) {
    const prefix = type === 'lifeguard' ? 'LG' : 'SW';
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    
    return `${prefix}-${year}${month}${day}${random}`;
}

function resetBookingForm(type) {
    const form = document.getElementById(type + 'Form');
    const confirmation = document.getElementById(type + 'Confirmation');
    
    if (form) {
        form.style.display = 'block';
        form.reset();
        updateBookingSummary(type);
    }
    
    if (confirmation) {
        confirmation.classList.remove('active');
    }
    
    // Scroll back to form
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Make resetBookingForm globally available
window.resetBookingForm = resetBookingForm;

/**
 * Pricing Calculator
 */
function initPricingCalculator() {
    // Lifeguard pricing
    const lifeguardInputs = document.querySelectorAll('#lifeguard-content input, #lifeguard-content select');
    lifeguardInputs.forEach(input => {
        input.addEventListener('change', () => updateBookingSummary('lifeguard'));
        input.addEventListener('input', () => updateBookingSummary('lifeguard'));
    });
    
    // Swimming lesson pricing
    const swimmingInputs = document.querySelectorAll('#swimming-content input, #swimming-content select');
    swimmingInputs.forEach(input => {
        input.addEventListener('change', () => updateBookingSummary('swimming'));
        input.addEventListener('input', () => updateBookingSummary('swimming'));
    });
    
    // Initial calculations
    updateBookingSummary('lifeguard');
    updateBookingSummary('swimming');
}

function updateBookingSummary(type) {
    if (type === 'lifeguard') {
        updateLifeguardSummary();
    } else if (type === 'swimming') {
        updateSwimmingSummary();
    }
}

function updateLifeguardSummary() {
    const packageRadios = document.querySelectorAll('input[name="lifeguardPackage"]');
    const eventDate = document.getElementById('eventDate');
    const duration = document.getElementById('duration');
    const guestCount = document.getElementById('guestCount');
    
    // Get selected package
    let selectedPackage = 'Basic Package';
    let hourlyRate = 50;
    
    packageRadios.forEach(radio => {
        if (radio.checked) {
            switch (radio.value) {
                case 'basic':
                    selectedPackage = 'Basic Package';
                    hourlyRate = 50;
                    break;
                case 'standard':
                    selectedPackage = 'Standard Package';
                    hourlyRate = 75;
                    break;
                case 'premium':
                    selectedPackage = 'Premium Package';
                    hourlyRate = 100;
                    break;
            }
        }
    });
    
    // Update summary fields
    const summaryService = document.getElementById('summaryService');
    const summaryDate = document.getElementById('summaryDate');
    const summaryDuration = document.getElementById('summaryDuration');
    const summaryGuests = document.getElementById('summaryGuests');
    const totalPrice = document.getElementById('totalPrice');
    
    if (summaryService) summaryService.textContent = selectedPackage;
    if (summaryDate) {
        summaryDate.textContent = eventDate?.value ? 
            new Date(eventDate.value).toLocaleDateString() : 'Not selected';
    }
    if (summaryDuration) summaryDuration.textContent = duration?.value ? `${duration.value} hours` : '4 hours';
    if (summaryGuests) summaryGuests.textContent = guestCount?.value || '20';
    
    // Calculate total
    const hours = parseInt(duration?.value) || 4;
    const total = hourlyRate * hours;
    
    if (totalPrice) totalPrice.textContent = `$${total.toFixed(2)}`;
}

function updateSwimmingSummary() {
    const packageRadios = document.querySelectorAll('input[name="swimmingPackage"]');
    const swimmerName = document.getElementById('swimmerName');
    const preferredDays = document.querySelectorAll('input[name="preferredDays[]"]:checked');
    const preferredTimes = document.querySelectorAll('input[name="preferredTimes[]"]:checked');
    
    // Get selected package
    let selectedPackage = 'Single Lesson';
    let packagePrice = 75;
    
    packageRadios.forEach(radio => {
        if (radio.checked) {
            switch (radio.value) {
                case 'single':
                    selectedPackage = 'Single Lesson';
                    packagePrice = 75;
                    break;
                case 'five':
                    selectedPackage = '5-Lesson Package';
                    packagePrice = 350;
                    break;
                case 'ten':
                    selectedPackage = '10-Lesson Package';
                    packagePrice = 650;
                    break;
            }
        }
    });
    
    // Update summary fields
    const lessonSummaryPackage = document.getElementById('lessonSummaryPackage');
    const lessonSummarySwimmer = document.getElementById('lessonSummarySwimmer');
    const lessonSummaryDays = document.getElementById('lessonSummaryDays');
    const lessonSummaryTime = document.getElementById('lessonSummaryTime');
    const lessonTotalPrice = document.getElementById('lessonTotalPrice');
    
    if (lessonSummaryPackage) lessonSummaryPackage.textContent = selectedPackage;
    if (lessonSummarySwimmer) {
        lessonSummarySwimmer.textContent = swimmerName?.value || 'Not specified';
    }
    
    // Get selected days
    const dayNames = Array.from(preferredDays).map(cb => {
        return cb.value.charAt(0).toUpperCase() + cb.value.slice(1);
    });
    if (lessonSummaryDays) {
        lessonSummaryDays.textContent = dayNames.length ? dayNames.join(', ') : 'Not selected';
    }
    
    // Get selected times
    const timeNames = Array.from(preferredTimes).map(cb => {
        switch (cb.value) {
            case 'morning': return 'Morning';
            case 'afternoon': return 'Afternoon';
            case 'evening': return 'Evening';
            default: return cb.value;
        }
    });
    if (lessonSummaryTime) {
        lessonSummaryTime.textContent = timeNames.length ? timeNames.join(', ') : 'Not selected';
    }
    
    if (lessonTotalPrice) lessonTotalPrice.textContent = `$${packagePrice.toFixed(2)}`;
}

/**
 * Summary Updates for Real-time Feedback
 */
function initSummaryUpdates() {
    // Set up minimum date for booking forms
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        input.min = today;
    });
    
    // Auto-update summaries when form values change
    document.addEventListener('change', function(e) {
        if (e.target.closest('#lifeguard-content')) {
            updateBookingSummary('lifeguard');
        } else if (e.target.closest('#swimming-content')) {
            updateBookingSummary('swimming');
        }
    });
    
    document.addEventListener('input', function(e) {
        if (e.target.closest('#lifeguard-content')) {
            debounce(() => updateBookingSummary('lifeguard'), 300)();
        } else if (e.target.closest('#swimming-content')) {
            debounce(() => updateBookingSummary('swimming'), 300)();
        }
    });
}

/**
 * Live Chat Integration
 */
function initLiveChat() {
    // This would integrate with your live chat service
    // For now, we'll simulate the functionality
}

function openLiveChat() {
    // Check if it's during business hours
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay(); // 0 = Sunday, 6 = Saturday
    
    const isBusinessHours = (day >= 1 && day <= 5 && hour >= 9 && hour < 18) || 
                           (day === 6 && hour >= 10 && hour < 16);
    
    if (isBusinessHours) {
        // Simulate opening live chat
        showNotification('Live chat is starting... Please wait while we connect you with our team.', 'info');
        
        // In a real implementation, you would initialize your chat widget here
        setTimeout(() => {
            showNotification('We\'re currently helping other customers. You can also call us at (805) 367-6432 for immediate assistance.', 'info');
        }, 3000);
    } else {
        showNotification('Live chat is currently offline. Our business hours are Mon-Fri 9AM-6PM, Sat 10AM-4PM. Please call (805) 367-6432 or send us a message using the contact form.', 'info');
    }
}

// Make openLiveChat globally available
window.openLiveChat = openLiveChat;

/**
 * Enhanced Notification System
 */
function showNotification(message, type = 'info', duration = 5000) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Icon mapping
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">
                <i class="${icons[type] || icons.info}"></i>
            </div>
            <div class="notification-text">
                <span>${message}</span>
            </div>
            <button class="notification-close" aria-label="Close notification">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="notification-progress"></div>
    `;
    
    // Color mapping
    const colors = {
        success: '#4caf50',
        error: '#f44336',
        warning: '#ff9800',
        info: '#2196f3'
    };
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 400px;
        min-width: 300px;
        overflow: hidden;
    `;
    
    // Style notification content
    const notificationContent = notification.querySelector('.notification-content');
    notificationContent.style.cssText = `
        display: flex;
        align-items: flex-start;
        padding: 20px;
        gap: 15px;
    `;
    
    const notificationIcon = notification.querySelector('.notification-icon');
    notificationIcon.style.cssText = `
        flex-shrink: 0;
        font-size: 1.2rem;
        margin-top: 2px;
    `;
    
    const notificationText = notification.querySelector('.notification-text');
    notificationText.style.cssText = `
        flex: 1;
        line-height: 1.5;
    `;
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: rgba(255,255,255,0.8);
        cursor: pointer;
        padding: 0;
        font-size: 1rem;
        flex-shrink: 0;
        transition: color 0.2s;
    `;
    
    const progressBar = notification.querySelector('.notification-progress');
    progressBar.style.cssText = `
        height: 3px;
        background: rgba(255,255,255,0.3);
        transform-origin: left;
        animation: notificationProgress ${duration}ms linear;
    `;
    
    // Add progress animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes notificationProgress {
            from { transform: scaleX(1); }
            to { transform: scaleX(0); }
        }
    `;
    document.head.appendChild(style);
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    closeBtn.addEventListener('click', () => {
        closeNotification(notification);
    });
    
    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.color = 'white';
    });
    
    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.color = 'rgba(255,255,255,0.8)';
    });
    
    // Auto-remove after duration
    setTimeout(() => {
        if (notification.parentNode) {
            closeNotification(notification);
        }
        // Clean up style element
        style.remove();
    }, duration);
    
    // Announce to screen readers
    if (window.announceToScreenReader) {
        window.announceToScreenReader(message);
    }
}

function closeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 400);
}

/**
 * Utility Functions
 */
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

/**
 * Newsletter Form (Footer)
 */
const footerNewsletterForm = document.getElementById('footerNewsletterForm');
if (footerNewsletterForm) {
    footerNewsletterForm.addEventListener('submit', function(e) {
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
        
        // Show loading state
        const originalHTML = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            showNotification('Thank you for subscribing to our newsletter!', 'success');
            emailInput.value = '';
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateContactForm,
        updateBookingSummary,
        generateBookingId,
        showNotification
    };
}