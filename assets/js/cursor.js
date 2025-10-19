/* ===================================
   CUSTOM CURSOR - BRICK GAME SPACESHIP STYLE
   Features: Pixelated spaceship, trailing effect,
   shoot animation on click, retro gaming aesthetic
   ================================ */

class CustomCursor {
    constructor() {
        this.cursor = null;
        this.spaceship = null;
        this.trail = [];
        this.maxTrailLength = 8;
        this.shootParticles = [];
        
        this.mouseX = 0;
        this.mouseY = 0;
        this.cursorX = 0;
        this.cursorY = 0;
        
        this.isHovering = false;
        this.isDragging = false;
        this.isClicking = false;
        this.isDamaged = false;
        this.isInvulnerable = false;
        
        // Performance optimization
        this.lastShootTime = 0;
        this.shootCooldown = 200;
        this.maxParticles = 80;
        this.currentParticleCount = 0;
        
        // Falling bricks/rocks system
        this.fallingObjects = [];
        this.maxFallingObjects = 3;
        this.lastSpawnTime = 0;
        this.spawnInterval = 3000;
        
        this.init();
    }

    init() {
        console.log('🚀 Initializing brick game spaceship cursor...');
        
        // Create cursor elements
        this.createSpaceshipCursor();
        
        // Hide default cursor
        this.hideDefaultCursor();
        
        // Track mouse movement
        this.trackMouse();
        
        // Add interactive states
        this.addInteractiveStates();
        
        // Start animation loop
        this.animate();
        
        // Start spawning falling objects
        this.spawnFallingObjects();
        
        console.log('✅ Spaceship cursor initialized with falling objects');
    }

