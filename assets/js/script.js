/* ===================================
   DEVFOLIO-INSPIRED PORTFOLIO - JAVASCRIPT
   Features: Custom Cursor, GSAP Animations,
   Soundbar, Theme Toggle, Menu, Typed Effect
   ================================ */

// ===================================
// Check if GSAP loaded
// ===================================
console.log('🎬 GSAP Status:', typeof gsap !== 'undefined' ? 'LOADED ✅' : 'FAILED ❌');
if (typeof gsap !== 'undefined') {
    console.log('📦 GSAP Version:', gsap.version);
    gsap.registerPlugin(ScrollTrigger);
    console.log('🔌 ScrollTrigger:', typeof ScrollTrigger !== 'undefined' ? 'REGISTERED ✅' : 'FAILED ❌');
} else {
    console.error('❌ GSAP NOT LOADED! Check assets/js/gsap.min.js');
}


// ===================================
// Progress Bar
// ===================================
class ProgressBar {
    constructor() {
        this.progressBar = document.querySelector('.progress-bar');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercentage = (scrollTop / scrollHeight);

            gsap.to(this.progressBar, {
                scaleX: scrollPercentage,
                duration: 0.1,
                ease: 'none'
            });
        });
    }
}

// ===================================
// Menu Toggle
// ===================================
class Menu {
    constructor(soundEffects) {
        this.menuCheckbox = document.getElementById('menu-toggle');
        this.menuLinks = document.querySelectorAll('.menu-link');
        this.menuContent = document.querySelector('.menu-content');
        this.soundEffects = soundEffects;

        console.log('🍔 Menu initialized');
        console.log('   - Checkbox:', this.menuCheckbox ? '✅' : '❌');
        console.log('   - Menu links:', this.menuLinks.length);
        console.log('   - Menu content:', this.menuContent ? '✅' : '❌');

        this.init();
    }

    init() {
        if (!this.menuCheckbox || !this.menuContent) {
            console.error('❌ Menu elements not found!');
            return;
        }

        // Animate menu content on open/close
        this.menuCheckbox.addEventListener('change', () => {
            this.soundEffects.playMenuSound();
            console.log('🍔 Menu toggled:', this.menuCheckbox.checked ? 'OPEN' : 'CLOSED');

            if (this.menuCheckbox.checked) {
                // Check if GSAP is available
                if (typeof gsap === 'undefined') {
                    console.error('❌ GSAP not available for menu animation!');
                    return;
                }

                console.log('🎬 Playing menu animation...');

                // Menu opening - POP animation
                gsap.fromTo(this.menuContent,
                    {
                        scale: 0,
                        opacity: 0,
                        rotation: -10
                    },
                    {
                        scale: 1,
                        opacity: 1,
                        rotation: 0,
                        duration: 0.5,
                        ease: 'back.out(1.7)',
                        onComplete: () => console.log('✅ Menu animation complete!')
                    }
                );

                // Stagger animate menu items
                gsap.from('.menu-link', {
                    opacity: 0,
                    y: 30,
                    duration: 0.4,
                    stagger: 0.1,
                    delay: 0.2,
                    ease: 'power2.out'
                });
            }
        });

        // Close menu when clicking on a link
        this.menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.soundEffects.playClickSound();
                console.log('🔗 Menu link clicked:', link.textContent);
                this.menuCheckbox.checked = false;
            });
        });

        // Close menu on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.menuCheckbox.checked) {
                console.log('⌨️ ESC pressed - closing menu');
                this.menuCheckbox.checked = false;
            }
        });

        console.log('✅ Menu event listeners attached');
    }
}

// ===================================
// Theme Toggle
// ===================================
class ThemeToggle {
    constructor() {
        this.themeToggle = document.querySelector('.theme-toggle');
        this.body = document.body;
        this.init();
    }

    init() {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            this.body.classList.add('light-theme');
        }

        // Toggle theme
        this.themeToggle.addEventListener('click', () => {
            this.body.classList.toggle('light-theme');

            // Save preference
            if (this.body.classList.contains('light-theme')) {
                localStorage.setItem('theme', 'light');
            } else {
                localStorage.setItem('theme', 'dark');
            }

            // Trigger scroll event to update header background
            window.dispatchEvent(new Event('scroll'));
        });
    }
}

