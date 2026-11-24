/* Voltra Motors — site fictício para laboratório de tagueamento (v2).
 * 1) Carrega o GTM do participante a partir de ?gtm=GTM-XXXXXXX (fica salvo no navegador).
 * 2) Publica eventos de negócio no dataLayer (o GTM decide quais tags disparam).
 * Nenhum dado pessoal (nome, e-mail, telefone) vai para o dataLayer.
 */
window.LAB_CATALOG = {
  aurora: {
    id: 'aurora', name: 'Voltra Aurora', segment: 'SUV compacto híbrido', price: 139990, img: 'assets/img/aurora.jpg',
    tagline: 'O SUV compacto híbrido que redefine a sua jornada.',
    features: [['Motor', 'Híbrido inteligente'], ['Autonomia', 'Combinada de até 1.000 km'], ['Segurança', 'Avançada 360°']],
    hot: { monte: [2.9, 38.7, 15.0, 5.8], saiba: [19.2, 38.7, 13.4, 5.8] }
  },
  trilha: {
    id: 'trilha', name: 'Voltra Trilha', segment: 'Picape média 4x4', price: 219990, img: 'assets/img/trilha.jpg',
    tagline: 'A picape média 4x4 que domina qualquer terreno.',
    features: [['Motor', 'Turbo diesel, forte e eficiente'], ['Tração', '4x4 com seletor de terreno'], ['Capacidade', 'Força para trabalho e lazer']],
    hot: { monte: [3.7, 89.1, 21.2, 6.2], saiba: [26.6, 89.1, 18.8, 6.2] }
  },
  faisca: {
    id: 'faisca', name: 'Voltra Faísca', segment: 'Hatch 100% elétrico', price: 159990, img: 'assets/img/faisca.jpg',
    tagline: 'O hatch 100% elétrico que pulsa com a sua energia.',
    features: [['Motor', '100% elétrico'], ['Autonomia', 'Urbana de até 450 km'], ['Recarga', 'Ultrarrápida']],
    hot: { monte: [3.7, 38.4, 18.0, 5.1], saiba: [23.2, 38.4, 16.2, 5.1] }
  }
};

