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
    [[-16, -20, .9], [68, -6, 1], [54, 74, .8], [-6, 80, .6]],
    [[70, -30, .8], [-25, 60, .7], [65, 80, .6], [0, 95, .5]],
    [[-12, -24, 1], [66, 0, .9], [58, 70, .8], [-10, 70, .7]],
    [[64, -14, 1], [-16, 56, .9], [36, 76, .7], [80, 80, .6]],
    [[30, -30, 1.25], [-20, 30, 1], [66, 50, 1.05], [6, 78, .9]]
  ];
  var blobs = $$('.f');
  function setField(i) {
    (FIELD[i] || FIELD[FIELD.length - 1]).forEach(function (p, k) { blobs[k].style.transform = 'translate3d(' + p[0] + 'vw,' + p[1] + 'vh,0) scale(' + p[2] + ')'; });
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
  /* Cursor states. The cursor only reacts to things that act: enabled links, buttons, toggles, cells.
     Click-to-advance lives on true empty background only (the slide, its layout wrapper, veil, photo,
     device slot), never on gaps inside text blocks, lists or cards, and only where a slide exists in
     that direction. Leaving a state is debounced so sweeping across adjacent items does not flicker. */
  var BG = '.slide, .in, .veil, .photo, .slot';
  var navSide = '', cState = 'rest', cText = '', cPend = 0, cPendKey = '', seen = false;
  function interactive(t) {
    var el = t && t.closest('a[href], button, label, .mcell, input, summary');
    if (!el || !el.closest('body')) return null;
    if (el.disabled || el.matches('.is-disabled, [aria-disabled="true"], [hidden]')) return null;
    if (el.matches('label') && !el.querySelector('input, select, textarea') && !el.htmlFor) return null;
    var h = el.matches('a') && el.getAttribute('href');
    if (h && /^#[1-9]$/.test(h) && parseInt(h.slice(1), 10) - 1 === cur) return null; /* link to the slide you are on */
    return el;
  }
  function isNavBg(t) {
    if (!t || !t.closest || mobileMQ.matches) return false;
    var s = t.closest('.slide');
    if (!s || s !== slides[cur]) return false;
    return t === s || t.matches(BG) || (t.parentElement && t.parentElement.matches('.photo') && t.matches('img'));
  }
  function sideAt(x) {
    var edge = innerWidth * .4, band = 32; /* hysteresis so the hint does not flip on the seam */
    if (navSide === 'next' && x > edge - band) return 'next';
    if (navSide === 'back' && x < edge + band) return 'back';
    return x > edge ? 'next' : 'back';
  }
  function navAt(t, x) {
    if (!isNavBg(t)) { navSide = ''; return ''; }
    navSide = sideAt(x);
    if (navSide === 'next' && cur >= N - 1) return '';
    if (navSide === 'back' && cur <= 0) return '';
    return navSide;
  }
  function setCursor(st, txt) {
    cState = st; cText = txt;
    cursor.classList.toggle('hover', st === 'hover');
    cursor.classList.toggle('label', st === 'label');
    cursor.classList.toggle('nav', st === 'nav');
    cursor.classList.toggle('quiet', st === 'quiet');
    if (txt) cLabel.textContent = txt;
  }
  function wantCursor(st, txt) {
    var key = st + '|' + txt;
    if (key === cState + '|' + cText) { clearTimeout(cPend); cPendKey = ''; return; }
    if (st === 'hover' || st === 'label' || st === 'quiet') { clearTimeout(cPend); cPendKey = ''; setCursor(st, txt); return; }
    if (key === cPendKey) return;
    clearTimeout(cPend); cPendKey = key;
    cPend = setTimeout(function () { cPendKey = ''; setCursor(st, txt); }, st === 'nav' ? 140 : 90);
  }
  function evalCursor(t, x) {
    var inter = interactive(t);
    var lab = inter && inter.closest('[data-cursor]');
    if (lab) return wantCursor('label', lab.dataset.cursor);
    if (inter) return wantCursor(inter.hasAttribute('data-cursor-quiet') ? 'quiet' : 'hover', '');
    var n = navAt(t, x);
    wantCursor(n ? 'nav' : 'rest', n === 'next' ? 'Next' : n === 'back' ? 'Back' : '');
  }
  function refreshCursor() {
    if (!fine || !seen) return;
    var t = document.elementFromPoint(mx, my);
    evalCursor(t, mx);
    if (magEl && (!interactive(t) || !magEl.contains(t))) { magEl.style.transform = ''; magEl = null; }
  }
  window.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    mx = e.clientX; my = e.clientY; tpx = mx / innerWidth - .5; tpy = my / innerHeight - .5;
    cursor.classList.remove('out'); seen = true;
    var t = e.target.closest ? e.target : null;
    evalCursor(t, e.clientX);
    /* magnetic: only enabled interactive elements pull */
    var it = interactive(t);
    var m = !RM() && it && it.closest('.mag');
    if (magEl && magEl !== m) { magEl.style.transform = ''; magEl = null; }
    if (m) {
      var r = m.getBoundingClientRect(), dx = mx - (r.left + r.width / 2), dy = my - (r.top + r.height / 2);
      var cl = function (v, lim) { return Math.max(-lim, Math.min(lim, v)); }; /* small pull, clamped inside its own bounds */
      m.style.transform = 'translate3d(' + cl(dx * .14, 6) + 'px,' + cl(dy * .2, 4) + 'px,0)'; magEl = m;
    }
    kick();
  }, { passive: true });
  document.addEventListener('pointerleave', function () { cursor.classList.add('out'); });
  $$('iframe').forEach(function (f) { f.addEventListener('pointerenter', function () { cursor.classList.add('out'); }); });

  /* ---------- shared device ---------- */
  var device = $('#device'), proto = $('#protoFrame'), protoHash = '', addHash = '/beyond/explore/curate';
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
      var want = slot.dataset.device === 'push' ? hold(addHash) : '/' + slot.dataset.device;
      setProto(want);
    } else device.classList.remove('on');
    if (instant) { void device.offsetWidth; device.classList.remove('no-anim'); }
  }
  // Slide 9 phone holds on the chosen view; the hero phone keeps playing the tour.
  function hold(h) { return h + (h.indexOf('?') < 0 ? '?' : '&') + 'hold=1'; }
  function setProto(h) {
    if (!proto.src) { proto.src = 'prototype/?embed=1&v=7#' + h; protoHash = h; return; }
    if (h === protoHash) return;
    protoHash = h;
    try { proto.contentWindow.location.hash = '#' + h; } catch (e) { proto.src = 'prototype/?embed=1&v=7#' + h; }
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
    later(refreshCursor, 0); later(refreshCursor, 980);
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
    if (prev >= 0) hint.classList.add('gone');
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
  var overlayOpen = function () { return !$('#overview').hidden || !$('#sources').hidden || !$('#jtbd').hidden; };
  document.addEventListener('keydown', function (e) {
    var tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 'Escape') { closeOverview(); closeDrawer(); closeJtbd(); return; }
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
    else if (/^[1-9]$/.test(k)) go(parseInt(k, 10) - 1);
  });

  /* No wheel or trackpad navigation: scrolling never changes slides. */

  /* touch swipe */
  var tx = 0, ty = 0, tt = 0;
  deck.addEventListener('touchstart', function (e) { var t = e.touches[0]; tx = t.clientX; ty = t.clientY; tt = Date.now(); }, { passive: true });
  deck.addEventListener('touchend', function (e) {
    var t = e.changedTouches[0], dx = t.clientX - tx, dy = t.clientY - ty;
    if (Date.now() - tt > 700) return;
    if (e.target.closest('.matrix, .opts, .sb-tabs, .stages')) { if (Math.abs(dx) < 80) return; }
    if (overlayOpen()) return;
    /* horizontal swipe only; vertical movement is always left to scrolling */
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) (dx < 0 ? next : prevS)();
  }, { passive: true });

  /* click empty background to advance */
  deck.addEventListener('click', function (e) {
    if (e.defaultPrevented || !isNavBg(e.target)) return; /* same rule as the cursor hint */
    if (String(window.getSelection && window.getSelection())) return;
    var side = navAt(e.target, e.clientX);
    if (side === 'next') next(); else if (side === 'back') prevS();
  });

  /* keep the device glued to its slot while a stacked slide scrolls (mobile) and on resize */
  slides.forEach(function (s) { s.addEventListener('scroll', function () { if (slides[cur] === s) requestAnimationFrame(function () { placeDevice(true); }); }, { passive: true }); });
  var rz = 0; window.addEventListener('resize', function () { cancelAnimationFrame(rz); rz = requestAnimationFrame(function () { placeDevice(true); if (journey.redraw) journey.redraw(); }); });

  /* ---------- toolbar toggles ---------- */
  var tokensBtn = $('#tokensBtn'), motionBtn = $('#motionBtn');
  function toggleTokens() { var on = body.classList.toggle('show-tokens'); tokensBtn.setAttribute('aria-pressed', on); }
  tokensBtn.addEventListener('click', toggleTokens);
  function syncMotion() { if (motionBtn) motionBtn.setAttribute('aria-pressed', RM()); }
  function toggleMotion() { root.dataset.motion = RM() ? 'full' : 'reduce'; syncMotion(); if (enter[cur]) enter[cur](); }
  if (motionBtn) motionBtn.addEventListener('click', toggleMotion);
  sysRM.addEventListener && sysRM.addEventListener('change', function () { root.dataset.motion = sysRM.matches ? 'reduce' : 'full'; syncMotion(); });
  syncMotion();

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
    requestAnimationFrame(function () { ov.classList.add('open'); ($$('button', ovGrid)[cur] || ov).focus(); refreshCursor(); });
  }
  function closeOverview() { if (ov.hidden) return; ov.classList.remove('open'); setTimeout(function () { ov.hidden = true; refreshCursor(); }, 250); if (lastFocus) lastFocus.focus(); }
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
    requestAnimationFrame(function () { dr.classList.add('open'); $('[data-close]', dr).focus(); refreshCursor();
      if (n) { var li = $('#src-' + n); if (li) { li.scrollIntoView({ block: 'center' }); li.classList.remove('flash'); void li.offsetWidth; li.classList.add('flash'); } } });
  }
  function closeDrawer() { if (dr.hidden) return; dr.classList.remove('open'); setTimeout(function () { dr.hidden = true; refreshCursor(); }, 250); if (lastFocus) lastFocus.focus(); }
  $$('[data-drawer]').forEach(function (b) { b.addEventListener('click', function () { openDrawer(); }); });
  $('[data-close]', dr).addEventListener('click', closeDrawer);
  dr.addEventListener('click', function (e) { if (e.target === dr) closeDrawer(); });
  /* ---------- 3 · Full JTBD analysis: jobs across the trip (dialog with focus trap) ---------- */
  var jt = $('#jtbd'), jtBtn = $('#jtbdBtn'), jtLast = null;
  function openJtbd() {
    if (!jt.hidden) return;
    jtLast = document.activeElement; jt.hidden = false; jt.scrollTop = 0;
    requestAnimationFrame(function () { jt.classList.add('open'); $('[data-jt-close]', jt).focus(); refreshCursor(); });
    if (typeof window.gtag === 'function') window.gtag('event', 'jtbd_drawer_open', { slide_number: cur + 1 });
  }
  function closeJtbd() {
    if (jt.hidden) return;
    jt.classList.remove('open'); setTimeout(function () { jt.hidden = true; refreshCursor(); }, RM() ? 0 : 250);
    if (jtLast && jtLast.focus) jtLast.focus();
  }
  jtBtn.addEventListener('click', openJtbd);
  $('[data-jt-close]', jt).addEventListener('click', closeJtbd);
  jt.addEventListener('click', function (e) { if (e.target === jt) closeJtbd(); });
  jt.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var f = $$('button, summary, a[href]', jt).filter(function (el) { return el.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
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
    // The highlight is clipped in user units at the active dot's x. A dash offset can't be used here: the stroke is non-scaling,
    // so dash lengths are measured in screen pixels and drift from the dots as soon as the SVG stretches.
    var NS = 'http://www.w3.org/2000/svg', svgC = $('.curve'), defs = svgC.querySelector('defs') || svgC.insertBefore(document.createElementNS(NS, 'defs'), svgC.firstChild);
    var cp = document.createElementNS(NS, 'clipPath'); cp.setAttribute('id', 'curveClip'); cp.setAttribute('clipPathUnits', 'userSpaceOnUse');
    var cr = document.createElementNS(NS, 'rect'); cr.setAttribute('x', 0); cr.setAttribute('y', -40); cr.setAttribute('width', 1000); cr.setAttribute('height', H + 80); cr.setAttribute('class', 'curve-clip');
    cp.appendChild(cr); defs.appendChild(cp); line.setAttribute('clip-path', 'url(#curveClip)');
    function reach(x) { cr.style.transform = 'scaleX(' + (x / 1000) + ')'; }
    reach(0);
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
      reach(xs[i]);
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
      if (RM()) { sel(0); return; }
      cr.style.transition = 'none'; reach(0); void cr.getBoundingClientRect(); cr.style.transition = '';
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
    var mo = $('.moment'), cBtn = $('#celebrateBtn');
    /* Snap back to the start with transitions off, then play the same entrance again. Runs every click. */
    function reset() { mo.classList.add('m-reset'); mo.classList.remove('play', 'm-fade'); void mo.offsetWidth; mo.classList.remove('m-reset'); void mo.offsetWidth; }
    function play() { reset(); mo.classList.add('play'); if (RM()) mo.classList.add('m-fade'); }
    cBtn.addEventListener('click', play);
    cBtn.addEventListener('animationend', function (e) { if (e.target === cBtn && (e.animationName === 'btnRing' || e.animationName === 'btnFade')) cBtn.classList.remove('btn-in'); });
    function arrive() { play(); later(function () { cBtn.classList.remove('btn-wait'); cBtn.classList.add('btn-in'); }, RM() ? 0 : 850); }
    /* v5.3: the success moment lives in slide 6's Motion tile as the Moment demo. */
    enter[5] = function () { reset(); cBtn.classList.remove('btn-in'); cBtn.classList.add('btn-wait'); later(arrive, RM() ? 0 : 900); };
  })();

  /* ---------- 6 · storybook ---------- */
  var sb = $('#sbFrame');
  function sbUrl(path) {
    if (mobileMQ.matches) { var p = path.split('/'); return 'storybook/iframe.html?id=' + p[1] + '&viewMode=' + (p[0] === 'docs' ? 'docs' : 'story'); }
    return 'storybook/index.html?path=/' + path + '&panel=false';
  }
  $$('.sb-tabs button').forEach(function (t, _, all) { t.addEventListener('click', function () { all.forEach(function (x) { x.setAttribute('aria-selected', x === t); }); sb.src = sbUrl(t.dataset.sb); }); });
  function preload(i) { if (i >= 4 && !sb.src) sb.src = sbUrl('docs/introduction--docs'); }

  /* ---------- 7 · poll demo + value adds ---------- */
  (function () {
    var card = $('#poll'), optsEl = $('#opts');
    var O = [['Taberna da Rua das Flores', 'Tasca · $$ · 6 min walk'], ['Cervejaria Ramiro', 'Seafood · $$$ · 14 min'], ['Park Rooftop', 'Drinks and bites · $$ · 9 min']];
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
      var hide = st.mine === null && !st.closed;
      card.dataset.hide = hide ? '1' : '0';
      $('#pcSub').textContent = st.closed ? 'Closed at 7:30 PM · ' + n + ' of 7 voted' : n + ' of 7 voted · closes 7:30 PM';
      $('.pc-as').textContent = st.closed ? (st.v[0] === 5 ? 'Taberna wins with 5 of 7. Booked for 8:30 PM.' : 'Taberna still wins. In the story, Ren and João both pick it: 5 of 7, 71%.')
        : hide ? 'Tap a place to vote. Counts show once you do.' : 'Your vote is in. Tap it again to change your mind.';
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
    $('#pollRM').addEventListener('change', function (e) { card.classList.toggle('is-rm', e.target.checked); });
    enter[7] = function () {
      stage(1);
      $('#pollRM').checked = RM(); card.classList.toggle('is-rm', RM());
      st = { v: [0, 0, 0], mine: null, closed: false }; render();
      later(function () { reset(); }, RM() ? 0 : 700);
    };
    reset();
    /* Stages: 1 create, 2 vote (the card above is its centerpiece), 3 lands on the plan. Each stage remembers its phone view. */
    var stages = $$('.s7-stages [role=tab]'), panels = $$('.s7-panel'), line = $('.s7-line span');
    function show(hash) { addHash = hash; var sl = slides[cur]; if (sl && $('.slot', sl) && $('.slot', sl).dataset.device === 'push') setProto(hold(hash)); $('#addOpen').href = protoLink(hash, 8); }
    function stage(n, focus) {
      stages.forEach(function (t, i) { var on = i === n - 1; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; t.classList.toggle('is-done', i < n - 1); if (on && focus) t.focus(); });
      panels.forEach(function (p, i) { p.hidden = i !== n - 1; });
      line.style.transform = 'scaleX(' + ((n - 1) / 2) + ')';
      var v = $('.sp-views [aria-pressed=true]', panels[n - 1]); if (v) show(v.dataset.hash); else if (panels[n - 1].dataset.hash) show(panels[n - 1].dataset.hash);
    }
    stages.forEach(function (t, i) {
      t.addEventListener('click', function () { stage(i + 1); });
      t.addEventListener('keydown', function (e) {
        var k = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!k) return;
        e.preventDefault(); e.stopPropagation(); stage(Math.max(1, Math.min(3, i + 1 + k)), true);
      });
    });
    $$('.sp-views').forEach(function (g) { var bs = $$('button', g); bs.forEach(function (b) { b.addEventListener('click', function () {
      bs.forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); show(b.dataset.hash);
    }); }); });
    stage(1);
  })();

  /* ---------- 8 · untangle (v4 "Instrument", Figma set 121:4174) ---------- */
  (function () {
    var NS = 'http://www.w3.org/2000/svg', P = D.PEOPLE, NP = D.NODES, CX = 181, CY = 112, W = 362;
    var svg = $('#graph'), gE = $('#edges'), gN = $('#nodes'), gT = $('#tech'), gP = $('#panel'), counter = $('#gCounter');
    var mk = function (t, a, par) { var e = document.createElementNS(NS, t); for (var k in a) e.setAttribute(k, a[k]); if (par) par.appendChild(e); return e; };
    var defs = svg.querySelector('defs');
    if (!document.getElementById('gAvClip')) mk('circle', { r: 16 }, mk('clipPath', { id: 'gAvClip' }, defs));
    // Technical layer: 12 px dot grid with a radial falloff, the dashed orbit, side ticks, and a crosshair shown on Solved.
    for (var x = 13; x <= 349; x += 12) for (var y = 34; y <= 194; y += 12) { var dd = Math.hypot((x - CX) / 170, (y - CY) / 82); if (dd < 1) mk('circle', { cx: x, cy: y, r: .625, class: 'g-dot', style: 'opacity:' + (dd < .6 ? 1 - dd * .6 : (1 - dd) * 1.6).toFixed(2) }, gT); }
    mk('ellipse', { cx: CX, cy: CY, rx: 125, ry: 54, class: 'g-orbit' }, gT);
    for (var i = 0; i < 15; i++) { var ty = 34 + i * 12, tl = i % 4 === 0 ? 6 : 3; mk('line', { x1: 4, x2: 4 + tl, y1: ty, y2: ty, class: 'g-tick' }, gT); mk('line', { x1: W - 4, x2: W - 4 - tl, y1: ty, y2: ty, class: 'g-tick' }, gT); }
    var cross = mk('g', { class: 'g-cross' }, gT); mk('line', { x1: CX - 5, x2: CX + 5, y1: CY, y2: CY }, cross); mk('line', { x1: CX, x2: CX, y1: CY - 5, y2: CY + 5 }, cross);
    // Quadratic threads: control = mid + (center - mid) * bend; start 24 px from the source, end 23 px from the target.
    function geo(a, b, bend) {
      var mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, c = [mx + (CX - mx) * bend, my + (CY - my) * bend];
      var q = function (t) { var u = 1 - t; return [u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]]; };
      var pts = []; for (var k = 0; k <= 60; k++) pts.push(q(k / 60));
      var cut = function (from, r) { for (var k = 1; k < pts.length; k++) { var p = from ? pts[k] : pts[pts.length - 1 - k]; if (Math.hypot(p[0] - (from ? a : b)[0], p[1] - (from ? a : b)[1]) >= r) return from ? k : pts.length - 1 - k; } return 0; };
      var s0 = cut(true, 24), s1 = cut(false, 23), poly = pts.slice(s0, s1 + 1);
      var d = 'M' + poly.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' L');
      var tip = poly[poly.length - 1], pre = poly[poly.length - 3], ang = Math.atan2(tip[1] - pre[1], tip[0] - pre[0]);
      return { d: d, poly: poly, tip: tip, s: poly[0], ang: ang, mid: poly[Math.floor(poly.length / 2)] };
    }
    function head(g, w) { var L = 5 + w * 1.6, H = 3 + w * .9, c = Math.cos(g.ang), s = Math.sin(g.ang), t = g.tip;
      return 'M' + (t[0] + c * 1.5) + ' ' + (t[1] + s * 1.5) + ' L' + (t[0] - c * L - s * H) + ' ' + (t[1] - s * L + c * H) + ' L' + (t[0] - c * L + s * H) + ' ' + (t[1] - s * L - c * H) + 'Z'; }
    function segX(p, p2, q, q2) { var r = [p2[0] - p[0], p2[1] - p[1]], s = [q2[0] - q[0], q2[1] - q[1]], den = r[0] * s[1] - r[1] * s[0]; if (Math.abs(den) < 1e-9) return null;
      var t = ((q[0] - p[0]) * s[1] - (q[1] - p[1]) * s[0]) / den, u = ((q[0] - p[0]) * r[1] - (q[1] - p[1]) * r[0]) / den; return t >= 0 && t <= 1 && u >= 0 && u <= 1 ? [p[0] + t * r[0], p[1] + t * r[1]] : null; }
    var BEND = { 'ari>tomas': .12, 'ren>ari': .25, 'mara>joao': .15, 'mara>sofia': .10, 'sofia>joao': .10, 'tomas>nic': .28 };
    var BEND_S = { 'ari>nic': .30, 'ren>ari': .30, 'mara>joao': .35 };
    // Tags sit on their thread; a small search picks the spot that stays clearest of nodes, knots and other tags.
    var placed = [], avoid = [];
    function spot(g, w) {
      var best = null, bs = -1;
      for (var f = .3; f <= .71; f += .04) { var m = g.poly[Math.round(f * (g.poly.length - 1))], sc = 99;
        Object.keys(NP).forEach(function (id) { sc = Math.min(sc, Math.max(0, Math.abs(NP[id][0] - m[0]) - w / 2 - 20) + Math.max(0, Math.abs(NP[id][1] - m[1]) - 27)); });
        avoid.forEach(function (k) { sc = Math.min(sc, Math.hypot(k[0] - m[0], k[1] - m[1]) - w / 2 + 2); });
        placed.forEach(function (r) { sc = Math.min(sc, Math.max(Math.abs(r[0] - m[0]) - (r[2] + w) / 2, Math.abs(r[1] - m[1]) - 15)); });
        sc -= Math.abs(f - .5) * 4; if (sc > bs) { bs = sc; best = m; } }
      placed.push([best[0], best[1], w]); return best;
    }
    function tag(g, txt, cls) { var w = txt.length * 6 + 10, m = spot(g, w), t = mk('g', { class: 'g-tag ' + cls }, gE);
      mk('rect', { x: m[0] - w / 2, y: m[1] - 7, width: w, height: 14, rx: 7 }, t); var tx = mk('text', { x: m[0], y: m[1] + 3.4, 'text-anchor': 'middle' }, t); tx.textContent = txt; return t; }
    var tang = D.TANGLED.map(function (e, i) {
      var g = geo(NP[e[0]], NP[e[1]], BEND[e[0] + '>' + e[1]] || .1), w = 1 + 1.5 * Math.min(e[2], 42.1) / 42.1;
      var lg = mk('linearGradient', { id: 'tg' + i, gradientUnits: 'userSpaceOnUse', x1: g.s[0], y1: g.s[1], x2: g.tip[0], y2: g.tip[1] }, defs);
      mk('stop', { offset: 0, class: 'g-t0' }, lg); mk('stop', { offset: .22, class: 'g-t1' }, lg); mk('stop', { offset: 1, class: 'g-t2' }, lg);
      var grp = mk('g', { class: 'g-thread' }, gE);
      var path = mk('path', { d: g.d, stroke: 'url(#tg' + i + ')', 'stroke-width': w, class: 'g-iou' }, grp);
      var dash = mk('path', { d: g.d, class: 'g-dash' }, grp);
      var hd = mk('path', { d: head(g, w), class: 'g-head' }, grp);
      var ep = mk('g', { class: 'g-ep' }, grp); mk('circle', { cx: g.s[0], cy: g.s[1], r: 2.5, class: 'owe' }, ep); mk('circle', { cx: g.tip[0], cy: g.tip[1], r: 2.5, class: 'owed' }, ep);
      var L = path.getTotalLength(); path.style.strokeDasharray = L; path.dataset.len = L;
      return { g: g, grp: grp, path: path, dash: dash, hd: hd, ep: ep, txt: e[2].toFixed(2) };
    });
    // Crossings are computed, never placed by hand.
    var knots = [], gK = mk('g', { class: 'g-knots' }, gE);
    for (var a = 0; a < tang.length; a++) for (var b = a + 1; b < tang.length; b++) { var A = tang[a].g.poly, B = tang[b].g.poly;
      for (var m = 1; m < A.length; m++) for (var n = 1; n < B.length; n++) { var X = segX(A[m - 1], A[m], B[n - 1], B[n]);
        if (X && !Object.keys(NP).some(function (id) { return Math.hypot(NP[id][0] - X[0], NP[id][1] - X[1]) < 26; }) && !knots.some(function (k) { return Math.hypot(k[0] - X[0], k[1] - X[1]) < 4; })) knots.push(X); } }
    avoid = knots.slice(); tang.forEach(function (e) { e.tag = tag(e.g, e.txt, 'is-iou'); }); placed = []; avoid = [];
    knots.forEach(function (k) { var g = mk('g', { class: 'g-knot', transform: 'translate(' + k[0].toFixed(1) + ' ' + k[1].toFixed(1) + ')' }, gK); mk('circle', { r: 6, class: 'glow' }, g); mk('circle', { r: 2.5, class: 'core' }, g); });
    var pays = D.SIMPLE.map(function (e, i) {
      var g = geo(NP[e[0]], NP[e[1]], BEND_S[e[0] + '>' + e[1]] || .3), w = e[2] >= 40 ? 3 : 2.25;
      var lg = mk('linearGradient', { id: 'sg' + i, gradientUnits: 'userSpaceOnUse', x1: g.s[0], y1: g.s[1], x2: g.tip[0], y2: g.tip[1] }, defs);
      mk('stop', { offset: 0, class: 'g-s0' }, lg); mk('stop', { offset: .35, class: 'g-s1' }, lg); mk('stop', { offset: 1, class: 'g-s1' }, lg);
      var grp = mk('g', { class: 'g-pay' }, gE);
      var path = mk('path', { d: g.d, stroke: 'url(#sg' + i + ')', 'stroke-width': w, class: 'g-arc' }, grp);
      var hd = mk('path', { d: head(g, w), class: 'g-arc-head' }, grp);
      var L = path.getTotalLength(); path.style.strokeDasharray = L; path.dataset.len = L;
      return { grp: grp, path: path, hd: hd, tag: tag(g, '$' + e[2].toFixed(2), 'is-pay') };
    });
    var MAX = 64, nodes = {};
    function arc(v) { var r = 19, ang = Math.min(1, Math.abs(v) / MAX) * 2 * Math.PI, sw = v > 0 ? 1 : 0; if (ang < .01) return '';
      if (ang > 2 * Math.PI - .01) return 'M0 ' + (-r) + ' A' + r + ' ' + r + ' 0 1 ' + sw + ' 0 ' + r + ' A' + r + ' ' + r + ' 0 1 ' + sw + ' 0 ' + (-r);
      var ex = Math.sin(ang) * r * (v > 0 ? 1 : -1), ey = -Math.cos(ang) * r; return 'M0 ' + (-r) + ' A' + r + ' ' + r + ' 0 ' + (ang > Math.PI ? 1 : 0) + ' ' + sw + ' ' + ex.toFixed(2) + ' ' + ey.toFixed(2); }
    Object.keys(NP).forEach(function (id) {
      var p = NP[id], v = D.NETS[id], g = mk('g', { class: 'g-node' + (id === 'ari' ? ' is-me' : '') + (v === 0 ? ' is-zero' : ''), transform: 'translate(' + p[0] + ' ' + p[1] + ')' }, gN);
      var ar = mk('path', { d: arc(v), class: 'bal ' + (v < 0 ? 'owe' : 'owed') }, g);
      // v5.1 medallion: 36 pt disc, 32 pt photo, same avatars as the prototype.
      mk('circle', { r: 18, class: 'disc' }, g);
      var im = mk('image', { x: -16, y: -16, width: 32, height: 32, 'clip-path': 'url(#gAvClip)', preserveAspectRatio: 'xMidYMid slice', class: 'av' }, g);
      im.setAttribute('href', 'deck/img/av-' + id + '.jpg');
      mk('circle', { r: 17.5, class: 'edge' }, g);
      // Labels: above when the node sits high, otherwise below. Ari sits to the right of the chip, stacked; Sofia is nudged right so labels never collide.
      var up = p[1] < CY - 20, nm = id === 'ari' ? 'You' : P[id], val = (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v).toFixed(2);
      var lx = id === 'ari' ? 25 : id === 'sofia' ? 8 : 0, anchor = id === 'ari' ? 'start' : 'middle';
      var l0 = mk('text', { x: lx, y: id === 'ari' ? -3 : up ? -26 : 34, 'text-anchor': anchor, class: 'lbl' }, g); l0.textContent = nm;
      var l1 = mk('text', { x: lx, y: id === 'ari' ? -3 : up ? -26 : 34, 'text-anchor': anchor, class: 'lbl is-net' }, g);
      if (id === 'ari') { l1.textContent = ''; mk('tspan', { x: lx, dy: 0 }, l1).textContent = nm; var t2 = mk('tspan', { x: lx, dy: 11, class: v < 0 ? 'owe' : 'owed' }, l1); t2.textContent = val; }
      else { l1.textContent = nm + ' '; var sp = mk('tspan', { class: v < 0 ? 'owe' : v > 0 ? 'owed' : 'zero' }, l1); sp.textContent = val; }
      nodes[id] = { g: g, ar: ar, l0: l0, l1: l1, v: v };
    });
    // Mono instrument panel, one per step.
    var PANELS = [[['IOUS', '6', ''], ['CROSSINGS', String(knots.length), ''], ['FLOW', '$190.60', '']],
      [['Σ NET', '0.00 ✓', ''], ['OWED', '+106.10', '', 'owed'], ['OWE', '−106.10', '', 'owe']],
      [['PAYMENTS', '3', ''], ['FLOW', '$124.50', ''], ['SAVED', '50%', '', 'acc']]];
    mk('rect', { x: 16, y: 206, width: 330, height: 50, rx: 12, class: 'g-pbox' }, gP);
    [1, 2].forEach(function (k) { mk('line', { x1: 16 + k * 110, x2: 16 + k * 110, y1: 214, y2: 248, class: 'g-pdiv' }, gP); });
    var pg = PANELS.map(function (cells) { var g = mk('g', { class: 'g-pset' }, gP);
      cells.forEach(function (c, ci) { var x = 30 + ci * 110; mk('text', { x: x, y: 225, class: 'g-cap' }, g).textContent = c[0];
        var v = mk('text', { x: x, y: 243, class: 'g-val' + (c[3] ? ' ' + c[3] : '') }, g); v.textContent = c[1]; if (c[2]) { var s = mk('tspan', { dx: 6, class: 'g-sub' }, v); s.textContent = c[2]; } }); return g; });
    var view = 2, btns = $$('.stepper button');
    function show(k, animate) {
      view = k; svg.dataset.step = k;
      // v5.4.2 Netting: the engine layer (math flying by, arrows collapsing, one dry line), then it lands on Solved.
      var host = svg.parentNode, oldE = host.querySelector('.ut-engine'); if (oldE) oldE.remove();
      if (k === 1 && animate) {
        var en = document.createElement('div'); en.className = 'ut-engine' + (RM() ? ' is-reduce' : ''); en.setAttribute('aria-hidden', 'true');
        var G = ['Σ', '√', '±', 'Σ nets = 0', '→', '÷ 7', '≈', 'Δ', '+', '−', 'min(Σ)', '∫', '+$106.10', '−$44.27', '+$23.83', '−$2.17'];
        if (!RM()) G.forEach(function (g, i) { var sp = document.createElement('span'); sp.className = 'ut-gl' + (/\$/.test(g) ? ' is-amt' : ''); sp.textContent = g;
          sp.style.cssText = '--x:' + ((i * 37) % 100) + '%;--y:' + ((i * 53 + 11) % 80) + '%;--d:' + ((i % 6) * 110) + 'ms;--r:' + ((i % 2 ? 1 : -1) * (8 + (i * 7) % 18)) + 'deg'; en.appendChild(sp); });
        var q = document.createElement('span'); q.className = 'ut-quip'; q.textContent = ['Doing the math so nobody has to.', 'Carrying the one. Several ones.'][Math.random() < .5 ? 0 : 1]; en.appendChild(q);
        if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
        host.appendChild(en); later(function () { if (view === 1) show(2, true); }, RM() ? 1600 : 2500);
      }
      btns.forEach(function (b, i) { b.setAttribute('aria-checked', i === k); });
      counter.textContent = ['01 TANGLED', '02 NETTING', '03 SOLVED'][k];
      $('#ro1').textContent = D.READOUT[k][0]; $('#ro2').textContent = D.READOUT[k][1];
      pg.forEach(function (g, i) { g.style.opacity = i === k ? 1 : 0; });
      tang.forEach(function (e, i) {
        var L = +e.path.dataset.len;
        e.path.style.opacity = k === 0 ? 1 : 0; e.hd.style.opacity = k === 0 ? 1 : 0; e.tag.style.opacity = k === 0 ? 1 : 0;
        e.dash.style.opacity = k === 1 ? .35 : 0; e.ep.style.opacity = k === 1 ? 1 : 0;
        if (k === 0 && animate && !RM()) { e.path.style.transition = 'none'; e.path.style.strokeDashoffset = L; void e.path.getBoundingClientRect(); e.path.style.transition = ''; later(function () { e.path.style.strokeDashoffset = 0; }, 40 * i); }
        else e.path.style.strokeDashoffset = 0;
      });
      gK.style.opacity = k === 0 ? 1 : 0;
      cross.style.opacity = k === 2 ? 1 : 0;
      Object.keys(nodes).forEach(function (id) { var n = nodes[id]; n.ar.style.opacity = k >= 1 ? 1 : 0; n.l0.style.opacity = k === 0 ? 1 : 0; n.l1.style.opacity = k >= 1 ? 1 : 0; n.g.classList.toggle('is-faded', k === 2 && n.v === 0); });
      pays.forEach(function (e, i) {
        var L = +e.path.dataset.len;
        if (k < 2) { e.grp.style.opacity = 0; e.path.style.transition = 'none'; e.path.style.strokeDashoffset = L; e.tag.style.opacity = 0; return; }
        e.grp.style.opacity = 1; e.tag.style.opacity = 0; e.hd.style.opacity = 0;
        if (!animate || RM()) { e.path.style.transition = RM() ? 'opacity .2s linear' : 'none'; e.path.style.strokeDashoffset = 0; e.tag.style.opacity = 1; e.hd.style.opacity = 1; return; }
        e.path.style.transition = 'none'; e.path.style.strokeDashoffset = L; void e.path.getBoundingClientRect();
        e.path.style.transition = '';
        later(function () { e.path.style.strokeDashoffset = 0; }, 80 + i * 80);
        later(function () { e.tag.style.opacity = 1; e.hd.style.opacity = 1; }, 560 + i * 80);
      });
    }
    var nextB = $('#gNext'), restart = $('#gRestart');
    function sync() { nextB.hidden = view === 2; restart.hidden = view !== 2; }
    function step(k) { clearTimers(); show(k, true); sync(); }
    btns.forEach(function (b, i) { b.addEventListener('click', function () { step(i); }); });
    nextB.addEventListener('click', function () { step(Math.min(2, view + 1)); if (view === 2) restart.focus(); });
    restart.addEventListener('click', function () { step(0); nextB.focus(); });
    var seen = false;
    enter[8] = function () { seen = false; show(0, false); sync(); if (!mobileMQ.matches) { seen = true; later(function () { show(0, true); }, 0); } };
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting && cur === 8 && !seen) { seen = true; show(0, true); } }); }, { threshold: .5 }).observe($('.graph'));
    show(0, false); sync();
  })();

  /* slide_view, outbound_click and jtbd_drawer_open go through analytics/ga.js. sync.js writes the measurement id. */
  function track(i) { if (typeof window.gtag === 'function') window.gtag('event', 'slide_view', { slide_number: i + 1, slide_title: slides[i].dataset.title }); }

  /* ---------- links that open a new tab: glyph, screen reader suffix, GA outbound_click ---------- */
  function markExt(root) {
    $$('a[target="_blank"]', root).forEach(function (a) {
      if (a.hasAttribute('data-ext')) return;
      a.setAttribute('data-ext', '');
      var s = document.createElement('span'); s.className = 'sr-only'; s.textContent = ' (opens in a new tab)'; a.appendChild(s);
    });
  }
  markExt(document);

  /* ---------- prototype links: always a new tab, self guided, at the exact route, with a way back to this slide ---------- */
  function protoLink(hash, slide) { return 'prototype/?mode=self&from=deck&slide=' + slide + '#' + (hash || '/home'); }
  $$('a[href^="prototype/"], a[href^="./prototype/"]').forEach(function (a) {
    var sec = a.closest('.slide'), n = sec ? slides.indexOf(sec) + 1 : 1;
    var raw = a.getAttribute('href'), h = raw.indexOf('#') >= 0 ? raw.slice(raw.indexOf('#') + 1) : '/home';
    a.href = protoLink(h, n); a.target = '_blank'; a.rel = 'noopener';
  });
  markExt(document);
  var mdet = $('.mdetail'); /* matrix detail rewrites its source links on every selection */
  if (mdet && 'MutationObserver' in window) new MutationObserver(function () { markExt(mdet); }).observe(mdet, { childList: true, subtree: true });
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[target="_blank"]');
    if (a && typeof window.gtag === 'function') window.gtag('event', 'outbound_click', { link_url: a.href, link_text: a.textContent.replace(' (opens in a new tab)', '').trim().slice(0, 80), slide_number: cur + 1 });
  });

  /* ---------- zoom: mood boards (slide 5) and the Storybook preview (slide 7) open full size ---------- */
  (function () {
    var lb = document.createElement('div'); lb.className = 'zoom'; lb.hidden = true;
    lb.innerHTML = '<div class="zoom-scrim"></div><figure class="zoom-fig" role="dialog" aria-modal="true" aria-label="Enlarged image"><img alt=""><figcaption></figcaption>' +
      '<button type="button" class="zoom-x" aria-label="Close">×</button><button type="button" class="zoom-nav is-prev" aria-label="Previous direction">‹</button><button type="button" class="zoom-nav is-next" aria-label="Next direction">›</button></figure>';
    document.body.appendChild(lb);
    var img = $('img', lb), cap = $('figcaption', lb), list = [], at = 0, back = null;
    function paint() { var it = list[at]; img.src = it.src; img.alt = it.alt; cap.textContent = it.cap || ''; $$('.zoom-nav', lb).forEach(function (b) { b.hidden = list.length < 2; }); }
    function open(items, i, from) { list = items; at = i; back = from; paint(); lb.hidden = false; requestAnimationFrame(function () { lb.classList.add('is-on'); }); $('.zoom-x', lb).focus(); }
    function close() { lb.classList.remove('is-on'); setTimeout(function () { lb.hidden = true; img.removeAttribute('src'); }, RM() ? 0 : 220); if (back) back.focus(); }
    function step(k) { at = (at + k + list.length) % list.length; paint(); var t = $$('.board-tabs button')[at]; if (list[0].board && t) t.click(); }
    $('.zoom-scrim', lb).addEventListener('click', close); $('.zoom-x', lb).addEventListener('click', close);
    $('.is-prev', lb).addEventListener('click', function () { step(-1); }); $('.is-next', lb).addEventListener('click', function () { step(1); });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return; e.stopPropagation();
      if (e.key === 'Escape') { e.preventDefault(); close(); } else if (e.key === 'ArrowRight') { e.preventDefault(); step(1); } else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
      else if (e.key === 'Tab') { var f = $$('button:not([hidden])', lb); var i = f.indexOf(document.activeElement); e.preventDefault(); f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus(); }
    }, true);
    $$('.zoomable').forEach(function (z) { z.addEventListener('click', function () {
      if (z.classList.contains('board-stage')) {
        var ims = $$('img', z), items = ims.map(function (im) { var name = $('.board-tabs [data-board="' + im.dataset.board + '"]'); return { board: im.dataset.board, src: im.getAttribute('src').replace('.jpg', '@2x.jpg'), alt: im.alt, cap: (name ? name.childNodes[0].textContent.trim() + '. ' : '') + D.BOARDS[im.dataset.board] }; });
        open(items, Math.max(0, ims.findIndex(function (im) { return im.classList.contains('on'); })), z);
      } else { var i0 = $('img', z); open([{ src: z.dataset.zoom || i0.src, alt: i0.alt }], 0, z); }
    }); });
  })();

  if (window.SB_COUNTS) { [['sbStories', 'stories'], ['sbComps', 'components'], ['sbDocs', 'docs']].forEach(function (k) { var el = document.getElementById(k[0]); if (el) el.textContent = window.SB_COUNTS[k[1]]; }); }

  /* ---------- start ---------- */
  slides.forEach(function (s) { s.setAttribute('aria-hidden', 'true'); s.inert = true; });
  var start = parseInt(location.hash.slice(1), 10);
  go(start >= 1 && start <= N ? start - 1 : 0);
  window.TripUpDeck = { go: go, get index() { return cur; } };
})();
