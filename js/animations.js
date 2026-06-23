/* ==========================================================================
   cloudbitlogicpro - Animation Effects
   Matrix rain, particle network, glitch, code typing
   ========================================================================== */

(function() {
    'use strict';

    // ===== Matrix Rain Effect =====
    function initMatrixRain() {
        const canvases = document.querySelectorAll('[data-matrix]');
        canvases.forEach(function(canvas) {
            createMatrixRain(canvas);
        });
    }

    function createMatrixRain(canvas) {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width, height, columns, drops;
        const fontSize = 14;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()[]{}|;:<>?/\\=+~`cloudbitlogicpro';
        let animationId;

        function resize() {
            const rect = canvas.parentElement.getBoundingClientRect();
            width = canvas.width = rect.width;
            height = canvas.height = rect.height;
            columns = Math.floor(width / fontSize);
            drops = [];
            for (let i = 0; i < columns; i++) {
                drops[i] = Math.random() * -100;
            }
        }

        function draw() {
            ctx.fillStyle = 'rgba(5, 8, 16, 0.06)';
            ctx.fillRect(0, 0, width, height);
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const char = chars[Math.floor(Math.random() * chars.length)];
                const x = i * fontSize;
                const y = drops[i] * fontSize;

                // Brighter leading character
                ctx.fillStyle = 'rgba(0, 240, 255, 0.9)';
                ctx.fillText(char, x, y);

                // Trail
                ctx.fillStyle = 'rgba(0, 240, 255, 0.5)';
                ctx.fillText(char, x, y - fontSize);

                ctx.fillStyle = 'rgba(124, 58, 237, 0.3)';
                ctx.fillText(char, x, y - fontSize * 2);

                if (y > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
            animationId = requestAnimationFrame(draw);
        }

        resize();
        draw();

        window.addEventListener('resize', resize);

        // Pause animation when not in view for performance
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        if (!animationId) draw();
                    } else {
                        cancelAnimationFrame(animationId);
                        animationId = null;
                    }
                });
            });
            observer.observe(canvas);
        }
    }

    // ===== Particle Network =====
    function initParticleNetwork() {
        const canvas = document.querySelector('[data-particles]');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width, height;
        let particles = [];
        let mouse = { x: -1000, y: -1000 };
        const PARTICLE_COUNT = 80;
        const CONNECTION_DIST = 140;
        const MOUSE_DIST = 180;

        function resize() {
            const rect = canvas.parentElement.getBoundingClientRect();
            width = canvas.width = rect.width;
            height = canvas.height = rect.height;
            initParticles();
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.4,
                    vy: (Math.random() - 0.5) * 0.4,
                    size: Math.random() * 2 + 0.5,
                    color: Math.random() > 0.5 ? '#00f0ff' : '#7c3aed'
                });
            }
        }

        function draw() {
            ctx.clearRect(0, 0, width, height);

            // Update + draw particles
            particles.forEach(function(p, i) {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                // Mouse interaction
                const dxm = p.x - mouse.x;
                const dym = p.y - mouse.y;
                const dm = Math.sqrt(dxm * dxm + dym * dym);
                if (dm < MOUSE_DIST) {
                    const force = (MOUSE_DIST - dm) / MOUSE_DIST;
                    p.x += (dxm / dm) * force * 2;
                    p.y += (dym / dm) * force * 2;
                }

                // Draw particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();

                // Connect to nearby particles
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < CONNECTION_DIST) {
                        const opacity = 1 - dist / CONNECTION_DIST;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = 'rgba(0, 240, 255, ' + (opacity * 0.4) + ')';
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }

                // Connect to mouse
                if (dm < MOUSE_DIST) {
                    const opacity = 1 - dm / MOUSE_DIST;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = 'rgba(124, 58, 237, ' + (opacity * 0.6) + ')';
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            });

            requestAnimationFrame(draw);
        }

        canvas.addEventListener('mousemove', function(e) {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });

        canvas.addEventListener('mouseleave', function() {
            mouse.x = -1000;
            mouse.y = -1000;
        });

        resize();
        draw();
        window.addEventListener('resize', resize);
    }

    // ===== Glitch Text Effect =====
    function initGlitchText() {
        document.querySelectorAll('[data-glitch]').forEach(function(el) {
            const original = el.textContent;
            el.setAttribute('data-text', original);
            el.classList.add('glitch');
        });
    }

    // ===== Typewriter Effect =====
    function initTypewriter() {
        document.querySelectorAll('[data-typewriter]').forEach(function(el) {
            const text = el.getAttribute('data-typewriter') || el.textContent;
            const speed = parseInt(el.getAttribute('data-speed'), 10) || 60;
            el.textContent = '';
            el.classList.add('typing');

            let i = 0;
            function type() {
                if (i < text.length) {
                    el.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                } else {
                    el.classList.remove('typing');
                    if (el.hasAttribute('data-cursor')) {
                        el.innerHTML += '<span class="cursor-blink"></span>';
                    }
                }
            }
            type();
        });
    }

    // ===== Tilt Effect on Cards =====
    function initTiltEffect() {
        document.querySelectorAll('[data-tilt]').forEach(function(card) {
            card.addEventListener('mousemove', function(e) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const cx = rect.width / 2;
                const cy = rect.height / 2;
                const rotateX = ((y - cy) / cy) * -4;
                const rotateY = ((x - cx) / cx) * 4;
                card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-6px)';
            });
            card.addEventListener('mouseleave', function() {
                card.style.transform = '';
            });
        });
    }

    // ===== Magnetic Cursor Effect =====
    function initMagnetic() {
        document.querySelectorAll('[data-magnetic]').forEach(function(el) {
            el.addEventListener('mousemove', function(e) {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                el.style.transform = 'translate(' + (x * 0.3) + 'px, ' + (y * 0.3) + 'px)';
            });
            el.addEventListener('mouseleave', function() {
                el.style.transform = '';
            });
        });
    }

    // ===== Code Line Highlighter =====
    function initCodeHighlight() {
        document.querySelectorAll('.code-block').forEach(function(block) {
            // Already styled via CSS, this is for dynamic additions
        });
    }

    // ===== Parallax =====
    function initParallax() {
        const elements = document.querySelectorAll('[data-parallax]');
        if (!elements.length) return;

        function update() {
            const scrolled = window.scrollY;
            elements.forEach(function(el) {
                const speed = parseFloat(el.getAttribute('data-parallax')) || 0.3;
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const offset = (scrolled - rect.top) * speed;
                    el.style.transform = 'translateY(' + offset + 'px)';
                }
            });
            requestAnimationFrame(update);
        }
        update();
    }

    // ===== Live Clock (Terminal Style) =====
    function initLiveClock() {
        const clockEl = document.querySelector('[data-clock]');
        if (!clockEl) return;
        function update() {
            const now = new Date();
            const time = now.toUTCString().split(' ')[4];
            const date = now.toISOString().split('T')[0];
            clockEl.textContent = date + ' ' + time + ' UTC';
        }
        update();
        setInterval(update, 1000);
    }

    // ===== Initialize =====
    document.addEventListener('DOMContentLoaded', function() {
        initMatrixRain();
        initParticleNetwork();
        initGlitchText();
        initTypewriter();
        initTiltEffect();
        initMagnetic();
        initParallax();
        initLiveClock();
    });
})();
