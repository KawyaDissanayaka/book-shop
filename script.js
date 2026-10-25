/**
 * නැණපහන පොත් මැඳුර - NENAPAHANA BOOKS (PVT) LTD
 * Production Frontend Logic & Order Management
 * Developed by SL Developer
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dark / Light Mode Toggle
  initThemeToggle();

  // 2. 3D Tilt Effect on Hero Book
  init3DBookTilt();

  // 3. Cart & Ordering System
  initCartAndCheckout();

  // 4. Chapter Accordion & Sneak Peek
  initChapterAccordion();

  // 5. Interactive Audiobook Player with Web Audio API
  initAudiobookPlayer();

  // 6. Free Sample Reader Modal
  initReaderModal();

  // 7. FAQ Accordion
  initFaqAccordion();

  // 8. Real Sri Lankan Buyer Social Proof Toasts
  initSocialProofToast();

  // 9. Mobile Menu Navigation
  initMobileMenu();

  // 10. Newsletter & Free PDF Sample Form
  initNewsletter();
});

/* --------------------------------------------------------------------------
   1. THEME TOGGLE (Dark / Light)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const root = document.documentElement;
  const toggleBtn = document.getElementById('themeToggleBtn');
  const toggleText = document.getElementById('themeToggleText');

  const savedTheme = localStorage.getItem('nenapahana_theme') || 'dark';
  applyTheme(savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const current = root.getAttribute('data-theme-mode') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('nenapahana_theme', next);
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
   2. 3D TILT EFFECT ON HERO BOOK
   -------------------------------------------------------------------------- */
