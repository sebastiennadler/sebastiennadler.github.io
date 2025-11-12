// charge et injecte nav-snippet.html dans chaque <nav class="navbar"> puis initialise le comportement
document.addEventListener('DOMContentLoaded', function () {
  var candidates = [
    'nav-snippet.html',
    './nav-snippet.html',
    '../nav-snippet.html',
    '../../nav-snippet.html',
    '/nav-snippet.html'
  ];

  function tryFetchList(list) {
    return list.reduce(function(prev, path){
      return prev.catch(function(){ return fetch(path); });
    }, Promise.reject());
  }

  tryFetchList(candidates)
    .then(function (r) {
      if (!r || !r.ok) throw new Error('Nav snippet non trouvé');
      return r.text();
    })
    .then(function (html) {
      var parser = new DOMParser();
      var doc = parser.parseFromString(html, 'text/html');
      var newNav = doc.querySelector('nav');
      if (!newNav) return;
      document.querySelectorAll('nav.navbar').forEach(function (placeholder) {
        var clone = newNav.cloneNode(true);
        placeholder.replaceWith(clone);
        initNavbar(clone);
      });
    })
    .catch(function (err) {
      console.warn('Impossible de charger nav-snippet.html :', err);
    });

  function initNavbar(navEl) {
    var menuBtn = navEl.querySelector('#menu-toggle') || navEl.querySelector('.hamburger');
    var navLinks = navEl.querySelector('.nav-links');
    if (!menuBtn || !navLinks) return;

    menuBtn.setAttribute('aria-expanded', 'false');

    function openNav() {
      navLinks.classList.add('open', 'show');
      menuBtn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-open');
    }
    function closeNav() {
      navLinks.classList.remove('open', 'show');
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    }

    menuBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (navLinks.classList.contains('open') || navLinks.classList.contains('show')) closeNav();
      else openNav();
    });

    document.addEventListener('click', function (e) {
      if (window.matchMedia('(max-width:840px)').matches) {
        if ((navLinks.classList.contains('open') || navLinks.classList.contains('show')) && !navEl.contains(e.target) && e.target !== menuBtn) {
          closeNav();
        }
      }
    });

    window.addEventListener('resize', function () {
      navLinks.classList.remove('open', 'show');
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    });

    navEl.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
  }
});