/* =============================================
   MARK FRIZAS PORTFOLIO — MAIN SCRIPTS
   ============================================= */

// ─── 1. NAVBAR: Scroll shrink + mobile hamburger ──────────────────────────────

const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

// Shrink nav on scroll
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// Toggle mobile menu
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
    });
});


// ─── 2. REVEAL ANIMATIONS on scroll ──────────────────────────────────────────

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger child cards within a grid when parent becomes visible
                const children = entry.target.querySelectorAll('.skill-card, .project-card, .contact-item');
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


// ─── 4. CONTACT FORM (AJAX via Formspree) ─────────────────────────────────────

const form    = document.getElementById('contact-form');
const status  = document.getElementById('form-status');
const btnText = document.getElementById('btn-text');
const btnIcon = document.getElementById('btn-icon');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Loading state
        btnText.textContent = 'Sending...';
        btnIcon.className   = 'fas fa-spinner fa-spin';
        status.textContent  = '';

        try {
            const response = await fetch(form.action, {
                method:  form.method,
                body:    new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                status.style.color  = '#34d399';        /* green */
                status.textContent  = '✓ Message sent! I\'ll get back to you soon.';
                form.reset();
            } else {
                const data = await response.json();
                const msg  = data?.errors?.map(e => e.message).join(', ') || 'Something went wrong.';
                status.style.color = '#f87171';         /* red */
                status.textContent = '✗ ' + msg;
            }
        } catch {
            status.style.color = '#f87171';
            status.textContent = '✗ Network error. Please try again.';
        } finally {
            // Restore button
            btnText.textContent = 'Send Message';
            btnIcon.className   = 'fas fa-paper-plane';
        }
    });
}


// ─── 5. SMOOTH SCROLL for anchor links ───────────────────────────────────────

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