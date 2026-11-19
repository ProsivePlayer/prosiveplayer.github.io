/* Lichtmoos Games – Skript · © 2026 Lichtmoos Games GmbH
   Demo: Es gibt kein Backend. Gespeichert werden nur die Cookie-Auswahl (localStorage, 6 Monate)
   und der Demo-Warenkorb (sessionStorage, bis Sitzungsende). */
(function () {
  'use strict';

  var KEY = 'gl_consent';
  var MAXAGE = 180 * 24 * 60 * 60 * 1000; /* 6 Monate */
  var banner = document.getElementById('cookie-banner');
  var live = document.getElementById('live-status');
  var opener = document.getElementById('cookie-settings');
  var fromFooter = false;

  function readConsent() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY));
      if (v && typeof v.t === 'number' && Date.now() - v.t < MAXAGE) { return v; }
    } catch (e) { /* Speicher nicht verfügbar */ }
    return null;
  }

  function saveConsent(statistik) {
    try {
      localStorage.setItem(KEY, JSON.stringify({ t: Date.now(), statistik: !!statistik }));
    } catch (e) { /* Auswahl gilt dann nur für diese Seite */ }
  }

  if (banner) {
    if (!readConsent()) { banner.hidden = false; }

    banner.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-consent]');
      if (!btn) { return; }
      var alle = btn.getAttribute('data-consent') === 'alle';
      saveConsent(alle);
      banner.hidden = true;
      if (live) {
        live.textContent = alle
          ? 'Ihre Auswahl wurde gespeichert: notwendige Cookies und Statistik.'
          : 'Ihre Auswahl wurde gespeichert: nur notwendige Cookies.';
      }
      if (fromFooter && opener) { opener.focus(); }
      fromFooter = false;
    });
  }

  if (opener && banner) {
    opener.addEventListener('click', function () {
      fromFooter = true;
      banner.hidden = false;
      banner.focus();
      banner.scrollIntoView({ block: 'start' });
    });
  }

  /* Demo-Warenkorb: wird nur bei Klick auf „Kaufen“ angelegt (technisch notwendig) */
  document.querySelectorAll('[data-kaufen]').forEach(function (a) {
    a.addEventListener('click', function () {
      try { sessionStorage.setItem('gl_cart', JSON.stringify({ produkt: 'nebelkraehe', menge: 1 })); } catch (e) { /* ignorieren */ }
    });
  });

  function lizenzschluessel() {
    var abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var out = [];
    var buf = new Uint8Array(12);
    (window.crypto || window.msCrypto).getRandomValues(buf);
    for (var g = 0; g < 3; g++) {
      var s = '';
      for (var i = 0; i < 4; i++) { s += abc.charAt(buf[g * 4 + i] % abc.length); }
      out.push(s);
    }
    return 'NK-' + out.join('-');
  }

  /* Gemockte Formulare (Kasse, Kontakt): nichts wird gesendet */
  document.querySelectorAll('form[data-mock]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ziel = document.getElementById(form.getAttribute('data-ergebnis'));
      if (!ziel) { return; }
      var key = ziel.querySelector('[data-key]');
      if (key) { key.textContent = lizenzschluessel(); }
      form.reset();
      form.hidden = true;
      ziel.hidden = false;
      var h = ziel.querySelector('h2, h3');
      if (h) { h.setAttribute('tabindex', '-1'); h.focus(); }
    });
  });
}());
