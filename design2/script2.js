/* ═══════════════════════════════════════════════
   HOLOCOMS v2 — Script
   ═══════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────
   LIVE CLOCK
───────────────────────────── */
const clockEl = document.getElementById('nav-clock');
function updateClock() {
  if (!clockEl) return;
  const now = new Date();
  const pad = n => String(n).padStart(2, '0');
  clockEl.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}
updateClock();
setInterval(updateClock, 1000);

/* ─────────────────────────────
   BACKGROUND GRID CANVAS
───────────────────────────── */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H;

function resizeCanvas() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas, { passive: true });

// Dot grid
function drawGrid() {
  ctx.clearRect(0, 0, W, H);
  const spacing = 48;
  ctx.fillStyle = 'rgba(45, 255, 110, 0.18)';
  for (let x = spacing / 2; x < W; x += spacing) {
    for (let y = spacing / 2; y < H; y += spacing) {
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
drawGrid();
window.addEventListener('resize', drawGrid, { passive: true });

/* ─────────────────────────────
   WAVEFORM BARS
───────────────────────────── */
const waveformEl = document.getElementById('waveform');
const BAR_COUNT = 48;

function makeWaveBars() {
  if (!waveformEl) return;
  waveformEl.innerHTML = '';
  for (let i = 0; i < BAR_COUNT; i++) {
    const bar = document.createElement('div');
    bar.className = 'wf-bar';
    const minH = Math.random() * 10 + 5;
    const maxH = Math.random() * 70 + 20;
    const dur  = (Math.random() * 0.6 + 0.4).toFixed(2);
    const delay = (Math.random() * 0.5).toFixed(2);
    bar.style.cssText = `
      --min-h: ${minH}%;
      --max-h: ${maxH}%;
      --dur: ${dur}s;
      animation-delay: ${delay}s;
    `;
    waveformEl.appendChild(bar);
  }
}
makeWaveBars();

// Re-randomise waveform occasionally to feel alive
setInterval(() => {
  if (!waveformEl) return;
  const bars = waveformEl.querySelectorAll('.wf-bar');
  bars.forEach(bar => {
    const maxH = Math.random() * 70 + 20;
    bar.style.setProperty('--max-h', maxH + '%');
  });
}, 3000);

/* ─────────────────────────────
   SCROLL PROGRESS BAR
───────────────────────────── */
const progressEl = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  if (!progressEl) return;
  const doc = document.documentElement;
  const scrolled = (window.scrollY / (doc.scrollHeight - doc.clientHeight)) * 100;
  progressEl.style.width = scrolled + '%';
}, { passive: true });

/* ─────────────────────────────
   REVEAL ON SCROLL
───────────────────────────── */
function makeObserver(className, visibleClass = 'visible') {
  const els = document.querySelectorAll('.' + className);
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add(visibleClass), +delay);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
  els.forEach(el => obs.observe(el));
}

makeObserver('reveal-left');
makeObserver('reveal-up');

/* ─────────────────────────────
   FEATURE ROWS — progress bars
───────────────────────────── */
const featRows = document.querySelectorAll('.feat-row');
const featObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const delay = entry.target.dataset.delay || 0;
    setTimeout(() => entry.target.classList.add('revealed'), +delay);
    featObs.unobserve(entry.target);
  });
}, { threshold: 0.2 });
featRows.forEach(r => featObs.observe(r));

/* ─────────────────────────────
   COUNTER ANIMATION
───────────────────────────── */
function animateCounter(el, target, duration = 1600) {
  const start = performance.now();
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterEls = document.querySelectorAll('.counter');
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const target = +entry.target.dataset.target;
    if (!isNaN(target) && target > 0) animateCounter(entry.target, target);
    counterObs.unobserve(entry.target);
  });
}, { threshold: 0.5 });
counterEls.forEach(el => counterObs.observe(el));

/* ─────────────────────────────
   HERO DATA CELLS — count up
───────────────────────────── */
const dataCells = document.querySelectorAll('.dc-val[data-target]');
const dcObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const target = +entry.target.dataset.target;
    if (!isNaN(target) && target > 0) animateCounter(entry.target, target, 2000);
    dcObs.unobserve(entry.target);
  });
}, { threshold: 0.5 });
dataCells.forEach(el => dcObs.observe(el));

/* ─────────────────────────────
   CURSOR — crosshair coords
───────────────────────────── */
let cursorX = 0, cursorY = 0;
let trailX = 0, trailY = 0;
const crosshairSize = 16;

