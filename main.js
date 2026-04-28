/* ═══════════════════════════════════════
   Project Holo — main.js
═══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Active nav link ──────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ── Billing toggle (pricing page) ────
  const toggle = document.querySelector('.billing-toggle');
  if (toggle) {
    const amounts   = document.querySelectorAll('.plan-price .amount');
    const monthly   = { starter: '49', pro: '129', enterprise: 'Custom' };
    const annual    = { starter: '39', pro: '99',  enterprise: 'Custom' };
    const keys      = ['starter', 'pro', 'enterprise'];

    toggle.addEventListener('click', () => {
      toggle.classList.toggle('annual');
      const isAnnual = toggle.classList.contains('annual');

      amounts.forEach((el, i) => {
        el.style.opacity = '0';
        setTimeout(() => {
          el.textContent = isAnnual ? annual[keys[i]] : monthly[keys[i]];
          el.style.opacity = '1';
        }, 150);
      });
    });
  }

  // ── FAQ accordion (pricing page) ─────
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q')?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item.open').forEach(o => o.classList.remove('open'));
      // Open clicked (unless it was already open)
      if (!isOpen) item.classList.add('open');
    });
  });

  // ── Subtle card tilt on hover ─────────
  document.querySelectorAll('.card, .plan-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const tiltX  = ((y - cy) / cy) * 4;
      const tiltY  = ((x - cx) / cx) * -4;
      card.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ── Scroll-reveal (lightweight) ───────
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity    = '1';
        entry.target.style.transform  = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.card, .plan-card, .faq-item').forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });

});