    createSpaceshipCursor() {
        // Main cursor container
        this.cursor = document.createElement('div');
        this.cursor.className = 'spaceship-cursor';
        
        // Spaceship element (pixelated brick game style)
        this.spaceship = document.createElement('div');
        this.spaceship.className = 'spaceship';
        this.spaceship.innerHTML = `
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <!-- Spaceship body (brick game style) -->
                <!-- Top tip -->
                <rect x="14" y="4" width="4" height="4" fill="#9f55ff" class="ship-body"/>
                
                <!-- Upper body -->
                <rect x="10" y="8" width="4" height="4" fill="#8b31ff" class="ship-body"/>
                <rect x="14" y="8" width="4" height="4" fill="#9f55ff" class="ship-body"/>
                <rect x="18" y="8" width="4" height="4" fill="#8b31ff" class="ship-body"/>
                
                <!-- Mid body -->
                <rect x="10" y="12" width="4" height="4" fill="#8b31ff" class="ship-body"/>
                <rect x="14" y="12" width="4" height="4" fill="#9f55ff" class="ship-body"/>
                <rect x="18" y="12" width="4" height="4" fill="#8b31ff" class="ship-body"/>
                
                <!-- Wings -->
                <rect x="6" y="16" width="4" height="4" fill="#7000ff" class="ship-body"/>
                <rect x="10" y="16" width="4" height="4" fill="#8b31ff" class="ship-body"/>
                <rect x="14" y="16" width="4" height="4" fill="#9f55ff" class="ship-body"/>
                <rect x="18" y="16" width="4" height="4" fill="#8b31ff" class="ship-body"/>
                <rect x="22" y="16" width="4" height="4" fill="#7000ff" class="ship-body"/>
                
                <!-- Engine base -->
                <rect x="10" y="20" width="4" height="4" fill="#8b31ff" class="ship-body"/>
                <rect x="14" y="20" width="4" height="4" fill="#9f55ff" class="ship-body"/>
                <rect x="18" y="20" width="4" height="4" fill="#8b31ff" class="ship-body"/>
                
                <!-- Engine flames (animated) -->
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
        
        // Add cursor styles
        this.injectStyles();
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Hide default cursor */
            * {
                cursor: none !important;
            }

            /* Spaceship cursor container */
            .spaceship-cursor {
                position: fixed;
                top: 0;
                left: 0;
                pointer-events: none;
                z-index: 99999;
                transform: translate(-50%, -50%);
            }

            /* Spaceship SVG */
            .spaceship {
                position: fixed;
                width: 32px;
                height: 32px;
                transform: translate(-50%, -50%) rotate(-15deg);
                filter: drop-shadow(0 0 8px rgba(159, 85, 255, 0.6));
                image-rendering: pixelated;
                image-rendering: -moz-crisp-edges;
                image-rendering: crisp-edges;
            }

            /* Damaged state - red blink effect */
            .spaceship-cursor.damaged .ship-body {
                animation: damageFlash 0.1s ease-in-out 6;
            }

            .spaceship-cursor.damaged .spaceship {
                animation: damageShake 0.1s ease-in-out 6;
            }

            @keyframes damageFlash {
                0%, 100% {
                    fill: #ff0000;
                }
                50% {
                    fill: #ffffff;
                }
            }

            @keyframes damageShake {
                0%, 100% {
                    transform: translate(-50%, -50%) rotate(-15deg);
                }
                25% {
                    transform: translate(-48%, -50%) rotate(-20deg);
                }
                75% {
                    transform: translate(-52%, -50%) rotate(-10deg);
                }
            }

            /* Invulnerable state - flashing effect */
            .spaceship-cursor.invulnerable .spaceship {
                animation: invulnerableFlash 0.15s ease-in-out infinite;
            }

            @keyframes invulnerableFlash {
                0%, 100% {
                    opacity: 1;
                }
                50% {
                    opacity: 0.3;
                }
            }

            /* Engine flame animation */
            @keyframes flameFlicker {
                0%, 100% {
                    opacity: 1;
                    transform: scaleY(1);
                }
                50% {
                    opacity: 0.7;
                    transform: scaleY(0.8);
                }
            }

            .flame {
                animation: flameFlicker 0.15s infinite;
            }

            .flame-1 { animation-delay: 0s; }
            .flame-2 { animation-delay: 0.05s; }
            .flame-3 { animation-delay: 0.1s; }
            .flame-4 { animation-delay: 0.03s; }
            .flame-5 { animation-delay: 0.08s; }
            .flame-6 { animation-delay: 0.12s; }

            /* Trail particle */
            .trail-particle {
                position: fixed;
                width: 12px;
                height: 12px;
                background: linear-gradient(135deg, #ff55ff, #9f55ff, #8b31ff);
                border-radius: 2px;
                pointer-events: none;
                z-index: 99998;
                transform: translate(-50%, -50%);
                image-rendering: pixelated;
                box-shadow: 0 0 12px rgba(255, 85, 255, 0.9), 0 0 6px rgba(139, 49, 255, 0.6);
            }

            /* Damaged trail - red smoke */
            .trail-particle.damaged-trail {
                background: linear-gradient(135deg, #ff0000, #ff4444, #cc0000);
                box-shadow: 0 0 12px rgba(255, 0, 0, 0.9), 0 0 6px rgba(204, 0, 0, 0.6);
            }

            /* Shoot particle (laser beam) */
            .shoot-particle {
                position: fixed;
                width: 6px;
                height: 20px;
                background: linear-gradient(180deg, #ffffff, #ff55ff, #9f55ff);
                border-radius: 2px;
                pointer-events: none;
                z-index: 99997;
                transform: translate(-50%, -50%);
                image-rendering: pixelated;
                box-shadow: 0 0 16px rgba(255, 85, 255, 1), 0 0 8px rgba(255, 255, 255, 0.8);
                animation: laserPulse 0.1s infinite;
            }

            @keyframes laserPulse {
                0%, 100% {
                    opacity: 1;
                    box-shadow: 0 0 16px rgba(255, 85, 255, 1), 0 0 8px rgba(255, 255, 255, 0.8);
                }
                50% {
                    opacity: 0.9;
                    box-shadow: 0 0 20px rgba(255, 85, 255, 1), 0 0 12px rgba(255, 255, 255, 1);
                }
            }

            /* Explosion effect */
            .explosion-particle {
                position: fixed;
                width: 10px;
                height: 10px;
                background: linear-gradient(135deg, #ffffff, #ffff00, #ff9500);
                border-radius: 2px;
                pointer-events: none;
                z-index: 99997;
                transform: translate(-50%, -50%);
                image-rendering: pixelated;
                box-shadow: 0 0 12px rgba(255, 149, 0, 1), 0 0 6px rgba(255, 255, 255, 0.8);
            }

            /* Falling brick/rock */
            .falling-object {
                position: fixed;
                width: 24px;
                height: 24px;
                pointer-events: none;
                z-index: 99996;
                image-rendering: pixelated;
                transition: none;
                cursor: none !important;
            }

            /* Brick destroyed animation */
            .falling-object.destroyed {
                animation: brickDestroy 0.3s ease-out forwards;
            }

            @keyframes brickDestroy {
                0% {
                    transform: scale(1) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: scale(0) rotate(360deg);
                    opacity: 0;
                }
            }

            /* Hover state - spaceship grows */
            .spaceship-cursor.hovering .spaceship {
                transform: translate(-50%, -50%) rotate(-15deg) scale(1.2);
                filter: drop-shadow(0 0 12px rgba(255, 85, 255, 0.8));
            }

            /* Clicking state - spaceship tilts more */
            .spaceship-cursor.clicking .spaceship {
                transform: translate(-50%, -50%) rotate(-25deg) scale(0.9);
            }

            /* Dragging state - spaceship rotates */
            .spaceship-cursor.dragging .spaceship {
                animation: spaceshipTilt 0.3s ease-in-out infinite alternate;
            }

            @keyframes spaceshipTilt {
                from {
                    transform: translate(-50%, -50%) rotate(-25deg);
                }
                to {
                    transform: translate(-50%, -50%) rotate(-5deg);
                }
            }

            /* Light theme adjustments */
            body.light-theme .spaceship svg rect:not(.flame) {
                filter: brightness(0.8);
            }

            /* Hide cursor on mobile */
            @media (max-width: 768px) {
                .spaceship-cursor,
                .trail-particle,
                .shoot-particle,
                .explosion-particle {
                    display: none !important;
                }
                
                * {
                    cursor: auto !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    hideDefaultCursor() {
        document.body.style.cursor = 'none';
    }

    trackMouse() {
        // Track mouse position
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        // Click effect - SHOOT LASER! (with cooldown to prevent lag)
        document.addEventListener('mousedown', (e) => {
            const currentTime = Date.now();
            
            // Check cooldown to prevent spam lag
            if (currentTime - this.lastShootTime < this.shootCooldown) {
                return; // Skip if cooling down
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

        // Detect when leaving window
        document.addEventListener('mouseleave', () => {
            this.cursor.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            this.cursor.style.opacity = '1';
        });
    }

    takeDamage() {
        if (this.isInvulnerable || this.isDamaged) return;
        
        this.isDamaged = true;
        this.cursor.classList.add('damaged');
        
        // Create impact explosion at cursor position
        this.createDamageExplosion(this.cursorX, this.cursorY);
        
        // Remove damaged state after animation (0.6s for 6 blinks)
        setTimeout(() => {
            this.isDamaged = false;
            this.cursor.classList.remove('damaged');
            
            // Start invulnerability period (1.5 seconds)
            this.isInvulnerable = true;
            this.cursor.classList.add('invulnerable');
            
            setTimeout(() => {
                this.isInvulnerable = false;
                this.cursor.classList.remove('invulnerable');
            }, 1500);
        }, 600);
    }

    createDamageExplosion(x, y) {
        // Red explosion effect when hit
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.className = 'explosion-particle';
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.background = 'linear-gradient(135deg, #ff0000, #ff4444, #cc0000)';
            particle.style.boxShadow = '0 0 12px rgba(255, 0, 0, 1), 0 0 6px rgba(255, 255, 255, 0.8)';
            document.body.appendChild(particle);
            this.currentParticleCount++;

            const angle = (Math.PI * 2 * i) / 12;
            const speed = 4 + Math.random() * 4;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;

            let px = x;
            let py = y;
            let life = 25;

            const animateParticle = () => {
                px += vx;
                py += vy;
                life--;

                particle.style.left = `${px}px`;
                particle.style.top = `${py}px`;
                particle.style.opacity = life / 25;

                if (life > 0) {
                    requestAnimationFrame(animateParticle);
                } else {
                    particle.remove();
                    this.currentParticleCount--;
                }
            };

            animateParticle();
        }
    }

    shootLaser(x, y) {
        // Check particle limit to prevent lag
        if (this.currentParticleCount > this.maxParticles) {
            console.log('⚠️ Particle limit reached - skipping to prevent lag');
            return;
        }

        // Create only 1 laser beam for better performance
        const laser = document.createElement('div');
        laser.className = 'shoot-particle';
        const laserX = x;
        laser.style.left = `${laserX}px`;
        laser.style.top = `${y}px`;
        document.body.appendChild(laser);
        this.currentParticleCount++;

        // Animate laser shooting upward
        let laserY = y;
        const speed = 22;
        let hasHit = false;
        
        const animateLaser = () => {
            laserY -= speed;
            laser.style.top = `${laserY}px`;
            
            // Check collision with falling objects
            if (!hasHit && this.checkLaserCollision(laserX, laserY)) {
                hasHit = true;
                laser.remove();
                this.currentParticleCount--;
                return;
            }
            
            // Remove when off screen
            if (laserY < -50) {
                laser.remove();
                this.currentParticleCount--;
            } else {
                requestAnimationFrame(animateLaser);
            }
        };
        
        animateLaser();

        // Remove laser after animation (shorter timeout)
        setTimeout(() => {
            if (laser.parentElement) {
                laser.remove();
                this.currentParticleCount--;
            }
        }, 400);

        // Create smaller click explosion (reduced particles)
        this.createClickExplosion(x, y);
    }

    createClickExplosion(x, y) {
        // Check particle limit
        if (this.currentParticleCount > this.maxParticles - 10) {
            return; // Skip explosion if near limit
        }

        // Create only 6 explosion particles (reduced from 12)
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.className = 'explosion-particle';
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.width = '8px';
            particle.style.height = '8px';
            document.body.appendChild(particle);
            this.currentParticleCount++;

            // Random direction for each particle
            const angle = (Math.PI * 2 * i) / 6;
            const speed = 3 + Math.random() * 3;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;

            let px = x;
            let py = y;
            let life = 15; // Shorter life

            const animateParticle = () => {
                px += vx;
                py += vy;
                life--;

                particle.style.left = `${px}px`;
                particle.style.top = `${py}px`;
                particle.style.opacity = life / 15;

                if (life > 0) {
                    requestAnimationFrame(animateParticle);
                } else {
                    particle.remove();
                    this.currentParticleCount--;
                }
            };

            animateParticle();
        }

        // Add smaller central flash
        const flash = document.createElement('div');
        flash.className = 'explosion-particle';
        flash.style.left = `${x}px`;
        flash.style.top = `${y}px`;
        flash.style.width = '20px';
        flash.style.height = '20px';
        flash.style.background = 'linear-gradient(135deg, #ffffff, #ffff00)';
        flash.style.boxShadow = '0 0 20px rgba(255, 255, 255, 1)';
        document.body.appendChild(flash);
        this.currentParticleCount++;

        let flashScale = 1.2;
        let flashOpacity = 1;

        const animateFlash = () => {
            flashScale += 0.4;
            flashOpacity -= 0.2;

            flash.style.transform = `translate(-50%, -50%) scale(${flashScale})`;
            flash.style.opacity = flashOpacity;

            if (flashOpacity > 0) {
                requestAnimationFrame(animateFlash);
            } else {
                flash.remove();
                this.currentParticleCount--;
            }
        };

        animateFlash();
    }

    createExplosion(x, y) {
        // Check particle limit
        if (this.currentParticleCount > this.maxParticles) {
            return;
        }

        // Create 12 explosion particles instead of 16 (performance optimization)
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.className = 'explosion-particle';
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            document.body.appendChild(particle);
            this.currentParticleCount++;

            // Random direction for each particle
            const angle = (Math.PI * 2 * i) / 12;
            const speed = 4 + Math.random() * 4;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;

            let px = x;
            let py = y;
            let life = 25;
            let scale = 1;

            const animateParticle = () => {
                px += vx;
                py += vy;
                life--;
                scale -= 0.04;

                particle.style.left = `${px}px`;
                particle.style.top = `${py}px`;
                particle.style.opacity = life / 25;
                particle.style.transform = `translate(-50%, -50%) scale(${scale})`;

                if (life > 0 && scale > 0) {
                    requestAnimationFrame(animateParticle);
                } else {
                    particle.remove();
                    this.currentParticleCount--;
                }
            };

            animateParticle();
        }

        // Add central flash effect
        const flash = document.createElement('div');
        flash.className = 'explosion-particle';
        flash.style.left = `${x}px`;
        flash.style.top = `${y}px`;
        flash.style.width = '25px';
        flash.style.height = '25px';
        flash.style.background = 'linear-gradient(135deg, #ffffff, #ffff00)';
        flash.style.boxShadow = '0 0 30px rgba(255, 255, 255, 1)';
        document.body.appendChild(flash);
        this.currentParticleCount++;

        let flashScale = 1.5;
        let flashOpacity = 1;

        const animateFlash = () => {
            flashScale += 0.3;
            flashOpacity -= 0.15;

            flash.style.transform = `translate(-50%, -50%) scale(${flashScale})`;
            flash.style.opacity = flashOpacity;

            if (flashOpacity > 0) {
                requestAnimationFrame(animateFlash);
            } else {
                flash.remove();
                this.currentParticleCount--;
            }
        };

        animateFlash();
    }

    // Falling objects system
    spawnFallingObjects() {
        setInterval(() => {
            // Strict limit enforcement before spawning
            if (this.fallingObjects.length < this.maxFallingObjects) {
                this.createFallingObject();
            }
            
            // Extra cleanup - remove any excess objects
            while (this.fallingObjects.length > this.maxFallingObjects) {
                const removed = this.fallingObjects.shift();
                if (removed && removed.element && removed.element.parentElement) {
                    removed.element.remove();
                }
            }
        }, this.spawnInterval);
    }

    createFallingObject() {
        const object = document.createElement('div');
        object.className = 'falling-object';
        
        // Random horizontal position
        const x = Math.random() * window.innerWidth;
        const y = -50;
        
        object.style.left = `${x}px`;
        object.style.top = `${y}px`;
        
        // Create pixelated brick/rock SVG
        const brickType = Math.random() > 0.5 ? 'brick' : 'rock';
        const colors = brickType === 'brick' 
            ? ['#8b4513', '#a0522d', '#6b3410'] // Brown brick colors
            : ['#808080', '#696969', '#505050']; // Gray rock colors
        
        object.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                ${brickType === 'brick' ? `
                    <!-- Brick pattern -->
                    <rect x="0" y="0" width="24" height="8" fill="${colors[0]}"/>
                    <rect x="2" y="2" width="20" height="4" fill="${colors[1]}"/>
                    <rect x="0" y="8" width="12" height="8" fill="${colors[0]}"/>
                    <rect x="12" y="8" width="12" height="8" fill="${colors[0]}"/>
                    <rect x="2" y="10" width="8" height="4" fill="${colors[1]}"/>
                    <rect x="14" y="10" width="8" height="4" fill="${colors[1]}"/>
                    <rect x="0" y="16" width="24" height="8" fill="${colors[0]}"/>
                    <rect x="2" y="18" width="20" height="4" fill="${colors[1]}"/>
                ` : `
                    <!-- Rock pattern (irregular) -->
                    <rect x="4" y="0" width="16" height="4" fill="${colors[0]}"/>
                    <rect x="0" y="4" width="20" height="4" fill="${colors[1]}"/>
                    <rect x="2" y="8" width="20" height="8" fill="${colors[0]}"/>
                    <rect x="4" y="16" width="16" height="4" fill="${colors[1]}"/>
                    <rect x="8" y="20" width="12" height="4" fill="${colors[2]}"/>
                `}
            </svg>
        `;
        
        document.body.appendChild(object);
        
        // Store object data
        const objectData = {
            element: object,
            x: x,
            y: y,
            velocityY: 2 + Math.random() * 2,
            rotation: 0,
            rotationSpeed: (Math.random() - 0.5) * 4,
            destroyed: false
        };
        
        this.fallingObjects.push(objectData);
    }

