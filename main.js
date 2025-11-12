// Wabi-Sabi Perfume Brand - Main JavaScript
// Handles animations, interactions, and navigation

class WabiSabiApp {
    constructor() {
        this.isAnimating = false;
        this.smokeParticles = [];
        this.scrollPosition = 0;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeAnimations();
        this.setupNavigation();
        this.createSmokeEffect();
        this.setupScrollEffects();
    }

    setupEventListeners() {
        // Touch and scroll events
        document.addEventListener('touchstart', this.handleTouchStart.bind(this));
        document.addEventListener('scroll', this.handleScroll.bind(this));
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Fragrance card interactions
        const cards = document.querySelectorAll('.fragrance-card');
        cards.forEach(card => {
            card.addEventListener('touchstart', this.handleCardTouch.bind(this));
            card.addEventListener('click', this.handleCardClick.bind(this));
        });

        // Navigation
        const navToggle = document.querySelector('.nav-toggle');
        if (navToggle) {
            navToggle.addEventListener('click', this.toggleNavigation.bind(this));
        }
    }

    initializeAnimations() {
        // Animate hero text on load
        this.animateHeroText();
        
        // Setup intersection observer for scroll animations
        this.setupIntersectionObserver();
    }

    animateHeroText() {
        const headline = document.querySelector('.hero-headline');
        if (headline) {
            // Split text into characters for animation
            const text = headline.textContent;
            headline.innerHTML = text.split('').map(char => 
                `<span class="char">${char === ' ' ? '&nbsp;' : char}</span>`
            ).join('');

            // Animate characters with stagger
            anime({
                targets: '.hero-headline .char',
                opacity: [0, 1],
                translateY: [20, 0],
                delay: anime.stagger(100),
                duration: 800,
                easing: 'easeOutQuart'
            });
        }
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe elements for scroll animations
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    animateElement(element) {
        const animationType = element.dataset.animation;
        
        switch(animationType) {
            case 'fade-up':
                anime({
                    targets: element,
                    opacity: [0, 1],
                    translateY: [30, 0],
                    duration: 1000,
                    easing: 'easeOutQuart'
                });
                break;
            case 'crack-grow':
                this.animateCrackGrowth(element);
                break;
            case 'steam-rise':
                this.animateSteam(element);
                break;
            case 'leaves-fall':
                this.animateLeaves(element);
                break;
        }
    }

    createSmokeEffect() {
        const canvas = document.getElementById('smoke-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Create smoke particles
        for (let i = 0; i < 20; i++) {
            this.smokeParticles.push({
                x: Math.random() * canvas.width,
                y: canvas.height + Math.random() * 100,
                radius: Math.random() * 3 + 1,
                opacity: Math.random() * 0.5 + 0.1,
                speedY: Math.random() * 0.5 + 0.2,
                speedX: Math.random() * 0.2 - 0.1,
                life: Math.random() * 100 + 50
            });
        }

        this.animateSmoke(ctx, canvas);
    }

    animateSmoke(ctx, canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.smokeParticles.forEach((particle, index) => {
            // Update particle
            particle.y -= particle.speedY;
            particle.x += particle.speedX;
            particle.life--;
            particle.opacity *= 0.99;

            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(168, 165, 160, ${particle.opacity})`;
            ctx.fill();

            // Reset particle when it dies or goes off screen
            if (particle.life <= 0 || particle.y < -10) {
                particle.y = canvas.height + Math.random() * 50;
                particle.x = Math.random() * canvas.width;
                particle.life = Math.random() * 100 + 50;
                particle.opacity = Math.random() * 0.5 + 0.1;
            }
        });

        requestAnimationFrame(() => this.animateSmoke(ctx, canvas));
    }

    handleCardTouch(event) {
        const card = event.currentTarget;
        
        // Add gentle lift animation
        anime({
            targets: card,
            translateY: [-5, 0],
            scale: [1, 1.02, 1],
            duration: 600,
            easing: 'easeOutQuart'
        });

        // Animate steam effect for silence card
        if (card.classList.contains('silence-card')) {
            this.animateSteamEffect(card);
        }

        // Fill shop button
        const button = card.querySelector('.shop-button');
        if (button) {
            anime({
                targets: button,
                backgroundColor: ['transparent', '#B8A082'],
                color: ['#4A5D4A', '#F8F6F0'],
                duration: 400,
                easing: 'easeOutQuart'
            });
        }
    }

    handleCardClick(event) {
        const card = event.currentTarget;
        const haiku = card.querySelector('.haiku');
        
        if (haiku) {
            // Reveal haiku with gentle animation
            anime({
                targets: haiku,
                opacity: [0, 1],
                translateY: [10, 0],
                duration: 800,
                easing: 'easeOutQuart'
            });
        }
    }

    animateSteamEffect(card) {
        const steam = card.querySelector('.steam-effect');
        if (steam) {
            anime({
                targets: steam,
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.1, 1],
                duration: 2000,
                loop: 3,
                easing: 'easeInOutSine'
            });
        }
    }

    setupScrollEffects() {
        let ticking = false;

        const updateScrollEffects = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;

            // Update smoke intensity based on scroll
            const smokeCanvas = document.getElementById('smoke-canvas');
            if (smokeCanvas) {
                const opacity = Math.max(0, 1 - scrollY / windowHeight);
                smokeCanvas.style.opacity = opacity;
            }

            // Parallax effect for hero background
            const hero = document.querySelector('.hero-section');
            if (hero) {
                const yPos = -(scrollY * 0.5);
                hero.style.transform = `translateY(${yPos}px)`;
            }

            ticking = false;
        };

        this.handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        };
    }

    setupNavigation() {
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                this.toggleNavigation();
            });
        }

        // Close menu when clicking outside
        document.addEventListener('click', (event) => {
            if (!navMenu?.contains(event.target) && !navToggle?.contains(event.target)) {
                this.closeNavigation();
            }
        });

        // Swipe gesture for navigation
        let touchStartY = 0;
        let touchEndY = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartY = e.changedTouches[0].screenY;
        });

        document.addEventListener('touchend', (e) => {
            touchEndY = e.changedTouches[0].screenY;
            this.handleSwipeGesture();
        });

        this.handleSwipeGesture = () => {
            const swipeThreshold = 50;
            const diff = touchStartY - touchEndY;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe up - open menu
                    this.openNavigation();
                } else {
                    // Swipe down - close menu
                    this.closeNavigation();
                }
            }
        };
    }

    toggleNavigation() {
        const navMenu = document.querySelector('.nav-menu');
        const isOpen = navMenu?.classList.contains('active');
        
        if (isOpen) {
            this.closeNavigation();
        } else {
            this.openNavigation();
        }
    }

    openNavigation() {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            navMenu.classList.add('active');
            anime({
                targets: navMenu,
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 400,
                easing: 'easeOutQuart'
            });
        }
    }

    closeNavigation() {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            anime({
                targets: navMenu,
                opacity: [1, 0],
                translateY: [0, -20],
                duration: 300,
                easing: 'easeInQuart',
                complete: () => {
                    navMenu.classList.remove('active');
                }
            });
        }
    }

    animateCrackGrowth(element) {
        const cracks = element.querySelectorAll('.crack-line');
        cracks.forEach((crack, index) => {
            anime({
                targets: crack,
                strokeDashoffset: [100, 0],
                duration: 2000,
                delay: index * 500,
                easing: 'easeInOutSine'
            });
        });
    }

    animateSteam(element) {
        const steam = element.querySelector('.steam-wisps');
        if (steam) {
            anime({
                targets: steam,
                opacity: [0, 0.6, 0],
                translateY: [0, -20, -40],
                duration: 3000,
                loop: true,
                easing: 'easeInOutSine'
            });
        }
    }

    animateLeaves(element) {
        const leaves = element.querySelectorAll('.falling-leaf');
        leaves.forEach((leaf, index) => {
            anime({
                targets: leaf,
                translateY: [-50, window.innerHeight],
                translateX: [0, Math.random() * 100 - 50],
                rotate: [0, 360],
                duration: 8000 + Math.random() * 4000,
                delay: index * 1000,
                loop: true,
                easing: 'easeInOutSine'
            });
        });
    }

    handleTouchStart(event) {
        // Prevent default touch behaviors that might interfere
        if (event.target.closest('.fragrance-card')) {
            // Allow card interactions
        } else {
            // Prevent scrolling during animations
        }
    }

    handleResize() {
        // Update canvas size for smoke effect
        const canvas = document.getElementById('smoke-canvas');
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    }

    // Utility function to check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Smooth scroll to element
    scrollToElement(element, duration = 1000) {
        const targetPosition = element.offsetTop;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = this.ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        };

        requestAnimationFrame(animation);
    }

    // Easing function for smooth scroll
    ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WabiSabiApp();
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is hidden
    } else {
        // Resume animations when page is visible
    }
});

// Reduced motion preference check
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Disable or reduce animations for users who prefer reduced motion
    document.documentElement.classList.add('reduced-motion');
}