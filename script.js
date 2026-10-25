/**
 * THE CELESTIAL ALGORITHM - INTERACTIVE SCRIPTS
 * Built for SL Developer Web Agency Showcase
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Showcase Customizer Controls (Mode, Color, Font)
  initThemeCustomizer();

  // 2. 3D Tilt Effect on Hero Book
  init3DBookTilt();

  // 3. Launch Countdown Timer
  initCountdownTimer();

  // 4. Chapter Accordion & Sneak Peek
  initChapterAccordion();

  // 5. Interactive Audiobook Player & Web Audio Ambient Synth
  initAudiobookPlayer();

  // 6. Review Filtering & Review Submission
  initReviewsSystem();

  // 7. Modals: Reader Preview, Checkout, Agency Inquiry
  initModals();

  // 8. FAQ Accordion
  initFaqAccordion();

  // 9. Live Social Proof Purchase Toasts
  initSocialProofToast();

  // 10. Mobile Menu Navigation
  initMobileMenu();

  // 11. Lead Magnet Newsletter Form
  initLeadMagnet();
});

/* --------------------------------------------------------------------------
   1. THEME CUSTOMIZER (Dark/Light, Colors, Fonts)
   -------------------------------------------------------------------------- */
function initThemeCustomizer() {
  const root = document.documentElement;
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeModeText = document.getElementById('themeModeText');
  const colorDots = document.querySelectorAll('.color-dot');
  const fontSelect = document.getElementById('fontSelect');

  // Load saved preferences
  const savedMode = localStorage.getItem('sl_book_theme_mode') || 'dark';
  const savedColor = localStorage.getItem('sl_book_color_theme') || 'gold';
  const savedFont = localStorage.getItem('sl_book_font_preset') || 'classic';

  applyMode(savedMode);
  applyColor(savedColor);
  applyFont(savedFont);

  // Toggle Dark/Light Mode
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentMode = root.getAttribute('data-theme-mode') || 'dark';
      const newMode = currentMode === 'dark' ? 'light' : 'dark';
      applyMode(newMode);
      localStorage.setItem('sl_book_theme_mode', newMode);
    });
  }

  function applyMode(mode) {
    root.setAttribute('data-theme-mode', mode);
    if (themeModeText) {
      themeModeText.textContent = mode === 'dark' ? '☀️ Light' : '🌙 Dark';
    }
  }

  // Color theme selection
  colorDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const color = dot.getAttribute('data-color');
      applyColor(color);
      localStorage.setItem('sl_book_color_theme', color);
    });
  });

  function applyColor(color) {
    root.setAttribute('data-color-theme', color);
    colorDots.forEach(dot => {
      dot.classList.toggle('active', dot.getAttribute('data-color') === color);
    });
  }

  // Font preset selection
  if (fontSelect) {
    fontSelect.value = savedFont;
    fontSelect.addEventListener('change', (e) => {
      applyFont(e.target.value);
      localStorage.setItem('sl_book_font_preset', e.target.value);
    });
  }

  function applyFont(font) {
    root.setAttribute('data-font-preset', font);
    if (fontSelect) fontSelect.value = font;
  }
}

/* --------------------------------------------------------------------------
   2. 3D TILT EFFECT FOR HERO BOOK
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

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 14;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  wrap.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}

/* --------------------------------------------------------------------------
   3. LAUNCH COUNTDOWN TIMER
   -------------------------------------------------------------------------- */
