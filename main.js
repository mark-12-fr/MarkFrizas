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

// ─── 24. 3D SKILL ICON SPIN ───────────────────────────────────────────────────

document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        const icon = card.querySelector('i');
        if (icon) icon.style.transform = 'rotateY(360deg) scale(1.2)';
    });
    card.addEventListener('mouseleave', () => {
        const icon = card.querySelector('i');
        if (icon) icon.style.transform = '';
    });
});

// ─── 25. 3D HERO BADGE PULSE ──────────────────────────────────────────────────

(function() {
    const badge = document.querySelector('.status-badge');
    if (!badge) return;
    badge.style.animation = 'badgeFloat 3s ease-in-out infinite';
    badge.style.transformStyle = 'preserve-3d';
    document.querySelector('.hero').addEventListener('mousemove', (e) => {
        const rect = badge.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        badge.style.transform = `perspective(500px) rotateY(${x * 10}deg)`;
    });
    document.querySelector('.hero').addEventListener('mouseleave', () => {
        badge.style.transform = '';
    });
})();

// ─── 26. 3D LOGO FLOAT ────────────────────────────────────────────────────────

document.querySelectorAll('.logo').forEach(logo => {
    let angle = 0;
    function animateLogo() {
        angle += 0.005;
        const yOff = Math.sin(angle) * 3;
        const rotY = Math.sin(angle * 0.5) * 5;
        logo.style.transform = `perspective(300px) translateY(${yOff}px) rotateY(${rotY}deg)`;
        requestAnimationFrame(animateLogo);
    }
    animateLogo();
});

// ─── 27. 3D RIPPLE ON CLICK ───────────────────────────────────────────────────

document.querySelectorAll('.project-card, .service-card, .achievement-card, .testimonial-card').forEach(card => {
    card.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        ripple.style.cssText = `position:absolute;width:${size}px;height:${size}px;border-radius:50%;background:rgba(59,130,246,0.15);pointer-events:none;left:${x}px;top:${y}px;transform:scale(0);animation:ripple3d 0.6s ease-out forwards;z-index:5;`;
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 700);
    });
});

// ─── 29. 3D PROJECT IMAGE DEPTH ───────────────────────────────────────────────

document.querySelectorAll('.project-card').forEach(card => {
    const img = card.querySelector('.project-image img');
    if (!img) return;
    card.addEventListener('mousemove', (e) => {
        const rect = card.querySelector('.project-image').getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        img.style.transform = `scale(1.15) translate(${x * -12}px, ${y * -8}px)`;
    });
    card.addEventListener('mouseleave', () => {
        img.style.transform = '';
    });
});

// ─── 30. 3D FORM INPUT GLOW ───────────────────────────────────────────────────

document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
    input.addEventListener('focus', () => {
        input.style.transform = 'perspective(500px) translateZ(6px)';
        input.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.2), 0 8px 24px rgba(59,130,246,0.1)';
    });
    input.addEventListener('blur', () => {
        input.style.transform = '';
        input.style.boxShadow = '';
    });
});

// ─── 31. 3D SECTION DIVIDER WAVES ─────────────────────────────────────────────

(function() {
    const sections = document.querySelectorAll('.skills-section, .about-section, .timeline-section, .services-section, .achievements-section, .projects-section, .testimonials-section, .contact-section');
    sections.forEach(section => {
        const wave = document.createElement('div');
        wave.style.cssText = 'position:absolute;bottom:-2px;left:0;width:100%;height:40px;overflow:hidden;pointer-events:none;z-index:1;';
        wave.innerHTML = '<svg viewBox="0 0 1200 40" preserveAspectRatio="none" style="width:100%;height:100%;"><path d="M0,20 C200,40 400,0 600,20 C800,40 1000,0 1200,20 L1200,40 L0,40 Z" fill="var(--bg)" opacity="0.5"><animate attributeName="d" dur="6s" repeatCount="indefinite" values="M0,20 C200,40 400,0 600,20 C800,40 1000,0 1200,20 L1200,40 L0,40 Z;M0,25 C200,10 400,35 600,15 C800,30 1000,10 1200,25 L1200,40 L0,40 Z;M0,20 C200,40 400,0 600,20 C800,40 1000,0 1200,20 L1200,40 L0,40 Z"/></path></svg>';
        if (section !== sections[sections.length - 1]) {
            section.style.position = 'relative';
            section.appendChild(wave);
        }
    });
})();

// ─── 32. 3D MOUSE TRAIL ───────────────────────────────────────────────────────

