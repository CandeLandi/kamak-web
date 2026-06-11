// Port de js/kamak.js (interacciones) + js/map-ar.js (mapa) del mockup, adaptado
// a funciones que el componente llama en ngAfterViewInit (browser-only).
// El submit del form lo maneja Angular (onSubmit) — acá NO se bindea data-wa-form.

const WA_NUMBER = '5492262559474';

export function initSiteInteractions(): void {
  const d = document;

  // Header: estado scrolled
  const nav = d.querySelector('.nav');
  const onScroll = () => { if (nav) nav.classList.toggle('scrolled', window.scrollY > 40); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Menú mobile
  const burger = d.querySelector('.nav__burger');
  const menu = d.querySelector('.mobile-menu');
  const toggleMenu = (force?: boolean) => {
    if (!menu) return;
    const open = force ?? !menu.classList.contains('open');
    menu.classList.toggle('open', open);
    d.body.style.overflow = open ? 'hidden' : '';
    burger?.classList.toggle('active', open);
  };
  burger?.addEventListener('click', () => toggleMenu());
  menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));

  // Slider Antes / Después
  d.querySelectorAll('.ba').forEach(ba => {
    const after = ba.querySelector<HTMLElement>('.ba__after');
    const handle = ba.querySelector<HTMLElement>('.ba__handle');
    if (!after || !handle) return;
    let dragging = false;
    const setPos = (clientX: number) => {
      const r = ba.getBoundingClientRect();
      let pct = ((clientX - r.left) / r.width) * 100;
      pct = Math.max(2, Math.min(98, pct));
      after.style.clipPath = `inset(0 0 0 ${pct}%)`;
      handle.style.left = pct + '%';
    };
    const start = () => { dragging = true; ba.classList.add('dragging'); };
    const move = (e: MouseEvent | TouchEvent) => {
      if (!dragging) return;
      const x = (e as TouchEvent).touches ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
      setPos(x);
      if (e.cancelable) e.preventDefault();
    };
    const end = () => { dragging = false; ba.classList.remove('dragging'); };
    handle.addEventListener('mousedown', start);
    ba.addEventListener('mousedown', (e) => { start(); setPos((e as MouseEvent).clientX); });
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);
    handle.addEventListener('touchstart', start, { passive: true });
    ba.addEventListener('touchstart', (e) => { start(); setPos((e as TouchEvent).touches[0].clientX); }, { passive: true });
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', end);
    const r0 = ba.getBoundingClientRect();
    setPos(r0.left + r0.width * 0.5);
  });

  // Botones WhatsApp directos
  d.querySelectorAll('[data-wa]').forEach(b => {
    const txt = b.getAttribute('data-wa') || 'Hola Kamak, quiero cotizar mi tienda.';
    b.setAttribute('href', `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(txt)}`);
    b.setAttribute('target', '_blank');
    b.setAttribute('rel', 'noopener');
  });

  // Scroll reveal (re-trigger)
  const revealEls = d.querySelectorAll('.reveal, .step');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { en.target.classList.toggle('in', en.isIntersecting); });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  revealEls.forEach(el => io.observe(el));
  const forceVisible = (el: HTMLElement) => { if (getComputedStyle(el).opacity === '0') { el.style.animation = 'none'; el.style.opacity = '1'; } };
  let runs = 0;
  const safety = setInterval(() => {
    d.querySelectorAll<HTMLElement>('.reveal.in,.step.in,.cards-4.reveal.in .who,.brandgrid.reveal.in .brandtile,.works-grid.reveal.in .work').forEach(forceVisible);
    if (++runs >= 6) clearInterval(safety);
  }, 1800);

  // Count-up
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const counters = d.querySelectorAll<HTMLElement>('[data-count]');
  const finalText = (el: HTMLElement) => {
    const target = parseFloat(el.getAttribute('data-count') || '0');
    const dec = ((el.getAttribute('data-count') || '').split('.')[1] || '').length;
    const pre = el.getAttribute('data-pre') || '', suf = el.getAttribute('data-suf') || '';
    return pre + target.toLocaleString('es-AR', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
  };
  const setFinal = (el: HTMLElement) => { if (el.dataset['done']) return; el.dataset['done'] = '1'; el.textContent = finalText(el); };
  const runCount = (el: HTMLElement) => {
    if (el.dataset['done']) return;
    if (reduceMotion) { setFinal(el); return; }
    el.dataset['done'] = '1';
    const target = parseFloat(el.getAttribute('data-count') || '0');
    const dec = ((el.getAttribute('data-count') || '').split('.')[1] || '').length;
    const dur = 1100, t0 = performance.now();
    const pre = el.getAttribute('data-pre') || '', suf = el.getAttribute('data-suf') || '';
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + (target * e).toLocaleString('es-AR', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
      if (p < 1) requestAnimationFrame(tick); else el.textContent = finalText(el);
    };
    requestAnimationFrame(tick);
  };
  if (reduceMotion) { counters.forEach(setFinal); }
  else {
    counters.forEach(c => c.textContent = c.getAttribute('data-pre') || '0');
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { runCount(en.target as HTMLElement); cio.unobserve(en.target); } });
    }, { threshold: 0.35 });
    counters.forEach(c => cio.observe(c));
    setTimeout(() => counters.forEach(c => { if (!c.dataset['done']) setFinal(c); }), 2500);
  }

  // Parallax
  const plxEls = d.querySelectorAll<HTMLElement>('[data-parallax]');
  if (plxEls.length) {
    const plx = () => {
      plxEls.forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
        el.style.setProperty('--py', (p * -26).toFixed(1) + 'px');
      });
    };
    window.addEventListener('scroll', plx, { passive: true });
    plx();
  }

  // Videos de fondo: autoplay + loop
  d.querySelectorAll<HTMLVideoElement>('.hero__video, .vstatement__video, .maker__video').forEach(v => {
    v.loop = true;
    const play = () => { const p = v.play(); if (p && p.catch) p.catch(() => {}); };
    if (v.readyState >= 2) play();
    v.addEventListener('loadeddata', play, { once: true });
    v.addEventListener('canplay', play, { once: true });
    d.addEventListener('click', play, { once: true });
  });
}

