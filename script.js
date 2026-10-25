/**
 * නැණපහන පොත් මැඳුර සහ ලිපිද්‍රව්‍ය මධ්‍යස්ථානය
 * NENAPAHANA BOOKSHOP & STATIONERY SUPERSTORE
 * Digital Store Menu & Price List System
 * Engineered by SL Developer
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dark / Light Mode Toggle
  initThemeToggle();

  // 2. Digital Menu Category Navigation & Live Search
  initMenuNavigationAndSearch();

  // 3. Direct Item WhatsApp Inquiry System
  initWhatsAppInquiry();

  // 4. QR Code Showcase & Share Modal
  initQrModal();

  // 5. School Booklist Photo Service
  initBooklistService();

  // 6. Header Scroll Polish
  initHeaderScroll();
});

/* --------------------------------------------------------------------------
   1. THEME TOGGLE (Dark / Light Mode)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const root = document.documentElement;
  const toggleBtn = document.getElementById('themeToggleBtn');
  const toggleText = document.getElementById('themeToggleText');

  const savedTheme = localStorage.getItem('nenapahana_superstore_theme') || 'dark';
  applyTheme(savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const current = root.getAttribute('data-theme-mode') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('nenapahana_superstore_theme', next);
    });
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme-mode', theme);
    if (toggleText) {
      toggleText.textContent = theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
    }
  }
}

/* --------------------------------------------------------------------------
   2. DIGITAL MENU CATEGORY NAVIGATION & LIVE SEARCH
   -------------------------------------------------------------------------- */
function initMenuNavigationAndSearch() {
  const departmentLinks = document.querySelectorAll('.department-link');
  const menuSections = document.querySelectorAll('.menu-section');
  const itemCards = document.querySelectorAll('.menu-item-card');
  const searchInput = document.getElementById('storeSearchInput');
  const searchResultNotice = document.getElementById('searchResultNotice');
  const searchKeyword = document.getElementById('searchKeyword');
  const searchCount = document.getElementById('searchCount');

  // Department Category Filter Links
  departmentLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const category = link.getAttribute('data-category');
      if (!category) return; // Allow normal anchor jump for #branches or #printServices

      e.preventDefault();
      departmentLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      if (searchInput) {
        searchInput.value = '';
      }
      if (searchResultNotice) {
        searchResultNotice.style.display = 'none';
      }

      filterByCategory(category);

      // Smooth scroll to catalog
      const catalogEl = document.getElementById('catalog');
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  function filterByCategory(category) {
    menuSections.forEach(section => {
      const sectionCategory = section.getAttribute('data-menu-category');
      if (category === 'all' || sectionCategory === category) {
        section.style.display = 'block';
        // Reset item cards inside this section
        const cards = section.querySelectorAll('.menu-item-card');
        cards.forEach(c => c.style.display = 'flex');
      } else {
        section.style.display = 'none';
      }
    });
  }

  // Live Instant Search across all Items
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();

      if (query === '') {
        // Reset to currently active category
        const activeLink = document.querySelector('.department-link.active');
        const activeCat = activeLink ? activeLink.getAttribute('data-category') : 'all';
        filterByCategory(activeCat || 'all');
        if (searchResultNotice) searchResultNotice.style.display = 'none';
        return;
      }

      // If searching, show all sections and filter cards individually
      let matchedCount = 0;

      menuSections.forEach(section => {
        let sectionHasMatches = false;
        const cards = section.querySelectorAll('.menu-item-card');

        cards.forEach(card => {
          const name = card.querySelector('.menu-item-name')?.textContent.toLowerCase() || '';
          const brand = card.querySelector('.menu-item-brand')?.textContent.toLowerCase() || '';
          const desc = card.querySelector('.menu-item-desc')?.textContent.toLowerCase() || '';
          const price = card.querySelector('.menu-item-price')?.textContent.toLowerCase() || '';

          if (name.includes(query) || brand.includes(query) || desc.includes(query) || price.includes(query)) {
            card.style.display = 'flex';
            sectionHasMatches = true;
            matchedCount++;
          } else {
            card.style.display = 'none';
          }
        });

        if (sectionHasMatches) {
          section.style.display = 'block';
        } else {
          section.style.display = 'none';
        }
      });

      // Show search notice
      if (searchResultNotice && searchKeyword && searchCount) {
        searchResultNotice.style.display = 'block';
        searchKeyword.textContent = query;
        searchCount.textContent = matchedCount;
      }
    });
  }

  // Smooth mousewheel horizontal scroll for departments bar
  const deptBar = document.querySelector('.departments-bar');
  if (deptBar) {
    deptBar.addEventListener('wheel', (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        deptBar.scrollLeft += e.deltaY * 0.8;
      }
    }, { passive: false });
  }
}