    updateFallingObjects() {
        // Clean up destroyed objects first
        this.fallingObjects = this.fallingObjects.filter(obj => {
            if (!obj.destroyed && obj.element && obj.element.parentElement) {
                return true;
            }
            // Remove orphaned elements
            if (obj.element && obj.element.parentElement) {
                obj.element.remove();
            }
            return false;
        });

        // Strict limit enforcement
        while (this.fallingObjects.length > this.maxFallingObjects) {
            const removed = this.fallingObjects.shift();
            if (removed && removed.element && removed.element.parentElement) {
                removed.element.remove();
            }
        }

        for (let i = this.fallingObjects.length - 1; i >= 0; i--) {
            const obj = this.fallingObjects[i];
            
            if (obj.destroyed) continue;
            
            // Update position
            obj.y += obj.velocityY;
            obj.rotation += obj.rotationSpeed;
            
            if (obj.element && obj.element.parentElement) {
                obj.element.style.top = `${obj.y}px`;
                obj.element.style.transform = `rotate(${obj.rotation}deg)`;
            }
            
            // Check collision with cursor (spaceship gets hit!)
            if (!this.isInvulnerable && !this.isDamaged) {
                const dx = this.cursorX - obj.x;
                const dy = this.cursorY - obj.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // If brick hits spaceship (within 25px radius)
                if (distance < 25) {
                    this.takeDamage();
                    this.destroyFallingObject(obj, i);
                    continue;
                }
            }
            
            // Remove if off screen (bottom)
            if (obj.y > window.innerHeight + 50) {
                if (obj.element && obj.element.parentElement) {
                    obj.element.remove();
                }
                this.fallingObjects.splice(i, 1);
            }
        }
    }

