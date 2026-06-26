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


// ─── 5. PROJECTS: Add / Delete with localStorage ──────────────────────────────

const STORAGE_KEY = 'mf_projects';

const defaultProjects = [
    {
        id: 'default-1',
        title: 'Edubio Website',
        description: 'Scalable web architecture with real-time data processing and a clean educational interface.',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=700&q=80',
        tag: 'Web App',
        tech: ['React', 'Node.js', 'MongoDB'],
        link: '#'
    },
    {
        id: 'default-2',
        title: 'Attendance Mobile App',
        description: 'Streamlined attendance tracking with a focus on user experience and sleek animations.',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&q=80',
        tag: 'Mobile App',
        tech: ['React Native', 'Firebase'],
        link: '#'
    }
];

function getProjects() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProjects));
    return defaultProjects;
}

function saveProjects(projects) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

function renderProjects() {
    const grid = document.getElementById('projectGrid');
    if (!grid) return;
    const projects = getProjects();
    grid.innerHTML = projects.map(p => `
        <article class="project-card reveal">
            <div class="project-image">
                <div class="overlay">
                    <span><i class="fas fa-arrow-up-right-from-square"></i> View Demo</span>
                </div>
                <img src="${p.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=700&q=80'}" alt="${p.title}">
                ${p.tag ? `<div class="project-tag">${p.tag}</div>` : ''}
            </div>
            <div class="project-info">
                <h3>${p.title}</h3>
                <p>${p.description}</p>
                <div class="tech-used">
                    ${(p.tech || []).map(t => `<span>${t.trim()}</span>`).join('')}
                </div>
                <div style="display:flex;gap:12px;align-items:center;justify-content:space-between;">
                    <a href="${p.link || '#'}" class="demo-btn" target="_blank">Live Preview <i class="fas fa-external-link-alt"></i></a>
                    ${p.id && !p.id.startsWith('default-') ? `<button class="delete-btn" data-id="${p.id}"><i class="fas fa-trash"></i> Delete</button>` : ''}
                </div>
            </div>
        </article>
    `).join('');

    // Re-observe reveal animations for new cards
    document.querySelectorAll('.project-card.reveal').forEach(el => revealObserver.observe(el));

    // Delete handlers
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            let projects = getProjects();
            projects = projects.filter(p => p.id !== id);
            saveProjects(projects);
            renderProjects();
        });
    });
}

// ─── Modal Logic ──────────────────────────────────────────────────────────────

const modalOverlay = document.getElementById('modalOverlay');
const addProjectBtn = document.getElementById('addProjectBtn');
const modalClose = document.getElementById('modalClose');
const projectForm = document.getElementById('projectForm');
const modalStatus = document.getElementById('modal-status');

function openModal() {
    modalOverlay.classList.add('open');
    modalStatus.textContent = '';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
    projectForm.reset();
}

if (addProjectBtn) addProjectBtn.addEventListener('click', openModal);
if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalOverlay) modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
});

if (projectForm) {
    projectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('projTitle').value.trim();
        const desc = document.getElementById('projDesc').value.trim();
        const image = document.getElementById('projImage').value.trim();
        const tag = document.getElementById('projTag').value.trim();
        const techRaw = document.getElementById('projTech').value.trim();
        const link = document.getElementById('projLink').value.trim();

        if (!title || !desc) {
            modalStatus.textContent = 'Title and description are required.';
            modalStatus.style.color = '#f87171';
            return;
        }

        const projects = getProjects();
        const newProject = {
            id: 'proj-' + Date.now(),
            title,
            description: desc,
            image: image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=700&q=80',
            tag: tag || 'Project',
            tech: techRaw ? techRaw.split(',').map(s => s.trim()).filter(Boolean) : [],
            link: link || '#'
        };
        projects.push(newProject);
        saveProjects(projects);
        renderProjects();
        closeModal();
    });
}

// Init
renderProjects();

// ─── 6. SMOOTH SCROLL for anchor links ───────────────────────────────────────

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