// ===================================
// Soundbar
// ===================================
class Soundbar {
    constructor() {
        this.soundbar = document.querySelector('.soundbar');
        this.audio = document.getElementById('background-music');
        this.isPlaying = false;
        this.init();
    }

    init() {
        if (!this.audio || !this.soundbar) return;

        this.soundbar.addEventListener('click', () => {
            if (this.isPlaying) {
                this.audio.pause();
                this.soundbar.classList.remove('playing');
            } else {
                this.audio.play();
                this.soundbar.classList.add('playing');
            }
            this.isPlaying = !this.isPlaying;
        });
    }
}

// ===================================
// Typed Text Effect
// ===================================
class TypedText {
    constructor() {
        this.element = document.querySelector('.typed-text');
        this.strings = [
            'Programmer',
            'Mobile Developer',
            'Web Developer',
            'Freelancer',
            'Problem Solver'
        ];
        this.currentStringIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.typingSpeed = 100;
        this.deletingSpeed = 50;
        this.pauseTime = 2000;

        this.init();
    }

    init() {
        if (!this.element) return;
        this.type();
    }

    type() {
        const currentString = this.strings[this.currentStringIndex];

        if (this.isDeleting) {
            this.element.textContent = currentString.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
        } else {
            this.element.textContent = currentString.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
        }

        let timeout = this.isDeleting ? this.deletingSpeed : this.typingSpeed;

        if (!this.isDeleting && this.currentCharIndex === currentString.length) {
            timeout = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentCharIndex === 0) {
            this.isDeleting = false;
            this.currentStringIndex = (this.currentStringIndex + 1) % this.strings.length;
        }

        setTimeout(() => this.type(), timeout);
    }
}

// ===================================
// Accordion Functionality
// ===================================
class Accordion {
    constructor() {
        this.accordionButtons = document.querySelectorAll('.accordion-button');
        console.log('📋 Accordion initialized - Found', this.accordionButtons.length, 'buttons');
        this.init();
    }

    init() {
        this.accordionButtons.forEach((button, index) => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();  // Prevent event from bubbling up

                const accordionItem = button.parentElement;
                const wasActive = accordionItem.classList.contains('active');

                // Toggle the clicked item only (allow multiple items open)
                accordionItem.classList.toggle('active');

                console.log(`📋 Accordion item ${index + 1}: ${wasActive ? 'CLOSED' : 'OPENED'}`);
            });
        });
        console.log('✅ Accordion event listeners attached');
    }
}

