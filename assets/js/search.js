/* 站内搜索：加载 Hugo 生成的 index.json，按权重评分（中文按子串匹配） */
(function () {
  'use strict';

  var input = document.getElementById('search-input');
  var resultsEl = document.getElementById('search-results');
  var statusEl = document.getElementById('search-status');
  if (!input || !resultsEl) return;

  var INDEX_URL = window.SEARCH_INDEX_URL || '/index.json';
  var DOCS = null;
  var SECTION_NAME = { logs: '日志', knowledge: '知识库', search: '搜索', archive: '归档', page: '页面' };

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function snippet(text, terms) {
    if (!text) return '';
    var lower = text.toLowerCase(), pos = -1;
    for (var i = 0; i < terms.length; i++) {
      pos = lower.indexOf(terms[i]);
      if (pos > -1) break;
    }
    var start = Math.max(0, pos - 30);
    var frag = (start > 0 ? '……' : '') + text.slice(start, start + 110) + (start + 110 < text.length ? '……' : '');
    for (var j = 0; j < terms.length; j++) {
      frag = frag.replace(new RegExp('(' + terms[j].replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'), '<mark>$1</mark>');
    }
    return frag;
  }

  function score(doc, terms) {
    var s = 0;
    var title = (doc.title || '').toLowerCase();
    var fields = [
      { v: title, w: 12 },
      { v: ((doc.tags || []) || []).join(' ').toLowerCase(), w: 8 },
      { v: ((doc.spot || '') + ' ' + (doc.location || '') + ' ' + (doc.region || '') + ' ' + (doc.era || '')).toLowerCase(), w: 6 },
      { v: (doc.summary || '').toLowerCase(), w: 3 },
      { v: (doc.content || '').toLowerCase(), w: 1 }
    ];
    for (var t = 0; t < terms.length; t++) {
      var term = terms[t], hit = false;
      for (var f = 0; f < fields.length; f++) {
        if (fields[f].v && fields[f].v.indexOf(term) > -1) {
          s += fields[f].w;
          hit = true;
        }
      }
      if (!hit) return -1; /* 所有词都必须命中 */
    }
    return s;
  }

  function search(q) {
    var terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length || !DOCS) return [];
    var out = [];
    for (var i = 0; i < DOCS.length; i++) {
      var s = score(DOCS[i], terms);
      if (s > 0) out.push({ doc: DOCS[i], score: s });
    }
    out.sort(function (a, b) { return b.score - a.score || (b.doc.date > a.doc.date ? 1 : -1); });
    return out;
  }

  function render(q) {
    var terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) {
      resultsEl.innerHTML = '';
      if (statusEl) statusEl.textContent = '输入关键词，实时检索全站。';
      return;
    }
    var hits = search(q);
    if (statusEl) statusEl.textContent = hits.length ? '寻得 ' + hits.length + ' 篇：' : '云深不知处，没有找到相关内容。';
    resultsEl.innerHTML = hits.slice(0, 30).map(function (h) {
      var d = h.doc;
      var meta = [SECTION_NAME[d.section] || d.section, d.date];
      if (d.spot) meta.push(d.spot);
      if (d.location) meta.push(d.location);
      return '<li class="sr-item">' +
        '<div class="sr-title"><a href="' + d.url + '">' + esc(d.title) + '</a></div>' +
        '<div class="sr-meta">' + meta.filter(Boolean).map(esc).join('<span>·</span>') + '</div>' +
        '<p class="sr-snippet">' + snippet(d.summary || d.content, terms) + '</p>' +
        '</li>';
    }).join('');
  }

  var debounceTimer = null;
  input.addEventListener('input', function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () { render(input.value.trim()); }, 180);
  });

  var urlQuery = new URLSearchParams(window.location.search).get('q');
  fetch(INDEX_URL)
    .then(function (r) { return r.json(); })
    .then(function (data) {
      DOCS = data;
      if (urlQuery) { input.value = urlQuery; render(urlQuery); }
    })
    .catch(function () {
      if (statusEl) statusEl.textContent = '索引加载失败，请刷新重试。';
    });
})();