function initCountdownTimer() {
  const daysEl = document.getElementById('countDays');
  const hoursEl = document.getElementById('countHours');
  const minsEl = document.getElementById('countMins');
  const secsEl = document.getElementById('countSecs');

  if (!daysEl) return;

  // Set target date 3 days, 14 hours from now
  const targetDate = new Date(Date.now() + (3 * 24 * 60 * 60 * 1000) + (14 * 60 * 60 * 1000));

  function update() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / 1000 / 60) % 60);
    const s = Math.floor((diff / 1000) % 60);

    daysEl.textContent = String(d).padStart(2, '0');
    hoursEl.textContent = String(h).padStart(2, '0');
    minsEl.textContent = String(m).padStart(2, '0');
    secsEl.textContent = String(s).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
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
      heading: 'From Chapter 1: The Code of Inception',
      text: '"The mind is not an accidental observer of reality; it is the silent architect. When you peel back the layers of subconscious conditioning, you encounter the primary algorithm that directs every instinct, intuition, and choice."'
    },
    '2': {
      heading: 'From Chapter 2: The Neural Blueprint',
      text: '"Intuition is not magic; it is computation operating faster than conscious awareness. By harmonizing your nervous system with high-order purpose, your decisions achieve an effortless clarity that mimics natural law."'
    },
    '3': {
      heading: 'From Chapter 3: Mastering Inner Entropy',
      text: '"Distraction is the friction of the soul. The modern world profits from fractured attention; the sovereign mind reclaims mastery by cultivating sacred intervals of deep, unbroken stillness."'
    },
    '4': {
      heading: 'From Chapter 4: The Flow Equation',
      text: '"Flow is the point where the ego yields to pure execution. In this chapter, we decode the biological catalysts that compress months of creative breakthroughs into hours of concentrated insight."'
    },
    '5': {
      heading: 'From Chapter 5: Designing Destiny',
      text: '"You do not rise to the level of your ambitions; you fall to the resilience of your cognitive architecture. Real freedom begins when you build mental models that withstand global volatility."'
    },
    '6': {
      heading: 'From Chapter 6: The Eternal Return',
      text: '"The ultimate victory is not conquering external territory, but achieving a harmonious peace where wisdom, ambition, and inner serenity exist in perpetual equilibrium."'
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
   5. AUDIOBOOK PLAYER & WEB AUDIO AMBIENT SYNTHESIZER
   -------------------------------------------------------------------------- */
function initAudiobookPlayer() {
  const playBtn = document.getElementById('audioPlayToggle');
  const playIcon = document.getElementById('playIcon');
  const canvas = document.getElementById('audioVisualizer');
  const scrubber = document.getElementById('playerScrubber');
  const currentTimeEl = document.getElementById('audioCurrentTime');
  const durationTimeEl = document.getElementById('audioDurationTime');
  const speedBtn = document.getElementById('speedToggleBtn');
  const volumeSlider = document.getElementById('volumeSlider');
  const teaserBar = document.getElementById('heroAudioTeaser');

  let audioCtx = null;
  let isPlaying = false;
  let masterGain = null;
  let oscillators = [];
  let animFrameId = null;
  let currentSeconds = 0;
  const totalSeconds = 184; // 3 mins 4 secs
  let playbackRate = 1.0;

  // Canvas visualizer setup
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
    masterGain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);

    // Warm atmospheric binaural drone chord (F# Minor / Celestial Harmonics)
    const freqs = [185.00, 220.00, 277.18, 370.00]; // F#3, A3, C#4, F#4
    oscillators = freqs.map((f, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(f, audioCtx.currentTime);

      // Subtle LFO modulation for breathing texture
      const lfo = audioCtx.createOscillator();
      const lfoGain = audioCtx.createGain();
      lfo.frequency.value = 0.2 + idx * 0.1;
      lfoGain.gain.value = 1.5;
      lfo.connect(osc.frequency);
      lfo.start();

      gain.gain.setValueAtTime(0.2 / freqs.length, audioCtx.currentTime);
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
    } else {
      stopAmbientAudio();
      if (playIcon) playIcon.textContent = '▶';
    }
  }

  if (playBtn) playBtn.addEventListener('click', togglePlay);
  if (teaserBar) {
    teaserBar.addEventListener('click', () => {
      const playerSec = document.getElementById('audiobook');
      if (playerSec) playerSec.scrollIntoView({ behavior: 'smooth' });
      if (!isPlaying) togglePlay();
    });
  }

  // Audio Visualizer Rendering
  function animateVisualizer() {
    if (!ctx2d) return;

    function render() {
      if (!isPlaying) {
        // Draw static baseline
        ctx2d.clearRect(0, 0, canvas.width, canvas.height);
        ctx2d.fillStyle = 'rgba(212, 175, 55, 0.2)';
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
        grad.addColorStop(0, '#d4af37');
        grad.addColorStop(0.5, '#f5d77f');
        grad.addColorStop(1, '#10b981');

        ctx2d.fillStyle = grad;
        ctx2d.beginPath();
        ctx2d.roundRect(x + 1.5, y, barWidth - 3, height, 3);
        ctx2d.fill();
      }

      // Increment scrubber
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

  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      if (masterGain && audioCtx) {
        masterGain.gain.setValueAtTime(parseFloat(e.target.value), audioCtx.currentTime);
      }
    });
  }
}

/* --------------------------------------------------------------------------
   6. REVIEWS FILTERING & SUBMISSION
   -------------------------------------------------------------------------- */