// ── Mapa nacional (port de map-ar.js). obras = ObraWeb[] con localidad/provincia ──
const LOCALIDAD_COORDS: Record<string, [number, number]> = {
  'Rosario': [-32.95, -60.65], 'Baradero': [-33.81, -59.51], 'San Pedro': [-33.68, -59.66],
  'Zárate': [-34.10, -59.03], 'Luján': [-34.57, -59.10], 'Pilar': [-34.46, -58.91],
  'La Plata': [-34.92, -57.95], 'Chascomús': [-35.57, -58.01], 'Dolores': [-36.31, -57.68],
  'San Clemente del Tuyú': [-36.36, -56.72], 'San Clemente': [-36.36, -56.72], 'Las Toninas': [-36.49, -56.70],
  'Pinamar': [-37.11, -56.86], 'Villa Gesell': [-37.26, -56.97], 'Mar del Plata': [-38.00, -57.55],
  'Miramar': [-38.27, -57.84], 'Balcarce': [-37.85, -58.26], 'Tandil': [-37.32, -59.13],
  'Azul': [-36.78, -59.86], 'Olavarría': [-36.89, -60.32], 'Necochea': [-38.55, -58.74],
  'Tres Arroyos': [-38.37, -60.28], 'Coronel Suárez': [-37.46, -61.93], 'Bahía Blanca': [-38.72, -62.27],
  'Pergamino': [-33.89, -60.57], 'Junín': [-34.59, -60.95], 'Chivilcoy': [-34.90, -60.02],
  'Elena': [-32.57, -64.39], 'Lobería': [-38.16, -58.78], 'San Bernardo': [-36.69, -56.68],
  'Madariaga': [-37.00, -57.14], 'San Martín': [-34.57, -58.53], 'Haedo': [-34.64, -58.59],
  'Rojas': [-34.19, -60.73], 'Lomas de Zamora': [-34.76, -58.40], 'El Talar': [-34.47, -58.63],
  '30 de Agosto': [-36.27, -62.34], 'Garín': [-34.42, -58.73], 'Sampacho': [-33.38, -64.72],
  'Moquehua': [-35.05, -59.50],
};
const AR_OUTLINE: [number, number][] = [
  [-66.9, -21.8], [-64.3, -22.2], [-62.8, -22.0], [-60.8, -23.5], [-58.4, -24.8], [-57.5, -25.4], [-56.0, -27.0], [-55.7, -27.4], [-54.6, -25.6], [-53.8, -26.0], [-53.6, -26.9], [-54.0, -27.5], [-55.4, -28.1], [-56.5, -28.9], [-57.6, -30.2], [-58.2, -31.8], [-58.4, -33.1], [-58.3, -34.2], [-57.1, -35.4], [-56.7, -36.3], [-56.7, -36.9], [-57.5, -38.0], [-58.7, -38.6], [-60.3, -38.9], [-62.1, -38.9], [-62.3, -39.5], [-63.0, -41.0], [-64.5, -41.0], [-65.1, -42.1], [-64.4, -42.5], [-65.3, -43.4], [-65.6, -45.0], [-67.3, -46.7], [-67.6, -47.8], [-68.0, -49.3], [-68.3, -50.1], [-68.6, -51.6], [-68.4, -52.4], [-70.8, -52.0], [-72.3, -51.0], [-72.3, -50.5], [-73.5, -49.5], [-72.6, -48.4], [-72.5, -47.5], [-71.9, -46.8], [-71.7, -45.6], [-71.8, -44.8], [-71.6, -43.6], [-72.1, -42.2], [-71.7, -40.8], [-71.9, -40.1], [-71.4, -38.9], [-71.0, -38.0], [-71.2, -36.8], [-70.4, -36.1], [-70.6, -35.2], [-70.0, -34.3], [-70.6, -33.3], [-70.0, -32.0], [-69.7, -30.5], [-70.2, -29.3], [-69.7, -28.4], [-68.6, -27.1], [-68.3, -26.5], [-67.3, -24.0], [-67.0, -23.0], [-66.9, -21.8],
];
const MW = 380, MH = 600, LON0 = -74.2, LON1 = -53.2, LAT0 = -21.4, LAT1 = -53.4;
const mpx = (lon: number) => (lon - LON0) / (LON1 - LON0) * MW;
const mpy = (lat: number) => (lat - LAT0) / (LAT1 - LAT0) * MH;

