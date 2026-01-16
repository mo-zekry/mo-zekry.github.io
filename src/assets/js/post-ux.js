// Show loading overlay utility
function showThemeLoadingOverlay() {
  const overlay = document.getElementById('theme-loading-overlay');
  if (overlay) {
    overlay.style.display = 'flex';
    overlay.setAttribute('aria-hidden', 'false');
  }
}
// Add loading overlay to language switcher
document.addEventListener('DOMContentLoaded', function() {
  const langToggle = document.getElementById('lang-toggle');
  if (langToggle) {
    langToggle.addEventListener('click', function() {
      showThemeLoadingOverlay();
    }, { capture: true });
  }
});
// Draw a minimal, developer-focused horizontal logo into a canvas
// Usage: add a container element where you want the logo, e.g.:
//   <div id="logo-root" class="site-brand"></div>
// then include the script and call: renderLogo(document.getElementById('logo-root'))

(function(){
  function sizeCanvasForDPR(canvas, w, h) {
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
  }

  function getColor(varName, fallback) {
    try {
      const root = getComputedStyle(document.documentElement);
      const v = root.getPropertyValue(varName).trim();
      return v || fallback;
    } catch (e) {
      return fallback;
    }
  }

function drawIcon(ctx, x, y, size, accent, fg) {
    // Minimal, editorial icon inspired by Markdown and code blocks
    // Subtle geometric mark that hints at MZ initials
    
    const pad = size * 0.18;
    const center = size / 2;
    
    // Draw a clean bracket-like symbol that subtly forms M+Z
    // Using monospace-inspired geometric shapes
    ctx.strokeStyle = fg;
    ctx.lineWidth = Math.max(1.5, size * 0.09);
    ctx.lineCap = 'square';
    ctx.lineJoin = 'miter';
    
    // Left bracket forming 'M' shape
    const leftX = x + pad;
    const topY = y + pad;
    const botY = y + size - pad;
    const midY = y + center;
    
    ctx.beginPath();
    // Outer left stroke
    ctx.moveTo(leftX, topY);
    ctx.lineTo(leftX, botY);
    // Inner peak (M shape)
    ctx.moveTo(leftX, topY);
    ctx.lineTo(leftX + size * 0.15, midY);
    ctx.lineTo(leftX + size * 0.30, topY);
    ctx.stroke();
    
    // Right angle forming 'Z' diagonal with brackets
    const rightX = x + size - pad;
    ctx.strokeStyle = accent;
    ctx.lineWidth = Math.max(1.5, size * 0.08);
    
    ctx.beginPath();
    // Top horizontal
    ctx.moveTo(rightX - size * 0.28, topY);
    ctx.lineTo(rightX, topY);
    // Diagonal (Z)
    ctx.moveTo(rightX - size * 0.05, topY + size * 0.05);
    ctx.lineTo(rightX - size * 0.28, botY - size * 0.05);
    // Bottom horizontal
    ctx.moveTo(rightX - size * 0.28, botY);
    ctx.lineTo(rightX, botY);
    ctx.stroke();
    
    // Subtle code-block corner brackets (markdown hint)
    ctx.strokeStyle = fg;
    ctx.globalAlpha = 0.15;
    ctx.lineWidth = Math.max(1, size * 0.06);
    const cornerSize = size * 0.12;
    
    // Top-left corner
    ctx.beginPath();
    ctx.moveTo(x + pad * 0.5, y + pad * 0.5 + cornerSize);
    ctx.lineTo(x + pad * 0.5, y + pad * 0.5);
    ctx.lineTo(x + pad * 0.5 + cornerSize, y + pad * 0.5);
    ctx.stroke();
    
    // Bottom-right corner
    ctx.beginPath();
    ctx.moveTo(x + size - pad * 0.5 - cornerSize, y + size - pad * 0.5);
    ctx.lineTo(x + size - pad * 0.5, y + size - pad * 0.5);
    ctx.lineTo(x + size - pad * 0.5, y + size - pad * 0.5 - cornerSize);
    ctx.stroke();
    
    ctx.globalAlpha = 1.0;
  }

  function roundRectPath(ctx, x, y, w, h, r) {
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawText(ctx, x, y, name, fg, accent) {
    // name: author text
    ctx.fillStyle = fg;
    // Use a custom font for the author name
    const fontSize = 14;
    ctx.font = `700 ${fontSize}px 'Quintessential', 'Montserrat', 'Inter', sans-serif`;
    ctx.textBaseline = 'middle';
    ctx.fillText(name, x, y);

    // subtle accent underline dot after the name for identity
    const metrics = ctx.measureText(name);
    const dotX = x + metrics.width + 8;
    const dotY = y;
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(dotX, dotY, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  function clear(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
  }

  function renderLogo(root, opts) {
    opts = opts || {};
    const name = opts.name || 'Mohamed Zekry';
    const height = opts.height || 36;
    const padding = opts.padding || 8;
    const iconSize = Math.round(height - padding * 0.8);

    // determine colors from CSS variables for theme compatibility
    // prefer explicit --accent if provided, otherwise fall back to --link
    const fg = getColor('--text', '#0f1720') || '#0f1720';
    const accent = getColor('--accent', '') || getColor('--link', '#3fc1c9') || '#3fc1c9';

    // container
    if (!root) return;
    // remove existing canvas if any
    const existing = root.querySelector('canvas.logo-canvas');
    if (existing) existing.remove();

    const canvas = document.createElement('canvas');
    canvas.className = 'logo-canvas';
    canvas.style.display = 'inline-block';
    canvas.style.verticalAlign = 'middle';

    // measure text to compute width
    const tmp = document.createElement('canvas');
    const tctx = sizeCanvasForDPR(tmp, 300, height);
    tctx.font = `600 14px Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial`;
    const metrics = tctx.measureText(name);
    const textWidth = Math.ceil(metrics.width);
    const totalW = Math.ceil(padding + iconSize + 8 + textWidth + padding);

    const ctx = sizeCanvasForDPR(canvas, totalW, height);

    clear(ctx, totalW, height);

    // background is transparent; draw icon
    const iconX = padding * 0.5;
    const iconY = (height - iconSize) / 2;
    drawIcon(ctx, iconX, iconY, iconSize, accent, fg);

    // draw name text
    const textX = iconX + iconSize + 8;
    const textY = height / 2;
    drawText(ctx, textX, textY, name, fg, accent);

    // attach
    root.insertBefore(canvas, root.firstChild);
    return canvas;
  }

  // auto-render when a container with id `logo-root` exists
  document.addEventListener('DOMContentLoaded', function(){
    const root = document.getElementById('logo-root') || document.querySelector('.site-brand');
    if (root) {
      renderLogo(root, {});

      // Re-render the logo when theme changes (data-theme attribute on <html>)
      const docEl = document.documentElement;
      const mo = new MutationObserver((entries) => {
        for (const e of entries) {
          if (e.type === 'attributes' && e.attributeName === 'data-theme') {
            // Show loading overlay before reload
            showThemeLoadingOverlay();
            setTimeout(() => {
              location.reload();
            }, 200);
          }
        }
      });
      mo.observe(docEl, { attributes: true, attributeFilter: ['data-theme'] });

      // re-render on resize / DPR change to keep canvas crisp
      let dpr = window.devicePixelRatio || 1;
      window.addEventListener('resize', () => renderLogo(root, {}));
      window.matchMedia(`(resolution: ${dpr}dppx)`).addEventListener?.('change', () => renderLogo(root, {}));
    }
  });

  // Back-to-top button: smooth scroll + show/hide on scroll
  document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    // initial style
    btn.style.transition = 'opacity 0.18s ease, transform 0.18s ease';
    btn.style.opacity = '0';
    btn.style.pointerEvents = 'none';

    function show() {
      btn.style.opacity = '1';
      btn.style.pointerEvents = 'auto';
      btn.style.transform = 'translateY(0)';
    }
    function hide() {
      btn.style.opacity = '0';
      btn.style.pointerEvents = 'none';
      btn.style.transform = 'translateY(6px)';
    }

    function onScroll() {
      if (window.scrollY > 300) show(); else hide();
    }

    // click -> smooth scroll to top
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // initialize and bind
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  });

  // Mobile nav toggle: accessible show/hide
  document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const siteNav = document.getElementById('site-nav') || document.querySelector('.site-nav');
    if (!navToggle || !siteNav) return;

    navToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      const open = siteNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Close when clicking outside the nav
    document.addEventListener('click', function(e) {
      if (!siteNav.contains(e.target) && !navToggle.contains(e.target)) {
        siteNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close when a nav link is tapped
    siteNav.querySelectorAll('a').forEach(a => a.addEventListener('click', function(){
      siteNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }));

    // Close if viewport enlarges
    window.addEventListener('resize', function(){
      if (window.innerWidth > 600) {
        siteNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    }, { passive: true });
  });

  // expose to global for manual use
  window.renderLogo = renderLogo;
})();