function initReviewsSystem() {
  const filterBtns = document.querySelectorAll('.review-filter-btn');
  const reviewCards = document.querySelectorAll('.review-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      reviewCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Write a Review Button
  const writeReviewBtn = document.getElementById('writeReviewBtn');
  const reviewModal = document.getElementById('reviewModal');
  const reviewForm = document.getElementById('reviewForm');

  if (writeReviewBtn && reviewModal) {
    writeReviewBtn.addEventListener('click', () => {
      reviewModal.classList.add('active');
    });
  }

  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('revName').value;
      const role = document.getElementById('revRole').value || 'Verified Reader';
      const comment = document.getElementById('revComment').value;

      // Create new review card
      const grid = document.querySelector('.reviews-grid');
      if (grid) {
        const card = document.createElement('div');
        card.className = 'review-card';
        card.setAttribute('data-category', 'verified');
        card.innerHTML = `
          <div class="review-stars">★★★★★</div>
          <p class="review-text">"${escapeHtml(comment)}"</p>
          <div class="review-user-info">
            <div class="review-avatar">${name.charAt(0).toUpperCase()}</div>
            <div class="review-meta">
              <span class="review-author-name">${escapeHtml(name)}</span>
              <span class="review-author-role">${escapeHtml(role)} • Just now</span>
            </div>
          </div>
        `;
        grid.prepend(card);
      }

      reviewModal.classList.remove('active');
      reviewForm.reset();
      showNotificationToast('Thank you! Your review has been published.');
    });
  }
}

/* --------------------------------------------------------------------------
   7. INTERACTIVE MODALS (Reader, Checkout, Agency Inquiry)
   -------------------------------------------------------------------------- */
function initModals() {
  // Close any modal on backdrop click or close button
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop || e.target.classList.contains('modal-close-btn') || e.target.closest('.modal-close-btn')) {
        backdrop.classList.remove('active');
      }
    });
  });

  // Free Sample Reader Modal
  const openReaderBtns = document.querySelectorAll('.open-reader-btn');
  const readerModal = document.getElementById('readerModal');
  const readerFontSmaller = document.getElementById('readerFontSmaller');
  const readerFontBigger = document.getElementById('readerFontBigger');
  const readerPageText = document.querySelector('.reader-book-page');

  openReaderBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (readerModal) readerModal.classList.add('active');
    });
  });

  let currentFontSize = 16;
  if (readerFontSmaller && readerPageText) {
    readerFontSmaller.addEventListener('click', () => {
      if (currentFontSize > 13) {
        currentFontSize -= 1;
        readerPageText.style.fontSize = `${currentFontSize}px`;
      }
    });
  }

  if (readerFontBigger && readerPageText) {
    readerFontBigger.addEventListener('click', () => {
      if (currentFontSize < 24) {
        currentFontSize += 1;
        readerPageText.style.fontSize = `${currentFontSize}px`;
      }
    });
  }

  // Checkout Modal
  const checkoutModal = document.getElementById('checkoutModal');
  const orderBtns = document.querySelectorAll('.trigger-order-btn');
  const checkoutTitle = document.getElementById('checkoutItemTitle');
  const checkoutPrice = document.getElementById('checkoutItemPrice');
  const checkoutForm = document.getElementById('checkoutForm');

  orderBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const title = btn.getAttribute('data-product-title') || "Collector's Hardcover Edition";
      const price = btn.getAttribute('data-product-price') || '$29.99';

      if (checkoutTitle) checkoutTitle.textContent = title;
      if (checkoutPrice) checkoutPrice.textContent = price;
      if (checkoutModal) checkoutModal.classList.add('active');
    });
  });

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = checkoutForm.querySelector('button[type="submit"]');
      submitBtn.innerHTML = 'Processing Order... ⌛';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = 'Complete Purchase';
        submitBtn.disabled = false;
        checkoutModal.classList.remove('active');
        triggerConfettiCelebration();
        showNotificationToast('🎉 Congratulations! Your order has been placed successfully.');
      }, 1200);
    });
  }

  // Agency "Order This Website" Modal (SL Developer Pitch)
  const agencyOrderBtns = document.querySelectorAll('.agency-order-trigger');
  const agencyModal = document.getElementById('agencyModal');

  agencyOrderBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (agencyModal) agencyModal.classList.add('active');
    });
  });

  const agencyInquiryForm = document.getElementById('agencyInquiryForm');
  if (agencyInquiryForm) {
    agencyInquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const clientName = document.getElementById('clientName').value;
      const clientPhone = document.getElementById('clientPhone').value;
      const clientType = document.getElementById('clientProjectType').value;

      // Pre-fill WhatsApp message
      const msg = `Hi SL Developer! I saw your Book Showcase Website demo. My name is ${clientName} (${clientPhone}). I am interested in building a website for: ${clientType}. Please provide pricing details!`;
      const waUrl = `https://wa.me/?text=${encodeURIComponent(msg)}`;

      window.open(waUrl, '_blank');
      agencyModal.classList.remove('active');
      showNotificationToast('Message sent to SL Developer WhatsApp! We will connect with you.');
    });
  }
}