// Inject a tiny canvas crosshair follower
const cursorCanvas = document.createElement('canvas');
cursorCanvas.style.cssText = `
  position: fixed; inset: 0; z-index: 9995; pointer-events: none;
  width: 100%; height: 100%;
`;
cursorCanvas.width = window.innerWidth;
cursorCanvas.height = window.innerHeight;
document.body.appendChild(cursorCanvas);
const cCtx = cursorCanvas.getContext('2d');

window.addEventListener('resize', () => {
  cursorCanvas.width = window.innerWidth;
  cursorCanvas.height = window.innerHeight;
}, { passive: true });

document.addEventListener('mousemove', e => {
  cursorX = e.clientX;
  cursorY = e.clientY;
});

function drawCursor() {
  trailX += (cursorX - trailX) * 0.14;
  trailY += (cursorY - trailY) * 0.14;

  cCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);

  // Outer crosshair
  cCtx.strokeStyle = 'rgba(45,255,110,0.8)';
  cCtx.lineWidth = 1;
  const s = crosshairSize;

  cCtx.beginPath();
  cCtx.moveTo(trailX - s, trailY); cCtx.lineTo(trailX - 3, trailY);
  cCtx.moveTo(trailX + 3, trailY); cCtx.lineTo(trailX + s, trailY);
  cCtx.moveTo(trailX, trailY - s); cCtx.lineTo(trailX, trailY - 3);
  cCtx.moveTo(trailX, trailY + 3); cCtx.lineTo(trailX, trailY + s);
  cCtx.stroke();

  // Inner dot (exact cursor pos)
  cCtx.fillStyle = 'rgba(45,255,110,1)';
  cCtx.beginPath();
  cCtx.arc(cursorX, cursorY, 2, 0, Math.PI * 2);
  cCtx.fill();

  requestAnimationFrame(drawCursor);
}
drawCursor();

/* ─────────────────────────────
   ACCESS FORM
───────────────────────────── */
const form = document.getElementById('access-form');
const formSuccess = document.getElementById('form-success');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name  = document.getElementById('f-name').value.trim();
    const biz   = document.getElementById('f-biz').value.trim();
    const email = document.getElementById('f-email').value.trim();
    const ind   = document.getElementById('f-industry').value;

    if (!name || !biz || !email || !ind) {
      const btn = form.querySelector('.btn-block');
      btn.textContent = '! FILL ALL FIELDS';
      btn.style.background = '#ff3c3c';
      btn.style.color = '#fff';
      setTimeout(() => {
        btn.textContent = 'SUBMIT REQUEST →';
        btn.style.background = '';
        btn.style.color = '';
      }, 1800);
      return;
    }

    const btn = form.querySelector('.btn-block');
    btn.textContent = '// PROCESSING...';
    btn.style.opacity = '0.6';

    setTimeout(() => {
      form.style.display = 'none';
      formSuccess.classList.add('visible');
      console.info('[HoloComs] Access request:', { name, biz, email, ind });
    }, 1000);
  });
}

/* ─────────────────────────────
   GLITCH EFFECT on headings
───────────────────────────── */
const glitchEls = document.querySelectorAll('[data-text]');

function triggerGlitch(el) {
  const original = el.dataset.text;
  const chars = '!@#$%^&*<>?/|01XZQW▓▒░◆◈';
  let iteration = 0;
  const interval = setInterval(() => {
    el.textContent = original.split('').map((char, i) => {
      if (i < iteration) return original[i];
      if (char === ' ') return ' ';
      return chars[Math.floor(Math.random() * chars.length)];
    }).join('');
    iteration += 0.5;
    if (iteration >= original.length) {
      el.textContent = original;
      clearInterval(interval);
    }
  }, 40);
}

// Trigger on load
setTimeout(() => {
  glitchEls.forEach(el => triggerGlitch(el));
}, 600);

// Re-trigger on hover
glitchEls.forEach(el => {
  el.addEventListener('mouseenter', () => triggerGlitch(el));
});

/* ─────────────────────────────
   TICKER pause on hover
───────────────────────────── */
const ticker = document.querySelector('.ticker-track');
if (ticker) {
  ticker.addEventListener('mouseenter', () => ticker.style.animationPlayState = 'paused');
  ticker.addEventListener('mouseleave', () => ticker.style.animationPlayState = 'running');
}

/* ─────────────────────────────
   NAV active section tracking
───────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const secObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    navLinks.forEach(a => {
      a.style.color = '';
      if (a.getAttribute('href') === '#' + id) a.style.color = 'var(--green)';
    });
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => secObs.observe(s));
