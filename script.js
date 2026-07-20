// ── Carta Piemonte – interações ───────────────────────────

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar (hambúrguer no mobile) ──────────────────────
  const hamburger = document.querySelector('.hamburger');
  const navTabs = document.querySelector('.nav-tabs');

  const closeMenu = () => {
    navTabs?.classList.remove('open');
    hamburger?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
  };

  hamburger?.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = navTabs.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Fecha ao clicar fora
  document.addEventListener('click', e => {
    if (!e.target.closest('.menu-nav')) closeMenu();
  });

  // ── Troca de seção ─────────────────────────────────────
  const navBtns = document.querySelectorAll('.nav-btn');
  const sections = document.querySelectorAll('.menu-section');

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.section;

      navBtns.forEach(b => b.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));

      btn.classList.add('active');
      const section = document.getElementById(target);
      section.classList.add('active');

      // garante que as páginas da seção recém-exibida apareçam
      section.querySelectorAll('.page').forEach(p => p.classList.add('visible'));

      closeMenu();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // ── Troca de dia (Refeições) ───────────────────────────
  const dayBtns = document.querySelectorAll('.day-btn');
  const dayPages = document.querySelectorAll('.day-page');

  dayBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const day = btn.dataset.day;

      dayBtns.forEach(b => b.classList.remove('active'));
      dayPages.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(`day-${day}`).classList.add('active', 'visible');

      // mantém o dia ativo centralizado na faixa
      btn.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    });
  });

  // ── Destaque de item ao tocar ──────────────────────────
  document.querySelectorAll('.wine-item').forEach(item => {
    item.addEventListener('click', () => item.classList.toggle('selected'));
  });

  // ── Animação de entrada ────────────────────────────────
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );

  document.querySelectorAll('.page').forEach(page => {
    page.classList.add('fade-in');
    observer.observe(page);
  });

});
