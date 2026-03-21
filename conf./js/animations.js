// Advanced Animations and Effects for Conference Website
// Enhanced version with comprehensive animations and interactive effects

class AnimationController {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.animatedElements = [];
        this.particles = [];
        this.parallaxElements = [];
        this.isInitialized = false;
        
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        this.setupScrollAnimations();
        this.setupParallaxEffects();
        this.setupFloatingParticles();
        this.setupInteractiveEffects();
        this.setupNavbarAnimations();
        this.setupCountdownAnimations();
        this.setupTypewriterEffects();
        this.setupRippleEffects();
        this.setupProgressAnimations();
        this.setupSmoothTransitions();
        
        this.isInitialized = true;
        console.log('🎬 Animation Controller initialized successfully');
    }

    // ===== SCROLL TRIGGERED ANIMATIONS =====
    setupScrollAnimations() {
        // Intersection Observer for scroll animations (simplified)
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    // Only add subtle hover effects, don't hide content
                    element.classList.add('animate-fade-in');
                    observer.unobserve(element);
                }
            });
        }, { threshold: 0.1 });

        // Add subtle animation classes to elements
        const animateElements = [
            // Hero section elements - keep visible but add subtle animations
            { selector: '.hero-section h1', animation: 'hover-lift', delay: 0 },
            { selector: '.hero-section .date-badge', animation: 'animate-pulse', delay: 200 },
            { selector: '.hero-section .countdown-container', animation: 'hover-glow', delay: 800 },
            
            // Section titles - subtle hover effects only
            { selector: '.section-title', animation: 'hover-lift', delay: 0 },
            
            // Cards and content - enhanced hover effects
            { selector: '.card-hover', animation: 'hover-lift', delay: 100 },
            { selector: '.info-card', animation: 'hover-glow', delay: 150 },
            { selector: '.speaker-card', animation: 'hover-tilt', delay: 200 },
            { selector: '.committee-card', animation: 'hover-lift', delay: 250 },
            
            // Navigation and buttons - keep functional
            { selector: '.btn-register', animation: 'hover-ripple', delay: 300 },
            { selector: '.nav-link', animation: 'hover-wave', delay: 100 },
            
            // Timeline and schedule items
            { selector: '.timeline-item', animation: 'hover-lift', delay: 100 },
            { selector: '.schedule-item', animation: 'hover-lift', delay: 150 },
            
            // Images and logos
            { selector: '.sponsor-logo', animation: 'hover-glow', delay: 200 },
            { selector: '.theme-banner', animation: 'hover-lift', delay: 300 },
            
            // Form elements
            { selector: '.form-control', animation: 'hover-lift', delay: 100 }
        ];

        // Apply subtle animations without hiding content
        animateElements.forEach(({ selector, animation, delay }) => {
            document.querySelectorAll(selector).forEach((element, index) => {
                // Only add hover-based animations, no initial hiding
                element.classList.add(animation);
                element.style.animationDelay = `${delay + (index * 100)}ms`;
                // Don't observe for scroll animations to keep content visible
                if (!animation.includes('scroll-animate')) {
                    observer.observe(element);
                }
                this.animatedElements.push(element);
            });
        });
    }

    triggerScrollAnimation(element) {
        // Add staggered animation for child elements
        const children = element.querySelectorAll('.row > div, .col-md-6, .col-lg-3, .col-md-4');
        children.forEach((child, index) => {
            setTimeout(() => {
                child.classList.add('animate-fade-in');
            }, index * 100);
        });

        // Special effects for specific elements
        if (element.classList.contains('countdown-container')) {
            this.animateCountdownBox();
        }

        if (element.classList.contains('speaker-card')) {
            this.animateSpeakerCard(element);
        }

        if (element.classList.contains('theme-banner')) {
            this.animateThemeBanner(element);
        }
    }

    // ===== PARALLAX EFFECTS =====
    setupParallaxEffects() {
        // Hero section parallax
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            heroSection.classList.add('parallax-bg');
            this.parallaxElements.push(heroSection);
        }

        // Theme banner parallax
        const themeBanner = document.querySelector('.theme-banner');
        if (themeBanner) {
            themeBanner.classList.add('parallax-element');
            this.parallaxElements.push(themeBanner);
        }

        // Apply parallax effect on scroll
        window.addEventListener('scroll', this.throttle(() => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;

            this.parallaxElements.forEach(element => {
                if (this.isElementInViewport(element)) {
                    element.style.transform = `translateY(${rate}px)`;
                }
            });
        }, 16)); // ~60fps
    }

    // ===== FLOATING PARTICLES =====
    setupFloatingParticles() {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;

        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        heroSection.appendChild(particlesContainer);

        // Create floating particles
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random position and properties
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 4 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 4) + 's';
            particle.style.opacity = Math.random() * 0.5 + 0.2;
            
            particlesContainer.appendChild(particle);
            this.particles.push(particle);
        }

        // Add geometric shapes for additional visual interest
        this.createGeometricShapes(heroSection);
    }

    createGeometricShapes(container) {
        const shapes = [
            { type: 'circle', size: 20, color: 'rgba(46, 204, 113, 0.1)' },
            { type: 'square', size: 15, color: 'rgba(52, 152, 219, 0.1)' },
            { type: 'triangle', size: 18, color: 'rgba(155, 89, 182, 0.1)' }
        ];

        shapes.forEach((shape, index) => {
            const element = document.createElement('div');
            element.style.cssText = `
                position: absolute;
                ${shape.type === 'circle' ? 'border-radius: 50%' : ''}
                width: ${shape.size}px;
                height: ${shape.size}px;
                background: ${shape.color};
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: float ${6 + index * 2}s ease-in-out infinite;
                animation-delay: ${index * 0.5}s;
                pointer-events: none;
            `;

            if (shape.type === 'triangle') {
                element.style.borderLeft = `${shape.size / 2}px solid transparent`;
                element.style.borderRight = `${shape.size / 2}px solid transparent`;
                element.style.borderBottom = `${shape.size}px solid ${shape.color}`;
                element.style.width = '0';
                element.style.height = '0';
            }

            container.appendChild(element);
        });
    }

    // ===== INTERACTIVE EFFECTS =====
    setupInteractiveEffects() {
        // Enhanced hover effects for cards
        document.querySelectorAll('.card-hover').forEach(card => {
            card.classList.add('hover-lift');
            
            card.addEventListener('mouseenter', () => {
                this.createRippleEffect(card);
            });
        });

        // Button hover effects
        document.querySelectorAll('.btn').forEach(btn => {
            btn.classList.add('hover-ripple');
            
            btn.addEventListener('click', (e) => {
                this.createClickRipple(e, btn);
            });
        });

        // Speaker card effects
        document.querySelectorAll('.speaker-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.animateSpeakerImage(card);
            });
        });

        // Navigation effects
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.classList.add('animate-wave');
                setTimeout(() => link.classList.remove('animate-wave'), 2000);
            });
        });

        // Form field animations
        document.querySelectorAll('.form-control').forEach(field => {
            field.addEventListener('focus', () => {
                field.classList.add('animate-pulse');
            });
            
            field.addEventListener('blur', () => {
                field.classList.remove('animate-pulse');
            });
        });
    }

    // ===== NAVBAR ANIMATIONS =====
    setupNavbarAnimations() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        let lastScrollTop = 0;
        const navbarHeight = navbar.offsetHeight;

        window.addEventListener('scroll', this.throttle(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Add scrolled class for styling
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Hide/show navbar on scroll
            if (scrollTop > lastScrollTop && scrollTop > navbarHeight) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }

            lastScrollTop = scrollTop;
        }, 100));
    }

    // ===== COUNTDOWN ANIMATIONS =====
    setupCountdownAnimations() {
        const countdownNumbers = document.querySelectorAll('.countdown-number');
        if (countdownNumbers.length === 0) return;

        // Animate numbers when they change
        const originalUpdateCountdown = window.updateCountdown;
        if (originalUpdateCountdown) {
            window.updateCountdown = () => {
                originalUpdateCountdown();
                
                countdownNumbers.forEach(number => {
                    this.animateNumberChange(number);
                });
            };
        }

        // Add special effects to countdown boxes
        document.querySelectorAll('.countdown-box').forEach(box => {
            box.addEventListener('mouseenter', () => {
                box.classList.add('animate-glow');
            });
            
            box.addEventListener('mouseleave', () => {
                box.classList.remove('animate-glow');
            });
        });
    }

    animateNumberChange(element) {
        element.style.transform = 'scale(1.2)';
        element.style.color = '#2ecc71';
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
            element.style.color = '';
        }, 200);
    }

    // ===== TYPEWRITER EFFECTS =====
    setupTypewriterEffects() {
        // Typewriter effect for main title
        const titleElement = document.querySelector('.hero-section h1 .text-reveal');
        if (titleElement) {
            this.typewriterEffect(titleElement, 'Conférence Internationale sur les Avancées en Informatique et Technologies Éducatives', 50);
        }

        // Staggered text reveal for other elements
        document.querySelectorAll('.lead').forEach((element, index) => {
            setTimeout(() => {
                this.fadeInText(element);
            }, 1000 + (index * 500));
        });
    }

    typewriterEffect(element, text, speed = 100) {
        element.innerHTML = '';
        element.style.borderRight = '2px solid #2ecc71';
        element.style.animation = 'blink 1s infinite';
        
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
                setTimeout(() => {
                    element.style.borderRight = 'none';
                    element.style.animation = 'none';
                }, 1000);
            }
        }, speed);
    }

    fadeInText(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.8s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100);
    }

    // ===== RIPPLE EFFECTS =====
    setupRippleEffects() {
        document.querySelectorAll('.btn, .card-hover').forEach(element => {
            element.addEventListener('click', (e) => {
                this.createClickRipple(e, element);
            });
        });
    }

    createClickRipple(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    createRippleEffect(element) {
        // Add subtle ripple effect on hover
        element.style.background = 'linear-gradient(45deg, rgba(46, 204, 113, 0.1), rgba(52, 152, 219, 0.1))';
        
        setTimeout(() => {
            element.style.background = '';
        }, 300);
    }

    // ===== PROGRESS ANIMATIONS =====
    setupProgressAnimations() {
        // Animate progress bars when they come into view
        const progressBars = document.querySelectorAll('.progress-fill');
        
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateProgressBar(entry.target);
                    progressObserver.unobserve(entry.target);
                }
            });
        });

        progressBars.forEach(bar => {
            progressObserver.observe(bar);
        });
    }

    animateProgressBar(element) {
        const targetWidth = element.dataset.width || '100%';
        element.style.width = '0%';
        
        setTimeout(() => {
            element.style.transition = 'width 2s ease-out';
            element.style.width = targetWidth;
        }, 100);
    }

    // ===== SMOOTH TRANSITIONS =====
    setupSmoothTransitions() {
        // Add smooth transitions to all interactive elements
        document.querySelectorAll('a, button, .card, .btn').forEach(element => {
            element.style.transition = 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';
        });

        // Smooth scroll enhancement
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    this.smoothScrollTo(target);
                }
            });
        });
    }

    smoothScrollTo(target) {
        const targetPosition = target.offsetTop - 80;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1000;
        let start = null;

        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const ease = this.easeInOutCubic(progress / duration);
            
            window.scrollTo(0, startPosition + distance * ease);
            
            if (progress < duration) {
                requestAnimationFrame(step);
            }
        };

        requestAnimationFrame(step);
    }

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    // ===== SPECIAL ANIMATION EFFECTS =====
    animateCountdownBox() {
        const boxes = document.querySelectorAll('.countdown-box');
        boxes.forEach((box, index) => {
            setTimeout(() => {
                box.classList.add('animate-bounce-in');
            }, index * 200);
        });
    }

    animateSpeakerCard(card) {
        const image = card.querySelector('.speaker-img');
        if (image) {
            setTimeout(() => {
                image.classList.add('animate-float');
            }, 300);
        }
    }

    animateSpeakerImage(card) {
        const image = card.querySelector('.speaker-img');
        if (image) {
            image.style.transform = 'scale(1.1) rotate(5deg)';
            setTimeout(() => {
                image.style.transform = '';
            }, 300);
        }
    }

    animateThemeBanner(banner) {
        banner.style.transform = 'scale(0.9) translateY(50px)';
        banner.style.opacity = '0';
        
        setTimeout(() => {
            banner.style.transition = 'all 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)';
            banner.style.transform = 'scale(1) translateY(0)';
            banner.style.opacity = '1';
        }, 100);
    }

    // ===== UTILITY METHODS =====
    isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

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

    debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }
}

