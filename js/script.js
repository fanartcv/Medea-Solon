(() => {
  const $ = (s) => document.querySelector(s);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = () => matchMedia('(max-width: 767px)').matches;

  // Marquee: individual images, left to right, ~30 steps per second
  const tiles = ['crown', 'commander', 'smirk', 'scholar', 'glance'];
  const buildTrack = (el, order, pxPerSec) => {
    el.textContent = '';
    const add = (name) => {
      const img = new Image();
      img.src = `assets/images/tile-${name}.webp`; img.alt = ''; img.width = 360; img.height = 480; img.decoding = 'async';
      el.appendChild(img);
    };
    add(order[0]);
    const step = el.firstChild.offsetWidth + 14;
    const count = Math.max(order.length, Math.ceil(innerWidth * 1.05 / step));
    for (let i = 1; i < count; i++) add(order[i % order.length]);
    [...el.children].forEach((c) => el.appendChild(c.cloneNode()));
    const seconds = (count * step) / (small() ? pxPerSec * .6 : pxPerSec);
    el.style.animationDuration = seconds + 's';
    el.style.animationTimingFunction = `steps(${Math.round(seconds * 30)}, end)`;
  };
  const buildMarquee = () => {
    buildTrack($('#trackA'), tiles, 30);
    if (!small()) buildTrack($('#trackB'), [tiles[3], tiles[1], tiles[4], tiles[0], tiles[2]], 18);
  };
  buildMarquee();
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(buildMarquee, 300); });
  document.addEventListener('visibilitychange', () => document.documentElement.classList.toggle('paused', document.hidden));

  // Progress (transform only)
  const bar = $('#progress');
  const onScroll = () => {
    const h = document.documentElement;
    bar.style.transform = `scaleX(${h.scrollTop / (h.scrollHeight - h.clientHeight || 1)})`;
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Reveal on scroll
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .12 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  // Compact menu
  const menu = $('#menu'), mbtn = $('#menuBtn');
  mbtn.addEventListener('click', () => mbtn.setAttribute('aria-expanded', menu.classList.toggle('open')));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) { menu.classList.remove('open'); mbtn.setAttribute('aria-expanded', 'false'); } });

  const fade = (el, text) => {
    el.style.opacity = 0;
    setTimeout(() => { el.textContent = text; el.style.opacity = 1; }, reduce ? 0 : 350);
  };

  // Her next move
  const moves = [
    'Her first move is always patience.',
    'She lets others reveal their hand before she shows a single card.',
    'A smile, placed exactly where it will confuse the most.',
    'She is already three moves ahead, and she is not in a hurry.',
    'Silence, used like a weapon with perfect manners.'
  ];
  let mi = 0;
  $('#moveBtn').addEventListener('click', () => { mi = (mi + 1) % moves.length; fade($('#moveText'), moves[mi]); });

  // Many faces
  const stageImg = $('#stageImg'), cap = $('#stageCap');
  $('.picker').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    document.querySelectorAll('.picker button').forEach((x) => x.setAttribute('aria-selected', x === b));
    stageImg.style.opacity = 0;
    setTimeout(() => {
      stageImg.src = `assets/images/medea-${b.dataset.k}.webp`; stageImg.alt = b.dataset.t;
      cap.innerHTML = ''; const s = document.createElement('strong');
      s.textContent = b.dataset.t + '. '; cap.append(s, b.dataset.d);
      stageImg.onload = () => { stageImg.style.opacity = 1; };
    }, reduce ? 0 : 300);
  });

  // Letter
  const seal = $('#seal'), paper = $('#paper');
  seal.addEventListener('click', () => {
    const open = paper.classList.toggle('open'); seal.setAttribute('aria-expanded', open);
  });

  // Name
  const lines = [
    'Say it once, and it stays.',
    'Some names are decorations. Hers is a verdict.',
    'You can forget a plot. You cannot forget her entrance.',
    'Long may she reign.'
  ];
  let li = 0;
  $('#bigName').addEventListener('click', () => { li = (li + 1) % lines.length; fade($('#whisper'), lines[li]); });
  $('#again').addEventListener('click', (e) => { e.preventDefault(); scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });
})();
