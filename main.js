/* =============================================
   MARK FRIZAS PORTFOLIO — MAIN SCRIPTS (Professional)
   ============================================= */

// ─── 1. NAVBAR: Scroll shrink + mobile hamburger ──────────────────────────────

const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

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
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
);

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObserver.observe(el));

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
    // Fires when a section crosses the middle band of the viewport, so tall sections still register.
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
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

function setTheme(mode, animate) {
    if (animate) {
        // Cross-fade colours for a moment so the switch doesn't snap.
        const root = document.documentElement;
        root.classList.add('theme-anim');
        clearTimeout(setTheme.timer);
        setTheme.timer = setTimeout(() => root.classList.remove('theme-anim'), 450);
    }
    document.body.classList.toggle('light-mode', mode === 'light');
    try { localStorage.setItem('mf_theme', mode); } catch (e) { /* storage blocked */ }
    if (themeIcon) {
        themeIcon.className = mode === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

let savedTheme = null;
try { savedTheme = localStorage.getItem('mf_theme'); } catch (e) { /* storage blocked */ }
if (savedTheme) setTheme(savedTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isLight = document.body.classList.contains('light-mode');
        setTheme(isLight ? 'dark' : 'light', true);
    });
}

// ─── 6. TYPEWRITER EFFECT ────────────────────────────────────────────────────

const typewriterEl = document.getElementById('typewriter');
if (typewriterEl) {
    const words = ['Full-Stack Developer', 'EdTech Systems Builder', 'AI-Powered Dashboards'];
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

// ─── 7. STATS COUNTER ────────────────────────────────────────────────────────

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
        const duration = 1200;
        const start = performance.now();
        function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
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
    statNumbers.forEach(s => {
        if (!reduceMotion) s.textContent = '0';   // HTML holds the real value; animate up from 0
        countObserver.observe(s);
    });
}
