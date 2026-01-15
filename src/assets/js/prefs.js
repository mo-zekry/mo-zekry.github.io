(function() {
  // Utility: detect language from path like /en/ or /ar/
  function pathLang() {
    const m = location.pathname.match(/^\/(en|ar)(?:\/|$)/);
    return m ? m[1] : null;
  }

  function setDocumentLang(lang) {
    if (!lang) return;
    document.documentElement.lang = lang === 'ar' ? 'ar' : 'en';
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  // Handle language toggle button and initialize document language
  document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('lang-toggle');

    function computeCurrent() {
      return pathLang() || document.documentElement.lang || (localStorage.getItem('lang') || 'en');
    }

    // Update document attributes from current lang
    const langInPath = pathLang();
    if (langInPath) {
      setDocumentLang(langInPath);
      localStorage.setItem('lang', langInPath);
    } else {
      const saved = localStorage.getItem('lang');
      if (saved) setDocumentLang(saved);
    }

    if (!toggle) return;

    // Set initial label: show the target language code (clicking will switch to it)
    const current = computeCurrent();
    const target = current === 'ar' ? 'EN' : 'AR';
    // preserve any emoji in the button; rewrite inner HTML to keep emoji + label
    toggle.innerHTML = (toggle.querySelector('.emoji') ? toggle.querySelector('.emoji').outerHTML + ' ' : '') + target;
    toggle.setAttribute('data-current', current);

    toggle.addEventListener('click', async function(e) {
      e.preventDefault();
      const now = computeCurrent();
      const to = now === 'ar' ? 'en' : 'ar';

      const p = location.pathname;
      const m = p.match(/^\/(en|ar)(\/.*)?$/);

      // helper: check URL exists via HEAD
      async function urlExists(url) {
        try {
          const res = await fetch(url, { method: 'HEAD' });
          return res && res.ok;
        } catch (err) {
          return false;
        }
      }

      // Build candidate target paths
      let candidates = [];
      if (!m) {
        candidates.push('/' + to + '/');
      } else {
        const rest = (m[2] || '/');
        const slug = rest === '/' ? '' : rest.replace(/^\//, '').replace(/\/$/, '');

        if (!slug) {
          candidates.push('/' + to + '/');
        } else {
          // try same slug
          candidates.push('/' + to + '/' + slug + '/');
          // try slug with -ar suffix (common pattern for translated posts)
          candidates.push('/' + to + '/' + slug + '-ar/');
          // try removing -ar if present
          if (slug.endsWith('-ar')) candidates.push('/' + to + '/' + slug.replace(/-ar$/, '') + '/');
          // try index.html fallback
          candidates.push('/' + to + '/' + slug + '/index.html');
          // finally language root
          candidates.push('/' + to + '/');
        }
      }

      // find first candidate that exists
      let found = null;
      for (const c of candidates) {
        // avoid checking external origins
        const abs = new URL(c, location.origin).href;
        if (await urlExists(abs)) { found = c; break; }
      }

      const finalPath = found || ('/' + to + '/');
      localStorage.setItem('lang', to);
      location.href = finalPath;
    });
  });
})();
