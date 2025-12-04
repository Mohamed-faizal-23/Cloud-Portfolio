// script.js -- Single clean version to replace your existing JS
document.addEventListener('DOMContentLoaded', () => {
  // ---------- Safety reset ----------
  document.documentElement.classList.remove('nav-open');
  document.body.style.overflow = '';
  try {
    const navReset = document.getElementById('siteNav');
    if (navReset) navReset.classList.remove('mobile-open');
    const mbReset = document.getElementById('mobileMenu');
    if (mbReset) { mbReset.textContent = '☰'; mbReset.setAttribute('aria-expanded', 'false'); }
  } catch (e) {
    // no-op
  }

  // ---------- Basic elements ----------
  const html = document.documentElement;
  const darkBtn = document.getElementById('darkToggle');
  const nav = document.getElementById('siteNav');
  const mobileBtn = document.getElementById('mobileMenu');

  // Early bail if required elements missing (prevents runtime errors)
  if (!nav) {
    console.warn('script.js: #siteNav not found — mobile menu features disabled.');
  }
  if (!mobileBtn) {
    console.warn('script.js: #mobileMenu not found — mobile menu toggle disabled.');
  }

  // ---------- Theme (persist) ----------
  (function initTheme() {
    const saved = localStorage.getItem('mfs_theme');
    if (saved === 'light') {
      html.classList.add('light-theme');
      if (darkBtn) darkBtn.textContent = '☀';
    } else {
      html.classList.remove('light-theme');
      if (darkBtn) darkBtn.textContent = '🌙';
    }
    if (darkBtn) {
      darkBtn.addEventListener('click', () => {
        const isLight = html.classList.toggle('light-theme');
        darkBtn.textContent = isLight ? '☀' : '🌙';
        localStorage.setItem('mfs_theme', isLight ? 'light' : 'dark');
      });
    }
  })();

  // ---------- Mobile menu helpers ----------
  // define once, before any handler uses it
  function setMobileOpen(open) {
    if (!nav || !mobileBtn) return;
    nav.classList.toggle('mobile-open', !!open);
    document.documentElement.classList.toggle('nav-open', !!open);
    document.body.style.overflow = open ? 'hidden' : '';
    mobileBtn.textContent = open ? '✕' : '☰';
    mobileBtn.setAttribute('aria-expanded', String(!!open));

    if (open) {
      // focus first link for keyboard users
      const firstLink = nav.querySelector('a');
      if (firstLink) firstLink.focus();
    } else {
      mobileBtn.focus();
    }
  }

  // Mobile button toggle
  if (mobileBtn && nav) {
    mobileBtn.setAttribute('aria-controls', 'siteNav');
    mobileBtn.setAttribute('aria-expanded', 'false');
    mobileBtn.addEventListener('click', () => {
      setMobileOpen(!nav.classList.contains('mobile-open'));
    });
  }

  // Ensure we only attach link handlers once — and they close after a short delay
  if (nav) {
    // Remove any previously-attached handlers by cloning (defensive)
    // This prevents duplicate listeners if the script ran twice.
    const navClone = nav.cloneNode(true);
    nav.parentNode.replaceChild(navClone, nav);
    // Now get the fresh nav reference
    const navFresh = document.getElementById('siteNav');

    // Attach handlers to links inside nav
    navFresh.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', (ev) => {
        // If it's an internal anchor (href starts with '#'), let browser handle jump
        // Close drawer shortly after so browser can navigate first on mobile
        if (navFresh.classList.contains('mobile-open')) {
          setTimeout(() => setMobileOpen(false), 140);
        }
      });

      a.addEventListener('keydown', (ev) => {
        if ((ev.key === 'Enter' || ev.key === ' ') && navFresh.classList.contains('mobile-open')) {
          setTimeout(() => setMobileOpen(false), 140);
        }
      });
    });

    // Close when clicking outside nav (backdrop)
    document.addEventListener('click', (e) => {
      if (!navFresh.classList.contains('mobile-open')) return;
      if (!navFresh.contains(e.target) && e.target !== mobileBtn) {
        setMobileOpen(false);
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navFresh.classList.contains('mobile-open')) {
        setMobileOpen(false);
      }
    });
  }

  // ---------- Typing effect for role ----------
  (function typingEffect() {
    const roleEl = document.querySelector('.hero-role .role-highlight');
    if (!roleEl) return;
    const phrases = ['Cloud Engineer', 'AWS Enthusiast', 'Infrastructure as Code'];
    let idx = 0, j = 0, forward = true;
    function step() {
      const p = phrases[idx];
      roleEl.textContent = p.slice(0, j);
      if (forward) {
        j++;
        if (j > p.length) { forward = false; setTimeout(step, 800); return; }
      } else {
        j--;
        if (j < 0) { forward = true; idx = (idx + 1) % phrases.length; setTimeout(step, 400); return; }
      }
      setTimeout(step, 80);
    }
    step();
  })();

  // ---------- Projects filter & modal ----------
  (function projectsAndModal() {
    const filterBtns = document.querySelectorAll('.project-filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        projectItems.forEach(item => {
          const category = item.getAttribute('data-category');
          item.style.display = (filter === 'all' || category === filter) ? '' : 'none';
        });
      });
    });

    const projectsData = {
      p1: { badge: 'Cloud Project', title: 'Static Website Hosting on AWS', year: '2025', tags: 'AWS · S3 · CloudFront', desc: 'Deployed a static portfolio site using Amazon S3 and CloudFront.', codeUrl: 'https://github.com/Mohamed-faizal-23/aws-static-site-hosting', liveUrl: '' },
      p2: { badge: 'Cloud Project', title: 'AWS Secure VPC Architecture', year: '2025', tags: 'AWS · VPC · EC2', desc: 'Designed secure VPC architecture.', codeUrl: 'https://github.com/Mohamed-faizal-23/aws-secure-vpc-architecture', liveUrl: '' },
      p3: { badge: 'Cloud Project', title: 'Enhancing Cloud Deployment on AWS', year: '2025', tags: 'AWS · CI/CD', desc: 'CI/CD pipeline implementation.', codeUrl: 'https://github.com/Mohamed-faizal-23/cloud-cicd-pipeline', liveUrl: '' },
      p4: { badge: 'Frontend Project', title: 'Frontend Internship Project', year: '2024', tags: 'HTML · CSS · JS', desc: 'Interactive frontend project.', codeUrl: 'https://github.com/Mohamed-faizal-23/front-end-project', liveUrl: 'https://mohamed-faizal-23.github.io/front-end-project/' }
    };

    const modalBackdrop = document.getElementById('projectModal');
    const modalClose = document.getElementById('projectModalClose');
    const modalBadge = document.getElementById('modalBadge');
    const modalTitle = document.getElementById('modalTitle');
    const modalYear = document.getElementById('modalYear');
    const modalTags = document.getElementById('modalTags');
    const modalDesc = document.getElementById('modalDesc');
    const modalCodeBtn = document.getElementById('modalCodeBtn');
    const modalLiveBtn = document.getElementById('modalLiveBtn');

    function openProjectModal(id) {
      if (!modalBackdrop) return;
      const d = projectsData[id];
      if (!d) return;
      if (modalBadge) modalBadge.textContent = d.badge;
      if (modalTitle) modalTitle.textContent = d.title;
      if (modalYear) modalYear.textContent = d.year;
      if (modalTags) modalTags.textContent = d.tags;
      if (modalDesc) modalDesc.textContent = d.desc;
      if (modalCodeBtn) {
        if (d.codeUrl) { modalCodeBtn.style.display = 'inline-flex'; modalCodeBtn.href = d.codeUrl; } else modalCodeBtn.style.display = 'none';
      }
      if (modalLiveBtn) {
        if (d.liveUrl) { modalLiveBtn.style.display = 'inline-flex'; modalLiveBtn.href = d.liveUrl; } else modalLiveBtn.style.display = 'none';
      }
      modalBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
      modalBackdrop.setAttribute('aria-hidden', 'false');
    }

    function closeProjectModal() {
      if (!modalBackdrop) return;
      modalBackdrop.classList.remove('open');
      document.body.style.overflow = '';
      modalBackdrop.setAttribute('aria-hidden', 'true');
    }

    document.querySelectorAll('.project-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.getAttribute('data-project-id');
        openProjectModal(id);
      });
    });

    if (modalClose && modalBackdrop) {
      modalClose.addEventListener('click', closeProjectModal);
      modalBackdrop.addEventListener('click', (e) => { if (e.target === modalBackdrop) closeProjectModal(); });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) closeProjectModal(); });
    }
  })();

  // ---------- Contact form (Formspree) ----------
  (function contactForm() {
    const contactForm = document.getElementById('contactForm');
    const contactStatus = document.getElementById('contactStatus');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (contactStatus) { contactStatus.textContent = 'Sending...'; contactStatus.style.color = '#9fb0c8'; }
      try {
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } });
        if (response.ok) {
          contactForm.reset();
          if (contactStatus) { contactStatus.textContent = '✅ Thanks! Your message has been sent.'; contactStatus.style.color = '#4ade80'; }
        } else {
          if (contactStatus) { contactStatus.textContent = '⚠ Oops! Something went wrong. Please try again later.'; contactStatus.style.color = '#f97373'; }
        }
      } catch (err) {
        if (contactStatus) { contactStatus.textContent = '⚠ Network error. Please check your connection.'; contactStatus.style.color = '#f97373'; }
      }
    });
  })();

}); // DOMContentLoaded end
