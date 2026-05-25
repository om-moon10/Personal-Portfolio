/**
 * OM MOON — PORTFOLIO  |  script.js
 * Handles: Loader · Particles · Cursor · Navbar · Typing · 
 *          Stats Counter · Scroll Reveal · Skill Bars · Contact Form
 */

/* ══════════════════════════════════
   1. LOADING SCREEN
══════════════════════════════════ */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  // Give the fill animation time to complete (2s), then hide
  setTimeout(() => {
    loader.classList.add('hidden');
    // Trigger hero animations
    document.querySelectorAll('.hero .reveal-left, .hero .reveal-right')
      .forEach(el => el.classList.add('visible'));
    startCounters();
  }, 2200);
});


/* ══════════════════════════════════
   2. PARTICLE CANVAS
══════════════════════════════════ */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];
  const COUNT = 90;
  const PALETTE = ['rgba(0,212,255,', 'rgba(162,89,255,', 'rgba(0,255,136,'];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : H + 10;
      this.r  = Math.random() * 1.5 + 0.4;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.4 + 0.1);
      this.alpha = Math.random() * 0.5 + 0.1;
      this.fade  = Math.random() * 0.003 + 0.001;
      this.color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.fade;
      if (this.alpha <= 0 || this.y < -10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  function connect() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,212,255,${0.04 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    connect();
    requestAnimationFrame(loop);
  }

  resize();
  window.addEventListener('resize', resize);
  for (let i = 0; i < COUNT; i++) particles.push(new Particle());
  loop();
})();


/* ══════════════════════════════════
   3. CUSTOM CURSOR
══════════════════════════════════ */
(function initCursor() {
  const glow = document.getElementById('cursor-glow');
  const dot  = document.getElementById('cursor-dot');
  let mx = 0, my = 0;
  let gx = 0, gy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  // Smooth cursor glow with lerp
  function lerp(a, b, t) { return a + (b - a) * t; }
  function animGlow() {
    gx = lerp(gx, mx, 0.08);
    gy = lerp(gy, my, 0.08);
    glow.style.left = gx + 'px';
    glow.style.top  = gy + 'px';
    requestAnimationFrame(animGlow);
  }
  animGlow();

  // Scale dot on clickable hover
  document.querySelectorAll('a, button, .project-card, .skill-card, .achievement-card')
    .forEach(el => {
      el.addEventListener('mouseenter', () => {
        dot.style.transform = 'translate(-50%,-50%) scale(2.5)';
        dot.style.background = 'var(--accent-purple)';
      });
      el.addEventListener('mouseleave', () => {
        dot.style.transform = 'translate(-50%,-50%) scale(1)';
        dot.style.background = 'var(--accent-blue)';
      });
    });
})();


/* ══════════════════════════════════
   4. SCROLL PROGRESS
══════════════════════════════════ */
window.addEventListener('scroll', () => {
  const bar  = document.getElementById('scroll-progress');
  const pct  = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
  bar.style.width = pct + '%';
});


/* ══════════════════════════════════
   5. NAVBAR — SCROLL BEHAVIOR & TOGGLE
══════════════════════════════════ */
(function initNavbar() {
  const nav    = document.getElementById('navbar');
  const toggle = document.getElementById('nav-toggle');
  const links  = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
  });

  // Close menu on link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
})();


/* ══════════════════════════════════
   6. TYPING ANIMATION
══════════════════════════════════ */
(function initTyping() {
  const el    = document.getElementById('typing-text');
  const roles = [
    'Frontend Developer',
    'Cybersecurity Enthusiast',
    'Android Developer',
    'Tech Explorer'
  ];
  let ri = 0, ci = 0, deleting = false, pause = false;
  const typeSpeed   = 80;
  const deleteSpeed = 45;
  const pauseTime   = 1800;

  function type() {
    const current = roles[ri];
    if (!deleting) {
      el.textContent = current.slice(0, ++ci);
      if (ci === current.length) {
        pause = true;
        setTimeout(() => { deleting = true; pause = false; tick(); }, pauseTime);
        return;
      }
    } else {
      el.textContent = current.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        ri = (ri + 1) % roles.length;
      }
    }
    if (!pause) setTimeout(tick, deleting ? deleteSpeed : typeSpeed);
  }

  function tick() { type(); }
  // Wait for loader to mostly finish
  setTimeout(tick, 2500);
})();


