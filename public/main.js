// Main JavaScript for Simiriki Landing Page
// Handles interactive elements and conversion optimization

document.addEventListener('DOMContentLoaded', function() {
    console.log('Simiriki Landing Page Loaded');
    
    // Initialize landing page functionality
    initializeAnimations();
    initializeCTATracking();
    initializeScrollEffects();
    initializeFormHandling();
});

// Animation initialization
function initializeAnimations() {
    // Observe elements for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe feature cards and other animated elements
    const animatedElements = document.querySelectorAll('.feature-card, .contact-container');
    animatedElements.forEach(function(element) {
        observer.observe(element);
    });
    
    // Add staggered animation to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(function(card, index) {
        card.style.animationDelay = (index * 0.2) + 's';
    });
}

// CTA button tracking for conversion optimization
function initializeCTATracking() {
    const ctaButtons = document.querySelectorAll('.btn');
    
    ctaButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            const buttonText = this.textContent.trim();
            const buttonType = this.classList.contains('btn-primary') ? 'primary' : 'secondary';
            
            // Track CTA clicks (you can integrate with analytics)
            console.log('CTA Clicked:', {
                text: buttonText,
                type: buttonType,
                timestamp: new Date().toISOString()
            });
            
            // Add click effect
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // If it's a contact button, scroll to contact section
            if (buttonText.toLowerCase().includes('contacto') || buttonText.toLowerCase().includes('contact')) {
                e.preventDefault();
                scrollToContact();
            }
        });
        
        // Add hover effects
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// Scroll effects and navigation
function initializeScrollEffects() {
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Header background effect on scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (header) {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            }
        }
    });
    
    // Parallax effect for hero section (subtle)
    window.addEventListener('scroll', function() {
        const hero = document.querySelector('.hero');
        if (hero) {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = 'translateY(' + rate + 'px)';
        }
    });
}

// Form handling and validation
function initializeFormHandling() {
    // Handle contact form if present
    const contactForms = document.querySelectorAll('form');
    contactForms.forEach(function(form) {
        form.addEventListener('submit', function(e) {
            console.log('Form submission attempted');
            
            // Basic validation
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(function(field) {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#ff6b6b';
                    
                    // Reset border color after user types
                    field.addEventListener('input', function() {
                        this.style.borderColor = '';
                    }, { once: true });
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                showNotification('Por favor, completa todos los campos requeridos', 'error');
                return false;
            }
            
            // Show loading state
            const submitButton = form.querySelector('[type="submit"]');
            if (submitButton) {
                const originalText = submitButton.textContent;
                submitButton.textContent = 'Enviando...';
                submitButton.disabled = true;
                
                // Reset after 3 seconds (in case form doesn't redirect)
                setTimeout(function() {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                }, 3000);
            }
        });
    });
}

// Utility functions
function scrollToContact() {
    const contactSection = document.querySelector('#contact, .contact');
    if (contactSection) {
        contactSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification notification-' + type;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
    `;
    
    if (type === 'error') {
        notification.style.background = '#ff6b6b';
    } else if (type === 'success') {
        notification.style.background = '#51cf66';
    } else {
        notification.style.background = '#339af0';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(function() {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(function() {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Add notification animations
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyles);

// Export functions for potential external use
window.SimirikiLanding = {
    scrollToContact,
    showNotification
};