function init3DBookTilt() {
  const card = document.getElementById('heroBook3D');
  if (!card) return;
  const wrap = card.parentElement;

  wrap.addEventListener('mousemove', (e) => {
    const rect = wrap.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 12;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  wrap.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}

/* --------------------------------------------------------------------------
   3. CART & REAL SRI LANKAN CHECKOUT SYSTEM
   -------------------------------------------------------------------------- */
let cartCount = 0;
let currentOrder = {
  item: "විශ්වීය ඇල්ගොරිතමය (Hardcover Edition)",
  price: 2650,
  qty: 1,
  deliveryFee: 250
};

function initCartAndCheckout() {
  const cartBadge = document.getElementById('navCartCount');
  const checkoutModal = document.getElementById('checkoutModal');
  const orderTriggers = document.querySelectorAll('.trigger-order-btn');
  const addCartBtns = document.querySelectorAll('.trigger-add-cart-btn');

  const modalItemTitle = document.getElementById('checkoutItemTitle');
  const modalItemPrice = document.getElementById('checkoutItemPrice');
  const modalDeliveryFee = document.getElementById('checkoutDeliveryFee');
  const modalGrandTotal = document.getElementById('checkoutGrandTotal');
  const districtSelect = document.getElementById('customerDistrict');
  const checkoutForm = document.getElementById('checkoutForm');
  const directWhatsAppOrderBtn = document.getElementById('directWhatsAppOrderBtn');

  // Add to cart buttons
  addCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const title = btn.getAttribute('data-product-title') || "විශ්වීය ඇල්ගොරිතමය";
      cartCount++;
      if (cartBadge) cartBadge.textContent = cartCount;
      showNotificationToast(`🛒 "${title}" කරත්තයට සාර්ථකව එක් කරන ලදී!`);
    });
  });

  // Open checkout modal
  orderTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const title = btn.getAttribute('data-product-title') || "විශ්වීය ඇල්ගොරිතමය (Hardcover Edition)";
      const price = parseInt(btn.getAttribute('data-product-price') || "2650", 10);

      currentOrder.item = title;
      currentOrder.price = price;

      updateOrderSummary();
      if (checkoutModal) checkoutModal.classList.add('active');
    });
  });

  // Calculate delivery fee based on Sri Lankan District
  if (districtSelect) {
    districtSelect.addEventListener('change', () => {
      const dist = districtSelect.value;
      if (dist === 'Colombo' || dist === 'Gampaha') {
        currentOrder.deliveryFee = 250;
      } else {
        currentOrder.deliveryFee = 350;
      }
      // Free delivery if order >= 4000
      if (currentOrder.price >= 4000) {
        currentOrder.deliveryFee = 0;
      }
      updateOrderSummary();
    });
  }

  function updateOrderSummary() {
    if (modalItemTitle) modalItemTitle.textContent = currentOrder.item;
    if (modalItemPrice) modalItemPrice.textContent = `රු. ${currentOrder.price.toLocaleString()}/=`;
    if (modalDeliveryFee) {
      modalDeliveryFee.textContent = currentOrder.deliveryFee === 0 ? 'නොමිලේ (Free)' : `රු. ${currentOrder.deliveryFee}/=`;
    }
    if (modalGrandTotal) {
      const grandTotal = currentOrder.price + currentOrder.deliveryFee;
      modalGrandTotal.textContent = `රු. ${grandTotal.toLocaleString()}/=`;
    }
  }

  // Handle Form Submit
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('custName').value;
      const phone = document.getElementById('custPhone').value;
      const address = document.getElementById('custAddress').value;
      const district = districtSelect ? districtSelect.value : 'Colombo';
      const payMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'Cash on Delivery';

      const submitBtn = checkoutForm.querySelector('button[type="submit"]');
      submitBtn.innerHTML = 'ඇණවුම සකසමින් පවතී... ⏳';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = 'ඇණවුම තහවුරු කරන්න (Confirm Order)';
        submitBtn.disabled = false;
        if (checkoutModal) checkoutModal.classList.remove('active');
        triggerConfetti();
        showNotificationToast(`🎉 ස්තූතියි ${name}! ඔබගේ ඇණවුම සාර්ථකව භාරගන්නා ලදී. (Ref: NP-${Math.floor(100000 + Math.random() * 900000)})`);
      }, 1200);
    });
  }

  // Direct WhatsApp Order
  if (directWhatsAppOrderBtn) {
    directWhatsAppOrderBtn.addEventListener('click', () => {
      const name = document.getElementById('custName')?.value || 'පාරිභෝගිකයා';
      const phone = document.getElementById('custPhone')?.value || '';
      const address = document.getElementById('custAddress')?.value || '';
      const grandTotal = currentOrder.price + currentOrder.deliveryFee;

      const message = `*නැණපහන පොත් මැඳුර (Nenapahana Books) වෙත ඇණවුමක්:*\n\n` +
                      `📖 පොත: ${currentOrder.item}\n` +
                      `💰 මුළු මුදල: රු. ${grandTotal}/=\n` +
                      `👤 නම: ${name}\n` +
                      `📞 දුරකථන: ${phone}\n` +
                      `📍 ලිපිනය: ${address}\n` +
                      `🚚 ගෙවීම් ක්‍රමය: Cash on Delivery\n\n` +
                      `කරුණාකර මෙම ඇණවුම තහවුරු කර එවන්න.`;

      const url = `https://wa.me/94779876543?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    });
  }
}

/* --------------------------------------------------------------------------
   4. CHAPTER ACCORDION & SNEAK PEEK
   -------------------------------------------------------------------------- */
function initChapterAccordion() {
  const items = document.querySelectorAll('.chapter-item');
  const previewExcerpt = document.getElementById('previewExcerpt');
  const previewHeading = document.getElementById('previewHeading');

  const excerpts = {
    '1': {
      heading: '1 වන පරිච්ඡේදය: මනසේ ප්‍රාථමික ඇල්ගොරිතමය (The Code of Inception)',
      text: '"මනස යනු ලෝකය දෙස බලා සිටින නිෂ්ක්‍රීය නිරීක්ෂකයෙකු නොවේ; එය අපගේ යථාර්ථය නිර්මාණය කරන නිහඬ ගෘහ නිර්මාණ ශිල්පියාය. අවිඥානික සිතුවිලි ස්ථර ඉවත් කළ විට, අපගේ සෑම තීරණයක්ම සහ සහජ බුද්ධියක්ම මෙහෙයවන මූලික ජීව විද්‍යාත්මක ඇල්ගොරිතමය හඳුනාගත හැක."'
    },
    '2': {
      heading: '2 වන පරිච්ඡේදය: සහජ ඥානයේ ස්නායු විද්‍යාව (The Neural Blueprint)',
      text: '"සහජ බුද්ධිය හෝ ඉව (Intuition) යනු කිසිසේත්ම අද්භූත මායාවක් නොවේ; එය සවිඥානික මනසට වඩා දසදහස් ගුණයකින් වේගයෙන් ක්‍රියාත්මක වන ස්නායු පරිගණනයකි. එම ස්නායු රටා නිවැරදිව හඳුනාගත් විට වඩාත් තීරණාත්මක මොහොතක පවා බියෙන් තොරව නිවැරදි තීන්දුව ගැනීමට හැකිවේ."'
    },
    '3': {
      heading: '3 වන පරිච්ඡේදය: අභ්‍යන්තර විසිරීම පාලනය (Mastering Inner Entropy)',
      text: '"නොසන්සුන් බව සහ සිතුවිලි විසිරීම යනු නූතන මිනිසා මුහුණ දෙන විශාලතම ඛේදවාචකයයි. අවධානය පැහැරගන්නා ඩිජිටල් උපාංග හමුවේ ඔබේ මානසික ශක්තිය ආරක්ෂා කරගනිමින් ගැඹුරු නිහඬතාවයක් ගොඩනගා ගන්නේ කෙසේදැයි මෙහිදී විග්‍රහ කෙරේ."'
    },
    '4': {
      heading: '4 වන පරිච්ඡේදය: උච්චතම කාර්යක්ෂමතා සමීකරණය (The Flow Equation)',
      text: '"පූර්ණ ඒකාග්‍රතාවය හෙවත් Flow State එක යනු සිතීමේ සහ ක්‍රියාවේ පරම සමතුලිතතාවයයි. ලොව අති දක්ෂතම නිර්මාණකරුවන් සහ විද්‍යාඥයින් මාස ගණනක ප්‍රතිඵල පැය කිහිපයකින් ලබාගන්නා ජෛව විද්‍යාත්මක රහස් මෙහි අඩංගු වේ."'
    },
    '5': {
      heading: '5 වන පරිච්ඡේදය: ඉරණම ප්‍රතිනිර්මාණය (Designing Destiny)',
      text: '"අපගේ සාර්ථකත්වය රඳා පවතින්නේ හුදු සිහින මත නොව, අප දිනපතා ක්‍රියාත්මක කරන මානසික ක්‍රමවේද මතය. ඕනෑම ආර්ථික හෝ සමාජීය කුණාටුවකට නොසැලී මුහුණ දිය හැකි ස්ථීර මානසික පදනමක් සකසා ගන්නා අයුරු මෙයින් පහදා දෙයි."'
    },
    '6': {
      heading: '6 වන පරිච්ඡේදය: චිරන්තන ශාන්තිය (The Eternal Return)',
      text: '"ලෞකික ජයග්‍රහණ සහ ඉලක්ක හඹා යන අතරතුරම, සිත තුළ නොසැලෙන අධ්‍යාත්මික සැනසීමක් පවත්වාගෙන යාම සැබෑ ජීවන විජයග්‍රහණයයි. සිතේ සාමය සහ සාර්ථකත්වය එකට මුසු වූ ජීවිතයක පරිසමාප්තිය මෙහිදී සනිටුහන් වේ."'
    }
  };

  items.forEach(item => {
    const header = item.querySelector('.chapter-header');
    header.addEventListener('click', () => {
      const chapterId = item.getAttribute('data-chapter');
      const isActive = item.classList.contains('active');

      items.forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
        if (excerpts[chapterId] && previewExcerpt && previewHeading) {
          previewHeading.textContent = excerpts[chapterId].heading;
          previewExcerpt.textContent = excerpts[chapterId].text;
        }
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5. AUDIOBOOK PLAYER & WEB AUDIO AMBIENT SYNTH
   -------------------------------------------------------------------------- */
function initAudiobookPlayer() {
  const playBtn = document.getElementById('audioPlayToggle');
  const playIcon = document.getElementById('playIcon');
  const canvas = document.getElementById('audioVisualizer');
  const scrubber = document.getElementById('playerScrubber');
  const currentTimeEl = document.getElementById('audioCurrentTime');
  const durationTimeEl = document.getElementById('audioDurationTime');
  const speedBtn = document.getElementById('speedToggleBtn');

  let audioCtx = null;
  let isPlaying = false;
  let masterGain = null;
  let oscillators = [];
  let animFrameId = null;
  let currentSeconds = 0;
  const totalSeconds = 184;
  let playbackRate = 1.0;

  let ctx2d = null;
  if (canvas) {
    ctx2d = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }

  function startAmbientAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);

    // Warm chord: D3, F#3, A3, D4
    const freqs = [146.83, 185.00, 220.00, 293.66];
    oscillators = freqs.map((f, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(f, audioCtx.currentTime);

      const lfo = audioCtx.createOscillator();
      const lfoGain = audioCtx.createGain();
      lfo.frequency.value = 0.25 + idx * 0.1;
      lfoGain.gain.value = 1.5;
      lfo.connect(osc.frequency);
      lfo.start();

      gain.gain.setValueAtTime(0.18 / freqs.length, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start();
      return { osc, gain, lfo };
    });
  }

  function stopAmbientAudio() {
    if (oscillators.length) {
      oscillators.forEach(o => {
        try {
          o.osc.stop();
          o.lfo.stop();
        } catch (e) {}
      });
      oscillators = [];
    }
  }

  function togglePlay() {
    isPlaying = !isPlaying;
    if (isPlaying) {
      startAmbientAudio();
      if (playIcon) playIcon.textContent = '⏸';
      animateVisualizer();
      showNotificationToast('🎧 සිංහල ශ්‍රව්‍ය සාම්පලය වාදනය වේ... (Audio Preview Playing)');
    } else {
      stopAmbientAudio();
      if (playIcon) playIcon.textContent = '▶';
    }
  }

  if (playBtn) playBtn.addEventListener('click', togglePlay);

  function animateVisualizer() {
    if (!ctx2d) return;

    function render() {
      if (!isPlaying) {
        ctx2d.clearRect(0, 0, canvas.width, canvas.height);
        ctx2d.fillStyle = 'rgba(201, 147, 59, 0.2)';
        ctx2d.fillRect(0, canvas.height / 2 - 1, canvas.width, 2);
        return;
      }

      ctx2d.clearRect(0, 0, canvas.width, canvas.height);
      const bars = 48;
      const barWidth = canvas.width / bars;
      const time = Date.now() * 0.004;

      for (let i = 0; i < bars; i++) {
        const height = Math.abs(Math.sin(time + i * 0.25) * Math.cos(time * 0.5 + i * 0.15)) * (canvas.height * 0.75) + 6;
        const x = i * barWidth;
        const y = (canvas.height - height) / 2;

        const grad = ctx2d.createLinearGradient(0, y, 0, y + height);
        grad.addColorStop(0, '#e5b869');
        grad.addColorStop(0.5, '#c9933b');
        grad.addColorStop(1, '#10b981');

        ctx2d.fillStyle = grad;
        ctx2d.beginPath();
        ctx2d.roundRect(x + 1.5, y, barWidth - 3, height, 3);
        ctx2d.fill();
      }

      currentSeconds += 0.05 * playbackRate;
      if (currentSeconds >= totalSeconds) currentSeconds = 0;
      updateTimeDisplay();

      animFrameId = requestAnimationFrame(render);
    }

    render();
  }

  function updateTimeDisplay() {
    if (scrubber) scrubber.value = (currentSeconds / totalSeconds) * 100;
    if (currentTimeEl) {
      const m = Math.floor(currentSeconds / 60);
      const s = Math.floor(currentSeconds % 60);
      currentTimeEl.textContent = `${m}:${String(s).padStart(2, '0')}`;
    }
  }

  if (scrubber) {
    scrubber.addEventListener('input', (e) => {
      currentSeconds = (e.target.value / 100) * totalSeconds;
      updateTimeDisplay();
    });
  }

  if (speedBtn) {
    const speeds = [1.0, 1.25, 1.5];
    let idx = 0;
    speedBtn.addEventListener('click', () => {
      idx = (idx + 1) % speeds.length;
      playbackRate = speeds[idx];
      speedBtn.textContent = `${playbackRate}x`;
    });
  }
}

/* --------------------------------------------------------------------------
   6. FREE SAMPLE READER MODAL
   -------------------------------------------------------------------------- */
function initReaderModal() {
  const openBtns = document.querySelectorAll('.open-reader-btn');
  const readerModal = document.getElementById('readerModal');
  const smallerBtn = document.getElementById('readerFontSmaller');
  const biggerBtn = document.getElementById('readerFontBigger');
  const readerText = document.querySelector('.reader-book-page');

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (readerModal) readerModal.classList.add('active');
    });
  });

  // Close modals
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop || e.target.classList.contains('modal-close-btn') || e.target.closest('.modal-close-btn')) {
        backdrop.classList.remove('active');
      }
    });
  });

  let fontSize = 17;
  if (smallerBtn && readerText) {
    smallerBtn.addEventListener('click', () => {
      if (fontSize > 14) {
        fontSize -= 1;
        readerText.style.fontSize = `${fontSize}px`;
      }
    });
  }

  if (biggerBtn && readerText) {
    biggerBtn.addEventListener('click', () => {
      if (fontSize < 24) {
        fontSize += 1;
        readerText.style.fontSize = `${fontSize}px`;
      }
    });
  }
}

/* --------------------------------------------------------------------------
   7. FAQ ACCORDION
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const q = item.querySelector('.faq-question');
    if (q) {
      q.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        items.forEach(i => i.classList.remove('active'));
        if (!isOpen) item.classList.add('active');
      });
    }
  });
}

/* --------------------------------------------------------------------------
   8. REAL SRI LANKAN BUYER SOCIAL PROOF TOAST
   -------------------------------------------------------------------------- */
function initSocialProofToast() {
  const toast = document.getElementById('livePurchaseToast');
  const toastBuyer = document.getElementById('toastBuyer');
  const toastEdition = document.getElementById('toastEdition');
  const toastTime = document.getElementById('toastTime');

  if (!toast) return;

  const purchases = [
    { buyer: 'චතුරංග වික්‍රමසිංහ - කොළඹ 07', edition: 'Hardcover Deluxe පිටපතක් ඇණවුම් කළා', time: 'මීට සුළු මොහොතකට පෙර' },
    { buyer: 'සඳුනි රත්නායක - මහනුවර', edition: 'Cash on Delivery මගින් ඇණවුම් කළා', time: 'මිනිත්තු 3කට පෙර' },
    { buyer: 'දිනේෂ් ප්‍රනාන්දු - ගාල්ල', edition: 'Koko Installments මගින් ඇණවුම් කළා', time: 'මිනිත්තු 5කට පෙර' },
    { buyer: 'කසුන් බණ්ඩාර - කුරුණෑගල', edition: 'Hardcover + Audiobook Combo ඇණවුම් කළා', time: 'මිනිත්තු 9කට පෙර' },
    { buyer: 'අනුරාධ විජේසිංහ - මහරගම', edition: 'Hardcover පිටපතක් ඇණවුම් කළා', time: 'මිනිත්තු 12කට පෙර' }
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
    setInterval(showToast, 15000);
  }, 4000);
}

/* --------------------------------------------------------------------------
   9. MOBILE MENU
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggle = document.getElementById('mobileMenuToggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const isOpen = navLinks.style.display === 'flex';
      navLinks.style.display = isOpen ? 'none' : 'flex';
      if (!isOpen) {
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '78px';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.background = 'var(--bg-surface)';
        navLinks.style.padding = '1.5rem';
        navLinks.style.boxShadow = 'var(--shadow-lg)';
        navLinks.style.zIndex = '998';
        navLinks.style.borderBottom = '1px solid var(--border-subtle)';
      }
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          navLinks.style.display = 'none';
        }
      });
    });
  }
}

/* --------------------------------------------------------------------------
   10. NEWSLETTER & NOTIFICATIONS
   -------------------------------------------------------------------------- */
function initNewsletter() {
  const form = document.getElementById('leadMagnetForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('leadEmail')?.value;
      const btn = form.querySelector('button');
      btn.innerHTML = 'PDF පිටපත යවමින් පවතී... 🚀';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = 'සාර්ථකව යවන ලදී!';
        btn.disabled = false;
        form.reset();
        showNotificationToast(`🎉 නොමිලේ කියවිය හැකි මුල් පරිච්ඡේද 2 සහිත PDF පිටපත ${email} වෙත යවන ලදී!`);
      }, 1000);
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
  const colors = ['#c9933b', '#e5b869', '#10b981', '#34d399', '#ffffff', '#ff0055'];

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
