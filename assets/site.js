// AuraSnap 官网 · 共享脚本：导航、最新版本号、进场动画、目录高亮
(function () {
  'use strict';
  document.documentElement.classList.remove('no-js');

  // 默认值随网站发布更新；页面打开后再从 GitHub 取最新发行版，取不到就用这里的
  var FALLBACK = {
    version: '3.2.114',
    dmg: 'https://github.com/8wcznkmy6b-del/AuraSnap-PB/releases/download/v3.2.114/AuraSnap-3.2.114.dmg'
  };
  var RELEASE_API = 'https://api.github.com/repos/8wcznkmy6b-del/AuraSnap-PB/releases/latest';
  var CACHE_KEY = 'aurasnap_latest_release_v1';

  function applyRelease(rel) {
    document.querySelectorAll('[data-version]').forEach(function (el) { el.textContent = 'v' + rel.version; });
    document.querySelectorAll('[data-dmg]').forEach(function (el) { el.setAttribute('href', rel.dmg); });
  }

  function loadRelease() {
    applyRelease(FALLBACK);
    try {
      var cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null');
      if (cached && cached.version && cached.dmg) { applyRelease(cached); return; }
    } catch (e) { /* 隐私模式下 sessionStorage 不可用 */ }
    if (!window.fetch) return;
    fetch(RELEASE_API, { headers: { Accept: 'application/vnd.github+json' } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data || !data.tag_name) return;
        var asset = (data.assets || []).find(function (a) { return /^AuraSnap-[\d.]+\.dmg$/.test(a.name); });
        if (!asset) return;
        var rel = { version: data.tag_name.replace(/^v/, ''), dmg: asset.browser_download_url };
        applyRelease(rel);
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(rel)); } catch (e) { /* 忽略 */ }
      })
      .catch(function () { /* 网络不通时保留默认值 */ });
  }

  function setupNav() {
    var nav = document.querySelector('.nav');
    var toggle = document.querySelector('.nav-toggle');
    if (!nav || !toggle) return;
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
    });
  }

  function setupReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) { items.forEach(function (el) { el.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  }

  // 截图切换：[data-tabs] 内的按钮 data-tab 对应 data-panel
  function setupShotTabs() {
    document.querySelectorAll('[data-tabs]').forEach(function (box) {
      var btns = box.querySelectorAll('[data-tab]');
      var panels = box.querySelectorAll('[data-panel]');
      btns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var id = btn.getAttribute('data-tab');
          btns.forEach(function (b) { b.setAttribute('aria-selected', b === btn ? 'true' : 'false'); });
          panels.forEach(function (p) { p.hidden = p.getAttribute('data-panel') !== id; });
          syncVideos(box, true);
          var row = btn.parentNode;
          if (row.scrollWidth > row.clientWidth) row.scrollTo({ left: btn.offsetLeft - row.clientWidth / 2 + btn.offsetWidth / 2, behavior: 'smooth' });
        });
      });
    });
  }

  // 演示录屏：只播放当前分页里、并且滚进视口的那一段；减弱动态效果时不自动播放，改为显示控制条
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function syncVideos(box, restart) {
    box.querySelectorAll('video').forEach(function (v) {
      var panel = v.closest('[data-panel]');
      var show = !(panel && panel.hidden) && box.dataset.inView === '1' && !reduceMotion;
      if (show) {
        if (restart) v.currentTime = 0;
        var p = v.play();
        if (p && p.catch) p.catch(function () { v.controls = true; });
      } else {
        v.pause();
      }
    });
  }

  function setupVideos() {
    var boxes = Array.prototype.filter.call(document.querySelectorAll('[data-tabs]'), function (b) { return b.querySelector('video'); });
    if (!boxes.length) return;
    if (reduceMotion) { boxes.forEach(function (b) { b.querySelectorAll('video').forEach(function (v) { v.controls = true; }); }); return; }
    if (!('IntersectionObserver' in window)) { boxes.forEach(function (b) { b.dataset.inView = '1'; syncVideos(b, false); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.dataset.inView = entry.isIntersecting ? '1' : '0';
        syncVideos(entry.target, false);
      });
    }, { threshold: 0.35 });
    boxes.forEach(function (b) { io.observe(b); });
  }

  // 文档页目录：滚动时高亮当前章节，手机上把高亮项滚进可视区
  function setupToc() {
    var toc = document.querySelector('.toc');
    if (!toc || !('IntersectionObserver' in window)) return;
    var links = Array.prototype.slice.call(toc.querySelectorAll('a[href^="#"]'));
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var current = null;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var a = map[entry.target.id];
        if (!a || a === current) return;
        if (current) current.classList.remove('active');
        current = a;
        a.classList.add('active');
        if (toc.scrollWidth > toc.clientWidth) {
          toc.scrollTo({ left: a.offsetLeft - 24, behavior: 'smooth' });
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    Object.keys(map).forEach(function (id) { var el = document.getElementById(id); if (el) io.observe(el); });
  }

  // 旧域名访问时提示迁移（旧域名不能整站跳转：老版本客户端还在用它的授权接口）
  function legacyDomainNotice() {
    if (!/dpdns\.org$/.test(location.hostname)) return;
    var bar = document.createElement('div');
    bar.className = 'notice-bar';
    bar.innerHTML = '官网已迁移到 <a href="https://aurasnapapp.com' + location.pathname + '">aurasnapapp.com</a>，请更新收藏。';
    document.body.insertBefore(bar, document.body.firstChild);
  }

  function setYear() {
    document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupNav();
    setupReveal();
    setupToc();
    setupShotTabs();
    setupVideos();
    loadRelease();
    legacyDomainNotice();
    setYear();
  });
})();
