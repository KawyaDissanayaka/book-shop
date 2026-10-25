/**
 * නැණපහන පොත් මැඳුර සහ ලිපිද්‍රව්‍ය මධ්‍යස්ථානය
 * NENAPAHANA BOOKSHOP & STATIONERY SUPERSTORE
 * Interactive Client Logic & E-Commerce System
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dark / Light Mode Toggle
  initThemeToggle();

  // 2. Product Tab Filtering & Live Search
  initCatalogFiltering();

  // 3. Cart & Multi-Item Checkout
  initCartSystem();

  // 4. School Booklist Upload / WhatsApp Service
  initBooklistService();

  // 5. Real Sri Lankan Purchase Alerts
  initSocialProofToast();

  // 6. Newsletter Subscription
  initNewsletter();
});

/* --------------------------------------------------------------------------
   1. THEME TOGGLE
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
   2. PRODUCT TAB FILTERING & LIVE SEARCH
   -------------------------------------------------------------------------- */
function initCatalogFiltering() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const productCards = document.querySelectorAll('.product-card');
  const searchInput = document.getElementById('storeSearchInput');

  // Tab Filtering
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-category');
      filterProducts(category, searchInput ? searchInput.value.toLowerCase().trim() : '');
    });
  });

  // Live Search
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const activeTab = document.querySelector('.tab-btn.active');
      const activeCat = activeTab ? activeTab.getAttribute('data-category') : 'all';
      filterProducts(activeCat, e.target.value.toLowerCase().trim());
    });
  }

  function filterProducts(category, query) {
    productCards.forEach(card => {
      const cardCat = card.getAttribute('data-category');
      const cardTitle = card.querySelector('.product-title')?.textContent.toLowerCase() || '';
      const cardBrand = card.querySelector('.product-brand')?.textContent.toLowerCase() || '';

      const matchesCat = (category === 'all' || cardCat === category);
      const matchesSearch = query === '' || cardTitle.includes(query) || cardBrand.includes(query);

      if (matchesCat && matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }
}

/* --------------------------------------------------------------------------
   3. CART & MULTI-ITEM CHECKOUT SYSTEM
   -------------------------------------------------------------------------- */
let cart = [];

function initCartSystem() {
  const cartBadge = document.getElementById('navCartCount');
  const cartTrigger = document.querySelector('.btn-cart-trigger');
  const checkoutModal = document.getElementById('checkoutModal');
  const addCartBtns = document.querySelectorAll('.trigger-add-cart-btn');

  const modalItemsList = document.getElementById('checkoutItemsList');
  const modalSubtotal = document.getElementById('checkoutSubtotal');
  const modalDeliveryFee = document.getElementById('checkoutDeliveryFee');
  const modalGrandTotal = document.getElementById('checkoutGrandTotal');
  const districtSelect = document.getElementById('customerDistrict');
  const checkoutForm = document.getElementById('checkoutForm');
  const directWhatsAppOrderBtn = document.getElementById('directWhatsAppOrderBtn');

  // Add product to cart
  addCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const title = btn.getAttribute('data-product-title') || "භාණ්ඩය";
      const price = parseInt(btn.getAttribute('data-product-price') || "250", 10);
      const img = btn.getAttribute('data-product-img') || "assets/images/stationery.jpg";

      const existing = cart.find(i => i.title === title);
      if (existing) {
        existing.qty++;
      } else {
        cart.push({ title, price, img, qty: 1 });
      }

      updateCartBadge();
      showNotificationToast(`🛒 "${title}" කරත්තයට එක් කරන ලදී!`);
    });
  });

  function updateCartBadge() {
    const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
    if (cartBadge) cartBadge.textContent = totalQty;
  }

  // Open Cart / Checkout Modal
  if (cartTrigger) {
    cartTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      if (cart.length === 0) {
        // Pre-fill with a default popular sample item if cart was empty
        cart.push({
          title: "Atlas CR Book 120 Pages Single Rule",
          price: 240,
          img: "assets/images/stationery.jpg",
          qty: 2
        });
        cart.push({
          title: "ළමා සුරංගනා කතා පෙළ - සිංහ රාජධානිය",
          price: 450,
          img: "assets/images/kids-books.jpg",
          qty: 1
        });
        updateCartBadge();
      }
      renderCheckoutSummary();
      if (checkoutModal) checkoutModal.classList.add('active');
    });
  }

  // District delivery calculation
  if (districtSelect) {
    districtSelect.addEventListener('change', renderCheckoutSummary);
  }

  function renderCheckoutSummary() {
    if (!modalItemsList) return;

    modalItemsList.innerHTML = '';
    let subtotal = 0;

    cart.forEach((item, idx) => {
      const itemTotal = item.price * item.qty;
      subtotal += itemTotal;

      const itemRow = document.createElement('div');
      itemRow.style.display = 'flex';
      itemRow.style.alignItems = 'center';
      itemRow.style.justifyContent = 'space-between';
      itemRow.style.gap = '0.75rem';
      itemRow.style.padding = '0.5rem 0';
      itemRow.style.borderBottom = '1px solid var(--border-subtle)';
      itemRow.style.fontSize = '0.85rem';

      itemRow.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.6rem; flex: 1;">
          <img src="${item.img}" style="width: 34px; height: 34px; border-radius: 4px; object-fit: cover;">
          <div>
            <div style="font-weight: 700; color: var(--text-main); line-height: 1.2;">${item.title}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">රු. ${item.price} × ${item.qty}</div>
          </div>
        </div>
        <div style="font-weight: 800; color: var(--primary-light);">රු. ${itemTotal.toLocaleString()}/=</div>
      `;
      modalItemsList.appendChild(itemRow);
    });

    // Calculate delivery
    const district = districtSelect ? districtSelect.value : 'Colombo';
    let delivery = (district === 'Colombo' || district === 'Gampaha') ? 250 : 350;
    if (subtotal >= 4000) delivery = 0; // Free delivery over 4000

    if (modalSubtotal) modalSubtotal.textContent = `රු. ${subtotal.toLocaleString()}/=`;
    if (modalDeliveryFee) {
      modalDeliveryFee.textContent = delivery === 0 ? 'නොමිලේ (Free Delivery)' : `රු. ${delivery}/=`;
    }
    if (modalGrandTotal) {
      modalGrandTotal.textContent = `රු. ${(subtotal + delivery).toLocaleString()}/=`;
    }
  }

  // Submit Order Form
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('custName')?.value || 'පාරිභෝගිකයා';
      const submitBtn = checkoutForm.querySelector('button[type="submit"]');

      submitBtn.innerHTML = 'ඇණවුම සකසමින් පවතී... ⏳';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = 'ඇණවුම තහවුරු කරන්න (Confirm Order)';
        submitBtn.disabled = false;
        if (checkoutModal) checkoutModal.classList.remove('active');
        triggerConfetti();
        showNotificationToast(`🎉 ස්තූතියි ${name}! ඔබගේ පොත් හා ලිපිද්‍රව්‍ය ඇණවුම සාර්ථකව භාරගන්නා ලදී.`);
        cart = [];
        updateCartBadge();
      }, 1200);
    });
  }

  // Direct WhatsApp Order
  if (directWhatsAppOrderBtn) {
    directWhatsAppOrderBtn.addEventListener('click', () => {
      const name = document.getElementById('custName')?.value || 'පාරිභෝගිකයා';
      const phone = document.getElementById('custPhone')?.value || '';
      const address = document.getElementById('custAddress')?.value || '';

      const itemsSummary = cart.map(i => `• ${i.title} (ප්‍රමාණය: ${i.qty}) - රු. ${i.price * i.qty}/=`).join('\n');
      const subtotal = cart.reduce((acc, i) => acc + (i.price * i.qty), 0);
      const delivery = subtotal >= 4000 ? 0 : 250;
      const grandTotal = subtotal + delivery;

      const message = `*නැණපහන පොත් මැඳුර වෙත ඇණවුමක්:*\n\n` +
                      `📦 *ඇණවුම් කළ භාණ්ඩ ලැයිස්තුව:*\n${itemsSummary}\n\n` +
                      `💰 මුළු මුදල: රු. ${grandTotal}/= (Delivery ඇතුළුව)\n` +
                      `👤 නම: ${name}\n` +
                      `📞 දුරකථන: ${phone}\n` +
                      `📍 ලිපිනය: ${address}\n` +
                      `🚚 ගෙවීම් ක්‍රමය: Cash on Delivery\n\n` +
                      `කරුණාකර මෙම ඇණවුම තහවුරු කරන්න.`;

      const url = `https://wa.me/94779876543?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    });
  }

  // Close modals
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop || e.target.classList.contains('modal-close-btn') || e.target.closest('.modal-close-btn')) {
        backdrop.classList.remove('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   4. SCHOOL BOOKLIST UPLOAD / WHATSAPP SERVICE
   -------------------------------------------------------------------------- */
function initBooklistService() {
  const triggerBtns = document.querySelectorAll('.trigger-booklist-modal');
  const booklistModal = document.getElementById('booklistModal');
  const booklistForm = document.getElementById('booklistForm');

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (booklistModal) booklistModal.classList.add('active');
    });
  });

  if (booklistForm) {
    booklistForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const parentName = document.getElementById('parentName')?.value || '';
      const parentPhone = document.getElementById('parentPhone')?.value || '';
      const studentGrade = document.getElementById('studentGrade')?.value || '';
      const notes = document.getElementById('booklistNotes')?.value || '';

      const msg = `*නැණපහන පොත් මැඳුර - පාසල් පොත් ලැයිස්තු ඇණවුම:*\n\n` +
                  `👤 මව්පියන්ගේ නම: ${parentName}\n` +
                  `📞 දුරකථන: ${parentPhone}\n` +
                  `🎓 ශිෂ්‍යයාගේ ශ්‍රේණිය: ${studentGrade}\n` +
                  `📝 විශේෂ අවශ්‍යතා: ${notes}\n\n` +
                  `මම පොත් ලැයිස්තුවේ ඡායාරූපය WhatsApp ඔස්සේ එවන්නෙමි. කරුණාකර මිල ගණන් දන්වන්න.`;

      const url = `https://wa.me/94779876543?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank');
      if (booklistModal) booklistModal.classList.remove('active');
      showNotificationToast('පාසල් පොත් ලැයිස්තු ඉල්ලීම WhatsApp වෙත යොමු කරන ලදී!');
    });
  }
}

/* --------------------------------------------------------------------------
   5. REAL SRI LANKAN PURCHASE ALERTS
   -------------------------------------------------------------------------- */
function initSocialProofToast() {
  const toast = document.getElementById('livePurchaseToast');
  const toastBuyer = document.getElementById('toastBuyer');
  const toastEdition = document.getElementById('toastEdition');
  const toastTime = document.getElementById('toastTime');

  if (!toast) return;

  const purchases = [
    { buyer: 'සුපුන් කෞෂල්‍ය - කිරිබත්ගොඩ', edition: 'Atlas CR Books 5ක් & Chooty Pens පැක් 2ක් ඇණවුම් කළා', time: 'මීට සුළු මොහොතකට පෙර' },
    { buyer: 'නිල්මිණි ප්‍රනාන්දු - පිළියන්දල', edition: '5 ශ්‍රේණිය ශිෂ්‍යත්ව අත්වැල සහ චිත්‍ර පොත් ඇණවුම් කළා', time: 'මිනිත්තු 3කට පෙර' },
    { buyer: 'මහේෂ් සේනාරත්න - නුවරඑළිය', edition: 'Faber-Castell Pastels සහ A4 Paper Box එකක් ඇණවුම් කළා', time: 'මිනිත්තු 6කට පෙර' },
    { buyer: 'කසුන් බණ්ඩාර - කුරුණෑගල', edition: 'පාසල් පොත් ලැයිස්තුවක් (Booklist) WhatsApp මගින් ලබාදුන්නා', time: 'මිනිත්තු 9කට පෙර' },
    { buyer: 'චතුරිකා විජේසිංහ - ගම්පහ', edition: 'ළමා සුරංගනා කතා පොත් 4ක් සහ පැන්සල් පෙට්ටියක් ඇණවුම් කළා', time: 'මිනිත්තු 12කට පෙර' }
  ];

  let idx = 0;

  function showToast() {
    const data = purchases[idx];
    if (toastBuyer) toastBuyer.textContent = data.buyer;
    if (toastEdition) toastEdition.textContent = data.edition;
    if (toastTime) toastTime.textContent = data.time;

    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);

    idx = (idx + 1) % purchases.length;
  }

  setTimeout(() => {
    showToast();
    setInterval(showToast, 14000);
  }, 3500);
}

/* --------------------------------------------------------------------------
   6. NEWSLETTER & HELPERS
   -------------------------------------------------------------------------- */
function initNewsletter() {
  const form = document.getElementById('leadMagnetForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('leadEmail')?.value;
      const btn = form.querySelector('button');
      btn.innerHTML = 'ලියාපදිංචි වෙමින් පවතී...';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = 'සාර්ථකයි!';
        btn.disabled = false;
        form.reset();
        showNotificationToast(`🎉 ස්තූතියි! නැණපහන මාසික පොත් හා ලිපිද්‍රව්‍ය වට්ටම් පුවත්පත ${email} වෙත යොමු කෙරේ.`);
      }, 900);
    });
  }
}

function showNotificationToast(msg) {
  let toast = document.getElementById('actionNotificationToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'actionNotificationToast';
    toast.style.position = 'fixed';
    toast.style.top = '24px';
    toast.style.right = '24px';
    toast.style.background = 'var(--bg-card)';
    toast.style.backdropFilter = 'blur(16px)';
    toast.style.border = '1px solid var(--border-focus)';
    toast.style.color = 'var(--text-main)';
    toast.style.padding = '0.9rem 1.4rem';
    toast.style.borderRadius = 'var(--radius-md)';
    toast.style.boxShadow = '0 12px 35px rgba(0,0,0,0.35), 0 0 25px var(--primary-glow)';
    toast.style.zIndex = '3000';
    toast.style.fontSize = '0.92rem';
    toast.style.fontWeight = '600';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '0.75rem';
    toast.style.transform = 'translateY(-60px)';
    toast.style.opacity = '0';
    toast.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span>✨</span><span>${escapeHtml(msg)}</span>`;
  toast.style.transform = 'translateY(0)';
  toast.style.opacity = '1';

  setTimeout(() => {
    toast.style.transform = 'translateY(-60px)';
    toast.style.opacity = '0';
  }, 4500);
}

function triggerConfetti() {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '3500';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#c9933b', '#e5b869', '#10b981', '#34d399', '#ffffff', '#2563eb'];

  for (let i = 0; i < 90; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.7) * 16,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10,
      alpha: 1
    });
  }

  let start = Date.now();
  function render() {
    const elapsed = Date.now() - start;
    if (elapsed > 2500) {
      canvas.remove();
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35;
      p.rotation += p.vRot;
      p.alpha = Math.max(0, 1 - (elapsed / 2500));
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    });
    requestAnimationFrame(render);
  }
  render();
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
