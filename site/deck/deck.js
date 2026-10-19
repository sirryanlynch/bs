/* TripUp deck. No dependencies. Every effect has a Reduce Motion path. */
(function () {
  'use strict';
  var D = window.DECK;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var root = document.documentElement, body = document.body, deck = $('#deck');
  var slides = $$('.slide'), N = slides.length, cur = -1;
  var sysRM = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mobileMQ = window.matchMedia('(max-width: 900px)');
  var RM = function () { return root.dataset.motion === 'reduce'; };
  root.dataset.motion = sysRM.matches ? 'reduce' : 'full';
  var timers = [];
  var later = function (fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; };
  var clearTimers = function () { timers.forEach(clearTimeout); timers = []; };

  /* stagger index for reveals */
  slides.forEach(function (s) { $$('[data-r]', s).forEach(function (el, i) { el.style.setProperty('--i', i); }); });

  /* ---------- ambient field per slide: [x%, y%, scale] for four lights ---------- */
  var FIELD = [
    [[62, -18, 1.1], [-14, 40, .9], [70, 62, .9], [10, 80, .7]],
    [[70, -22, 1], [-20, 20, .8], [60, 70, .7], [-5, 85, .6]],
    [[-10, -20, .9], [64, 10, .9], [40, 72, .8], [80, 70, .6]],
    [[60, -30, 1], [-20, 50, .8], [70, 70, .8], [0, 90, .6]],
    [[56, -26, 1.2], [-18, 30, 1], [62, 58, 1], [2, 74, .9]],
    [[70, -30, .8], [-25, 60, .7], [65, 80, .6], [0, 95, .5]],
    [[-12, -24, 1], [66, 0, .9], [58, 70, .8], [-10, 70, .7]],
    [[64, -14, 1], [-16, 56, .9], [36, 76, .7], [80, 80, .6]],
    [[30, -30, 1.25], [-20, 30, 1], [66, 50, 1.05], [6, 78, .9]]
  ];
  var blobs = $$('.f');
  function setField(i) {
    FIELD[i].forEach(function (p, k) { blobs[k].style.transform = 'translate3d(' + p[0] + 'vw,' + p[1] + 'vh,0) scale(' + p[2] + ')'; });
  }

  /* ---------- pointer: cursor, magnetic, parallax ---------- */
  var cursor = $('.cursor'), cDot = $('.c-dot'), cRing = $('.c-ring'), cLabel = $('.c-ring span');
  var fine = window.matchMedia('(pointer: fine)').matches;
  var mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my, px = 0, py = 0, tpx = 0, tpy = 0, raf = 0;
  var fieldIn = $('.field-in');
  if (fine) { body.classList.add('has-cursor'); cursor.classList.add('out'); }
  function loop() {
    raf = 0;
    var k = RM() ? 1 : .2;
    rx += (mx - rx) * k; ry += (my - ry) * k;
    px += (tpx - px) * (RM() ? 1 : .06); py += (tpy - py) * (RM() ? 1 : .06);
    if (fine) { cDot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)'; cRing.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)'; }
    if (!RM()) {
      fieldIn.style.transform = 'translate3d(' + (px * -26) + 'px,' + (py * -20) + 'px,0)';
      var ph = slides[cur] && $('[data-parallax]', slides[cur]);
      if (ph && !mobileMQ.matches) ph.style.transform = 'translate3d(' + (px * -14) + 'px,' + (py * -10) + 'px,0)';
    }
    if (Math.abs(mx - rx) > .3 || Math.abs(my - ry) > .3 || Math.abs(tpx - px) > .002 || Math.abs(tpy - py) > .002) raf = requestAnimationFrame(loop);
  }
  var kick = function () { if (!raf) raf = requestAnimationFrame(loop); };
  var magEl = null;
  window.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    mx = e.clientX; my = e.clientY; tpx = mx / innerWidth - .5; tpy = my / innerHeight - .5;
    cursor.classList.remove('out');
    var t = e.target.closest ? e.target : null;
    var inter = t && t.closest('a, button, label, .mcell, input');
    var lab = inter && inter.closest('[data-cursor]');
    var bg = !inter && t && t.closest('.slide') && !t.closest('p, h1, h2, h3, q, li, dl, blockquote, .graph, .pollcard, .matrix, .sb-frame, img, svg');
    cursor.classList.toggle('hover', !!inter && !lab);
    cursor.classList.toggle('label', !!lab || !!bg);
    cLabel.textContent = lab ? lab.dataset.cursor : bg ? (e.clientX > innerWidth * .4 ? 'Next' : 'Back') : '';
    /* magnetic */
    var m = !RM() && t && t.closest('.mag');
    if (magEl && magEl !== m) { magEl.style.transform = ''; magEl = null; }
    if (m) {
      var r = m.getBoundingClientRect(), dx = mx - (r.left + r.width / 2), dy = my - (r.top + r.height / 2);
      m.style.transform = 'translate3d(' + dx * .18 + 'px,' + dy * .28 + 'px,0)'; magEl = m;
    }
    kick();
  }, { passive: true });
  document.addEventListener('pointerleave', function () { cursor.classList.add('out'); });
  $$('iframe').forEach(function (f) { f.addEventListener('pointerenter', function () { cursor.classList.add('out'); }); });

  /* ---------- shared device ---------- */
  var device = $('#device'), proto = $('#protoFrame'), protoHash = '', addHash = '/push';
  function slotRect(slot) {
    var x = 0, y = 0, el = slot, s = slot.closest('.slide');
    while (el && el !== s) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; }
    return { x: x - s.scrollLeft, y: y - s.scrollTop, w: slot.offsetWidth, h: slot.offsetHeight };
  }
  function placeDevice(instant) {
    var slot = slides[cur] && $('.slot', slides[cur]);
    if (instant) device.classList.add('no-anim');
    if (slot && slot.offsetWidth) {
      var r = slotRect(slot), sc = r.w / 422;
      device.style.transform = 'translate3d(' + r.x + 'px,' + r.y + 'px,0) scale(' + sc + ')';
      device.classList.add('on');
      var want = slot.dataset.device === 'push' ? addHash : '/' + slot.dataset.device;
      setProto(want);
    } else device.classList.remove('on');
    if (instant) { void device.offsetWidth; device.classList.remove('no-anim'); }
  }
  function setProto(h) {
    if (!proto.src) { proto.src = 'prototype/?embed=1#' + h; protoHash = h; return; }
    if (h === protoHash) return;
    protoHash = h;
    try { proto.contentWindow.location.hash = '#' + h; } catch (e) { proto.src = 'prototype/?embed=1#' + h; }
  }

  /* ---------- navigation ---------- */
  var cnt = $('#cur'), prog = $('#progress'), hint = $('#hint');
  slides.forEach(function (s, i) {
    var li = document.createElement('li'), b = document.createElement('button');
    b.type = 'button'; b.setAttribute('aria-label', 'Slide ' + (i + 1) + ': ' + s.dataset.title);
    b.innerHTML = '<span class="tip">' + (i + 1) + ' · ' + s.dataset.title + '</span>';
    b.addEventListener('click', function () { go(i); });
    li.appendChild(b); prog.appendChild(li);
  });
  var progBtns = $$('button', prog);
  var enter = {}, leave = {};
  function go(i, opts) {
    opts = opts || {};
    i = Math.max(0, Math.min(N - 1, i));
    if (i === cur && !opts.force) return;
    var prev = cur;
    deck.classList.toggle('back', prev > i);
    clearTimers();
    if (prev >= 0) {
      var p = slides[prev];
      p.classList.remove('is-active', 'is-in'); p.classList.add('is-leaving');
      p.setAttribute('aria-hidden', 'true'); p.inert = true;
      later(function () { p.classList.remove('is-leaving'); }, 950);
      if (leave[prev]) leave[prev]();
    }
    cur = i;
    var s = slides[i];
    s.removeAttribute('aria-hidden'); s.inert = false;
    s.classList.add('is-active'); s.scrollTop = 0;
    requestAnimationFrame(function () { requestAnimationFrame(function () { s.classList.add('is-in'); }); });
    cnt.textContent = String(i + 1).padStart(2, '0');
    progBtns.forEach(function (b, k) { b.classList.toggle('done', k < i); b.classList.toggle('cur', k === i); if (k === i) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
    $('#prev').disabled = i === 0; $('#next').disabled = i === N - 1;
    setField(i);
    placeDevice(prev < 0);
    if (history.replaceState) history.replaceState(null, '', '#' + (i + 1)); else location.hash = '#' + (i + 1);
    document.title = (i === 0 ? 'TripUp' : s.dataset.title + ' · TripUp') + ' · Ryan Lynch';
    if (enter[i]) enter[i]();
    if (prev >= 0) { hint.classList.add('gone'); sound.tick(); }
    track(i);
    preload(i);
  }
  var next = function () { go(cur + 1); }, prevS = function () { go(cur - 1); };
  $('#next').addEventListener('click', next); $('#prev').addEventListener('click', prevS);
  window.addEventListener('hashchange', function () { var n = parseInt(location.hash.slice(1), 10); if (n >= 1 && n <= N) go(n - 1); });

  /* in-deck links like href="#7" */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var h = a.getAttribute('href').slice(1);
    if (h === 'sources') { e.preventDefault(); openDrawer(a.dataset.src); return; }
    var n = parseInt(h, 10);
    if (n >= 1 && n <= N) { e.preventDefault(); go(n - 1); }
  });

  /* keyboard */
  var overlayOpen = function () { return !$('#overview').hidden || !$('#sources').hidden; };
  document.addEventListener('keydown', function (e) {
    var tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 'Escape') { closeOverview(); closeDrawer(); return; }
    if (overlayOpen()) { if (e.key === 'o' || e.key === 'g') closeOverview(); return; }
    var k = e.key;
    if (k === 'ArrowRight' || k === 'ArrowDown' || k === 'PageDown' || (k === ' ' && !e.shiftKey)) {
      if (k === ' ' && (tag === 'button' || tag === 'a')) return;
      e.preventDefault(); next();
    } else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp' || (k === ' ' && e.shiftKey)) { e.preventDefault(); prevS(); }
    else if (k === 'Home') { e.preventDefault(); go(0); }
    else if (k === 'End') { e.preventDefault(); go(N - 1); }
    else if (k === 'o' || k === 'g') openOverview();
    else if (k === 't') toggleTokens();
    else if (k === 'r') toggleMotion();
    else if (k === 's') sound.toggle();
    else if (/^[1-9]$/.test(k)) go(parseInt(k, 10) - 1);
  });

  /* wheel: one step per gesture, ignores trackpad inertia, lets inner scrollers scroll */
  var wheelLock = 0, wheelAcc = 0;
  function canScroll(el, dy) {
    for (; el && el !== document.body; el = el.parentElement) {
      if (el.scrollHeight > el.clientHeight + 2) {
        var oy = getComputedStyle(el).overflowY;
        if (oy === 'auto' || oy === 'scroll') { if (dy > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 2 : el.scrollTop > 2) return true; }
      }
    }
    return false;
  }
  window.addEventListener('wheel', function (e) {
    if (overlayOpen()) return;
    var dy = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (canScroll(e.target, dy)) return;
    var now = Date.now();
    if (now < wheelLock) { wheelLock = Math.max(wheelLock, now + 180); return; }
    wheelAcc += dy;
    if (Math.abs(wheelAcc) > 60) { (wheelAcc > 0 ? next : prevS)(); wheelAcc = 0; wheelLock = now + 850; }
  }, { passive: true });

  /* touch swipe */
  var tx = 0, ty = 0, tt = 0;
  deck.addEventListener('touchstart', function (e) { var t = e.touches[0]; tx = t.clientX; ty = t.clientY; tt = Date.now(); }, { passive: true });
  deck.addEventListener('touchend', function (e) {
    var t = e.changedTouches[0], dx = t.clientX - tx, dy = t.clientY - ty;
    if (Date.now() - tt > 700) return;
    if (e.target.closest('.matrix, .opts, .sb-tabs, .stages')) { if (Math.abs(dx) < 80) return; }
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) (dx < 0 ? next : prevS)();
    else if (!mobileMQ.matches && Math.abs(dy) > 60 && Math.abs(dy) > Math.abs(dx) * 1.4) (dy < 0 ? next : prevS)();
  }, { passive: true });

  /* click empty background to advance */
  deck.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.target.closest('a, button, input, label, iframe, .matrix, .graph, .pollcard, .mdetail, .stage-panel, .job, .persona, .board-stage, .bill, .quote, .sb-frame, .moment')) return;
    if (String(window.getSelection && window.getSelection())) return;
    if (mobileMQ.matches) return;
    (e.clientX > innerWidth * .4 ? next : prevS)();
  });

  /* keep the device glued to its slot while a stacked slide scrolls (mobile) and on resize */
  slides.forEach(function (s) { s.addEventListener('scroll', function () { if (slides[cur] === s) requestAnimationFrame(function () { placeDevice(true); }); }, { passive: true }); });
  var rz = 0; window.addEventListener('resize', function () { cancelAnimationFrame(rz); rz = requestAnimationFrame(function () { placeDevice(true); if (journey.redraw) journey.redraw(); }); });

  /* ---------- toolbar toggles ---------- */
  var tokensBtn = $('#tokensBtn'), motionBtn = $('#motionBtn');
  function toggleTokens() { var on = body.classList.toggle('show-tokens'); tokensBtn.setAttribute('aria-pressed', on); }
  tokensBtn.addEventListener('click', toggleTokens);
  function syncMotion() { motionBtn.setAttribute('aria-pressed', RM()); }
  function toggleMotion() { root.dataset.motion = RM() ? 'full' : 'reduce'; syncMotion(); if (enter[cur]) enter[cur](); }
  motionBtn.addEventListener('click', toggleMotion);
  sysRM.addEventListener && sysRM.addEventListener('change', function () { root.dataset.motion = sysRM.matches ? 'reduce' : 'full'; syncMotion(); });
  syncMotion();

  /* ---------- ambient sound, off by default ---------- */
  var sound = (function () {
    var ctx = null, master = null, on = false, btn = $('#soundBtn'), label = $('span', btn);
    function start() {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
      var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900; lp.connect(master);
      [110, 164.81, 220.0, 277.18].forEach(function (f, i) {
        var o = ctx.createOscillator(), g = ctx.createGain(); o.type = i % 2 ? 'triangle' : 'sine'; o.frequency.value = f; o.detune.value = (i - 1.5) * 4;
        g.gain.value = i === 0 ? .5 : .22; o.connect(g); g.connect(lp); o.start();
      });
      var lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = .05; lg.gain.value = 380; lfo.connect(lg); lg.connect(lp.frequency); lfo.start();
      master.gain.linearRampToValueAtTime(.045, ctx.currentTime + 2.5);
    }
    function toggle() {
      on = !on; btn.setAttribute('aria-pressed', on); label.textContent = on ? 'Sound on' : 'Sound off';
      if (on) { if (!master) start(); else { ctx.resume(); master.gain.cancelScheduledValues(ctx.currentTime); master.gain.linearRampToValueAtTime(.045, ctx.currentTime + 1.2); } }
      else if (master) { master.gain.cancelScheduledValues(ctx.currentTime); master.gain.linearRampToValueAtTime(0, ctx.currentTime + .6); later(function () { if (!on) ctx.suspend(); }, 700); }
    }
    function tick() {
      if (!on || !ctx) return;
      var o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine'; o.frequency.value = 1318.5;
      g.gain.setValueAtTime(0, ctx.currentTime); g.gain.linearRampToValueAtTime(.03, ctx.currentTime + .01); g.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + .9);
      o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 1);
    }
    btn.addEventListener('click', toggle);
    return { toggle: toggle, tick: tick };
  })();

  /* ---------- overview (O) ---------- */
  var ov = $('#overview'), ovGrid = $('#ovGrid'), lastFocus = null;
  slides.forEach(function (s, i) {
    var li = document.createElement('li'), b = document.createElement('button'), nn = String(i + 1).padStart(2, '0');
    b.type = 'button'; b.style.setProperty('--i', i);
    b.innerHTML = '<span class="th" style="background-image:url(deck/thumbs/' + nn + '.jpg)"></span><span class="lbl"><i>' + nn + '</i>' + s.dataset.title + '</span>';
    b.addEventListener('click', function () { closeOverview(); go(i); });
    li.appendChild(b); ovGrid.appendChild(li);
  });
  function openOverview() {
    lastFocus = document.activeElement; ov.hidden = false;
    $$('button', ovGrid).forEach(function (b, k) { b.classList.toggle('cur', k === cur); });
    requestAnimationFrame(function () { ov.classList.add('open'); ($$('button', ovGrid)[cur] || ov).focus(); });
  }
  function closeOverview() { if (ov.hidden) return; ov.classList.remove('open'); setTimeout(function () { ov.hidden = true; }, 250); if (lastFocus) lastFocus.focus(); }
  $('#gridBtn').addEventListener('click', openOverview); $('#ovClose').addEventListener('click', closeOverview);
  ov.addEventListener('click', function (e) { if (e.target === ov) closeOverview(); });
  ov.addEventListener('keydown', function (e) {
    var bs = $$('button', ovGrid), k = bs.indexOf(document.activeElement); if (k < 0) return;
    var cols = mobileMQ.matches ? 2 : 3, m = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: cols, ArrowUp: -cols }[e.key];
    if (m) { e.preventDefault(); (bs[k + m] || bs[k]).focus(); }
  });

  /* ---------- sources drawer ---------- */
  var dr = $('#sources'), srcList = $('#srcList');
  D.SOURCES.forEach(function (s, i) { var li = document.createElement('li'); li.id = 'src-' + (i + 1); li.innerHTML = s[0] + '<br><a href="' + s[1] + '" target="_blank" rel="noopener">' + s[1].replace(/^https?:\/\//, '') + '</a>'; srcList.appendChild(li); });
  function openDrawer(n) {
    lastFocus = document.activeElement; dr.hidden = false;
    requestAnimationFrame(function () { dr.classList.add('open'); $('[data-close]', dr).focus();
      if (n) { var li = $('#src-' + n); if (li) { li.scrollIntoView({ block: 'center' }); li.classList.remove('flash'); void li.offsetWidth; li.classList.add('flash'); } } });
  }
  function closeDrawer() { if (dr.hidden) return; dr.classList.remove('open'); setTimeout(function () { dr.hidden = true; }, 250); if (lastFocus) lastFocus.focus(); }
  $$('[data-drawer]').forEach(function (b) { b.addEventListener('click', function () { openDrawer(); }); });
  $('[data-close]', dr).addEventListener('click', closeDrawer);
  dr.addEventListener('click', function (e) { if (e.target === dr) closeDrawer(); });
  var srcLinks = function (arr) { return (arr || []).map(function (n) { return '<a href="' + D.SOURCES[n - 1][1] + '" target="_blank" rel="noopener">[' + n + '] ' + D.SOURCES[n - 1][0].split(':')[0] + '</a>'; }).join(''); };

  /* ---------- 2 · matrix ---------- */
  (function () {
    var mx2 = $('.matrix'), COLS = ['Plan', 'Decide', 'Track spend', 'Settle', 'Guest, no install'], WORD = { y: 'Built in', p: 'Partly', n: 'Not found in its docs', u: 'Unclear' };
    var CLS = { y: 'm-yes', p: 'm-part', n: 'm-no', u: 'm-unk' };
    D.MATRIX.forEach(function (row, r) {
      var el = document.createElement('div'); el.className = 'mrow'; el.setAttribute('role', 'row');
      el.innerHTML = '<span class="mapp" role="rowheader">' + row.app + '<small>' + row.kind + '</small></span>';
      row.cells.forEach(function (c, k) {
        var b = document.createElement('button'); b.type = 'button'; b.className = 'mcell'; b.setAttribute('role', 'cell');
        b.style.setProperty('--d', (r * 70 + k * 45 + 250) + 'ms');
        b.setAttribute('aria-label', row.app + ', ' + COLS[k] + ': ' + WORD[c[0]]);
        b.innerHTML = '<i class="m ' + CLS[c[0]] + '"></i>';
        var show = function () { select(r, k, b); };
        b.addEventListener('mouseenter', show); b.addEventListener('focus', show); b.addEventListener('click', show);
        el.appendChild(b);
      });
      mx2.appendChild(el);
    });
    var rows = $$('.mrow:not(.mhead)', mx2);
    function select(r, k, b) {
      var row = D.MATRIX[r], c = row.cells[k];
      $$('.mcell', mx2).forEach(function (x) { x.classList.remove('sel'); }); b.classList.add('sel');
      rows.forEach(function (x, i) { x.classList.toggle('dim', i !== r); });
      $('#mdTitle').textContent = row.app + ' · ' + COLS[k];
      $('.mdetail .k').textContent = WORD[c[0]];
      $('#mdNote').textContent = c[1];
      $('#mdGap').innerHTML = row.gap + (row.gapSrc ? ' <span class="md-src">' + srcLinks(row.gapSrc) + '</span>' : '');
      $('#mdAns').textContent = row.ans;
      var g = $('#mdGo'); g.hidden = false; g.href = '#' + row.go; g.textContent = 'See it on slide ' + row.go;
      $('#mdSrc').innerHTML = c[2] ? 'Source: ' + srcLinks(c[2]) : 'No page states this. It is the absence of a feature in the pages checked.';
    }
    mx2.addEventListener('mouseleave', function () { rows.forEach(function (x) { x.classList.remove('dim'); }); });
    enter[1] = function () { later(function () { var b = $$('.mcell', rows[4])[1]; if (b && !$('.mcell.sel', mx2)) select(4, 1, b); rows.forEach(function (x) { x.classList.remove('dim'); }); }, RM() ? 0 : 1400); };
  })();

  /* ---------- 3 · jobs ---------- */
  (function () {
    var jobs = $('.jobs');
    $$('.persona').forEach(function (p) {
      var on = function () { var ids = p.dataset.jobs.split(','); jobs.classList.add('focus'); $$('.job', jobs).forEach(function (j) { j.classList.toggle('hot', ids.indexOf(j.dataset.job) > -1); }); };
      var off = function () { jobs.classList.remove('focus'); };
      p.addEventListener('mouseenter', on); p.addEventListener('focus', on); p.addEventListener('mouseleave', off); p.addEventListener('blur', off);
      p.addEventListener('click', on);
    });
  })();

  /* ---------- 4 · journey ---------- */
  var journey = (function () {
    var S = D.STAGES, wrap = $('.stages'), line = $('#curveLine'), base = $('#curveBase'), imgs = $$('.stage-photos img');
    var H = 130, ys = S.map(function (s) { return H - (8 + s.y * 114); }), xs = S.map(function (s, i) { return (i + .5) * 200; });
    var pts = [[0, ys[0] + 10]].concat(xs.map(function (x, i) { return [x, ys[i]]; }), [[1000, ys[4] - 4]]);
    var d = 'M' + pts[0][0] + ' ' + pts[0][1];
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      d += ' C' + (p1[0] + (p2[0] - p0[0]) / 6) + ' ' + (p1[1] + (p2[1] - p0[1]) / 6) + ',' + (p2[0] - (p3[0] - p1[0]) / 6) + ' ' + (p2[1] - (p3[1] - p1[1]) / 6) + ',' + p2[0] + ' ' + p2[1];
    }
    line.setAttribute('d', d); base.setAttribute('d', d);
    $('.curve').setAttribute('viewBox', '0 0 1000 ' + H);
    $('.curve .mid').setAttribute('y1', H / 2); $('.curve .mid').setAttribute('y2', H / 2);
    var L = line.getTotalLength(), frac = xs.map(function (x) { var lo = 0, hi = L; for (var j = 0; j < 22; j++) { var m = (lo + hi) / 2; if (line.getPointAtLength(m).x < x) lo = m; else hi = m; } return lo / L; });
    line.style.strokeDasharray = L; line.style.strokeDashoffset = L;
    var btns = S.map(function (s, i) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'stage'; b.setAttribute('role', 'tab'); b.style.setProperty('--y', s.y);
      b.innerHTML = '<span class="dot"></span><b>' + s.name + '</b><small>' + s.time + '</small>';
      b.addEventListener('click', function () { auto = false; sel(i); });
      wrap.appendChild(b); return b;
    });
    var at = -1, auto = true;
    function sel(i) {
      at = i;
      btns.forEach(function (b, k) { b.setAttribute('aria-selected', k === i); b.classList.toggle('reached', k <= i); b.tabIndex = k === i ? 0 : -1; });
      line.style.strokeDashoffset = L * (1 - (i === S.length - 1 ? 1 : frac[i]));
      imgs.forEach(function (im, k) { im.classList.toggle('on', k === i); });
      var s = S[i];
      $('#spPain').textContent = s.pain; $('#spJob').textContent = '“' + s.job + '”'; $('#spMoment').textContent = s.moment;
      var shot = $('#spShot'); shot.src = 'deck/img/' + s.shot + '.jpg'; shot.alt = s.alt;
      $('#stageCredit').textContent = 'Photo: ' + s.photo + ', Pexels';
    }
    wrap.addEventListener('keydown', function (e) {
      var m = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (!m) return;
      var n = at + m; if (n < 0 || n >= S.length) return;
      e.preventDefault(); e.stopPropagation(); auto = false; sel(n); btns[n].focus();
    });
    enter[3] = function () {
      auto = true;
      if (RM()) { sel(0); line.style.strokeDashoffset = 0; btns.forEach(function (b) { b.classList.add('reached'); }); return; }
      line.style.transition = 'none'; line.style.strokeDashoffset = L; void line.getBoundingClientRect(); line.style.transition = '';
      later(function () { sel(0); }, 500);
      for (var k = 1; k < S.length; k++) (function (k) { later(function () { if (auto) sel(k); }, 500 + k * 1700); })(k);
    };
    sel(0);
    return { redraw: function () {} };
  })();

  /* ---------- 5 · boards + moment ---------- */
  (function () {
    var tabs = $$('.board-tabs button'), imgs = $$('.board-stage img');
    tabs.forEach(function (t) { t.addEventListener('click', function () {
      tabs.forEach(function (x) { x.setAttribute('aria-selected', x === t); });
      imgs.forEach(function (im) { im.classList.toggle('on', im.dataset.board === t.dataset.board); });
      $('#boardWhy').textContent = D.BOARDS[t.dataset.board];
    }); });
    $('#boardWhy').textContent = D.BOARDS.prism;
    var mo = $('.moment');
    function play() { mo.classList.remove('play'); void mo.offsetWidth; later(function () { mo.classList.add('play'); }, RM() ? 0 : 60); }
    $('#celebrateBtn').addEventListener('click', play);
    enter[4] = function () { mo.classList.remove('play'); later(play, RM() ? 0 : 1200); };
  })();

  /* ---------- 6 · storybook ---------- */
  var sb = $('#sbFrame');
  function sbUrl(path) {
    if (mobileMQ.matches) { var p = path.split('/'); return 'storybook/iframe.html?id=' + p[1] + '&viewMode=' + (p[0] === 'docs' ? 'docs' : 'story'); }
    return 'storybook/index.html?path=/' + path;
  }
  $$('.sb-tabs button').forEach(function (t, _, all) { t.addEventListener('click', function () { all.forEach(function (x) { x.setAttribute('aria-selected', x === t); }); sb.src = sbUrl(t.dataset.sb); }); });
  function preload(i) { if (i >= 4 && !sb.src) sb.src = sbUrl('docs/introduction--docs'); }

  /* ---------- 7 · poll demo + value adds ---------- */
  (function () {
    var card = $('#poll'), optsEl = $('#opts');
    var O = [['Taberna da Rua das Flores', 'Tasca · €€ · 6 min walk'], ['Cervejaria Ramiro', 'Seafood · €€€ · 14 min'], ['Park Rooftop', 'Drinks and bites · €€ · 9 min']];
    var base = [3, 1, 1], st;
    function reset() { st = { v: base.slice(), mine: null, closed: false }; render(); }
    var els = O.map(function (o, i) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'opt';
      b.innerHTML = '<span class="fill"></span><span><b>' + o[0] + '<span class="tag" hidden></span></b><small>' + o[1] + '</small></span><span class="pct tu-num"></span>';
      b.addEventListener('click', function () {
        if (st.closed) return;
        if (st.mine !== null) st.v[st.mine]--;
        st.mine = st.mine === i ? null : i; if (st.mine !== null) st.v[st.mine]++;
        render();
      });
      optsEl.appendChild(b); return b;
    });
    function render() {
      var n = st.v.reduce(function (a, b) { return a + b; }, 0), max = Math.max.apply(null, st.v), lead = st.v.filter(function (x) { return x === max; }).length === 1;
      var hide = card.dataset.mode === 'hidden' && st.mine === null && !st.closed;
      card.dataset.hide = hide ? '1' : '0';
      $('#pcSub').textContent = st.closed ? 'Closed at 19:30 · ' + n + ' of 7 voted' : n + ' of 7 voted · closes 19:30';
      $('.pc-as').textContent = st.closed ? (st.v[0] === 5 ? 'Taberna wins with 5 of 7. Booked for 20:30.' : 'Taberna still wins. In the story, Ren and João both pick it: 5 of 7, 71%.')
        : hide ? 'You are Ren on a web link. Counts stay hidden until you vote.' : st.mine === null ? 'You are Ren on a web link. Tap a place to vote.' : 'Your vote is in. Tap it again to change your mind.';
      els.forEach(function (b, i) {
        var p = n ? st.v[i] / n : 0, tag = $('.tag', b);
        b.style.setProperty('--p', p.toFixed(3));
        $('.pct', b).textContent = Math.round(p * 100) + '%';
        b.classList.toggle('mine', st.mine === i);
        var win = st.closed && st.v[i] === max, leading = !st.closed && lead && st.v[i] === max && !hide;
        b.classList.toggle('winner', win); b.classList.toggle('loser', st.closed && !win);
        tag.hidden = !(win || leading || st.mine === i);
        tag.textContent = win ? 'WON' : st.mine === i ? 'YOU' : 'LEADING';
        b.setAttribute('aria-pressed', st.mine === i);
        b.setAttribute('aria-label', O[i][0] + (hide ? '' : ', ' + Math.round(p * 100) + ' percent') + (st.mine === i ? ', your vote' : ''));
      });
      $('#closePoll').disabled = st.closed;
    }
    $('#closePoll').addEventListener('click', function () {
      if (st.mine === null) { st.mine = 0; st.v[0]++; }
      st.v[0]++; st.closed = true; render();
    });
    $('#resetPoll').addEventListener('click', reset);
    $$('.pc-head [data-mode]').forEach(function (t, _, all) { t.addEventListener('click', function () {
      all.forEach(function (x) { x.setAttribute('aria-checked', x === t); }); card.dataset.mode = t.dataset.mode; reset();
    }); });
    $('#pollRM').addEventListener('change', function (e) { card.classList.toggle('rm', e.target.checked); });
    enter[6] = function () {
      $('#pollRM').checked = RM(); card.classList.toggle('rm', RM());
      st = { v: [0, 0, 0], mine: null, closed: false }; render();
      later(function () { reset(); }, RM() ? 0 : 700);
    };
    reset();
    var adds = $$('.add-list button');
    adds.forEach(function (b) { b.addEventListener('click', function () {
      adds.forEach(function (x) { x.setAttribute('aria-selected', x === b); });
      addHash = b.dataset.hash; setProto(addHash); $('#addOpen').href = 'prototype/#' + addHash;
    }); });
  })();

  /* ---------- 8 · untangle ---------- */
  (function () {
    var NS = 'http://www.w3.org/2000/svg', P = D.PEOPLE, NP = D.NODES, R = 15;
    var gE = $('#edges'), gN = $('#nodes'), counter = $('#gCounter');
    var mk = function (t, a, par) { var e = document.createElementNS(NS, t); for (var k in a) e.setAttribute(k, a[k]); if (par) par.appendChild(e); return e; };
    var above = { ari: 1, sofia: 1 };
    function edge(e, cls, bend) {
      var a = NP[e[0]], b = NP[e[1]], dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len;
      var sx = a[0] + ux * (R + 2), sy = a[1] + uy * (R + 2), ex = b[0] - ux * (R + 5), ey = b[1] - uy * (R + 5);
      var cx = (sx + ex) / 2 - uy * bend, cy = (sy + ey) / 2 + ux * bend;
      var g = mk('g', { class: 'edge ' + cls }, gE);
      var path = mk('path', { d: 'M' + sx + ' ' + sy + ' Q' + cx + ' ' + cy + ' ' + ex + ' ' + ey, 'marker-end': 'url(#ah)' }, g);
      var mx = .25 * sx + .5 * cx + .25 * ex, my = .25 * sy + .5 * cy + .25 * ey;
      var txt = (cls === 'pay' ? '€' : '') + e[2].toFixed(2), w = txt.length * 4.6 + 8;
      var tag = mk('g', { class: 'tag' }, g);
      mk('rect', { x: mx - w / 2, y: my - 6.5, width: w, height: 13, rx: 4 }, tag);
      var t = mk('text', { x: mx, y: my + 2.6, 'text-anchor': 'middle' }, tag); t.textContent = txt;
      var L = path.getTotalLength(); path.style.strokeDasharray = L; path.dataset.len = L;
      return { g: g, path: path, tag: tag };
    }
    var BEND = { 'ari>tomas': -8, 'tomas>nic': 10, 'ren>ari': -6, 'mara>joao': 8, 'mara>sofia': -6, 'sofia>joao': -10 };
    var tang = D.TANGLED.map(function (e) { return edge(e, 'iou', BEND[e[0] + '>' + e[1]] || 0); });
    var pays = D.SIMPLE.map(function (e) { return edge(e, 'pay', { 'ari>nic': -14, 'ren>ari': -6, 'mara>joao': 10 }[e[0] + '>' + e[1]] || 0); });
    var nodes = {};
    Object.keys(NP).forEach(function (id) {
      var p = NP[id], g = mk('g', { class: 'node' }, gN), up = above[id];
      mk('circle', { cx: p[0], cy: p[1], r: R }, g);
      var ini = mk('text', { x: p[0], y: p[1] + 3.5, 'text-anchor': 'middle', class: 'ini' }, g); ini.textContent = P[id][0];
      var nm = mk('text', { x: p[0], y: up ? p[1] - R - 5 : p[1] + R + 10, 'text-anchor': 'middle', class: 'nm' }, g); nm.textContent = P[id];
      var v = D.NETS[id], net = mk('text', { x: p[0], y: up ? p[1] - R - 15 : p[1] + R + 20, 'text-anchor': 'middle', class: 'net ' + (v < 0 ? 'owe' : v > 0 ? 'owed' : 'zero') }, g);
      net.textContent = (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toFixed(2);
      nodes[id] = { g: g, net: net, v: v };
    });
    var view = 2, btns = $$('.stepper button');
    function show(k, animate) {
      view = k;
      btns.forEach(function (b, i) { b.setAttribute('aria-checked', i === k); });
      counter.textContent = D.COUNTER[k];
      $('#ro1').textContent = D.READOUT[k][0]; $('#ro2').textContent = D.READOUT[k][1];
      tang.forEach(function (e) {
        e.g.style.opacity = k === 0 ? 1 : k === 1 ? .25 : 0;
        if (k === 1) e.path.removeAttribute('marker-end'); else e.path.setAttribute('marker-end', 'url(#ah)');
        e.tag.style.opacity = k === 0 ? 1 : 0; e.path.style.strokeDashoffset = 0;
      });
      Object.keys(nodes).forEach(function (id) { var n = nodes[id]; n.net.style.opacity = k === 1 ? 1 : 0; n.g.classList.toggle('zero', k >= 1 && n.v === 0); });
      pays.forEach(function (e, i) {
        var L = +e.path.dataset.len;
        if (k < 2) { e.g.style.opacity = 0; e.path.style.transition = 'none'; e.path.style.strokeDashoffset = L; return; }
        e.g.style.opacity = 1; e.tag.style.opacity = 0;
        if (!animate || RM()) { e.path.style.transition = RM() ? 'opacity .2s linear' : 'none'; e.path.style.strokeDashoffset = 0; e.tag.style.opacity = 1; return; }
        e.path.style.transition = 'none'; e.path.style.strokeDashoffset = L; void e.path.getBoundingClientRect();
        e.path.style.transition = ''; 
        later(function () { e.path.style.strokeDashoffset = 0; }, 120 + i * 260);
        later(function () { e.tag.style.opacity = 1; }, 520 + i * 260);
      });
    }
    btns.forEach(function (b, i) { b.addEventListener('click', function () { clearTimers(); show(i, true); }); });
    function replay() {
      clearTimers(); show(0, false);
      later(function () { show(1, true); }, RM() ? 1400 : 1500);
      later(function () { show(2, true); }, RM() ? 2800 : 3100);
    }
    $('#replay').addEventListener('click', replay);
    var seen = false;
    enter[7] = function () { seen = false; show(0, false); if (!mobileMQ.matches) { seen = true; later(replay, 0); } };
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting && cur === 7 && !seen) { seen = true; replay(); } }); }, { threshold: .5 }).observe($('.graph'));
    show(2, false);
  })();

  /* slide_view uses the shared loader in analytics/ga.js so consent and Do Not Track match the rest of the site. */
  function track(i) {
    var title = slides[i].dataset.title;
    if (typeof window.tripupTrack === 'function') window.tripupTrack('slide_view', { slide_number: i + 1, slide_title: title });
    else if (typeof window.gtag === 'function') window.gtag('event', 'slide_view', { slide_number: i + 1, slide_title: title });
  }

  /* ---------- start ---------- */
  slides.forEach(function (s) { s.setAttribute('aria-hidden', 'true'); s.inert = true; });
  var start = parseInt(location.hash.slice(1), 10);
  go(start >= 1 && start <= N ? start - 1 : 0);
  window.TripUpDeck = { go: go, get index() { return cur; } };
})();