/* --------------------------------------------------------------------------
   3. DIRECT ITEM WHATSAPP INQUIRY SYSTEM
   -------------------------------------------------------------------------- */
function initWhatsAppInquiry() {
  const inquireBtns = document.querySelectorAll('.btn-inquire-item');
  const storePhone = '94779876543';

  inquireBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const itemName = btn.getAttribute('data-item-name') || 'භාණ්ඩය';
      const itemPrice = btn.getAttribute('data-item-price') || '';

      const message = `හෙලෝ නැණපහන පොත් මැඳුර, මට ඔබගේ Digital Menu එකේ තිබූ "${itemName}" (${itemPrice}) පිළිබඳ වැඩිදුර විස්තර / ලබාගත හැකි ආකාරය දැනගැනීමට අවශ්‍යයි.`;
      const waUrl = `https://wa.me/${storePhone}?text=${encodeURIComponent(message)}`;

      window.open(waUrl, '_blank');
    });
  });
}

/* --------------------------------------------------------------------------
   4. FRONT DESK QR CODE SHOWCASE & WHATSAPP SHARE CENTER
   -------------------------------------------------------------------------- */
function initQrModal() {
  const qrModal = document.getElementById('qrModal');
  const openQrBtn = document.getElementById('openQrModalBtn');
  const openHeroQrModalBtn = document.getElementById('openHeroQrModalBtn');
  const copyLinkBtn = document.getElementById('copyMenuLinkBtn');
  const modalPrintStandBtn = document.getElementById('modalPrintStandBtn');
  const modalDownloadQrBtn = document.getElementById('modalDownloadQrBtn');
  const modalShareWhatsappBtn = document.getElementById('modalShareWhatsappBtn');
  const heroShareWhatsappBtn = document.getElementById('heroShareWhatsappBtn');

  const presetWifiBtn = document.getElementById('presetWifiBtn');
  const presetLiveBtn = document.getElementById('presetLiveBtn');
  const customQrUrlInput = document.getElementById('customQrUrlInput');
  const heroQrImg = document.getElementById('heroQrImg');
  const modalQrImg = document.getElementById('modalQrImg');

  // Default target URL (Live public HTTPS URL so ANY customer can scan on phone/4G/5G)
  let targetUrl = 'https://kawyadissanayaka.github.io/book-shop/';

  // If already hosted on a real custom domain (e.g. .lk or .com), use that domain by default
  if (!window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')) {
    targetUrl = window.location.href.split('#')[0];
    if (customQrUrlInput) customQrUrlInput.value = targetUrl;
  }

  function updateQrDisplay(url) {
    targetUrl = url;
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=8&data=${encodeURIComponent(url)}`;
    if (heroQrImg) heroQrImg.src = qrApiUrl;
    if (modalQrImg) modalQrImg.src = qrApiUrl;
  }

  // Initial QR setup
  updateQrDisplay(targetUrl);

  // Preset Buttons (Dynamic handler for any preset pill)
  document.querySelectorAll('.qr-preset-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.qr-preset-pill').forEach(b => b.classList.remove('active'));
      pill.classList.add('active');
      const url = pill.getAttribute('data-url');
      if (url) {
        if (customQrUrlInput) customQrUrlInput.value = url;
        updateQrDisplay(url);
        showToast(`🌐 QR Link එක යාවත්කාලීන විය: ${url}`);
      }
    });
  });

  // Custom URL Input live change
  if (customQrUrlInput) {
    customQrUrlInput.addEventListener('input', (e) => {
      const url = e.target.value.trim();
      if (url) {
        document.querySelectorAll('.qr-preset-pill').forEach(b => b.classList.remove('active'));
        updateQrDisplay(url);
      }
    });
  }

  // Open QR Modal Triggers
  const openTriggers = [
    openQrBtn,
    openHeroQrModalBtn,
    document.getElementById('openTopQrModalBtn'),
    document.getElementById('footerOpenQrModalBtn')
  ].filter(Boolean);

  openTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (qrModal) qrModal.classList.add('active');
    });
  });

  // WhatsApp Share Trigger
  function triggerWhatsAppShare() {
    const shareText = `🪔 *නැණපහන පොත් මැඳුර සහ ලිපිද්‍රව්‍ය - ඩිජිටල් මිල දර්ශකය*\n(Nenapahana Bookshop Digital Store Menu)\n\nඅපගේ පොත්හලේ ඇති සියලුම ලියන පොත්, CR පොත්, පෑන්, පැන්සල්, ළමා කතා, නවකතා, සඟරා හා මුද්‍රණ සේවාවන්හි නවතම මිල ගණන් (Price List) ඔබගේ දුරකථනයෙන්ම පහසුවෙන් බලාගැනීමට මෙම සබැඳියට පිවිසෙන්න:\n\n👉 ${targetUrl}\n\n📞 ක්ෂණික ඇමතුම්: 011 258 4400\n💬 WhatsApp: 077 987 6543\n📍 කොළඹ බම්බලපිටිය • මහනුවර • කුරුණෑගල`;

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank');
  }

  const whatsappTriggers = [
    modalShareWhatsappBtn,
    heroShareWhatsappBtn,
    document.getElementById('headerShareWhatsappBtn')
  ].filter(Boolean);

  whatsappTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      triggerWhatsAppShare();
    });
  });

  // Print Counter Stand
  if (modalPrintStandBtn) {
    modalPrintStandBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Download QR Code as PNG
  if (modalDownloadQrBtn) {
    modalDownloadQrBtn.addEventListener('click', () => {
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&margin=10&data=${encodeURIComponent(targetUrl)}`;
      showToast('⏳ QR Code PNG ගොනුව සකසමින් පවතී...');

      fetch(qrApiUrl)
        .then(res => res.blob())
        .then(blob => {
          const blobUrl = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'nenapahana-digital-menu-qr.png';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(blobUrl);
          showToast('💾 QR Image (PNG) සාර්ථකව බාගත (Download) විය!');
        })
        .catch(() => {
          window.open(qrApiUrl, '_blank');
        });
    });
  }

  // Copy Menu Link
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(targetUrl).then(() => {
        showToast(`📋 Link එක Copy කරගන්නා ලදී: ${targetUrl}`);
      }).catch(() => {
        showToast(`📋 ${targetUrl}`);
      });
    });
  }

  // Close Modals on backdrop click or close button
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('modal-close-btn')) {
        modal.classList.remove('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5. SCHOOL BOOKLIST PHOTO SERVICE
   -------------------------------------------------------------------------- */
function initBooklistService() {
  const booklistModal = document.getElementById('booklistModal');
  const triggers = document.querySelectorAll('.trigger-booklist-modal');
  const booklistForm = document.getElementById('booklistForm');
  const storePhone = '94779876543';

  triggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (booklistModal) booklistModal.classList.add('active');
    });
  });

  if (booklistForm) {
    booklistForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const parentName = document.getElementById('parentName')?.value.trim() || '';
      const parentPhone = document.getElementById('parentPhone')?.value.trim() || '';
      const grade = document.getElementById('studentGrade')?.value || '';
      const notes = document.getElementById('booklistNotes')?.value.trim() || '';

      const message = `*පාසල් පොත් ලැයිස්තු ඉල්ලීම (School Booklist)*\n\n` +
        `👤 මව්පියන්ගේ නම: ${parentName}\n` +
        `📞 දුරකථනය: ${parentPhone}\n` +
        `🎓 ශ්‍රේණිය: ${grade}\n` +
        `📝 සටහන්: ${notes || 'නැත'}\n\n` +
        `(පොත් ලැයිස්තුවේ ඡායාරූපය පහතින් අමුණන්න)`;

      const waUrl = `https://wa.me/${storePhone}?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank');

      if (booklistModal) booklistModal.classList.remove('active');
      showToast('📸 WhatsApp වෙත යොමු කෙරේ! පොත් ලැයිස්තුවේ Photo එක Attach කරන්න.');
      booklistForm.reset();
    });
  }
}

/* --------------------------------------------------------------------------
   6. HEADER SCROLL POLISH & GENERAL TOAST
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.getElementById('siteHeader');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.25)';
      } else {
        header.style.boxShadow = 'none';
      }
    });
  }
}

function showToast(text) {
  const toast = document.getElementById('generalToast');
  const toastMsg = document.getElementById('toastMessage');
  if (!toast) return;

  if (toastMsg) toastMsg.textContent = text;
  toast.style.display = 'flex';
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.style.display = 'none';
    }, 400);
  }, 4000);
}
