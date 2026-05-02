/* ═══════════════════════════════════════════════
   HOLOCOMS — Main Script
   ═══════════════════════════════════════════════ */

'use strict';

/* ── Custom cursor ── */
document.addEventListener('mousemove', e => {
  document.documentElement.style.setProperty('--cx', e.clientX + 'px');
  document.documentElement.style.setProperty('--cy', e.clientY + 'px');
});

/* ── Navbar scroll state ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── Hamburger (mobile) ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
});

/* ─────────────────────────────
   TYPEWRITER
───────────────────────────── */
const phrases = [
  'The AI Receptionist That Never Sleeps.',
  'Intelligent. Adaptive. Always On.',
  'Your Front Desk, Reimagined.',
  'Voice AI That Actually Understands.',
];
let phraseIndex = 0, charIndex = 0, isDeleting = false;
const typeEl = document.getElementById('typewriter');

function type() {
  const current = phrases[phraseIndex];
  const speed = isDeleting ? 40 : 68;

  if (!isDeleting && charIndex <= current.length) {
    typeEl.textContent = current.slice(0, charIndex++);
  } else if (isDeleting && charIndex >= 0) {
    typeEl.textContent = current.slice(0, charIndex--);
  }

  if (!isDeleting && charIndex > current.length) {
    isDeleting = true;
    setTimeout(type, 1800);
    return;
  }
  if (isDeleting && charIndex < 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    setTimeout(type, 400);
    return;
  }
  setTimeout(type, speed);
}
setTimeout(type, 1000);

/* ─────────────────────────────
   PARTICLE CANVAS
───────────────────────────── */
const canvas = document.getElementById('particle-canvas');
const ctx    = canvas.getContext('2d');
let particles = [], W, H, animId;

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize, { passive: true });

function makeParticle() {
  return {
    x:    Math.random() * W,
    y:    Math.random() * H,
    r:    Math.random() * 1.8 + 0.4,
    vx:   (Math.random() - 0.5) * 0.25,
    vy:  -(Math.random() * 0.3 + 0.1),
    life: Math.random(),
    maxLife: Math.random() * 0.4 + 0.6,
    color: Math.random() > 0.5 ? '0,230,118' : '0,180,100',
  };
}

for (let i = 0; i < 90; i++) particles.push(makeParticle());

function drawParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach((p, i) => {
    p.life += 0.004;
    p.x += p.vx; p.y += p.vy;
    if (p.life > p.maxLife || p.y < -10) particles[i] = makeParticle();
    const alpha = Math.sin(Math.PI * (p.life / p.maxLife)) * 0.6;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.color},${alpha})`;
    ctx.fill();
  });
  animId = requestAnimationFrame(drawParticles);
}
drawParticles();

/* ─────────────────────────────
   SCROLL REVEAL
───────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const delay = entry.target.dataset.delay || 0;
    setTimeout(() => {
      entry.target.classList.add('revealed');
    }, +delay);
    revealObs.unobserve(entry.target);
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObs.observe(el));

/* ─────────────────────────────
   GLASS CARDS REVEAL
───────────────────────────── */
const glassCards = document.querySelectorAll('.glass-card');
const cardObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const delay = entry.target.dataset.delay || 0;
    setTimeout(() => {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }, +delay);
    cardObs.unobserve(entry.target);
  });
}, { threshold: 0.1 });

glassCards.forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(24px)';
  card.style.transition = 'opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)';
  cardObs.observe(card);
});

/* ─────────────────────────────
   TERMINAL LOG ANIMATION
───────────────────────────── */
const terminalLog = document.getElementById('terminal-log');
const logLines = [
  { text: '> holocoms-engine initialising...', cls: 'line-muted', delay: 200 },
  { text: '✓ NLP module loaded [v2.1.4]', cls: 'line-ok', delay: 600 },
  { text: '✓ Speech synthesis engine ready', cls: 'line-ok', delay: 1000 },
  { text: '✓ Voice recognition pipeline active', cls: 'line-ok', delay: 1400 },
  { text: '⚠ Calendar API integration — 72% complete', cls: 'line-warn', delay: 1800 },
  { text: '⚠ Sentiment analysis module — building...', cls: 'line-warn', delay: 2200 },
  { text: '✗ CRM connector — not yet initialised', cls: '', delay: 2600 },
  { text: '> Running test suite: 847 passed, 12 pending', cls: 'line-ok', delay: 3000 },
  { text: '> Build #041 — core engine healthy', cls: 'line-ok', delay: 3400 },
  { text: '> Next milestone: calendar scheduling v1.0', cls: 'line-muted', delay: 3800 },
  { text: '', cls: '', delay: 4200 },
  { text: '> holo@holocoms:~$ _', cls: 'line-muted', delay: 4200, blink: true },
];

const terminalObs = new IntersectionObserver((entries) => {
  if (!entries[0].isIntersecting) return;
  logLines.forEach(({ text, cls, delay, blink }) => {
    setTimeout(() => {
      if (!terminalLog) return;
      const line = document.createElement('div');
      line.className = cls || '';
      if (blink) {
        line.innerHTML = text;
        const span = document.createElement('span');
        span.style.cssText = 'animation: blink 1s step-end infinite; display:inline';
        line.appendChild(span);
      } else {
        line.textContent = text;
      }
      terminalLog.appendChild(line);
      terminalLog.scrollTop = terminalLog.scrollHeight;
    }, delay);
  });
  terminalObs.disconnect();
}, { threshold: 0.3 });

if (terminalLog) terminalObs.observe(terminalLog);

/* ─────────────────────────────
   FEATURE BAR REVEAL
───────────────────────────── */
const featureItems = document.querySelectorAll('.feature-item');
const featureObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('revealed');
    featureObs.unobserve(entry.target);
  });
}, { threshold: 0.2 });
featureItems.forEach(item => featureObs.observe(item));

/* ─────────────────────────────
   ROADMAP REVEAL
───────────────────────────── */
document.querySelectorAll('.roadmap-item').forEach((item, i) => {
  item.style.opacity = '0';
  item.style.transform = 'translateX(-20px)';
  item.style.transition = `opacity 0.6s ${i * 0.15}s cubic-bezier(0.22,1,0.36,1), transform 0.6s ${i * 0.15}s cubic-bezier(0.22,1,0.36,1)`;

  const obs = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    item.style.opacity = '1';
    item.style.transform = 'translateX(0)';
    obs.disconnect();
  }, { threshold: 0.2 });
  obs.observe(item);
});

/* ─────────────────────────────
   EARLY ACCESS FORM
───────────────────────────── */
const form       = document.getElementById('access-form');
const successMsg = document.getElementById('success-msg');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name     = document.getElementById('name').value.trim();
    const email    = document.getElementById('email').value.trim();
    const business = document.getElementById('business').value.trim();
    const industry = document.getElementById('industry').value;

    if (!name || !email || !business || !industry) {
      shakeForm();
      return;
    }

    // Simulate async submission
    const btn = form.querySelector('.btn-primary');
    btn.textContent = '// Submitting...';
    btn.style.opacity = '0.7';

    setTimeout(() => {
      form.style.display = 'none';
      successMsg.classList.add('visible');
      console.info('[HoloComs] Early access request:', { name, email, business, industry });
    }, 900);
  });
}

function shakeForm() {
  const btn = form.querySelector('.btn-primary');
  btn.style.animation = 'shake 0.35s ease';
  setTimeout(() => btn.style.animation = '', 350);
}

/* ─────────────────────────────
   HERO PARALLAX (subtle)
───────────────────────────── */
window.addEventListener('scroll', () => {
  const orb = document.querySelector('.hero-orb-container');
  const content = document.querySelector('.hero-content');
  if (!orb || !content) return;
  const y = window.scrollY;
  orb.style.transform = `translateY(calc(-50% + ${y * 0.18}px))`;
  content.style.transform = `translateY(${y * 0.07}px)`;
}, { passive: true });

/* ─────────────────────────────
   SECTION ACTIVE NAV
───────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const navObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    navAnchors.forEach(a => {
      a.style.color = '';
      if (a.getAttribute('href') === `#${id}`) {
        a.style.color = 'var(--green-dark)';
      }
    });
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => navObs.observe(s));

/* ─────────────────────────────
   CSS SHAKE KEYFRAME (injected)
───────────────────────────── */
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-6px); }
    40%, 80% { transform: translateX(6px); }
  }
  .nav-links.open {
    display: flex !important;
    flex-direction: column;
    position: fixed;
    inset: var(--nav-h) 0 0 0;
    background: rgba(245,250,246,0.97);
    backdrop-filter: blur(20px);
    padding: 40px 24px;
    gap: 28px;
    font-size: 1.1rem;
    z-index: 99;
  }
`;
document.head.appendChild(styleSheet);

/* ─────────────────────────────
   EASTER EGG — Konami
───────────────────────────── */
const konami = [38,38,40,40,37,39,37,39,66,65];
let konamiIdx = 0;
document.addEventListener('keydown', e => {
  if (e.keyCode === konami[konamiIdx]) {
    konamiIdx++;
    if (konamiIdx === konami.length) {
      konamiIdx = 0;
      document.body.style.filter = 'hue-rotate(180deg)';
      const msg = document.createElement('div');
      msg.innerHTML = `<span style="font-family:JetBrains Mono,monospace;font-size:0.8rem;
        position:fixed;top:90px;left:50%;transform:translateX(-50%);
        background:var(--ink);color:var(--green);padding:10px 24px;border-radius:40px;
        z-index:9999;box-shadow:0 4px 24px rgba(0,230,118,0.3)">
        // holo_mode: active — colour matrix inverted</span>`;
      document.body.appendChild(msg);
      setTimeout(() => {
        document.body.style.filter = '';
        msg.remove();
      }, 3000);
    }
  } else {
    konamiIdx = 0;
  }
});
