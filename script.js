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
   4. QR CODE SHOWCASE & SHARE MODAL
   -------------------------------------------------------------------------- */
function initQrModal() {
  const openQrBtn = document.getElementById('openQrModalBtn');
  const shareMenuBtn = document.getElementById('shareMenuBtn');
  const qrModal = document.getElementById('qrModal');
  const copyLinkBtn = document.getElementById('copyMenuLinkBtn');

  if (openQrBtn && qrModal) {
    openQrBtn.addEventListener('click', (e) => {
      e.preventDefault();
      qrModal.classList.add('active');
    });
  }

  if (shareMenuBtn && qrModal) {
    shareMenuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      qrModal.classList.add('active');
    });
  }

  // Copy Menu Link
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', () => {
      const url = window.location.href.split('#')[0];
      navigator.clipboard.writeText(url).then(() => {
        showToast('📋 ඩිජිටල් මෙනුවේ Link එක Copy කරගන්නා ලදී!');
        if (qrModal) qrModal.classList.remove('active');
      }).catch(() => {
        showToast('📋 https://nenapahana-books.lk');
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