    checkLaserCollision(laserX, laserY) {
        for (let i = this.fallingObjects.length - 1; i >= 0; i--) {
            const obj = this.fallingObjects[i];
            
            if (obj.destroyed) continue;
            
            // Simple collision detection (distance check)
            const dx = laserX - obj.x;
            const dy = laserY - obj.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // If laser is close to brick (within 30px radius)
            if (distance < 30) {
                this.destroyFallingObject(obj, i);
                return true;
            }
        }
        return false;
    }

    destroyFallingObject(obj, index) {
        if (!obj || obj.destroyed) return;
        
        obj.destroyed = true;
        
        if (obj.element && obj.
        element.parentElement) {
            obj.element.classList.add('destroyed');
            
            // Create explosion at brick position
            this.createBrickExplosion(obj.x, obj.y);
            
            // Remove from DOM after animation
            setTimeout(() => {
                if (obj.element && obj.element.parentElement) {
                    obj.element.remove();
                }
                // Remove from array if still exists
                const idx = this.fallingObjects.indexOf(obj);
                if (idx > -1) {
                    this.fallingObjects.splice(idx, 1);
                }
            }, 300);
        } else {
            // Already removed, just clean up array
            const idx = this.fallingObjects.indexOf(obj);
            if (idx > -1) {
                this.fallingObjects.splice(idx, 1);
            }
        }
    }