(function() {
    const trail = document.createElement('div');
    trail.id = 'mouse-trail';
    trail.style.cssText = 'position:fixed;pointer-events:none;z-index:9997;';
    document.body.appendChild(trail);
    const dots = [];
    var count = 12;
    for (var i = 0; i < count; i++) {
        var dot = document.createElement('div');
        var size = 4 - i * 0.25;
        var alpha = 0.3 - i * 0.025;
        dot.style.cssText = 'position:fixed;border-radius:50%;pointer-events:none;background:rgba(59,130,246,' + alpha + ');width:' + size + 'px;height:' + size + 'px;transform:translate(-50%,-50%);transition:left 0.1s ease-out,top 0.1s ease-out;';
        trail.appendChild(dot);
        dots.push({ el: dot, x: 0, y: 0 });
    }
    var pos = { x: 0, y: 0 };
    document.addEventListener('mousemove', function(e) {
        pos.x = e.clientX;
        pos.y = e.clientY;
    });
    function animateTrail() {
        dots[0].el.style.left = pos.x + 'px';
        dots[0].el.style.top = pos.y + 'px';
        for (var i = 1; i < dots.length; i++) {
            dots[i].x += (dots[i - 1].x - dots[i].x) * 0.35;
            dots[i].y += (dots[i - 1].y - dots[i].y) * 0.35;
            dots[i].el.style.left = dots[i].x + 'px';
            dots[i].el.style.top = dots[i].y + 'px';
        }
        for (var i = 0; i < dots.length; i++) {
            dots[i].x = parseFloat(dots[i].el.style.left) || pos.x;
            dots[i].y = parseFloat(dots[i].el.style.top) || pos.y;
        }
        requestAnimationFrame(animateTrail);
    }
    animateTrail();
})();

// ─── 33. 3D SCROLL TEXT REVEAL (perspective cascade) ───────────────────────────

(function() {
    const els = document.querySelectorAll('.about-text p, .service-card p, .achievement-info p, .timeline-content p, .testimonial-card > p');
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'perspective(600px) translateZ(0) rotateX(0)';
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    els.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'perspective(600px) translateZ(-40px) rotateX(4deg)';
        el.style.transitionDelay = (i % 5) * 0.08 + 's';
        obs.observe(el);
    });
})();

// ─── 34. 3D STAGGER CASCADE REVEAL ─────────────────────────────────────────────

(function() {
    const grids = document.querySelectorAll('.skills-grid, .project-grid, .services-grid, .testimonials-grid, .achievements-grid');
    grids.forEach(grid => {
        const children = grid.children;
        Array.from(children).forEach((child, i) => {
            child.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            child.style.transitionDelay = i * 0.06 + 's';
        });
    });
})();

// ─── 35. 3D ANIMATED GRADIENT ON NAME ──────────────────────────────────────────

(function() {
    const highlight = document.querySelector('.name-highlight');
    if (highlight) {
        highlight.style.backgroundSize = '200% 200%';
        highlight.style.animation = 'gradientShift 4s ease infinite';
    }
})();

// ─── 36. 3D DECORATIVE BG BLOBS ───────────────────────────────────────────────

(function() {
    const sections = document.querySelectorAll('.skills-section, .timeline-section, .achievements-section, .testimonials-section, .contact-section');
    sections.forEach((section, si) => {
        for (var i = 0; i < 2; i++) {
            var blob = document.createElement('div');
            var size = 150 + Math.random() * 200;
            var x = Math.random() * 100;
            var y = Math.random() * 100;
            var colors = ['59,130,246', '6,182,212', '139,92,246', '52,211,153'];
            var c = colors[(si + i) % colors.length];
            blob.style.cssText = 'position:absolute;width:' + size + 'px;height:' + size + 'px;border-radius:50%;background:radial-gradient(circle,rgba(' + c + ',0.04),transparent 70%);pointer-events:none;left:' + x + '%;top:' + y + '%;animation:blobFloat ' + (8 + Math.random() * 6) + 's ease-in-out ' + (Math.random() * 4) + 's infinite;z-index:0;';
            section.style.position = 'relative';
            section.appendChild(blob);
        }
    });
})();

// ─── 37. 3D NAV ACTIVE PULSE ───────────────────────────────────────────────────

(function() {
    const links = document.querySelectorAll('.nav-link');
    const obs = new MutationObserver(() => {
        links.forEach(link => {
            if (link.classList.contains('active')) {
                link.style.animation = 'navPulse 2s ease-in-out infinite';
            } else {
                link.style.animation = '';
            }
        });
    });
    links.forEach(link => {
        obs.observe(link, { attributes: true, attributeFilter: ['class'] });
    });
})();

// ─── 38. 3D HERO GLOW SHIFT ───────────────────────────────────────────────────

