// Sharing buttons behavior
(function(){
  function encode(v){return encodeURIComponent(v||'');}

  function openPopup(url, title, w=600, h=500){
    const left = (screen.width/2) - (w/2);
    const top = (screen.height/2) - (h/2);
    window.open(url, title, `toolbar=0,status=0,width=${w},height=${h},top=${top},left=${left}`);
  }

  function getMeta(name){
    let el = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
    return el ? el.getAttribute('content') : '';
  }

  function handleClick(e){
    const btn = e.currentTarget;
    const service = btn.dataset.service;
    const title = document.title || getMeta('og:title') || '';
    const desc = getMeta('description') || getMeta('og:description') || '';
    const url = (getMeta('og:url') || location.href);
    const image = getMeta('og:image') || '';

    let shareUrl = '';
    switch(service){
      case 'twitter':
      case 'x':
        shareUrl = `https://twitter.com/intent/tweet?text=${encode(title)}&url=${encode(url)}&via=mo_zekry`;
        openPopup(shareUrl, 'Share on Twitter');
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encode(url)}`;
        openPopup(shareUrl, 'Share on Facebook');
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encode(url)}`;
        openPopup(shareUrl, 'Share on LinkedIn');
        break;
      case 'hackernews':
        shareUrl = `https://news.ycombinator.com/submitlink?u=${encode(url)}&t=${encode(title)}`;
        openPopup(shareUrl, 'Share on Hacker News');
        break;
      case 'reddit':
        shareUrl = `https://www.reddit.com/submit?url=${encode(url)}&title=${encode(title)}`;
        openPopup(shareUrl, 'Share on Reddit');
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encode(title + ' ' + url)}`;
        window.location.href = shareUrl;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encode(title)}&body=${encode(desc + '\n\n' + url)}`;
        window.location.href = shareUrl;
        break;
      case 'copy':
        if (navigator.clipboard){
          navigator.clipboard.writeText(url).then(()=>{
            btn.classList.add('copied');
            const old = btn.innerHTML;
            btn.innerHTML = '✅ ' + (btn.getAttribute('title') || 'Copied');
            setTimeout(()=>{ btn.classList.remove('copied'); btn.innerHTML = old; }, 1200);
          });
        }
        break;
      default:
        console.warn('Unknown share service', service);
    }
  }

  document.addEventListener('DOMContentLoaded', function(){
    document.querySelectorAll('.sharing-buttons .share-btn').forEach(function(btn){
      btn.addEventListener('click', handleClick);
      // Make keyboard-friendly
      btn.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); } });
    });
  });
})();
