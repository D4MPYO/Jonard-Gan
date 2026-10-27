/* ===================================
   CUSTOM CURSOR - BRICK GAME SPACESHIP STYLE
   Features: Pixelated spaceship, trailing effect,
   shoot animation on click, retro gaming aesthetic
   Optimized: Batched RAF loop, event delegation, zero MutationObserver
   ================================ */

class CustomCursor {
    constructor() {
        this.cursor = null;
        this.spaceship = null;
        this.particlesContainer = null;
        
        this.particles = [];
        this.maxParticles = 60;
        
        this.mouseX = -100;
        this.mouseY = -100;
        this.cursorX = -100;
        this.cursorY = -100;
        
        this.isHovering = false;
        this.isDragging = false;
        this.isClicking = false;
        this.isDamaged = false;
        this.isInvulnerable = false;
        this.isVisible = false;
        this.rafId = null;
        
        // Cooldowns and limits
        this.lastShootTime = 0;
        this.shootCooldown = 180;
        
        // Falling bricks/rocks system
        this.fallingObjects = [];
        this.maxFallingObjects = 3;
        this.spawnInterval = 3000;
        this.spawnTimer = null;
        
        // Motion preference
        this.reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.init();
    }

    init() {
        this.createSpaceshipCursor();
        this.injectStyles();
        this.trackMouse();
        this.addInteractiveStates();
        
        // Start animation loop
        this.animate = this.animate.bind(this);
        this.rafId = requestAnimationFrame(this.animate);
        
        // Spawn falling objects only if not reduced motion
        if (!this.reducedMotion) {
            this.spawnFallingObjects();
        }

        // Listen for visibility change to pause RAF when tab is hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (this.rafId) {
                    cancelAnimationFrame(this.rafId);
                    this.rafId = null;
                }
            } else if (!this.rafId && window.innerWidth > 768) {
                this.rafId = requestAnimationFrame(this.animate);
            }
        });
    }

    createSpaceshipCursor() {
        // Dedicated container for cursor particles to isolate DOM changes
        this.particlesContainer = document.createElement('div');
        this.particlesContainer.className = 'spaceship-particles-container';
        this.particlesContainer.setAttribute('aria-hidden', 'true');
        document.body.appendChild(this.particlesContainer);

        // Main cursor container
        this.cursor = document.createElement('div');
        this.cursor.className = 'spaceship-cursor';
        this.cursor.setAttribute('aria-hidden', 'true');
        
        // Spaceship element (pixelated brick game style)
        this.spaceship = document.createElement('div');
        this.spaceship.className = 'spaceship';
        this.spaceship.innerHTML = `
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <!-- Spaceship body (brick game style) -->
                <rect x="14" y="4" width="4" height="4" fill="#9f55ff" class="ship-body"/>
                
                <rect x="10" y="8" width="4" height="4" fill="#8b31ff" class="ship-body"/>
                <rect x="14" y="8" width="4" height="4" fill="#9f55ff" class="ship-body"/>
                <rect x="18" y="8" width="4" height="4" fill="#8b31ff" class="ship-body"/>
                
                <rect x="10" y="12" width="4" height="4" fill="#8b31ff" class="ship-body"/>
                <rect x="14" y="12" width="4" height="4" fill="#9f55ff" class="ship-body"/>
                <rect x="18" y="12" width="4" height="4" fill="#8b31ff" class="ship-body"/>
                
                <rect x="6" y="16" width="4" height="4" fill="#7000ff" class="ship-body"/>
                <rect x="10" y="16" width="4" height="4" fill="#8b31ff" class="ship-body"/>
                <rect x="14" y="16" width="4" height="4" fill="#9f55ff" class="ship-body"/>
                <rect x="18" y="16" width="4" height="4" fill="#8b31ff" class="ship-body"/>
                <rect x="22" y="16" width="4" height="4" fill="#7000ff" class="ship-body"/>
                
                <rect x="10" y="20" width="4" height="4" fill="#8b31ff" class="ship-body"/>
                <rect x="14" y="20" width="4" height="4" fill="#9f55ff" class="ship-body"/>
                <rect x="18" y="20" width="4" height="4" fill="#8b31ff" class="ship-body"/>
                
                <rect x="10" y="24" width="4" height="4" fill="#ff6b00" class="flame flame-1"/>
                <rect x="14" y="24" width="4" height="4" fill="#ff9500" class="flame flame-2"/>
                <rect x="18" y="24" width="4" height="4" fill="#ff6b00" class="flame flame-3"/>
                
                <rect x="10" y="28" width="4" height="2" fill="#ff4400" class="flame flame-4"/>
                <rect x="14" y="28" width="4" height="2" fill="#ff6b00" class="flame flame-5"/>
                <rect x="18" y="28" width="4" height="2" fill="#ff4400" class="flame flame-6"/>
            </svg>
        `;
        
        this.cursor.appendChild(this.spaceship);
        document.body.appendChild(this.cursor);
    }

    injectStyles() {
        const style = document.createElement('style');
        style.id = 'spaceship-cursor-styles';
        style.textContent = `
            /* Hide cursor only on pointer-interactive and main elements (avoids * selector) */
            body, a, button, input, textarea, select, label, .link, [role="button"], .theme-toggle, .hamburger {
                cursor: none !important;
            }

            .spaceship-particles-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 99997;
                overflow: hidden;
            }

            /* Spaceship cursor container */
            .spaceship-cursor {
                position: fixed;
                top: 0;
                left: 0;
                pointer-events: none;
                z-index: 99999;
                will-change: transform;
                opacity: 0;
                transition: opacity 0.2s ease;
            }

            .spaceship-cursor.is-visible {
                opacity: 1;
            }

            /* Spaceship SVG */
            .spaceship {
                position: absolute;
                top: 0;
                left: 0;
                width: 32px;
                height: 32px;
                margin-left: -16px;
                margin-top: -16px;
                transform: rotate(-15deg);
                filter: drop-shadow(0 0 8px rgba(159, 85, 255, 0.6));
                image-rendering: pixelated;
                image-rendering: -moz-crisp-edges;
                image-rendering: crisp-edges;
                transition: transform 0.15s ease-out, filter 0.15s ease-out;
            }

            /* Damaged state - red blink effect */
            .spaceship-cursor.damaged .ship-body {
                animation: damageFlash 0.1s ease-in-out 6;
            }

            .spaceship-cursor.damaged .spaceship {
                animation: damageShake 0.1s ease-in-out 6;
            }

            @keyframes damageFlash {
                0%, 100% { fill: #ff0000; }
                50% { fill: #ffffff; }
            }

            @keyframes damageShake {
                0%, 100% { transform: rotate(-15deg); }
                25% { transform: translate(-2px, 0) rotate(-20deg); }
                75% { transform: translate(2px, 0) rotate(-10deg); }
            }

            /* Invulnerable state - flashing effect */
            .spaceship-cursor.invulnerable .spaceship {
                animation: invulnerableFlash 0.15s ease-in-out infinite;
            }

            @keyframes invulnerableFlash {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.3; }
            }

            /* Engine flame animation */
            @keyframes flameFlicker {
                0%, 100% { opacity: 1; transform: scaleY(1); }
                50% { opacity: 0.7; transform: scaleY(0.8); }
            }

            .flame {
                animation: flameFlicker 0.15s infinite;
                transform-origin: center top;
            }

            .flame-1 { animation-delay: 0s; }
            .flame-2 { animation-delay: 0.05s; }
            .flame-3 { animation-delay: 0.1s; }
            .flame-4 { animation-delay: 0.03s; }
            .flame-5 { animation-delay: 0.08s; }
            .flame-6 { animation-delay: 0.12s; }

            /* Trail particle */
            .trail-particle {
                position: absolute;
                width: 12px;
                height: 12px;
                background: linear-gradient(135deg, #ff55ff, #9f55ff, #8b31ff);
                border-radius: 2px;
                pointer-events: none;
                image-rendering: pixelated;
                box-shadow: 0 0 12px rgba(255, 85, 255, 0.9), 0 0 6px rgba(139, 49, 255, 0.6);
                will-change: transform, opacity;
            }

            .trail-particle.damaged-trail {
                background: linear-gradient(135deg, #ff0000, #ff4444, #cc0000);
                box-shadow: 0 0 12px rgba(255, 0, 0, 0.9), 0 0 6px rgba(204, 0, 0, 0.6);
            }

            /* Shoot particle (laser beam) */
            .shoot-particle {
                position: absolute;
                width: 6px;
                height: 20px;
                background: linear-gradient(180deg, #ffffff, #ff55ff, #9f55ff);
                border-radius: 2px;
                pointer-events: none;
                image-rendering: pixelated;
                box-shadow: 0 0 16px rgba(255, 85, 255, 1), 0 0 8px rgba(255, 255, 255, 0.8);
                will-change: transform;
            }

            /* Explosion effect */
            .explosion-particle {
                position: absolute;
                width: 10px;
                height: 10px;
                background: linear-gradient(135deg, #ffffff, #ffff00, #ff9500);
                border-radius: 2px;
                pointer-events: none;
                image-rendering: pixelated;
                box-shadow: 0 0 12px rgba(255, 149, 0, 1), 0 0 6px rgba(255, 255, 255, 0.8);
                will-change: transform, opacity;
            }

            /* Falling brick/rock */
            .falling-object {
                position: absolute;
                width: 24px;
                height: 24px;
                pointer-events: none;
                z-index: 99996;
                image-rendering: pixelated;
                will-change: transform;
            }

            .falling-object.destroyed {
                animation: brickDestroy 0.3s ease-out forwards;
            }

            @keyframes brickDestroy {
                0% { transform: scale(1) rotate(0deg); opacity: 1; }
                100% { transform: scale(0) rotate(360deg); opacity: 0; }
            }

            /* Hover state */
            .spaceship-cursor.hovering .spaceship {
                transform: rotate(-15deg) scale(1.2);
                filter: drop-shadow(0 0 12px rgba(255, 85, 255, 0.8));
            }

            /* Clicking state */
            .spaceship-cursor.clicking .spaceship {
                transform: rotate(-25deg) scale(0.9);
            }

            /* Dragging state */
            .spaceship-cursor.dragging .spaceship {
                animation: spaceshipTilt 0.3s ease-in-out infinite alternate;
            }

            @keyframes spaceshipTilt {
                from { transform: rotate(-25deg); }
                to { transform: rotate(-5deg); }
            }

            /* Light theme adjustments */
            body.light-theme .spaceship svg rect:not(.flame) {
                filter: brightness(0.85);
            }

            /* Hide cursor on mobile or touch */
            @media (max-width: 768px), (pointer: coarse) {
                .spaceship-cursor,
                .spaceship-particles-container,
                .falling-object {
                    display: none !important;
                }
                body, a, button, input, textarea, select, label, .link, [role="button"], .theme-toggle, .hamburger {
                    cursor: auto !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    trackMouse() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            
            if (!this.isVisible) {
                this.isVisible = true;
                this.cursor.classList.add('is-visible');
            }
        }, { passive: true });

        document.addEventListener('mousedown', (e) => {
            const currentTime = performance.now();
            if (currentTime - this.lastShootTime < this.shootCooldown) {
                return;
            }
            this.lastShootTime = currentTime;
            this.isClicking = true;
            this.cursor.classList.add('clicking');
            this.shootLaser(e.clientX, e.clientY);
        });

        document.addEventListener('mouseup', () => {
            this.isClicking = false;
            this.cursor.classList.remove('clicking');
        });

        document.addEventListener('mouseleave', () => {
            this.isVisible = false;
            this.cursor.classList.remove('is-visible');
        });

        document.addEventListener('mouseenter', () => {
            this.isVisible = true;
            this.cursor.classList.add('is-visible');
        });
    }

    addInteractiveStates() {
        // High-performance event delegation replaces per-element listeners and MutationObserver!
        const interactiveSelector = 'a, button, .link, input, textarea, select, .skill-card, .sphere, .project-btn, .certificate-image, .experience-tab, .menu-link, label, [role="button"]';

        document.addEventListener('mouseover', (e) => {
            if (e.target && e.target.closest && e.target.closest(interactiveSelector)) {
                if (!this.isHovering) {
                    this.isHovering = true;
                    this.cursor.classList.add('hovering');
                }
            }
        }, { passive: true });

        document.addEventListener('mouseout', (e) => {
            if (e.target && e.target.closest && e.target.closest(interactiveSelector)) {
                // If leaving the interactive boundary
                const related = e.relatedTarget;
                if (!related || !related.closest || !related.closest(interactiveSelector)) {
                    this.isHovering = false;
                    this.cursor.classList.remove('hovering');
                }
            }
        }, { passive: true });

        // Wheel drag detection
        const skillsWheel = document.getElementById('skillsWheel');
        if (skillsWheel) {
            skillsWheel.addEventListener('mousedown', () => {
                this.isDragging = true;
                this.cursor.classList.add('dragging');
            });

            document.addEventListener('mouseup', () => {
                if (this.isDragging) {
                    this.isDragging = false;
                    this.cursor.classList.remove('dragging');
                }
            });
        }
    }

    takeDamage() {
        if (this.isInvulnerable || this.isDamaged) return;
        
        this.isDamaged = true;
        this.cursor.classList.add('damaged');
        this.createDamageExplosion(this.cursorX, this.cursorY);
        
        setTimeout(() => {
            this.isDamaged = false;
            this.cursor.classList.remove('damaged');
            
            this.isInvulnerable = true;
            this.cursor.classList.add('invulnerable');
            
            setTimeout(() => {
                this.isInvulnerable = false;
                this.cursor.classList.remove('invulnerable');
            }, 1500);
        }, 600);
    }

    createDamageExplosion(x, y) {
        for (let i = 0; i < 10; i++) {
            if (this.particles.length >= this.maxParticles) break;
            const el = document.createElement('div');
            el.className = 'explosion-particle';
            el.style.background = 'linear-gradient(135deg, #ff0000, #ff4444, #cc0000)';
            el.style.boxShadow = '0 0 12px rgba(255, 0, 0, 1), 0 0 6px rgba(255, 255, 255, 0.8)';
            this.particlesContainer.appendChild(el);

            const angle = (Math.PI * 2 * i) / 10;
            const speed = 4 + Math.random() * 3;
            
            this.particles.push({
                el: el,
                type: 'explosion',
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 25,
                maxLife: 25,
                scale: 1
            });
        }
    }

    shootLaser(x, y) {
        if (this.particles.length >= this.maxParticles) return;

        const laser = document.createElement('div');
        laser.className = 'shoot-particle';
        this.particlesContainer.appendChild(laser);

        this.particles.push({
            el: laser,
            type: 'laser',
            x: x - 3,
            y: y - 10,
            vy: -22,
            hasHit: false
        });

        this.createClickExplosion(x, y);
    }

    createClickExplosion(x, y) {
        if (this.particles.length >= this.maxParticles - 6) return;

        for (let i = 0; i < 6; i++) {
            const el = document.createElement('div');
            el.className = 'explosion-particle';
            el.style.width = '8px';
            el.style.height = '8px';
            this.particlesContainer.appendChild(el);

            const angle = (Math.PI * 2 * i) / 6;
            const speed = 3 + Math.random() * 2.5;

            this.particles.push({
                el: el,
                type: 'click-explosion',
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 15,
                maxLife: 15,
                scale: 1
            });
        }
    }

    createTrailParticle(x, y) {
        if (this.particles.length >= this.maxParticles) return;

        const el = document.createElement('div');
        el.className = 'trail-particle' + (this.isDamaged ? ' damaged-trail' : '');
        this.particlesContainer.appendChild(el);

        this.particles.push({
            el: el,
            type: 'trail',
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 1.2,
            vy: 0.5,
            opacity: 1,
            size: 12
        });
    }

    createBrickExplosion(x, y) {
        for (let i = 0; i < 8; i++) {
            if (this.particles.length >= this.maxParticles) break;
            const el = document.createElement('div');
            el.className = 'explosion-particle';
            el.style.width = '6px';
            el.style.height = '6px';
            this.particlesContainer.appendChild(el);

            const angle = (Math.PI * 2 * i) / 8;
            const speed = 3 + Math.random() * 2;

            this.particles.push({
                el: el,
                type: 'explosion',
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 18,
                maxLife: 18,
                scale: 1
            });
        }
    }

    spawnFallingObjects() {
        this.spawnTimer = setInterval(() => {
            if (document.hidden || this.fallingObjects.length >= this.maxFallingObjects) {
                return;
            }
            this.createFallingObject();
        }, this.spawnInterval);
    }

    createFallingObject() {
        const object = document.createElement('div');
        object.className = 'falling-object';
        
        const x = Math.random() * (window.innerWidth - 40);
        const y = -40;
        
        const brickType = Math.random() > 0.5 ? 'brick' : 'rock';
        const colors = brickType === 'brick' 
            ? ['#8b4513', '#a0522d', '#6b3410']
            : ['#808080', '#696969', '#505050'];
        
        object.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                ${brickType === 'brick' ? `
                    <rect x="0" y="0" width="24" height="8" fill="${colors[0]}"/>
                    <rect x="2" y="2" width="20" height="4" fill="${colors[1]}"/>
                    <rect x="0" y="8" width="12" height="8" fill="${colors[0]}"/>
                    <rect x="12" y="8" width="12" height="8" fill="${colors[0]}"/>
                    <rect x="2" y="10" width="8" height="4" fill="${colors[1]}"/>
                    <rect x="14" y="10" width="8" height="4" fill="${colors[1]}"/>
                    <rect x="0" y="16" width="24" height="8" fill="${colors[0]}"/>
                    <rect x="2" y="18" width="20" height="4" fill="${colors[1]}"/>
                ` : `
                    <rect x="4" y="0" width="16" height="4" fill="${colors[0]}"/>
                    <rect x="0" y="4" width="20" height="4" fill="${colors[1]}"/>
                    <rect x="2" y="8" width="20" height="8" fill="${colors[0]}"/>
                    <rect x="4" y="16" width="16" height="4" fill="${colors[1]}"/>
                    <rect x="8" y="20" width="12" height="4" fill="${colors[2]}"/>
                `}
            </svg>
        `;
        
        this.particlesContainer.appendChild(object);
        
        this.fallingObjects.push({
            element: object,
            x: x,
            y: y,
            velocityY: 2 + Math.random() * 1.8,
            rotation: 0,
            rotationSpeed: (Math.random() - 0.5) * 3,
            destroyed: false
        });
    }

    updateFallingObjects() {
        for (let i = this.fallingObjects.length - 1; i >= 0; i--) {
            const obj = this.fallingObjects[i];
            
            if (obj.destroyed) continue;
            
            obj.y += obj.velocityY;
            obj.rotation += obj.rotationSpeed;
            
            obj.element.style.transform = `translate3d(${obj.x}px, ${obj.y}px, 0) rotate(${obj.rotation}deg)`;
            
            // Cursor collision check
            if (!this.isInvulnerable && !this.isDamaged && this.isVisible) {
                const dx = this.cursorX - (obj.x + 12);
                const dy = this.cursorY - (obj.y + 12);
                if (dx * dx + dy * dy < 625) { // 25px radius squared
                    this.takeDamage();
                    this.destroyFallingObject(obj, i);
                    continue;
                }
            }
            
            // Remove when off bottom
            if (obj.y > window.innerHeight + 40) {
                obj.element.remove();
                this.fallingObjects.splice(i, 1);
            }
        }
    }

    checkLaserCollision(laserX, laserY) {
        for (let i = this.fallingObjects.length - 1; i >= 0; i--) {
            const obj = this.fallingObjects[i];
            if (obj.destroyed) continue;
            
            const dx = laserX - (obj.x + 12);
            const dy = laserY - (obj.y + 12);
            if (dx * dx + dy * dy < 900) { // 30px radius squared
                this.destroyFallingObject(obj, i);
                return true;
            }
        }
        return false;
    }

    destroyFallingObject(obj, index) {
        if (!obj || obj.destroyed) return;
        obj.destroyed = true;
        
        obj.element.classList.add('destroyed');
        this.createBrickExplosion(obj.x + 12, obj.y + 12);
        
        setTimeout(() => {
            if (obj.element && obj.element.parentElement) {
                obj.element.remove();
            }
            const idx = this.fallingObjects.indexOf(obj);
            if (idx > -1) {
                this.fallingObjects.splice(idx, 1);
            }
        }, 300);
    }

    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            if (p.type === 'laser') {
                p.y += p.vy;
                if (!p.hasHit && this.checkLaserCollision(p.x, p.y)) {
                    p.hasHit = true;
                    p.el.remove();
                    this.particles.splice(i, 1);
                    continue;
                }
                if (p.y < -30) {
                    p.el.remove();
                    this.particles.splice(i, 1);
                    continue;
                }
                p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;

            } else if (p.type === 'trail') {
                p.opacity -= 0.04;
                p.size -= 0.25;
                p.y += p.vy;
                p.x += p.vx;
                p.vy += 0.2;

                if (p.opacity <= 0 || p.size <= 1) {
                    p.el.remove();
                    this.particles.splice(i, 1);
                    continue;
                }

                p.el.style.opacity = p.opacity;
                p.el.style.width = `${p.size}px`;
                p.el.style.height = `${p.size}px`;
                p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;

            } else if (p.type === 'explosion' || p.type === 'click-explosion') {
                p.x += p.vx;
                p.y += p.vy;
                p.life--;
                p.scale = Math.max(0, p.life / p.maxLife);

                if (p.life <= 0) {
                    p.el.remove();
                    this.particles.splice(i, 1);
                    continue;
                }

                p.el.style.opacity = p.scale;
                p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) scale(${p.scale})`;
            }
        }
    }

    animate() {
        // Interpolate cursor position smoothly
        this.cursorX += (this.mouseX - this.cursorX) * 0.25;
        this.cursorY += (this.mouseY - this.cursorY) * 0.25;
        
        // Use translate3d for zero-layout-reflow GPU positioning
        this.cursor.style.transform = `translate3d(${this.cursorX}px, ${this.cursorY}px, 0)`;
        
        // Spawn trail particles with throttled chance
        if (this.isVisible && !this.reducedMotion && Math.random() > 0.45 && this.particles.length < 50) {
            const spawnX = this.cursorX + (Math.random() - 0.5) * 10 + 6;
            const spawnY = this.cursorY + 16 + Math.random() * 6;
            this.createTrailParticle(spawnX, spawnY);
        }
        
        // Batched update for all active particles in single RAF pass
        this.updateParticles();
        
        // Update falling objects
        if (!this.reducedMotion) {
            this.updateFallingObjects();
        }
        
        this.rafId = requestAnimationFrame(this.animate);
    }
}

// Initialize Custom Cursor only on desktop
document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth > 768 && window.matchMedia('(pointer: fine)').matches) {
        new CustomCursor();
    }
});