    createBrickExplosion(x, y) {
        // Smaller explosion for brick destruction
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'explosion-particle';
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.width = '6px';
            particle.style.height = '6px';
            document.body.appendChild(particle);
            this.currentParticleCount++;

            const angle = (Math.PI * 2 * i) / 8;
            const speed = 3 + Math.random() * 3;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;

            let px = x;
            let py = y;
            let life = 20;

            const animateParticle = () => {
                px += vx;
                py += vy;
                life--;

                particle.style.left = `${px}px`;
                particle.style.top = `${py}px`;
                particle.style.opacity = life / 20;

                if (life > 0) {
                    requestAnimationFrame(animateParticle);
                } else {
                    particle.remove();
                    this.currentParticleCount--;
                }
            };

            animateParticle();
        }
    }

    addInteractiveStates() {
        // Hover effects for clickable elements
        const interactiveElements = document.querySelectorAll('a, button, .link, input, textarea, .skill-card, .project-btn, .certificate-image, .experience-tab');

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.isHovering = true;
                this.cursor.classList.add('hovering');
            });

            el.addEventListener('mouseleave', () => {
                this.isHovering = false;
                this.cursor.classList.remove('hovering');
            });
        });

        // Detect dragging on skills wheel
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

        // Listen for dynamically added elements (like menu links)
        const observer = new MutationObserver(() => {
            const newElements = document.querySelectorAll('.menu-link');
            newElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    this.isHovering = true;
                    this.cursor.classList.add('hovering');
                });

                el.addEventListener('mouseleave', () => {
                    this.isHovering = false;
                    this.cursor.classList.remove('hovering');
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    createTrailParticle(x, y) {
        // Check particle limit to prevent lag
        if (this.currentParticleCount > this.maxParticles) {
            return;
        }

        const particle = document.createElement('div');
        particle.className = 'trail-particle';
        
        // Change trail color when damaged
        if (this.isDamaged) {
            particle.classList.add('damaged-trail');
        }
        
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        document.body.appendChild(particle);
        this.currentParticleCount++;

        // Fade out, shrink, and FALL DOWN like smoke with SIDEWAYS DRIFT
        let opacity = 1;
        let size = 12;
        let posY = y;
        let posX = x;
        let velocityY = 0.5;
        let velocityX = (Math.random() - 0.5) * 1.5;
        
        const fadeOut = () => {
            opacity -= 0.04;
            size -= 0.25;
            posY += velocityY;
            posX += velocityX;
            velocityY += 0.2;
            
            particle.style.opacity = opacity;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.top = `${posY}px`;
            particle.style.left = `${posX}px`;
            
            if (opacity > 0 && size > 1) {
                requestAnimationFrame(fadeOut);
            } else {
                particle.remove();
                this.currentParticleCount--;
            }
        };
        
        fadeOut();
    }

    animate() {
        // Smooth following animation
        this.cursorX += (this.mouseX - this.cursorX) * 0.2;
        this.cursorY += (this.mouseY - this.cursorY) * 0.2;
        
        // Update spaceship position
        this.spaceship.style.left = `${this.cursorX}px`;
        this.spaceship.style.top = `${this.cursorY}px`;
        
        // Create trail particles with stricter limits
        const spawnChance = this.currentParticleCount > 50 ? 0.6 : 0.4;
        
        if (Math.random() > spawnChance && this.currentParticleCount < 70) {
            const spawnX = this.cursorX + (Math.random() - 0.5) * 12 + 8;
            const spawnY = this.cursorY + 18 + Math.random() * 8;
            this.createTrailParticle(spawnX, spawnY);
        }
        
        // Update falling objects
        this.updateFallingObjects();
        
        // Continue animation loop
        requestAnimationFrame(() => this.animate());
    }
}

// ===================================
// Initialize Custom Cursor
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on desktop (not mobile/tablet)
    if (window.innerWidth > 768) {
        new CustomCursor();
        console.log('🎯 Custom cursor active on desktop');
    } else {
        console.log('📱 Custom cursor disabled on mobile');
    }
});