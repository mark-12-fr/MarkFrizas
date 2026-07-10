/* =============================================
   MARK FRIZAS PORTFOLIO — MAIN SCRIPTS
   ============================================= */

// ─── 1. NAVBAR: Scroll shrink + mobile hamburger ──────────────────────────────

const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
});

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
    });
});

// ─── 2. REVEAL ANIMATIONS on scroll ──────────────────────────────────────────

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const children = entry.target.querySelectorAll('.skill-card, .project-card, .contact-item, .timeline-item, .testimonial-card');
                if (children.length) {
                    children.forEach((child, i) => {
                        setTimeout(() => child.classList.add('active'), i * 80);
                    });
                }
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
);

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
});

// ─── 3. ACTIVE NAV LINK highlight on scroll ───────────────────────────────────

const sections  = document.querySelectorAll('section[id], header[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove('active'));
                const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                if (active) active.classList.add('active');
            }
        });
    },
    { threshold: 0.45 }
);

sections.forEach(s => sectionObserver.observe(s));

// ─── 4. SMOOTH SCROLL for anchor links ───────────────────────────────────────

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const offset = navbar.offsetHeight + 10;
            const top    = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

// ─── 5. THEME TOGGLE (Dark/Light) ────────────────────────────────────────────

const themeToggle = document.getElementById('themeToggle');
const themeIcon   = themeToggle?.querySelector('i');

function setTheme(mode) {
    document.body.classList.toggle('light-mode', mode === 'light');
    localStorage.setItem('mf_theme', mode);
    if (themeIcon) {
        themeIcon.className = mode === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

const savedTheme = localStorage.getItem('mf_theme');
if (savedTheme) setTheme(savedTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isLight = document.body.classList.contains('light-mode');
        setTheme(isLight ? 'dark' : 'light');
    });
}

// ─── 6. TYPEWRITER EFFECT ────────────────────────────────────────────────────

const typewriterEl = document.getElementById('typewriter');
if (typewriterEl) {
    const words = ['Full-Stack Developer', 'Flask & Python Engineer', 'AcadTrack Creator', 'EdTech Developer'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const current = words[wordIndex];
        if (isDeleting) {
            charIndex--;
        } else {
            charIndex++;
        }

        typewriterEl.textContent = current.substring(0, charIndex);

        if (!isDeleting && charIndex === current.length) {
            setTimeout(() => { isDeleting = true; type(); }, 2000);
            return;
        }

        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            setTimeout(type, 400);
            return;
        }

        setTimeout(type, isDeleting ? 40 : 80);
    }

    type();
}

// ─── 7. PARTICLES BACKGROUND ─────────────────────────────────────────────────

const canvas = document.getElementById('particles-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    function resize() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.4 + 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(59, 130, 246, ${this.opacity})`;
            ctx.fill();
        }
    }

    function initParticles() {
        const count = Math.min(Math.floor(canvas.width * canvas.height / 12000), 50);
        particles = Array.from({ length: count }, () => new Particle());
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(59, 130, 246, ${0.06 * (1 - dist / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        drawConnections();
        animId = requestAnimationFrame(animate);
    }

    function drawStaticFrame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => p.draw());
        drawConnections();
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    resize();
    initParticles();

    if (reduceMotion) {
        // Respect users who prefer less motion: render one static frame, no loop.
        drawStaticFrame();
    } else {
        animate();
        // Pause the animation loop while the tab is hidden to save CPU/battery.
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animId);
            } else {
                animate();
            }
        });
    }

    window.addEventListener('resize', () => {
        resize();
        initParticles();
        if (reduceMotion) drawStaticFrame();
    });
}

// ─── 8. STATS COUNTER (count-up animation) ───────────────────────────────────

const statNumbers = document.querySelectorAll('.stat-number[data-count]');
if (statNumbers.length) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function countUp(el) {
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        if (reduceMotion) {
            el.textContent = target + suffix;
            return;
        }
        const duration = 1400;
        const start = performance.now();
        function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            // easeOutCubic for a snappy finish
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countUp(entry.target);
                countObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    statNumbers.forEach(s => countObserver.observe(s));
}

// ─── 9. HERO IMAGE 3D TILT ────────────────────────────────────────────────────

