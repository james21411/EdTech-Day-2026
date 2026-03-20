// ============================================================
//  ANIMATIONS 3D PREMIUM — EdTech Day 2026
//  Particules canvas, tilt 3D, scroll reveal, navbar shrink
// ============================================================

/* ── 1. CANVAS PARTICULES 3D DANS LE HERO ── */
(function initParticles() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const PARTICLE_COUNT = 90;
    const particles = [];

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.z = Math.random() * 800 + 200;           // pseudo-profondeur
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.vz = (Math.random() - 0.5) * 1.2;
            this.size = Math.random() * 2.5 + 0.5;
            const colors = ['#4cc9f0', '#4361ee', '#f72585', '#7209b7', '#06d6a0', '#ffffff'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.alpha = Math.random() * 0.6 + 0.2;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.z += this.vz;
            // rebond sur les bords
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            if (this.z < 100 || this.z > 1000) this.vz *= -1;
        }
        draw() {
            // perspective : les particules loin sont plus petites et transparentes
            const scale = 600 / this.z;
            const px = (this.x - canvas.width / 2) * scale + canvas.width / 2;
            const py = (this.y - canvas.height / 2) * scale + canvas.height / 2;
            const radius = this.size * scale;
            const alpha = this.alpha * Math.min(1, scale * 0.8);

            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = this.color;
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(px, py, Math.max(0.1, radius), 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    // Connexions entre particules proches
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const a = particles[i], b = particles[j];
                const scaleA = 600 / a.z, scaleB = 600 / b.z;
                const ax = (a.x - canvas.width / 2) * scaleA + canvas.width / 2;
                const ay = (a.y - canvas.height / 2) * scaleA + canvas.height / 2;
                const bx = (b.x - canvas.width / 2) * scaleB + canvas.width / 2;
                const by = (b.y - canvas.height / 2) * scaleB + canvas.height / 2;
                const dist = Math.hypot(ax - bx, ay - by);
                if (dist < 120) {
                    ctx.save();
                    ctx.globalAlpha = (1 - dist / 120) * 0.15;
                    ctx.strokeStyle = '#4cc9f0';
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(ax, ay);
                    ctx.lineTo(bx, by);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        }
    }

    // Interaction souris : attirer les particules proches
    let mouseX = canvas.width / 2, mouseY = canvas.height / 2;
    canvas.parentElement.addEventListener('mousemove', e => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            // Légère attraction vers la souris
            const scale = 600 / p.z;
            const px = (p.x - canvas.width / 2) * scale + canvas.width / 2;
            const py = (p.y - canvas.height / 2) * scale + canvas.height / 2;
            const dxM = mouseX - px, dyM = mouseY - py;
            const distM = Math.hypot(dxM, dyM);
            if (distM < 180) {
                p.vx += (dxM / distM) * 0.02;
                p.vy += (dyM / distM) * 0.02;
            }
            p.update();
            p.draw();
        });
        drawConnections();
        requestAnimationFrame(animate);
    }
    animate();
})();


/* ── 2. TILT 3D INTERACTIF SUR LES CARTES ── */
(function initTilt() {
    const selectors = [
        '.card-hover', '.speaker-card', '.stats-box',
        '.exhibition-card', '.demo-card', '.hackathon-card'
    ];
    const cards = document.querySelectorAll(selectors.join(','));

    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (e.clientX - cx) / (rect.width / 2);
            const dy = (e.clientY - cy) / (rect.height / 2);
            const rotX = -dy * 8;   // max ±8deg
            const rotY = dx * 8;
            card.style.transform =
                `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(10px)`;
            card.style.transition = 'transform 0.1s ease';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
            card.style.transition = 'transform 0.5s cubic-bezier(.25,.8,.25,1)';
        });
    });
})();


/* ── 3. SCROLL REVEAL ── */
(function initScrollReveal() {
    // Ajouter la classe reveal à certains éléments
    const targets = document.querySelectorAll(
        '.stats-box, .card-hover, .speaker-card, .exhibition-card, .demo-card, ' +
        '.hackathon-card, .actualite-card, .timeline-item, .partner-badge'
    );
    targets.forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${(i % 4) * 0.08}s`;
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    targets.forEach(el => observer.observe(el));
})();


/* ── 4. NAVBAR SHRINK AU SCROLL ── */
(function initNavbarShrink() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });
})();


/* ── 5. COMPTEUR ANIMÉ POUR LES STATS ── */
(function initCounters() {
    const counters = document.querySelectorAll('.stats-number');
    const targets = [3, 50, 1000, 30];   // valeurs cibles

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, idx) => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const suffix = el.textContent.replace(/\d/g, ''); // "+", etc.
            const target = targets[idx] || parseInt(el.textContent);
            let current = 0;
            const step = Math.ceil(target / 60);
            const timer = setInterval(() => {
                current = Math.min(current + step, target);
                el.textContent = current + suffix;
                if (current >= target) clearInterval(timer);
            }, 25);
            observer.unobserve(el);
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
})();


/* ── 6. CURSOR GLOW (effet lumière qui suit la souris hors hero) ── */
(function initCursorGlow() {
    const glow = document.createElement('div');
    glow.style.cssText = `
    position: fixed; width: 300px; height: 300px;
    border-radius: 50%; pointer-events: none; z-index: 9990;
    background: radial-gradient(circle, rgba(67,97,238,0.08) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
  `;
    document.body.appendChild(glow);

    document.addEventListener('mousemove', e => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
        // Ne pas afficher dans la hero (le canvas s'en charge)
        const hero = document.getElementById('accueil');
        if (hero) {
            const rect = hero.getBoundingClientRect();
            glow.style.opacity = (e.clientY > rect.bottom) ? '1' : '0';
        }
    }, { passive: true });
})();