// ===================================
// GSAP Scroll Animations
// ===================================
class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        // Fade in sections
        gsap.utils.toArray('.section').forEach(section => {
            gsap.from(section, {
                opacity: 0,
                y: 50,
                duration: 1,
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    end: 'top 50%',
                    scrub: 1
                }
            });
        });

        // Section headers animation
        gsap.utils.toArray('.section-header').forEach(header => {
            gsap.from(header, {
                opacity: 0,
                y: 30,
                duration: 0.8,
                scrollTrigger: {
                    trigger: header,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            });
        });

        // Skills cards stagger animation - DISABLED TO FIX VISIBILITY
        // Skills will be visible immediately without animation
        /* const skillCards = gsap.utils.toArray('.skill-card');
        if (skillCards.length > 0) {
            gsap.from(skillCards, {
                opacity: 0,
                y: 50,
                scale: 0.9,
                duration: 0.6,
                stagger: 0.1,
                scrollTrigger: {
                    trigger: '.skills-grid',
                    start: 'top 90%',
                    toggleActions: 'play none none none'
                }
            });
        } */

        // About info items animation
        const infoItems = gsap.utils.toArray('.info-item');
        if (infoItems.length > 0) {
            gsap.from(infoItems, {
                opacity: 0,
                x: -50,
                duration: 0.8,
                stagger: 0.15,
                scrollTrigger: {
                    trigger: '.about-info',
                    start: 'top 75%',
                    toggleActions: 'play none none reverse'
                }
            });
        }

        // Project cards hover animation with GSAP
        this.initProjectCards();

        // Collaboration section animations
        this.initCollaborationAnimation();

        // Contact form animation
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            gsap.from(contactForm, {
                opacity: 0,
                x: -50,
                duration: 1,
                scrollTrigger: {
                    trigger: contactForm,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            });
        }

        const contactInfo = document.querySelector('.contact-info');
        if (contactInfo) {
            gsap.from(contactInfo, {
                opacity: 0,
                x: 50,
                duration: 1,
                scrollTrigger: {
                    trigger: contactInfo,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            });
        }

        // Footer animation
        const footer = document.querySelector('.footer');
        if (footer) {
            gsap.from(footer, {
                opacity: 0,
                y: 50,
                duration: 1,
                scrollTrigger: {
                    trigger: footer,
                    start: 'top 90%',
                    toggleActions: 'play none none reverse'
                }
            });
        }
    }

    initProjectCards() {
        const projectCards = document.querySelectorAll('.project-card');

        projectCards.forEach((card, index) => {
            const browserSection = card.querySelector('.project-browser');
            const infoSection = card.querySelector('.project-info');

            // Animate left section (browser mockup) - slide in from left with fade
            if (browserSection) {
                gsap.from(browserSection, {
                    opacity: 0,
                    x: -100,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    },
                    delay: index * 0.1
                });
            }

            // Animate right section (project info) - slide in from right with fade
            if (infoSection) {
                gsap.from(infoSection, {
                    opacity: 0,
                    x: 100,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    },
                    delay: index * 0.1 + 0.2
                });
            }

            // Hover animation for card container
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    boxShadow: '0 20px 60px rgba(139, 49, 255, 0.4)',
                    duration: 0.4,
                    ease: 'power2.out'
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                    duration: 0.4,
                    ease: 'power2.out'
                });
            });
        });

        console.log('✅ Project cards GSAP animations initialized');
    }

    initCollaborationAnimation() {
        const collaborationTitle = document.querySelector('.collaboration-title');

        if (collaborationTitle) {
            // Simple fade-in animation for the title
            gsap.from(collaborationTitle, {
                opacity: 0,
                y: 30,
                duration: 1,
                scrollTrigger: {
                    trigger: collaborationTitle,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            });
        }

        // No GSAP animations for scrolling text - pure CSS animations handle it
        console.log('✅ Collaboration section initialized with CSS animations');
    }
}

// ===================================
// Contact Form Handler
// ===================================
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.init();
    }

    init() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => {
            // Form will submit to Web3Forms
            // You can add custom validation here if needed
        });
    }
}

// ===================================
// Smooth Scroll for Anchor Links
// ===================================
class SmoothScroll {
    constructor() {
        this.links = document.querySelectorAll('a[href^="#"]');
        this.init();
    }

    init() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');

                if (href === '#' || href === '#home') {
                    e.preventDefault();
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                    return;
                }

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const offsetTop = target.offsetTop - 100;

                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ===================================
// Header Scroll Effect
// ===================================
class HeaderScroll {
    constructor() {
        this.header = document.querySelector('.header');
        this.init();
    }

    init() {
        if (!this.header) return;

        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            const isLightMode = document.body.classList.contains('light-theme');

            if (currentScroll > 100) {
                // Check if light mode or dark mode
                if (isLightMode) {
                    this.header.style.background = 'rgba(255, 255, 255, 0.95)';
                    this.header.style.backdropFilter = 'blur(20px)';
                    this.header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                } else {
                    this.header.style.background = 'rgba(0, 0, 0, 0.95)';
                    this.header.style.backdropFilter = 'blur(20px)';
                    this.header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
                }
            } else {
                // At the top - use gradient
                if (isLightMode) {
                    this.header.style.background = 'linear-gradient(to bottom, rgba(255, 255, 255, 0.8), transparent)';
                    this.header.style.backdropFilter = 'blur(10px)';
                    this.header.style.boxShadow = 'none';
                } else {
                    this.header.style.background = 'linear-gradient(to bottom, rgba(0, 0, 0, 0.8), transparent)';
                    this.header.style.backdropFilter = 'blur(10px)';
                    this.header.style.boxShadow = 'none';
                }
            }

            lastScroll = currentScroll;
        });
    }
}

// ===================================
// Parallax Effect for Hero Section - DISABLED
// ===================================
// Removed to prevent gap between hero and about sections

