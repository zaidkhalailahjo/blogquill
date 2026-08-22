/**
 * Interactive Script for Jordan Robotics Strategy Article
 * Supports dynamic logo switching for Dark/Light mode
 */

const NAVY_LOGO_URL = 'https://uploads.onecompiler.io/43n8uttmw/43naswvmw/New-Project-9-1-1.png';
const WHITE_LOGO_URL = 'https://uploads.onecompiler.io/43n8uttmw/1787401723231/unnamed%20(2).png';

document.addEventListener('DOMContentLoaded', () => {
  initThemeAndLogos();
  initReadingProgressBar();
  initFontControls();
  initSocialSharing();
  initBookmarks();
});

/* 1. Theme Management & Logo Switching */
function initThemeAndLogos() {
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const headerLogo = document.getElementById('header-site-logo');
  const footerLogo = document.getElementById('footer-site-logo');

  // Check saved theme or system preference
  const savedTheme = localStorage.getItem('site_theme') || 'light';
  applyTheme(savedTheme);

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('site_theme', next);
    });
  });

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    // In Header: Use White logo in dark theme or dark header, Navy in light theme
    // Since our navbar has a sleek dark aesthetic like reference design, White logo looks stunning on both,
    // but in light theme we can switch or display appropriately.
    if (headerLogo) {
      headerLogo.src = WHITE_LOGO_URL;
    }
    if (footerLogo) {
      footerLogo.src = WHITE_LOGO_URL;
    }

    // Update icons
    document.querySelectorAll('.theme-icon-slot').forEach(slot => {
      if (theme === 'dark') {
        slot.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>`;
      } else {
        slot.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>`;
      }
    });
  }
}

/* 2. Reading Progress Bar */
function initReadingProgressBar() {
  const bar = document.getElementById('reading-bar');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (total <= 0) return;
    const progress = Math.min((window.scrollY / total) * 100, 100);
    bar.style.width = `${progress}%`;
  }, { passive: true });
}

/* 3. Font Size Controls */
function initFontControls() {
  const fontSizes = ['sm', 'md', 'lg', 'xl'];
  let currentIndex = 1; // 'md' default

  document.querySelectorAll('.font-size-cycle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % fontSizes.length;
      const selected = fontSizes[currentIndex];
      fontSizes.forEach(s => document.body.classList.remove(`font-${s}`));
      document.body.classList.add(`font-${selected}`);
      showToastNotice(`تم ضبط حجم الخط: ${selected.toUpperCase()}`);
    });
  });
}

/* 4. Social Sharing */
function initSocialSharing() {
  const url = window.location.href;
  const title = document.title;

  document.querySelectorAll('.share-btn-wa').forEach(b => {
    b.addEventListener('click', () => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`, '_blank'));
  });

  document.querySelectorAll('.share-btn-tw').forEach(b => {
    b.addEventListener('click', () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank'));
  });

  document.querySelectorAll('.share-btn-in').forEach(b => {
    b.addEventListener('click', () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank'));
  });

  document.querySelectorAll('.share-btn-fb').forEach(b => {
    b.addEventListener('click', () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank'));
  });

  document.querySelectorAll('.share-btn-cp').forEach(b => {
    b.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(url);
        showToastNotice('تم نسخ رابط المقال بنجاح!');
      } catch (err) {
        showToastNotice('رابط المقال: ' + url);
      }
    });
  });
}

/* 5. Bookmarks */
function initBookmarks() {
  const bookmarkBtns = document.querySelectorAll('.bookmark-btn');
  let saved = localStorage.getItem('article_bookmarked') === 'true';

  updateBookmarkUI(saved);

  bookmarkBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      saved = !saved;
      localStorage.setItem('article_bookmarked', saved ? 'true' : 'false');
      updateBookmarkUI(saved);
      showToastNotice(saved ? 'تم حفظ المقال في المفضلة' : 'تمت إزالة المقال من المفضلة');
    });
  });

  function updateBookmarkUI(isSaved) {
    bookmarkBtns.forEach(btn => {
      btn.classList.toggle('saved', isSaved);
    });
  }
}

function showToastNotice(msg) {
  let toast = document.getElementById('site-toast-box');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'site-toast-box';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00a3ff" stroke-width="2.5"><path d="M20 6L9 17l-5-5"></path></svg>
    <span>${msg}</span>
  `;
  toast.classList.add('active');
  setTimeout(() => toast.classList.remove('active'), 3200);
}
