// ── Cardápio Piemonte – interações ───────────────────────────

(() => {
  // Centraliza um botão dentro da sua faixa rolável, sem mexer na rolagem da página
  const centralizar = (btn, suave = true) => {
    const faixa = btn.parentElement;
    if (faixa.scrollWidth <= faixa.clientWidth) return;
    faixa.scrollTo({
      left: btn.offsetLeft - (faixa.clientWidth - btn.offsetWidth) / 2,
      behavior: suave ? 'smooth' : 'auto',
    });
  };

  // ── Abas das seções ──────────────────────────────────────
  const abas = [...document.querySelectorAll('.tab')];
  const secoes = [...document.querySelectorAll('.menu-section')];

  const mostrarSecao = (id, { atualizarEndereco = true } = {}) => {
    const alvo = secoes.find((s) => s.id === id);
    if (!alvo) return false;

    secoes.forEach((s) => s.classList.toggle('is-active', s === alvo));
    abas.forEach((a) => {
      const ativa = a.dataset.section === id;
      a.classList.toggle('is-active', ativa);
      a.setAttribute('aria-selected', String(ativa));
      if (ativa) centralizar(a);
    });

    // mantém o dia escolhido visível na faixa de dias
    const diaAtivo = alvo.querySelector('.day.is-active');
    if (diaAtivo) { centralizar(diaAtivo, false); atualizarBordas(); }

    // permite abrir uma seção direto pelo link (ex.: .../#sopas)
    if (atualizarEndereco) history.replaceState(null, '', `#${id}`);
    return true;
  };

  abas.forEach((aba) => {
    aba.addEventListener('click', () => {
      mostrarSecao(aba.dataset.section);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // ── Dias da semana (Refeições) ───────────────────────────
  const dias = [...document.querySelectorAll('.day')];
  const paginasDias = [...document.querySelectorAll('.day-page')];

  const faixaDias = document.querySelector('.days');
  const setas = [...document.querySelectorAll('.days-arrow')];

  const mostrarDia = (dia) => {
    let indice = 0;
    dias.forEach((d, i) => {
      const ativo = d.dataset.day === dia;
      d.classList.toggle('is-active', ativo);
      d.setAttribute('aria-selected', String(ativo));
      if (ativo) { indice = i; centralizar(d); }
    });
    paginasDias.forEach((p) => p.classList.toggle('is-active', p.id === `day-${dia}`));

    // ‹ desativa na segunda, › desativa no domingo
    setas.forEach((s) => {
      const destino = indice + Number(s.dataset.step);
      s.disabled = destino < 0 || destino >= dias.length;
    });
  };

  dias.forEach((d) => d.addEventListener('click', () => mostrarDia(d.dataset.day)));

  setas.forEach((s) => s.addEventListener('click', () => {
    const atual = dias.findIndex((d) => d.classList.contains('is-active'));
    const destino = dias[atual + Number(s.dataset.step)];
    if (destino) mostrarDia(destino.dataset.day);
  }));

  // Esmaece só o lado em que ainda há dias escondidos
  const atualizarBordas = () => {
    if (!faixaDias) return;
    const { scrollLeft, scrollWidth, clientWidth } = faixaDias;
    faixaDias.classList.toggle('has-left', scrollLeft > 4);
    faixaDias.classList.toggle('has-right', scrollLeft + clientWidth < scrollWidth - 4);
  };
  faixaDias?.addEventListener('scroll', atualizarBordas, { passive: true });
  window.addEventListener('resize', atualizarBordas);

  // Abre já no dia de hoje e marca com "Hoje"
  const hoje = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'][new Date().getDay()];
  const botaoHoje = dias.find((d) => d.dataset.day === hoje);
  if (botaoHoje) {
    botaoHoje.classList.add('is-today');
    botaoHoje.insertAdjacentHTML('beforeend', '<span class="sr-only"> (hoje)</span>');
    document.querySelector(`#day-${hoje} .day-head`)
      ?.insertAdjacentHTML('beforeend', '<span class="today-tag">Hoje</span>');
    mostrarDia(hoje);
  }

  // Seção vinda do link (#vinhos, #sopas, #refeicoes, #bebidas)
  const abrirSecaoDoLink = () => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (id) mostrarSecao(id, { atualizarEndereco: false });
  };
  abrirSecaoDoLink();
  window.addEventListener('hashchange', abrirSecaoDoLink);

  // ── Destaque de item ao tocar ────────────────────────────
  document.querySelectorAll('.item').forEach((item) => {
    item.addEventListener('click', () => item.classList.toggle('is-selected'));
  });

  // ── Entrada suave das categorias ─────────────────────────
  const revelar = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    revelar.forEach((el) => io.observe(el));
  } else {
    revelar.forEach((el) => el.classList.add('is-visible'));
  }
})();