// ===================================
// Semi-Circular Skills Wheel with GSAP (Draggable + Snap)
// ===================================
class SkillsWheel {
    constructor() {
        this.wheel = document.getElementById('skillsWheel');
        this.cards = document.querySelectorAll('.skill-card');
        this.descriptionBox = document.getElementById('skillDescription');
        this.dragIndicator = document.querySelector('.drag-me-indicator');
        this.collisionPoint = document.getElementById('collisionPoint');
        this.sphere = document.querySelector('.sphere');

        this.currentRotation = 0;
        this.isDragging = false;
        this.activeIndex = null;
        this.velocity = 0;
        this.lastAngle = 0;
        this.lastTime = Date.now();

        // Auto-spin properties
        this.isAutoSpinning = false;
        this.autoSpinSpeed = 0.15; // Slow rotation speed (degrees per frame)
        this.autoSpinAnimation = null;
        this.inactivityTimer = null;
        this.inactivityDelay = 7000; // 7 seconds

        this.init();
    }

    init() {
        if (!this.wheel || this.cards.length === 0) {
            console.error('❌ Skills wheel elements not found!');
            return;
        }

        console.log('🎡 Semi-circular wheel initialized with', this.cards.length, 'skills');

        // Position cards in a circle
        this.positionCards();

        // Hide description initially during auto-spin
        this.hideDescription();

        // Setup drag functionality
        this.setupDrag();

        // Add resize listener to reposition cards
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                console.log('📐 Window resized - repositioning cards');
                this.positionCards();
            }, 250);
        });

        // Start auto-spin after a short delay
        setTimeout(() => {
            console.log('🚀 Starting auto-spin...');
            this.startAutoSpin();
        }, 500);
    }

    positionCards() {
        // RESPONSIVE RADIUS - adjusts based on screen width
        let radius;
        const screenWidth = window.innerWidth;

        if (screenWidth <= 480) {
            // Small mobile - 600px wheel = 300px radius / 2 = 150px usable
            radius = 230;
        } else if (screenWidth <= 768) {
            // Mobile - 800px wheel = 400px radius / 2 = 200px usable
            radius = 320;
        } else if (screenWidth <= 1024) {
            // Tablet - 1200px wheel = 600px radius / 2 = 300px usable
            radius = 500;
        } else {
            // Desktop - 1400px wheel = 700px radius / 2 = 350px usable
            radius = 550;
        }

        console.log('🎡 Positioning cards with radius:', radius, 'px for screen width:', screenWidth, 'px');

        // FULL CIRCLE positioning - all 360 degrees
        const angleStep = (2 * Math.PI) / this.cards.length;

        this.cards.forEach((card, index) => {
            const angle = angleStep * index;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            // NO ROTATION - Keep cards perfectly square and straight!
            gsap.set(card, {
                x: x,
                y: y,
                rotation: 0
            });
        });
    }

    setupDrag() {
        let startAngle = 0;

        // Get angle from mouse position
        const getAngle = (e) => {
            const rect = this.wheel.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const clientY = e.clientY || (e.touches && e.touches[0].clientY);

            return Math.atan2(clientY - centerY, clientX - centerX);
        };

        const onMouseDown = (e) => {
            e.preventDefault();
            this.isDragging = true;
            const angle = getAngle(e);
            startAngle = angle - (this.currentRotation * Math.PI / 180);
            this.lastAngle = angle;
            this.lastTime = Date.now();
            this.velocity = 0;

            // Stop auto-spin on interaction
            this.stopAutoSpin();
            this.clearInactivityTimer();

            // Scale down sphere when dragging
            if (this.sphere) {
                this.sphere.classList.add('is-active');
            }

            console.log('🖱️ Drag started');
        };

        const onMouseMove = (e) => {
            if (!this.isDragging) return;

            const currentTime = Date.now();
            const currentAngle = getAngle(e);
            const deltaTime = currentTime - this.lastTime;

            if (deltaTime > 0) {
                let deltaAngle = currentAngle - this.lastAngle;

                // Handle angle wrap-around
                if (deltaAngle > Math.PI) deltaAngle -= 2 * Math.PI;
                if (deltaAngle < -Math.PI) deltaAngle += 2 * Math.PI;

                // Calculate velocity
                this.velocity = deltaAngle / deltaTime * 16;
            }

            const rotation = (currentAngle - startAngle) * 180 / Math.PI;
            this.currentRotation = rotation;

            gsap.set(this.wheel, {
                rotation: rotation
            });

            // Update card rotations to keep them upright
            this.updateCardRotations();

            this.lastAngle = currentAngle;
            this.lastTime = currentTime;
        };

        const onMouseUp = () => {
            if (!this.isDragging) return;

            this.isDragging = false;

            // Scale up sphere when drag ends
            if (this.sphere) {
                this.sphere.classList.remove('is-active');
            }

            console.log('🖱️ Drag ended - velocity:', this.velocity.toFixed(3));

            // Apply inertia/momentum
            if (Math.abs(this.velocity) > 0.001) {
                this.applyMomentum();
            } else {
                // Snap to nearest card immediately
                this.snapToNearest();
            }

            // Start inactivity timer to resume auto-spin
            this.startInactivityTimer();
        };

        this.wheel.addEventListener('mousedown', onMouseDown);
        this.wheel.addEventListener('touchstart', onMouseDown);

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('touchmove', onMouseMove);

        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('touchend', onMouseUp);
    }

    applyMomentum() {
        const momentumStep = () => {
            // Apply friction
            this.velocity *= 0.95;

            // Stop when velocity is too small
            if (Math.abs(this.velocity) < 0.001) {
                // Snap to nearest card
                this.snapToNearest();
                return;
            }

            // Apply velocity to rotation
            this.currentRotation += this.velocity * 2;

            gsap.set(this.wheel, {
                rotation: this.currentRotation
            });

            // Update card rotations
            this.updateCardRotations();

            // Continue animation
            requestAnimationFrame(momentumStep);
        };

        momentumStep();
    }

    snapToNearest() {
        const anglePerCard = 360 / this.cards.length;

        // Calculate nearest snap position
        const nearestSnap = Math.round(this.currentRotation / anglePerCard) * anglePerCard;

        // Animate to snap position
        gsap.to(this.wheel, {
            rotation: nearestSnap,
            duration: 0.3,
            ease: 'power2.out',
            onUpdate: () => {
                this.currentRotation = gsap.getProperty(this.wheel, 'rotation');
                this.updateCardRotations();
            },
            onComplete: () => {
                this.currentRotation = nearestSnap;
                this.detectActiveCard();
            }
        });

        console.log('📍 Snapping to', nearestSnap, 'degrees');
    }

    detectActiveCard() {
        // Find the card CLOSEST to the top-center collision point
        const collisionRect = this.collisionPoint.getBoundingClientRect();
        const collisionCenterX = collisionRect.left + collisionRect.width / 2;
        const collisionCenterY = collisionRect.top + collisionRect.height / 2;

        let closestIndex = null;
        let closestDistance = Infinity;

        this.cards.forEach((card, index) => {
            const cardRect = card.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;

            // Calculate distance from card center to collision point center
            const dx = cardCenterX - collisionCenterX;
            const dy = cardCenterY - collisionCenterY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
            }
        });

        this.setActiveCard(closestIndex);
    }

    setActiveCard(index) {
        this.activeIndex = index;

        // Update card classes
        this.cards.forEach((card, i) => {
            if (i === index) {
                card.classList.add('focused');
            } else {
                card.classList.remove('focused');
            }
        });

        // Update description
        if (index !== null) {
            const card = this.cards[index];
            const skillName = card.dataset.skill;
            const skillDesc = card.dataset.description;

            const nameEl = this.descriptionBox.querySelector('.skill-name');
            const descEl = this.descriptionBox.querySelector('.skill-desc');

            if (nameEl) nameEl.textContent = skillName;
            if (descEl) descEl.textContent = skillDesc;

            this.showDescription();

            console.log('✨ Active skill:', skillName);
        } else {
            this.hideDescription();
        }
    }

    updateCardRotations() {
        const wheelRotation = gsap.getProperty(this.wheel, 'rotation');

        // Keep ALL cards at 0 rotation - perfectly square and straight!
        this.cards.forEach((card) => {
            gsap.set(card, {
                rotation: -wheelRotation // Counter-rotate to keep cards straight
            });
        });
    }

    showDescription() {
        gsap.to(this.descriptionBox, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out',
            onStart: () => {
                this.descriptionBox.classList.add('visible');
            }
        });
    }

    hideDescription() {
        gsap.to(this.descriptionBox, {
            opacity: 0,
            y: 20,
            duration: 0.4,
            ease: 'power2.in',
            onComplete: () => {
                this.descriptionBox.classList.remove('visible');
            }
        });
    }

    startAutoSpin() {
        if (this.isAutoSpinning) return; // Already spinning

        this.isAutoSpinning = true;

        // Remove active card and hide description during auto-spin
        this.cards.forEach(card => card.classList.remove('focused'));
        this.hideDescription();

        const spinStep = () => {
            if (!this.isAutoSpinning) return;

            // Slowly rotate the wheel
            this.currentRotation += this.autoSpinSpeed;

            gsap.set(this.wheel, {
                rotation: this.currentRotation
            });

            // Update card rotations to keep them upright
            this.updateCardRotations();

            // Continue animation
            this.autoSpinAnimation = requestAnimationFrame(spinStep);
        };

        console.log('🔄 Auto-spin started');
        spinStep();
    }

    stopAutoSpin() {
        if (!this.isAutoSpinning) return;

        this.isAutoSpinning = false;

        if (this.autoSpinAnimation) {
            cancelAnimationFrame(this.autoSpinAnimation);
            this.autoSpinAnimation = null;
        }

        console.log('⏸️ Auto-spin stopped');
    }

    startInactivityTimer() {
        this.clearInactivityTimer();

        this.inactivityTimer = setTimeout(() => {
            console.log('⏰ Inactivity detected - resuming auto-spin');
            this.startAutoSpin();
        }, this.inactivityDelay);
    }

    clearInactivityTimer() {
        if (this.inactivityTimer) {
            clearTimeout(this.inactivityTimer);
            this.inactivityTimer = null;
        }
    }
}