/* ══════════════════════════════════
   7. STATS COUNTER ANIMATION
══════════════════════════════════ */
function startCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.target);
    let current  = 0;
    const step   = Math.ceil(target / 40);
    const timer  = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 40);
  });
}


/* ══════════════════════════════════
   8. INTERSECTION OBSERVER — REVEAL & SKILLS
══════════════════════════════════ */
(function initReveal() {
  // Reveal elements
  const revealOpts = { threshold: 0.12, rootMargin: '0px 0px -60px 0px' };
  const revealObs  = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.style.getPropertyValue('--delay') || '0s';
        entry.target.style.transitionDelay = delay;
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, revealOpts);

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    .forEach(el => revealObs.observe(el));

  // Skill bars animation
  const skillObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach((bar, i) => {
          setTimeout(() => bar.classList.add('animated'), i * 120);
        });
        skillObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.skill-category').forEach(el => skillObs.observe(el));
})();


/* ══════════════════════════════════
   9. SMOOTH ACTIVE NAV HIGHLIGHTING
══════════════════════════════════ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => {
          a.style.color = '';
          if (a.getAttribute('href') === '#' + entry.target.id) {
            a.style.color = 'var(--accent-blue)';
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => obs.observe(s));
})();


/* ══════════════════════════════════
   10. PROJECT CARD TILT EFFECT
══════════════════════════════════ */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect  = card.getBoundingClientRect();
    const cx    = rect.left + rect.width  / 2;
    const cy    = rect.top  + rect.height / 2;
    const dx    = (e.clientX - cx) / (rect.width  / 2);
    const dy    = (e.clientY - cy) / (rect.height / 2);
    const rotX  = dy * -6;
    const rotY  = dx *  6;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});


/* ══════════════════════════════════
   11. CONTACT FORM
══════════════════════════════════ */
document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const btn     = this.querySelector('button[type="submit"]');
  const success = document.getElementById('form-success');

  btn.disabled = true;
  btn.querySelector('span').textContent = 'Sending...';

  // Simulate async send
  setTimeout(() => {
    success.classList.add('show');
    this.reset();
    btn.disabled = false;
    btn.querySelector('span').textContent = 'Send Message';
    setTimeout(() => success.classList.remove('show'), 5000);
  }, 1500);
});


/* ══════════════════════════════════
   12. FLOATING TECH ICONS (BACKGROUND)
══════════════════════════════════ */
(function createFloatingIcons() {
  const icons  = ['HTML', 'CSS', 'JS', 'Java', '⌨', '🔐', 'Git', 'APK', 'SEC', 'C++'];
  const parent = document.querySelector('.hero');
  if (!parent) return;

  icons.forEach((text, i) => {
    const el = document.createElement('div');
    el.className = 'floating-icon-bg';
    el.textContent = text;
    el.style.cssText = `
      position: absolute;
      font-family: var(--font-mono);
      font-size: ${10 + Math.random() * 6}px;
      color: rgba(0,212,255,${0.04 + Math.random() * 0.05});
      left: ${5 + Math.random() * 85}%;
      top:  ${5 + Math.random() * 85}%;
      pointer-events: none;
      user-select: none;
      animation: floatIcon ${6 + Math.random() * 6}s ease-in-out infinite alternate;
      animation-delay: ${i * 0.4}s;
      z-index: 1;
    `;
    parent.appendChild(el);
  });

  // Inject keyframes once
  if (!document.getElementById('floatIconStyle')) {
    const style = document.createElement('style');
    style.id = 'floatIconStyle';
    style.textContent = `
      @keyframes floatIcon {
        from { transform: translateY(0) rotate(0deg); opacity: 0.6; }
        to   { transform: translateY(-20px) rotate(5deg); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
})();


/* ══════════════════════════════════
   13. SMOOTH SCROLL POLYFILL
══════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