(function() {
    const glow = document.querySelector('.hero-glow');
    if (glow) {
        document.querySelector('.hero').addEventListener('mousemove', (e) => {
            const rect = glow.parentElement.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width * 30 - 15;
            const y = (e.clientY - rect.top) / rect.height * 30 - 15;
            glow.style.transform = 'translate(' + x + 'px,' + y + 'px)';
        });
    }
})();

// ─── 39. 3D SKILL STARS BOUNCE ─────────────────────────────────────────────────

document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.querySelectorAll('.skill-stars i').forEach((star, i) => {
            star.style.transition = 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)';
            star.style.transitionDelay = i * 0.05 + 's';
            star.style.transform = 'translateY(-4px) scale(1.3)';
        });
    });
    card.addEventListener('mouseleave', () => {
        card.querySelectorAll('.skill-stars i').forEach(star => {
            star.style.transform = '';
        });
    });
});

// ─── 40. 3D ANIMATED BORDER ON PROJECT CARDS ───────────────────────────────────

document.querySelectorAll('.project-card').forEach(card => {
    const border = document.createElement('div');
    border.style.cssText = 'position:absolute;inset:-2px;border-radius:inherit;z-index:-1;background:conic-gradient(from var(--angle), transparent 40%, var(--primary) 50%, transparent 60%);animation:borderSpin 3s linear infinite;opacity:0;transition:opacity 0.4s ease;';
    card.style.position = 'relative';
    card.style.zIndex = '1';
    card.prepend(border);
    card.addEventListener('mouseenter', () => { border.style.opacity = '1'; });
    card.addEventListener('mouseleave', () => { border.style.opacity = '0'; });
});

// ─── 41. 3D GRAIN OVERLAY ──────────────────────────────────────────────────────

(function() {
    const grain = document.createElement('div');
    grain.style.cssText = 'position:fixed;inset:0;z-index:9996;pointer-events:none;opacity:0.03;mix-blend-mode:overlay;background-image:url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E");background-size:256px 256px;';
    document.body.appendChild(grain);
})();

// ─── 42. HYBRID DIGITAL RAIN (hero canvas overlay) ────────────────────────────

(function() {
    var canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;z-index:1;pointer-events:none;opacity:0.5;';
    var hero = document.querySelector('.hero');
    if (!hero) return;
    hero.insertBefore(canvas, hero.querySelector('.hero-container'));
    var ctx = canvas.getContext('2d');
    var drops = [];
    var fontSize = 10;
    var columns, chars;

    function resize() {
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
        columns = Math.floor(canvas.width / fontSize);
        chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';
        while (drops.length < columns) drops.push(Math.random() * -canvas.height / fontSize);
    }

    function draw() {
        ctx.fillStyle = 'rgba(8,12,20,0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#3b82f6';
        ctx.font = fontSize + 'px monospace';
        for (var i = 0; i < drops.length; i++) {
            var text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillStyle = Math.random() > 0.98 ? '#06b6d4' : '#3b82f6';
            ctx.globalAlpha = 0.4 + Math.random() * 0.3;
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            ctx.globalAlpha = 1;
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }

    resize();
    setInterval(draw, 45);
    window.addEventListener('resize', resize);
})();

// ─── 43. HYBRID MAGNETIC 3D BUTTONS ──────────────────────────────────────────

document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', function(e) {
        var rect = this.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        var dist = Math.sqrt(x * x + y * y);
        var maxDist = 120;
        if (dist < maxDist) {
            var pull = (1 - dist / maxDist) * 12;
            var angle = Math.atan2(y, x);
            var dx = Math.cos(angle) * pull;
            var dy = Math.sin(angle) * pull;
            var rotX = (y / (rect.height / 2)) * -6;
            var rotY = (x / (rect.width / 2)) * 6;
            this.style.transform = 'perspective(600px) translate(' + dx + 'px,' + dy + 'px) rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg) scale(1.05)';
        }
    });
    btn.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
});

// ─── 44. HYBRID GLITCH TEXT (section headers on hover) ────────────────────────

(function() {
    var style = document.createElement('style');
    style.textContent = `
        .section-title, h2, h3 { position: relative; }
        .glitch-trigger:hover {
            animation: glitchAnim 0.3s ease 2;
        }
        @keyframes glitchAnim {
            0% { transform: translate(0); filter: none; }
            20% { transform: translate(-2px, 2px); filter: hue-rotate(90deg); }
            40% { transform: translate(2px, -1px); filter: hue-rotate(180deg); }
            60% { transform: translate(-1px, -2px); filter: none; }
            80% { transform: translate(1px, 1px); filter: hue-rotate(90deg); }
            100% { transform: translate(0); filter: none; }
        }
    `;
    document.head.appendChild(style);
    document.querySelectorAll('.section-title, .project-info h3, .service-card h3, .achievement-info h3, .timeline-content h3').forEach(el => {
        el.classList.add('glitch-trigger');
    });
})();