(function() {
    const imgFrame = document.querySelector('.img-frame');
    if (!imgFrame) return;
    const hero = document.querySelector('.hero');
    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        imgFrame.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${y * -6}deg)`;
    });
    hero.addEventListener('mouseleave', () => {
        imgFrame.style.transform = '';
    });
})();

// ─── 10. 3D FLOATING SKILL CARDS ──────────────────────────────────────────────

(function() {
    const cards = document.querySelectorAll('.skill-card');
    cards.forEach((card, i) => {
        const delay = i * 0.15;
        const duration = 3 + (i % 3) * 0.5;
        card.style.animation = `float3d ${duration}s ease-in-out ${delay}s infinite`;
    });
})();

// ─── 11. SCROLL PARALLAX (3D depth) ───────────────────────────────────────────

(function() {
    const els = document.querySelectorAll('.section-header, .achievement-card, .service-card, .timeline-item');
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const sy = window.scrollY;
                els.forEach((el, i) => {
                    const rect = el.getBoundingClientRect();
                    const center = rect.top + rect.height / 2;
                    if (center < window.innerHeight && center > -rect.height) {
                        const depth = 0.02 + (i % 5) * 0.01;
                        const yOff = (center - window.innerHeight / 2) * depth;
                        el.style.transform = `translateY(${yOff}px)`;
                    }
                });
                ticking = false;
            });
            ticking = true;
        }
    });
})();

// ─── 12. SERVICE + ACHIEVEMENT CARD 3D TILT ───────────────────────────────────

document.querySelectorAll('.service-card, .achievement-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${y * -4}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ─── 13. 3D NAV LINK TILT ─────────────────────────────────────────────────────

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('mousemove', (e) => {
        const rect = link.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        link.style.transform = `perspective(400px) rotateY(${x * 12}deg)`;
    });
    link.addEventListener('mouseleave', () => {
        link.style.transform = '';
    });
});

// ─── 14. 3D SOCIAL ICONS TILT + SPIN ──────────────────────────────────────────

document.querySelectorAll('.social-icons a, .footer-socials a').forEach(icon => {
    icon.addEventListener('mousemove', (e) => {
        const rect = icon.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        icon.style.transform = `perspective(500px) rotateY(${x * 20}deg) rotateX(${y * -15}deg)`;
    });
    icon.addEventListener('mouseleave', () => {
        icon.style.transform = '';
    });
});

// ─── 15. 3D BUTTON LIFT ───────────────────────────────────────────────────────

document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        btn.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${y * -5}deg) translateY(-3px)`;
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
    });
});

// ─── 16. 3D SECTION TAG ROTATE ────────────────────────────────────────────────

document.querySelectorAll('.section-tag').forEach(tag => {
    tag.addEventListener('mousemove', (e) => {
        const rect = tag.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        tag.style.transform = `perspective(300px) rotateY(${x * 25}deg) scale(1.1)`;
    });
    tag.addEventListener('mouseleave', () => {
        tag.style.transform = '';
    });
});

// ─── 17. 3D TESTIMONIAL CARDS TILT ────────────────────────────────────────────

document.querySelectorAll('.testimonial-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${y * -5}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ─── 18. 3D CONTACT ITEMS TILT ────────────────────────────────────────────────

document.querySelectorAll('.contact-item').forEach(item => {
    item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        item.style.transform = `perspective(700px) rotateY(${x * 8}deg) rotateX(${y * -5}deg)`;
    });
    item.addEventListener('mouseleave', () => {
        item.style.transform = '';
    });
});

// ─── 19. 3D SCROLL PROGRESS BAR ───────────────────────────────────────────────

(function() {
    const bar = document.createElement('div');
    bar.id = 'scroll-progress';
    bar.style.cssText = 'position:fixed;top:0;left:0;width:0%;height:3px;background:linear-gradient(90deg,var(--primary),var(--accent));z-index:9999;transition:width 0.1s linear;transform:translateZ(0);';
    document.body.prepend(bar);
    window.addEventListener('scroll', () => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = h > 0 ? (window.scrollY / h * 100) + '%' : '0%';
    });
})();

// ─── 20. 3D CURSOR GLOW ───────────────────────────────────────────────────────

(function() {
    const glow = document.createElement('div');
    glow.id = 'cursor-glow';
    glow.style.cssText = 'position:fixed;width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,rgba(59,130,246,0.08),transparent 70%);pointer-events:none;z-index:9998;transform:translate(-50%,-50%);transition:left 0.15s ease-out,top 0.15s ease-out;';
    document.body.prepend(glow);
    document.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });
})();

// ─── 21. 3D TIMELINE DOT PULSE ────────────────────────────────────────────────

(function() {
    const dots = document.querySelectorAll('.timeline-dot');
    dots.forEach((dot, i) => {
        dot.style.animation = `pulse3d ${1.5 + i * 0.2}s ease-in-out ${i * 0.3}s infinite`;
    });
})();

// ─── 22. 3D PROJECT BADGE SHINE ───────────────────────────────────────────────

document.querySelectorAll('.project-tag, .project-status').forEach(badge => {
    badge.addEventListener('mousemove', (e) => {
        const rect = badge.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        badge.style.transform = `perspective(400px) rotateY(${x * 15}deg) scale(1.05)`;
    });
    badge.addEventListener('mouseleave', () => {
        badge.style.transform = '';
    });
});

// ─── 23. 3D TECH TAGS ─────────────────────────────────────────────────────────

document.querySelectorAll('.tech-used span').forEach(tag => {
    tag.addEventListener('mousemove', (e) => {
        const rect = tag.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        tag.style.transform = `perspective(300px) rotateY(${x * 20}deg) translateZ(8px)`;
    });
    tag.addEventListener('mouseleave', () => {
        tag.style.transform = '';
    });
});

// ─── 9. (legacy) CLICKABLE PROJECT CARDS + 3D TILT ────────────────────────────

document.querySelectorAll('.project-card').forEach(card => {
    const image = card.querySelector('.project-image');
    const demoLink = card.querySelector('.demo-btn:not(.github-link)');
    if (image && demoLink) {
        image.style.cursor = 'pointer';
        image.addEventListener('click', () => {
            window.open(demoLink.href, '_blank', 'noopener');
        });
    }

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});
