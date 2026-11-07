/* 万类霜天竞自由 · 站点交互脚本（无任何外部依赖） */
(function () {
  'use strict';

  var doc = document;
  doc.documentElement.classList.add('js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 深浅主题切换 ---------- */
  var themeMeta = doc.querySelector('meta[name="theme-color"]');

  function applyThemeMeta(theme) {
    if (themeMeta) themeMeta.setAttribute('content', theme === 'dark' ? '#1B2422' : '#EFE7D2');
  }

  var toggle = doc.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var root = doc.documentElement;
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) { /* 忽略 */ }
      applyThemeMeta(next);
      /* 同步 Giscus 评论主题（若已开启） */
      var iframe = doc.querySelector('iframe.giscus-beta');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          { giscus: { setConfig: { theme: next } } },
          'https://giscus.app'
        );
      }
    });
  }

  /* ---------- 移动端菜单 ---------- */
  var navToggle = doc.getElementById('nav-toggle');
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      var open = doc.body.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  doc.querySelectorAll('.site-nav a').forEach(function (a) {
    a.addEventListener('click', function () { doc.body.classList.remove('nav-open'); });
  });

  /* ---------- 阅读进度墨线 ---------- */
  var progress = doc.getElementById('progress');
  if (progress) {
    var updateProgress = function () {
      var h = doc.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var p = max > 0 ? h.scrollTop / max : 0;
      progress.style.transform = 'scaleX(' + p + ')';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* ---------- 元素浮现（画卷徐展） ---------- */
  var revealEls = [].slice.call(doc.querySelectorAll('.reveal'));
  if (revealEls.length && 'IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- 首屏远山视差 ---------- */
  var hero = doc.querySelector('.hero');
  if (hero && !reduceMotion) {
    var layers = [].slice.call(hero.querySelectorAll('[data-speed]'));
    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        var rect = hero.getBoundingClientRect();
        if (rect.bottom > 0) {
          var offset = Math.min(-rect.top, rect.height);
          layers.forEach(function (layer) {
            var speed = parseFloat(layer.getAttribute('data-speed')) || 0;
            layer.style.transform = 'translate(0,' + (offset * speed * 0.35) + 'px)';
          });
        }
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 知识库筛选（地区 + 主题） ---------- */
  var grid = doc.getElementById('card-grid');
  var filterWrap = doc.querySelector('.filters');
  if (grid && filterWrap) {
    var empty = doc.getElementById('filter-empty');
    var state = { region: '', tags: '' };

    filterWrap.querySelectorAll('.filter-chips').forEach(function (group) {
      var key = group.getAttribute('data-filter');
      group.querySelectorAll('.chip').forEach(function (chip) {
        chip.addEventListener('click', function () {
          group.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('active'); });
          chip.classList.add('active');
          state[key] = chip.getAttribute('data-value') || '';
          applyFilter();
        });
      });
    });

    function applyFilter() {
      var visible = 0;
      var cards = grid.querySelectorAll('.card');
      cards.forEach(function (card) {
        var region = (card.getAttribute('data-region') || '');
        var tags = (card.getAttribute('data-tags') || '').toLowerCase();
        var okRegion = !state.region || region === state.region;
        var okTag = !state.tags || tags.split(' ').indexOf(state.tags) > -1;
        var show = okRegion && okTag;
        card.style.display = show ? '' : 'none';
        if (show) visible++;
      });
      if (empty) empty.hidden = visible !== 0;
    }
  }
})();
