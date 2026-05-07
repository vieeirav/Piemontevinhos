// ── Carta de Vinhos – interações ──────────────────────────

document.addEventListener('DOMContentLoaded', () => {

  // ── Hambúrguer ─────────────────────────────────────────
  const hamburger = document.querySelector('.hamburger');
  const navDropdown = document.querySelector('.nav-dropdown');
  const navActiveLabel = document.querySelector('.nav-active-label');

  hamburger?.addEventListener('click', () => {
    const isOpen = navDropdown.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Fecha ao clicar fora
  document.addEventListener('click', e => {
    if (!e.target.closest('.menu-nav')) {
      navDropdown?.classList.remove('open');
      hamburger?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
    }
  });

  // ── Navbar tab switching ───────────────────────────────
  const navBtns = document.querySelectorAll('.nav-btn');
  const sections = document.querySelectorAll('.menu-section');

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.section;

      navBtns.forEach(b => b.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(target).classList.add('active');

      // Atualiza label e fecha dropdown no mobile
      if (navActiveLabel) navActiveLabel.textContent = btn.textContent;
      navDropdown?.classList.remove('open');
      hamburger?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // ── Day selector (Refeições) ──────────────────────────
  const dayBtns = document.querySelectorAll('.day-btn');
  const dayPages = document.querySelectorAll('.day-page');

  dayBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const day = btn.dataset.day;

      dayBtns.forEach(b => b.classList.remove('active'));
      dayPages.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(`day-${day}`).classList.add('active');
    });
  });

  // ── Highlight wine items on click ─────────────────────
  document.querySelectorAll('.wine-item').forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('selected');
    });
  });

  // ── Entrance animation ────────────────────────────────
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.page').forEach(page => {
    page.classList.add('fade-in');
    observer.observe(page);
  });

});
