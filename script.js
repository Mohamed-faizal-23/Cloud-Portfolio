// Dark / light toggle, mobile menu, typing effect, projects filter + modal + contact form
document.addEventListener('DOMContentLoaded', function () {
  const darkBtn = document.getElementById('darkToggle');
  const html = document.documentElement;

  // Dark / light toggle
  if (darkBtn) {
    darkBtn.addEventListener('click', () => {
      html.classList.toggle('light-theme');
      darkBtn.textContent = html.classList.contains('light-theme') ? '☀️' : '🌙';
    });
  }

  // Mobile menu toggle + responsive behavior
  const mobileBtn = document.getElementById('mobileMenu');
  const nav = document.getElementById('siteNav');

  function handleNavResize() {
    if (!nav) return;
    if (window.innerWidth >= 760) {
      // Desktop: always show nav
      nav.style.display = 'flex';
    } else {
      // Mobile: let CSS control (hidden by default)
      nav.style.display = '';
    }
  }

  if (mobileBtn && nav) {
    mobileBtn.addEventListener('click', () => {
      // Only toggle on mobile
      if (window.innerWidth < 760) {
        nav.style.display = (nav.style.display === 'flex') ? 'none' : 'flex';
        nav.style.flexDirection = 'column';
      }
    });

    window.addEventListener('resize', handleNavResize);
    handleNavResize();
  }

  // Typing effect for role
  const roleEl = document.querySelector('.hero-role .role-highlight');
  if (roleEl) {
    const phrases = ['Cloud Engineer', 'AWS Enthusiast', 'Infrastructure as Code'];
    let idx = 0;
    let j = 0;
    let forward = true;
    function step() {
      const p = phrases[idx];
      roleEl.textContent = p.slice(0, j);
      if (forward) {
        j++;
        if (j > p.length) {
          forward = false;
          setTimeout(step, 800);
          return;
        }
      } else {
        j--;
        if (j < 0) {
          forward = true;
          idx = (idx + 1) % phrases.length;
          setTimeout(step, 400);
          return;
        }
      }
      setTimeout(step, 80);
    }
    step();
  }

  // ---------- PROJECTS: filter ----------
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const projectItems = document.querySelectorAll('.project-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      projectItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // ---------- PROJECTS: modal ----------
  const projectsData = {
    p1: {
      badge: 'Cloud Project',
      title: 'Static Website Hosting on AWS',
      year: '2025',
      tags: 'AWS · S3 · CloudFront · Static Website',
      desc: 'Deployed a static portfolio site using Amazon S3 as the origin and CloudFront as CDN. Configured origin access control, bucket policies, and caching behaviours to deliver content securely and with low latency.',
      codeUrl: '', // later: GitHub report/code link
      liveUrl: ''
    },
    p2: {
      badge: 'Cloud Project',
      title: 'AWS Secure VPC Architecture',
      year: '2025',
      tags: 'AWS · VPC · EC2 · Security Groups',
      desc: 'Designed a secure VPC with public and private subnets, Internet Gateway, route tables and NAT configuration. Launched an EC2 instance running Apache in the public subnet and restricted access using security groups.',
      codeUrl: '', // later: GitHub report/code link
      liveUrl: ''
    },
    p3: {
      badge: 'Cloud Project',
      title: 'Enhancing Cloud Deployment on AWS',
      year: '2025',
      tags: 'AWS · CodePipeline · CodeBuild · CI/CD',
      desc: 'Implemented a CI/CD pipeline using AWS CodePipeline and CodeBuild to automate build, test and deployment to an S3-hosted application. Ensured repeatable deployments and faster releases with minimal downtime.',
      codeUrl: '', // later: GitHub report/code link
      liveUrl: ''
    },
    p4: {
      badge: 'Frontend Project',
      title: 'Frontend Internship Project',
      year: '2024',
      tags: 'HTML · CSS · JavaScript · Responsive UI',
      desc: 'Developed an interactive web application during my internship, focusing on responsive layouts, reusable components and better user experience. Worked on form handling, navigation and layout improvements.',
      codeUrl: 'https://github.com/Mohamed-faizal-23/front-end-project',
      liveUrl: 'https://mohamed-faizal-23.github.io/front-end-project/'
    }
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
    const data = projectsData[id];
    if (!data) return;

    modalBadge.textContent = data.badge;
    modalTitle.textContent = data.title;
    modalYear.textContent = data.year;
    modalTags.textContent = data.tags;
    modalDesc.textContent = data.desc;

    if (data.codeUrl) {
      modalCodeBtn.style.display = 'inline-flex';
      modalCodeBtn.href = data.codeUrl;
    } else {
      modalCodeBtn.style.display = 'none';
    }

    if (data.liveUrl) {
      modalLiveBtn.style.display = 'inline-flex';
      modalLiveBtn.href = data.liveUrl;
    } else {
      modalLiveBtn.style.display = 'none';
    }

    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  projectItems.forEach(item => {
    item.addEventListener('click', () => {
      const id = item.getAttribute('data-project-id');
      openProjectModal(id);
    });
  });

  if (modalClose && modalBackdrop) {
    modalClose.addEventListener('click', closeProjectModal);

    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeProjectModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
        closeProjectModal();
      }
    });
  }

  // ---------- CONTACT FORM (Formspree) ----------
  const contactForm = document.getElementById('contactForm');
  const contactStatus = document.getElementById('contactStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Clear old message
      if (contactStatus) {
        contactStatus.textContent = 'Sending...';
        contactStatus.style.color = '#9fb0c8';
      }

      try {
        const formData = new FormData(contactForm);

        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          contactForm.reset();
          if (contactStatus) {
            contactStatus.textContent = '✅ Thanks! Your message has been sent.';
            contactStatus.style.color = '#4ade80'; // green-ish
          }
        } else {
          if (contactStatus) {
            contactStatus.textContent = '⚠️ Oops! Something went wrong. Please try again later.';
            contactStatus.style.color = '#f97373';
          }
        }
      } catch (err) {
        if (contactStatus) {
          contactStatus.textContent = '⚠️ Network error. Please check your connection.';
          contactStatus.style.color = '#f97373';
        }
      }
    });
  }

});
