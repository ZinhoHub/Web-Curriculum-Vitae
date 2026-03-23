/* ===========================
   main.js — Julien Alary CV
=========================== */

// ── Navbar scroll behaviour ──────────────────────────────────────────────────
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// ── Smooth active nav link highlighting ─────────────────────────────────────
const sections = document.querySelectorAll('section[id], header[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${entry.target.id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(section => sectionObserver.observe(section));

// ── Reveal on scroll ─────────────────────────────────────────────────────────
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings in the same parent
      const siblings = entry.target.parentElement.querySelectorAll('.reveal');
      let delay = 0;
      siblings.forEach((sibling, index) => {
        if (sibling === entry.target) delay = index * 80;
      });
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealElements.forEach(el => revealObserver.observe(el));

// ── Language bar animation ───────────────────────────────────────────────────
const barFills = document.querySelectorAll('.bar-fill');

const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

barFills.forEach(bar => barObserver.observe(bar));

// ── Smooth scroll for nav links ──────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── Cursor trail (subtle golden particles) ───────────────────────────────────
const canvas = document.createElement('canvas');
canvas.style.cssText = `
  position: fixed; top: 0; left: 0;
  pointer-events: none; z-index: 9998;
  mix-blend-mode: screen; opacity: 0.5;
`;
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

let W = window.innerWidth;
let H = window.innerHeight;
canvas.width = W;
canvas.height = H;

window.addEventListener('resize', () => {
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;
}, { passive: true });

const particles = [];
let mouse = { x: -200, y: -200 };

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  // Spawn particle
  if (particles.length < 60) {
    particles.push({
      x: mouse.x,
      y: mouse.y,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2 - 0.5,
      life: 1,
      size: Math.random() * 2 + 1,
    });
  }
}, { passive: true });

function animateParticles() {
  ctx.clearRect(0, 0, W, H);
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.02; // gravity
    p.life -= 0.03;

    if (p.life <= 0) {
      particles.splice(i, 1);
      continue;
    }

    ctx.save();
    ctx.globalAlpha = p.life * 0.5;
    ctx.fillStyle = '#c9a84c';
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  requestAnimationFrame(animateParticles);
}

animateParticles();

// ── Timeline items hover enhancement ────────────────────────────────────────
document.querySelectorAll('.timeline-content').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateX(4px)';
    card.style.transition = 'transform 0.25s ease, border-color 0.35s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateX(0)';
  });
});

// ── Typing animation for hero tag ────────────────────────────────────────────
const heroTag = document.querySelector('.hero-tag');
if (heroTag) {
  const text = heroTag.textContent;
  heroTag.textContent = '';
  let i = 0;
  const type = () => {
    if (i < text.length) {
      heroTag.textContent += text[i];
      i++;
      setTimeout(type, 45);
    }
  };
  setTimeout(type, 300);
}

// ── Fact card count-up animation ─────────────────────────────────────────────
function animateValue(el, start, end, duration, suffix = '') {
  const range = end - start;
  const startTime = performance.now();
  const step = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const value = Math.round(start + range * eased);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const factObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const numEl = entry.target.querySelector('.fact-number');
      if (!numEl) return;
      const raw = numEl.textContent;
      const numMatch = raw.match(/[\d]+/);
      if (!numMatch) return;
      const suffix = raw.replace(/[\d]+/, '');
      animateValue(numEl, 0, parseInt(numMatch[0]), 1200, suffix);
      factObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.fact-card').forEach(card => factObserver.observe(card));

console.log('%c Julien Alary — CV Website ', 'background:#c9a84c;color:#0c0d0f;font-weight:bold;padding:4px 8px;border-radius:2px;');