(function () {
  window.dataLayer = window.dataLayer || [];

  // ---------- 0. Contexto da página (antes do GTM, sem evento) ----------
  var file = (location.pathname.split('/').pop() || 'index.html').replace('.html', '') || 'index';
  var CTX = { index: ['home', 'institucional'], modelo: ['modelo', 'produto'], 'test-drive': ['formulario', 'conversao'], obrigado: ['obrigado', 'conversao'] };
  var ctx = CTX[file] || ['outros', 'institucional'];
  window.dataLayer.push({ page_type: ctx[0], site_section: ctx[1] });

  // ---------- 1. Carregador do GTM ----------
  var params = new URLSearchParams(location.search);
  var fromUrl = (params.get('gtm') || '').trim().toUpperCase();
  if (params.get('gtm') === 'off') { try { localStorage.removeItem('lab_gtm'); } catch (e) {} }
  else if (/^GTM-[A-Z0-9]{4,12}$/.test(fromUrl)) { try { localStorage.setItem('lab_gtm', fromUrl); } catch (e) {} }

  // Prioridade: ID na URL > ID salvo no navegador
  var gtmId = /^GTM-[A-Z0-9]{4,12}$/.test(fromUrl) ? fromUrl : null;
  if (!gtmId && params.get('gtm') !== 'off') { try { gtmId = localStorage.getItem('lab_gtm'); } catch (e) {} }

  if (gtmId) {
    // Snippet oficial do GTM (parte <head>), apenas com o ID dinâmico
    (function (w, d, s, l, i) {
      w[l] = w[l] || []; w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
      j.async = true; j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
      f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', gtmId);
  }

  window.lab = {
    push: function (obj) {
      window.dataLayer.push(obj);
      if (window.console) console.log('[dataLayer]', obj);
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    var bar = document.createElement('div');
    bar.className = 'labbar';
    bar.innerHTML = gtmId
      ? 'LAB · contêiner ativo: <b>' + gtmId + '</b> · <a href="?gtm=off">trocar</a>'
      : 'LAB · nenhum GTM carregado. Abra a página com <code>?gtm=GTM-XXXXXXX</code> no fim da URL.';
    document.body.prepend(bar);
    render();
    document.querySelectorAll('a[href]').forEach(function (a) {
      var h = a.getAttribute('href');
      if (h && h.charAt(0) !== '#' && !/^(https?:|mailto:|tel:)/.test(h)) a.setAttribute('href', withGtm(h));
    });
    wire();
  });

  // Acrescenta ?gtm=ID numa URL interna (o contêiner não se perde na navegação,
  // mesmo quando o navegador ou o Tag Assistant não guardam o localStorage)
  function withGtm(href) {
    if (!gtmId || !href) return href;
    try {
      var u = new URL(href, location.href);
      if (u.origin !== location.origin || !/\.html$|\/$/.test(u.pathname)) return href;
      u.searchParams.set('gtm', gtmId);
      return u.pathname.split('/').pop() + u.search + u.hash;
    } catch (e) { return href; }
  }
  window.lab_withGtm = withGtm;

  function fmt(v) { return typeof v === 'number' ? v.toLocaleString('pt-BR') : v; }

  // ---------- 2. Monta o conteúdo dinâmico (antes de ligar os cliques) ----------
  function render() {
    var catalog = window.LAB_CATALOG, body = document.body;

    // Banners com áreas clicáveis sobre os botões desenhados na imagem
    document.querySelectorAll('[data-banner]').forEach(function (box) {
      var key = box.dataset.banner === 'auto' ? (new URLSearchParams(location.search).get('m') || 'aurora') : box.dataset.banner;
      var item = catalog[key] || catalog.aurora;
      var loc = box.dataset.ctaLocation || 'banner';
      box.innerHTML = '<img src="' + item.img + '" alt="' + item.name + '">';
      [['monte', 'monte_o_seu', 'test-drive.html?m=' + item.id], ['saiba', 'saiba_mais', box.dataset.banner === 'auto' ? '#detalhes' : 'modelo.html?m=' + item.id]].forEach(function (h) {
        var r = item.hot[h[0]], a = document.createElement('a');
        a.className = 'hotspot'; a.href = h[2]; a.setAttribute('aria-label', h[1].replace(/_/g, ' '));
        a.dataset.cta = h[1]; a.dataset.ctaLocation = loc; a.dataset.model = item.id;
        a.style.cssText = 'left:' + r[0] + '%;top:' + r[1] + '%;width:' + r[2] + '%;height:' + r[3] + '%';
        box.appendChild(a);
      });
    });

    if (body.dataset.pageType === 'modelo') {
      var m = new URLSearchParams(location.search).get('m') || 'aurora';
      var item = catalog[m] || catalog.aurora;
      document.title = item.name + ' — Voltra Motors (site fictício)';
      document.querySelectorAll('[data-fill]').forEach(function (n) { n.textContent = fmt(item[n.dataset.fill]); });
      document.querySelectorAll('[data-model-link]').forEach(function (a) { a.href = 'test-drive.html?m=' + item.id; a.dataset.model = item.id; });
      var feats = document.getElementById('features');
      if (feats) feats.innerHTML = item.features.map(function (f) { return '<div class="feat"><span>' + f[0] + '</span><b>' + f[1] + '</b></div>'; }).join('');
    }
  }

  // ---------- 3. Eventos de negócio ----------
  function wire() {
    var body = document.body, catalog = window.LAB_CATALOG;

    // Cliques em CTAs marcados com data-cta
    document.querySelectorAll('[data-cta]').forEach(function (el) {
      el.addEventListener('click', function () {
        lab.push({
          event: 'cta_click',
          cta_name: el.dataset.cta,
          cta_location: el.dataset.ctaLocation || 'corpo',
          vehicle_model: el.dataset.model || undefined
        });
      });
    });

    // Página de modelo → view_item
    if (body.dataset.pageType === 'modelo') {
      var item = catalog[new URLSearchParams(location.search).get('m')] || catalog.aurora;
      lab.push({ ecommerce: null });
      lab.push({
        event: 'view_item',
        vehicle_model: item.id,
        ecommerce: { currency: 'BRL', value: item.price, items: [{ item_id: item.id, item_name: item.name, item_category: item.segment, price: item.price }] }
      });
    }

    // Formulário de test drive → form_start / generate_lead
    var form = document.getElementById('form-test-drive');
    if (form) {
      var sel = form.elements.modelo, prev = document.getElementById('preview');
      var pre = new URLSearchParams(location.search).get('m');
      if (pre && catalog[pre]) sel.value = pre;
      var showPrev = function () { var it = catalog[sel.value]; if (prev && it) { prev.src = it.img; prev.alt = it.name; } };
      sel.addEventListener('change', showPrev); showPrev();

      var started = false;
      form.addEventListener('input', function () {
        if (!started) { started = true; lab.push({ event: 'form_start', form_name: 'test_drive' }); }
      });
      form.addEventListener('submit', function (ev) {
        ev.preventDefault();
        var model = form.elements.modelo.value, city = form.elements.cidade.value;
        var leadId = 'LD-' + Date.now();
        try { sessionStorage.setItem('lab_lead', JSON.stringify({ id: leadId, model: model, city: city })); } catch (e) {}
        lab.push({
          event: 'generate_lead',
          form_name: 'test_drive',
          vehicle_model: model,
          lead_city: city,
          lead_id: leadId,
          value: 1, currency: 'BRL'
        });
        // pequeno atraso para as tags saírem antes do redirecionamento
        setTimeout(function () { location.href = withGtm('obrigado.html'); }, 400);
      });
    }

    // Página de obrigado → thank_you_view (para o Floodlight)
    if (body.dataset.pageType === 'obrigado') {
      var lead = {};
      try { lead = JSON.parse(sessionStorage.getItem('lab_lead') || '{}'); } catch (e) {}
      var it = catalog[lead.model];
      var img = document.getElementById('thanks-img'); if (img && it) { img.src = it.img; img.alt = it.name; }
      var nm = document.getElementById('thanks-model'); if (nm && it) nm.textContent = it.name;
      lab.push({ event: 'thank_you_view', lead_id: lead.id || 'sem_id', vehicle_model: lead.model || 'nao_informado' });
    }
  }
})();