/* --------------------------------------------------------------------------
   8. FAQ ACCORDION
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      faqItems.forEach(f => f.classList.remove('active'));
      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   9. LIVE SOCIAL PROOF TOAST
   -------------------------------------------------------------------------- */
function initSocialProofToast() {
  const toast = document.getElementById('livePurchaseToast');
  const toastBuyer = document.getElementById('toastBuyer');
  const toastEdition = document.getElementById('toastEdition');
  const toastTime = document.getElementById('toastTime');

  if (!toast) return;

  const purchases = [
    { buyer: 'Kasun Bandara from Kandy', edition: "Collector's Hardcover Edition", time: 'Just now' },
    { buyer: 'Elena Rostova from London', edition: 'Ultimate Masterclass Bundle', time: '2 minutes ago' },
    { buyer: 'Tharindu Fernando from Colombo', edition: 'Unabridged Audiobook', time: '4 minutes ago' },
    { buyer: 'Marcus Vance from New York', edition: "Collector's Hardcover Edition", time: '7 minutes ago' },
    { buyer: 'Amara Weerasinghe from Galle', edition: 'Kindle & eBook Edition', time: '11 minutes ago' }
  ];

  let idx = 0;

  function showToast() {
    const data = purchases[idx];
    if (toastBuyer) toastBuyer.textContent = data.buyer;
    if (toastEdition) toastEdition.textContent = `Purchased ${data.edition}`;
    if (toastTime) toastTime.textContent = data.time;

    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);

    idx = (idx + 1) % purchases.length;
  }

  // Show first toast after 4s, then repeat every 14s
  setTimeout(() => {
    showToast();
    setInterval(showToast, 14000);
  }, 4000);
}

/* --------------------------------------------------------------------------
   10. MOBILE MENU
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = navLinks.style.display === 'flex';
      navLinks.style.display = isOpen ? 'none' : 'flex';
      if (!isOpen) {
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '76px';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.background = 'var(--bg-surface)';
        navLinks.style.padding = '1.5rem';
        navLinks.style.boxShadow = 'var(--shadow-lg)';
        navLinks.style.zIndex = '998';
        navLinks.style.borderBottom = '1px solid var(--border-subtle)';
      }
    });

    // Close when clicking a link
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
   11. LEAD MAGNET FORM & NOTIFICATION HELPER
   -------------------------------------------------------------------------- */
function initLeadMagnet() {
  const form = document.getElementById('leadMagnetForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('leadEmail').value;
      const btn = form.querySelector('button');
      btn.textContent = 'Sending PDF... 🚀';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = 'Chapters Sent!';
        btn.disabled = false;
        form.reset();
        showNotificationToast(`🎉 The first 3 chapters have been emailed to ${email}! Check your inbox.`);
      }, 1000);
    });
  }
}

function showNotificationToast(message) {
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
    toast.style.boxShadow = '0 12px 35px rgba(0,0,0,0.3), 0 0 25px var(--primary-glow)';
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

  toast.innerHTML = `<span>✨</span><span>${escapeHtml(message)}</span>`;
  toast.style.transform = 'translateY(0)';
  toast.style.opacity = '1';

  setTimeout(() => {
    toast.style.transform = 'translateY(-60px)';
    toast.style.opacity = '0';
  }, 4500);
}

/* --------------------------------------------------------------------------
   CONFETTI CELEBRATION HELPER
   -------------------------------------------------------------------------- */
function triggerConfettiCelebration() {
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
  const colors = ['#d4af37', '#f5d77f', '#10b981', '#34d399', '#f59e0b', '#ffffff', '#ec4899'];

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

  let startTime = Date.now();
  function render() {
    const elapsed = Date.now() - startTime;
    if (elapsed > 2500) {
      canvas.remove();
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
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