export function renderKamakMap(elId: string, obras: { localidad?: string; provincia?: string }[]): void {
  const el = document.getElementById(elId);
  if (!el) return;
  const seen: Record<string, boolean> = {}, provincias: Record<string, boolean> = {};
  const pts: { n: string; x: number; y: number }[] = [];
  (obras || []).forEach(o => {
    const loc = o.localidad || '';
    if (!loc || seen[loc]) return;
    seen[loc] = true;
    if (o.provincia) provincias[o.provincia] = true;
    const c = LOCALIDAD_COORDS[loc];
    if (!c) return;
    pts.push({ n: loc, x: mpx(c[1]), y: mpy(c[0]) });
  });
  const path = AR_OUTLINE.map((p, i) => (i ? 'L' : 'M') + mpx(p[0]).toFixed(1) + ',' + mpy(p[1]).toFixed(1)).join(' ') + ' Z';
  let svg = `<svg viewBox="0 0 ${MW} ${MH}" role="img" aria-label="Mapa de obras Kamak en Argentina">`;
  svg += '<defs><pattern id="kmgrid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="rgba(255,255,255,.05)" stroke-width="1"/></pattern></defs>';
  svg += `<rect width="${MW}" height="${MH}" fill="url(#kmgrid)"/>`;
  svg += `<path d="${path}" fill="rgba(26,155,156,.05)" stroke="rgba(26,155,156,.3)" stroke-width="1.5" stroke-linejoin="round"/>`;
  pts.forEach((p, i) => {
    let lx = p.x + 10, anchor = 'start';
    if (p.x > MW * 0.62) { lx = p.x - 10; anchor = 'end'; }
    svg += '<g>';
    svg += `<circle cx="${p.x}" cy="${p.y}" r="12" fill="rgba(26,155,156,.12)"><animate attributeName="r" values="8;15;8" dur="3s" begin="${(i * .18).toFixed(2)}s" repeatCount="indefinite"/></circle>`;
    svg += `<rect x="${p.x - 3.2}" y="${p.y - 3.2}" width="6.4" height="6.4" fill="#1a9b9c" transform="rotate(45 ${p.x} ${p.y})"/>`;
    svg += `<text x="${lx}" y="${p.y + 3}" text-anchor="${anchor}" fill="rgba(247,244,236,.66)" font-family="JetBrains Mono,monospace" font-size="9.5" letter-spacing="0.5">${p.n}</text>`;
    svg += '</g>';
  });
  svg += '</svg>';
  el.innerHTML = svg;
  const locEl = document.querySelector('[data-map-localidades]');
  if (locEl) locEl.textContent = String(Object.keys(seen).length);
  const provEl = document.querySelector('[data-map-provincias]');
  if (provEl) provEl.textContent = String(Object.keys(provincias).length);
}