// ===================================
// Particle Background with Three.js
// ===================================
class ParticleBackground {
    constructor() {
        this.container = document.getElementById('particle-background');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.mouse = { x: 0, y: 0 };
        this.targetMouse = { x: 0, y: 0 };

        this.init();
    }

    init() {
        if (!this.container || typeof THREE === 'undefined') {
            console.error('❌ Three.js or container not found!');
            return;
        }

        console.log('🌌 Initializing particle background...');

        // Set up scene
        this.scene = new THREE.Scene();

        // Set up camera
        this.camera = new THREE.PerspectiveCamera(
            20,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;

        // Set up renderer
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearAlpha(0);
        this.container.appendChild(this.renderer.domElement);

        // Create particles
        this.createParticles();

        // Mouse movement
        window.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        // Handle resize
        window.addEventListener('resize', () => this.handleResize());

        // Start animation
        this.animate();

        console.log('✅ Particle background initialized');
    }

    createParticles() {
        const numParticles = 500;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(numParticles * 3);
        const colors = new Float32Array(numParticles * 3);

        for (let i = 0; i < numParticles; i++) {
            // Random positions
            positions[i * 3] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

            // Alternate between white and blue particles
            if (i % 2 === 0) {
                // White particles
                colors[i * 3] = 1.0;     // R
                colors[i * 3 + 1] = 1.0; // G
                colors[i * 3 + 2] = 1.0; // B
            } else {
                // Blue particles (#4276C3)
                colors[i * 3] = 66 / 255;   // R
                colors[i * 3 + 1] = 118 / 255; // G
                colors[i * 3 + 2] = 195 / 255; // B
            }
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.02,
            vertexColors: true
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Wave motion
        const time = Date.now() * 0.0001;
        const positions = this.particles.geometry.attributes.position.array;

        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] = Math.sin(i / 100 + time);
        }

        this.particles.geometry.attributes.position.needsUpdate = true;

        // Smooth mouse interaction
        this.targetMouse.x += (this.mouse.x * 0.2 - this.targetMouse.x) * 0.02;
        this.targetMouse.y += (-this.mouse.y * 0.2 - this.targetMouse.y) * 0.02;

        // Rotate particles towards mouse
        gsap.to(this.particles.rotation, {
            x: this.targetMouse.x,
            y: this.targetMouse.y,
            duration: 1,
        });

        this.renderer.render(this.scene, this.camera);
    }

    handleResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// ===================================
// Sound Effects
// ===================================
class SoundEffects {
    constructor() {
        this.menuSound = new Audio('assets/soundeffect/pop-sound.wav');
        this.clickSound = new Audio('assets/soundeffect/mouse-click.mp3');
        this.menuSound.preload = 'auto';
        this.clickSound.preload = 'auto';
    }

    playMenuSound() {
        this.menuSound.currentTime = 0;
        this.menuSound.play();
    }

    playClickSound() {
        this.clickSound.currentTime = 0;
        this.clickSound.play();
    }
}

// ===================================
// Initialize Everything
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    const soundEffects = new SoundEffects();

    // Initialize all components
    new ParticleBackground();
    new ProgressBar();
    new Menu(soundEffects);
    new ThemeToggle();
    new Soundbar();
    new TypedText();
    new Accordion();
    new SkillsWheel();
    new ScrollAnimations();
    new ContactForm();
    new SmoothScroll();
    new HeaderScroll();
    new CertificateLightbox(soundEffects);
    new CollaborationAnimations();
    // ParallaxEffect removed to prevent gap between sections

    // Add click sound to all relevant elements
    document.querySelectorAll('.link, .accordion-button, .project-btn, .theme-toggle, .certificate-image, .download-cv-btn').forEach(element => {
        element.addEventListener('click', () => {
            soundEffects.playClickSound();
        });
    });