// ─── 45. HYBRID SHIMMER ON PROJECT IMAGES ─────────────────────────────────────

(function() {
    var style = document.createElement('style');
    style.textContent = `
        .project-image::after {
            content: ''; position: absolute; inset: 0; z-index: 2;
            background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%);
            background-size: 200% 100%;
            opacity: 0; transition: opacity 0.4s ease;
            pointer-events: none;
        }
        .project-card:hover .project-image::after {
            opacity: 1;
            animation: shimmer 1.2s ease forwards;
        }
        @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
    `;
    document.head.appendChild(style);
})();

// ─── 46. HYBRID WAVE TEXT (hero title — safe version) ─────────────────────────

(function() {
    var h1 = document.querySelector('.hero-text h1');
    if (!h1) return;
    var style = document.createElement('style');
    style.textContent = '@keyframes waveText { 0%,100% { transform: translateY(0) rotateX(0); } 25% { transform: translateY(-4px) rotateX(8deg); } 50% { transform: translateY(0) rotateX(0); } 75% { transform: translateY(-2px) rotateX(4deg); } }';
    document.head.appendChild(style);
    var highlight = h1.querySelector('.name-highlight');
    if (highlight) {
        var text = highlight.textContent;
        highlight.textContent = '';
        Array.from(text).forEach(function(ch, i) {
            var span = document.createElement('span');
            span.textContent = ch;
            span.style.display = 'inline-block';
            span.style.animation = 'waveText ' + (2.5 + Math.random() * 0.5) + 's ease-in-out ' + (i * 0.04) + 's infinite';
            span.style.transformStyle = 'preserve-3d';
            highlight.appendChild(span);
        });
    }
})();

// ─── 47. HYBRID SPARKLE FOLLOW ────────────────────────────────────────────────

(function() {
    var container = document.createElement('div');
    container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9995;';
    document.body.appendChild(container);
    var sparks = [];
    document.addEventListener('mousemove', function(e) {
        if (Math.random() > 0.7) return;
        var spark = document.createElement('div');
        var size = 2 + Math.random() * 4;
        var colors = ['#3b82f6', '#06b6d4', '#8b5cf6', '#34d399'];
        spark.style.cssText = 'position:absolute;width:' + size + 'px;height:' + size + 'px;border-radius:50%;background:' + colors[Math.floor(Math.random() * colors.length)] + ';left:' + e.clientX + 'px;top:' + e.clientY + 'px;box-shadow:0 0 6px currentColor;transform:translate(-50%,-50%);';
        container.appendChild(spark);
        var dx = (Math.random() - 0.5) * 60;
        var dy = (Math.random() - 0.5) * 60 - 30;
        spark.style.transition = 'transform 0.8s ease-out, opacity 0.8s ease-out';
        requestAnimationFrame(function() {
            spark.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(0)';
            spark.style.opacity = '0';
        });
        setTimeout(function() { spark.remove(); }, 900);
    });
})();

// ─── 48. HYBRID PERSPECTIVE ON SECTION HEADERS ────────────────────────────────

document.querySelectorAll('.section-header').forEach(function(header) {
    header.style.transformStyle = 'preserve-3d';
    header.style.perspective = '800px';
    var title = header.querySelector('.section-title');
    var tag = header.querySelector('.section-tag');
    var sub = header.querySelector('.section-sub');
    if (tag) { tag.style.transformStyle = 'preserve-3d'; tag.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)'; }
    if (title) { title.style.transformStyle = 'preserve-3d'; title.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.05s'; }
    if (sub) { sub.style.transformStyle = 'preserve-3d'; sub.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.1s'; }
    header.addEventListener('mousemove', function(e) {
        var rect = header.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        if (tag) tag.style.transform = 'perspective(500px) translateZ(20px) rotateY(' + (x * 10) + 'deg) rotateX(' + (y * -6) + 'deg)';
        if (title) title.style.transform = 'perspective(500px) translateZ(10px) rotateY(' + (x * 6) + 'deg) rotateX(' + (y * -4) + 'deg)';
        if (sub) sub.style.transform = 'perspective(500px) translateZ(5px) rotateY(' + (x * 4) + 'deg) rotateX(' + (y * -2) + 'deg)';
    });
    header.addEventListener('mouseleave', function() {
        if (tag) tag.style.transform = '';
        if (title) title.style.transform = '';
        if (sub) sub.style.transform = '';
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