// ===== ENHANCED PAGE LOADING ANIMATIONS (DISABLED) =====
class LoadingAnimator {
    constructor() {
        // Loading screen disabled to ensure immediate content visibility
        this.init();
    }

    init() {
        // Skip loading screen, show content immediately
        this.animatePageEntrance();
    }

    animatePageEntrance() {
        // Subtle navbar animation only
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.style.transition = 'all 0.3s ease';
        }
    }
}

// ===== INITIALIZE ANIMATIONS =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main animation controller
    const animationController = new AnimationController();
    
    // Initialize loading animations (simplified)
    const loadingAnimator = new LoadingAnimator();
    
    // Make animation controller globally available for debugging
    window.animationController = animationController;
    
    console.log('🎬 Animations initialized - Content visible!');
});

// ===== PERFORMANCE MONITORING =====
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log(`⚡ Page load time: ${perfData.loadEventEnd - perfData.loadEventStart}ms`);
        }, 0);
    });
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
document.addEventListener('keydown', (e) => {
    // Respect user's motion preferences
    if (e.key === 'Escape') {
        // Remove any active animations that might be overwhelming
        document.querySelectorAll('.animate-pulse, .animate-float, .animate-wave').forEach(el => {
            el.style.animation = 'none';
        });
    }
});

// Reduce motion for users who prefer it
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');
    document.documentElement.style.setProperty('--animation-iteration-count', '1');
}