    // Initial page load animation
    gsap.from('.hero-content', {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out'
    });

    // Social links - SET to fully visible immediately (no animation)
    gsap.set('.social-links a', {
        opacity: 1,
        x: 0
    });

    // Loading animation complete
    console.log('Portfolio loaded successfully! ✨');
});

// ===================================
// Certificate Lightbox
// ===================================
class CertificateLightbox {
    constructor(soundEffects) {
        this.lightbox = document.getElementById('certificateLightbox');
        this.lightboxImage = document.getElementById('lightboxImage');
        this.lightboxClose = document.getElementById('lightboxClose');
        this.certificateImages = document.querySelectorAll('.certificate-image');
        this.soundEffects = soundEffects;

        this.init();
    }

    init() {
        if (!this.lightbox || !this.lightboxImage) {
            console.error('❌ Lightbox elements not found!');
            return;
        }

        console.log('🖼️ Certificate lightbox initialized');

        // Add click event to all certificate images
        this.certificateImages.forEach(imageContainer => {
            imageContainer.addEventListener('click', (e) => {
                const img = imageContainer.querySelector('img');
                if (img) {
                    this.openLightbox(img.src, img.alt);
                }
            });
        });

        // Close button
        this.lightboxClose.addEventListener('click', () => {
            this.soundEffects.playClickSound();
            this.closeLightbox();
        });

        // Click outside to close
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) {
                this.soundEffects.playClickSound();
                this.closeLightbox();
            }
        });

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.lightbox.classList.contains('active')) {
                this.soundEffects.playClickSound();
                this.closeLightbox();
            }
        });

        console.log('✅ Lightbox event listeners attached');
    }

    openLightbox(src, alt) {
        this.lightboxImage.src = src;
        this.lightboxImage.alt = alt;
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        console.log('🖼️ Lightbox opened:', alt);
    }

    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        console.log('🖼️ Lightbox closed');
    }
}

// ===================================
// Collaboration Section Scroll Animations
// ===================================
class CollaborationAnimations {
    constructor() {
        this.elements = document.querySelectorAll('[data-scroll-animation]');
        this.init();
    }

    init() {
        if (!this.elements.length) {
            console.log('⚠️ No collaboration elements found for animation');
            return;
        }

        console.log('✨ Initializing collaboration animations');

        // Create IntersectionObserver for scroll animations
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    console.log('🎬 Animating:', entry.target.className);
                }
            });
        }, observerOptions);

        // Observe all collaboration elements
        this.elements.forEach(element => {
            observer.observe(element);
        });

        console.log('✅ Collaboration animations initialized');
    }
}

// ===================================
// Add resize listener to update animations
// ===================================
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 250);
});
