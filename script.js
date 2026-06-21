/* ===========================================================
   A JOURNEY WITH DADDY — script.js
   =========================================================== */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     0. Utility
  --------------------------------------------------------- */
  const rand = (min, max) => Math.random() * (max - min) + min;
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  /* ---------------------------------------------------------
     1. Cursor glow
  --------------------------------------------------------- */
  const cursorGlow = $('#cursorGlow');
  if (cursorGlow && !reduceMotion) {
    window.addEventListener('pointermove', (e) => {
      cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
    }, { passive: true });
  }

  /* ---------------------------------------------------------
     2. Heart trail on pointer move
  --------------------------------------------------------- */
  let lastTrail = 0;
  window.addEventListener('pointermove', (e) => {
    if (reduceMotion) return;
    const now = Date.now();
    if (now - lastTrail < 90) return;
    lastTrail = now;
    spawnTrailHeart(e.clientX, e.clientY);
  }, { passive: true });

  function spawnTrailHeart(x, y) {
    const h = document.createElement('span');
    h.className = 'fh';
    h.textContent = Math.random() > 0.5 ? '❤️' : '✨';
    h.style.position = 'fixed';
    h.style.left = x + 'px';
    h.style.top = y + 'px';
    h.style.fontSize = rand(10, 15) + 'px';
    h.style.pointerEvents = 'none';
    h.style.zIndex = 6;
    h.style.opacity = '0.85';
    h.style.transition = 'transform 0.9s ease-out, opacity 0.9s ease-out';
    document.body.appendChild(h);
    requestAnimationFrame(() => {
      h.style.transform = `translateY(${rand(-50, -90)}px) translateX(${rand(-20, 20)}px) scale(0.4) rotate(${rand(-40,40)}deg)`;
      h.style.opacity = '0';
    });
    setTimeout(() => h.remove(), 950);
  }

  /* ---------------------------------------------------------
     3. Floating hearts ambient layer (background)
  --------------------------------------------------------- */
  const floatingHeartsLayer = $('#floatingHearts');
  function spawnFloatingHeart() {
    if (!floatingHeartsLayer) return;
    const h = document.createElement('span');
    h.className = 'fh';
    h.textContent = Math.random() > 0.6 ? '❤️' : (Math.random() > 0.5 ? '💛' : '✨');
    h.style.left = rand(2, 98) + 'vw';
    h.style.setProperty('--s', rand(12, 22) + 'px');
    h.style.setProperty('--dur', rand(10, 18) + 's');
    h.style.setProperty('--drift', rand(-60, 60) + 'px');
    floatingHeartsLayer.appendChild(h);
    setTimeout(() => h.remove(), 19000);
  }
  if (!reduceMotion) {
    for (let i = 0; i < 6; i++) setTimeout(spawnFloatingHeart, i * 900);
    setInterval(spawnFloatingHeart, 1800);
  }

  /* ---------------------------------------------------------
     4. Starfield canvas (twinkling ambient stars)
  --------------------------------------------------------- */
  const starsCanvas = $('#starsCanvas');
  const starsCtx = starsCanvas.getContext('2d');
  let stars = [];

  function resizeCanvases() {
    [starsCanvas, $('#particlesCanvas'), $('#fireworksCanvas')].forEach(c => {
      if (!c) return;
      c.width = window.innerWidth * devicePixelRatio;
      c.height = window.innerHeight * devicePixelRatio;
      c.style.width = window.innerWidth + 'px';
      c.style.height = window.innerHeight + 'px';
    });
  }
  function initStars() {
    const count = window.innerWidth < 700 ? 70 : 140;
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: rand(0.4, 1.6),
      phase: Math.random() * Math.PI * 2,
      speed: rand(0.01, 0.03)
    }));
  }
  function drawStars(t) {
    starsCtx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    starsCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    stars.forEach(s => {
      const tw = (Math.sin(t * s.speed + s.phase) + 1) / 2;
      starsCtx.beginPath();
      starsCtx.arc(s.x, s.y, s.r * (0.6 + tw * 0.8), 0, Math.PI * 2);
      starsCtx.fillStyle = `rgba(255, 215, 0, ${0.25 + tw * 0.55})`;
      starsCtx.fill();
    });
    if (!reduceMotion) requestAnimationFrame(drawStars);
  }

  /* ---------------------------------------------------------
     5. Golden floating particles canvas
  --------------------------------------------------------- */
  const particlesCanvas = $('#particlesCanvas');
  const pCtx = particlesCanvas.getContext('2d');
  let particles = [];
  function initParticles() {
    const count = window.innerWidth < 700 ? 22 : 45;
    particles = Array.from({ length: count }, () => makeParticle());
  }
  function makeParticle() {
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight + window.innerHeight,
      r: rand(1, 3),
      vy: rand(0.2, 0.6),
      vx: rand(-0.15, 0.15),
      alpha: rand(0.2, 0.7)
    };
  }
  function drawParticles() {
    pCtx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    pCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles.forEach(p => {
      p.y -= p.vy;
      p.x += p.vx;
      if (p.y < -10) { p.y = window.innerHeight + 10; p.x = Math.random() * window.innerWidth; }
      pCtx.beginPath();
      pCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      pCtx.fillStyle = `rgba(255, 215, 0, ${p.alpha})`;
      pCtx.shadowColor = 'rgba(255,215,0,0.8)';
      pCtx.shadowBlur = 6;
      pCtx.fill();
    });
    if (!reduceMotion) requestAnimationFrame(drawParticles);
  }

  resizeCanvases();
  initStars();
  initParticles();
  if (!reduceMotion) {
    requestAnimationFrame(drawStars);
    requestAnimationFrame(drawParticles);
  } else {
    drawStars(0);
    drawParticles();
  }
  window.addEventListener('resize', () => {
    resizeCanvases();
    initStars();
    initParticles();
  });

  /* ---------------------------------------------------------
     6. Hero lanterns
  --------------------------------------------------------- */
  const heroLanternsLayer = $('#heroLanterns');
  function spawnLantern(layer) {
    if (!layer) return;
    const l = document.createElement('span');
    l.className = 'lantern';
    l.textContent = '🏮';
    l.style.left = rand(5, 92) + '%';
    l.style.setProperty('--lsize', rand(22, 38) + 'px');
    l.style.setProperty('--ldur', rand(14, 22) + 's');
    l.style.setProperty('--ldrift', rand(15, 50) + 'px');
    layer.appendChild(l);
    setTimeout(() => l.remove(), 23000);
  }
  if (!reduceMotion) {
    for (let i = 0; i < 3; i++) setTimeout(() => spawnLantern(heroLanternsLayer), i * 2500);
    setInterval(() => spawnLantern(heroLanternsLayer), 5200);
  }

  /* ---------------------------------------------------------
     7. Scroll progress thread
  --------------------------------------------------------- */
  const scrollFill = $('#scrollFill');
  function updateScrollProgress() {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight);
    scrollFill.style.width = (scrolled * 100) + '%';
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  /* ---------------------------------------------------------
     8. Hero locket open + typewriter
  --------------------------------------------------------- */
  const locket = $('#locket');
  const typewriterEl = $('#typewriter');
  const quotes = [
    "Every age opened a new chapter of love.",
    "Your hugs were my first home.",
    "Your strength taught me how to stand."
  ];

  function typeLoop() {
    let qIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function step() {
      const current = quotes[qIndex];
      if (!deleting) {
        charIndex++;
        typewriterEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(step, 2200);
          return;
        }
        setTimeout(step, 45);
      } else {
        charIndex--;
        typewriterEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          qIndex = (qIndex + 1) % quotes.length;
          setTimeout(step, 400);
          return;
        }
        setTimeout(step, 22);
      }
    }
    step();
  }

  setTimeout(() => {
    locket.classList.add('opened');
  }, 700);
  setTimeout(typeLoop, 1500);

  /* ---------------------------------------------------------
     9. Start Our Journey button -> smooth scroll
  --------------------------------------------------------- */
  $('#startJourneyBtn').addEventListener('click', () => {
    $('#timeline').scrollIntoView({ behavior: 'smooth' });
  });

  /* ---------------------------------------------------------
     10. Background music toggle
  --------------------------------------------------------- */
  const musicPlayer = $('#musicPlayer');
  const musicToggle = $('#musicToggle');
  const bgAudio = $('#bgAudio');
  let musicOn = false;
  musicToggle.addEventListener('click', () => {
    musicOn = !musicOn;
    if (musicOn) {
      bgAudio.volume = 0.35;
      bgAudio.play().catch(() => {
        showEggToast("Tap once more — your browser is being shy 🎵");
        musicOn = false;
        musicPlayer.classList.remove('playing');
      });
      musicPlayer.classList.add('playing');
    } else {
      bgAudio.pause();
      musicPlayer.classList.remove('playing');
    }
  });

  /* ---------------------------------------------------------
     11. Timeline spine fill + scroll-reveal chapters
  --------------------------------------------------------- */
  const timelineEl = $('#timeline');
  const spineFill = $('#spineFill');
  const timelineSpark = $('#timelineSpark');

  function updateSpine() {
    const rect = timelineEl.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = rect.height;
    let visibleTop = vh - rect.top;
    visibleTop = Math.max(0, Math.min(visibleTop, total + vh));
    let pct = (visibleTop) / (total + vh * 0.3);
    pct = Math.max(0, Math.min(1, pct));
    spineFill.style.height = (pct * 100) + '%';
    timelineSpark.style.top = (pct * 100) + '%';
  }
  window.addEventListener('scroll', updateSpine, { passive: true });
  window.addEventListener('resize', updateSpine);
  updateSpine();

  const chapterAnimState = {};

  const chapterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        const chNum = entry.target.dataset.chapter;
        if (!chapterAnimState[chNum]) {
          chapterAnimState[chNum] = true;
          triggerChapterAnimation(entry.target);
        }
      }
    });
  }, { threshold: 0.35 });

  $$('.chapter').forEach(ch => chapterObserver.observe(ch));

  function triggerChapterAnimation(chapterEl) {
    const anim = chapterEl.dataset.anim;
    setTimeout(() => {
      switch (anim) {
        case 'envelope': animEnvelope(chapterEl); break;
        case 'starburst': animStarburst(chapterEl); break;
        case 'confetti': animConfetti(chapterEl); break;
        case 'polaroids': /* css-driven, nothing extra needed */ break;
        case 'giftbox': animGiftbox(chapterEl); break;
      }
    }, 450);
  }

  // Chapter 1 — envelope opens, hearts fly
  function animEnvelope(chapterEl) {
    const envelope = chapterEl.querySelector('.envelope');
    const heartsLayer = chapterEl.querySelector('.envelope-hearts');
    envelope.classList.add('opened');
    setTimeout(() => {
      for (let i = 0; i < 10; i++) {
        const h = document.createElement('span');
        h.className = 'pop-heart';
        h.textContent = Math.random() > 0.5 ? '❤️' : '💛';
        h.style.setProperty('--hx', rand(-90, 90) + 'px');
        h.style.setProperty('--hy', rand(-110, -60) + 'px');
        h.style.animationDelay = (i * 0.05) + 's';
        heartsLayer.appendChild(h);
      }
      setTimeout(() => { heartsLayer.innerHTML = ''; }, 1800);
    }, 500);
  }

  // Chapter 2 — star burst rays
  function animStarburst(chapterEl) {
    const wrap = chapterEl.querySelector('.star-burst-wrap');
    const rays = chapterEl.querySelector('.burst-rays');
    rays.innerHTML = '';
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const dist = rand(50, 90);
      const ray = document.createElement('span');
      ray.className = 'ray';
      ray.style.setProperty('--rx', Math.cos(angle) * dist + 'px');
      ray.style.setProperty('--ry', Math.sin(angle) * dist + 'px');
      ray.style.animationDelay = (i * 0.02) + 's';
      rays.appendChild(ray);
    }
    wrap.classList.add('burst');
    setTimeout(() => wrap.classList.remove('burst'), 1200);
  }

  // Chapter 3 — confetti burst
  function animConfetti(chapterEl) {
    const wrap = chapterEl.querySelector('.confetti-wrap');
    wrap.innerHTML = '';
    const colors = ['#FFD700', '#8B0000', '#F7E7CE', '#FFF8E7', '#F2C94C'];
    for (let i = 0; i < 40; i++) {
      const piece = document.createElement('span');
      piece.className = 'piece';
      piece.style.left = rand(0, 100) + '%';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.setProperty('--cx', rand(-60, 60) + 'px');
      piece.style.setProperty('--crot', rand(250, 550) + 'deg');
      piece.style.setProperty('--cdur', rand(1.2, 2.1) + 's');
      piece.style.animationDelay = rand(0, 0.4) + 's';
      wrap.appendChild(piece);
    }
    wrap.classList.add('burst');
    setTimeout(() => { wrap.classList.remove('burst'); wrap.innerHTML = ''; }, 2600);
  }

  // Chapter 5 — gift box opens with golden particles
  function animGiftbox(chapterEl) {
    const gift = chapterEl.querySelector('.gift-wrap');
    const particlesLayer = chapterEl.querySelector('.gift-particles');
    gift.classList.add('opened');
    setTimeout(() => {
      particlesLayer.innerHTML = '';
      for (let i = 0; i < 18; i++) {
        const gp = document.createElement('span');
        gp.className = 'gp';
        const angle = rand(0, Math.PI * 2);
        const dist = rand(40, 100);
        gp.style.setProperty('--gx', Math.cos(angle) * dist + 'px');
        gp.style.setProperty('--gy', (Math.sin(angle) * dist - 30) + 'px');
        gp.style.animationDelay = (i * 0.03) + 's';
        particlesLayer.appendChild(gp);
      }
      setTimeout(() => { particlesLayer.innerHTML = ''; }, 1600);
    }, 400);
  }

  /* ---------------------------------------------------------
     12. Letter reveal on scroll
  --------------------------------------------------------- */
  const letterPaper = $('#letterPaper');
  new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); });
  }, { threshold: 0.3 }).observe(letterPaper);

  /* ---------------------------------------------------------
     13. 20 Reasons — flip cards
  --------------------------------------------------------- */
  const reasons = [
    "You always support me.",
    "You believe in me.",
    "You protect me.",
    "You make me smile.",
    "You are my hero.",
    "You work hard for our family.",
    "You taught me kindness.",
    "You motivate me.",
    "You make me feel safe.",
    "You inspire me.",
    "You forgive my mistakes.",
    "You celebrate my wins.",
    "You listen when I need it most.",
    "You sacrifice without complaint.",
    "You hold our family together.",
    "You taught me to be brave.",
    "You never give up on me.",
    "You make every place feel like home.",
    "You are my biggest cheerleader.",
    "You love me, simply and always."
  ];

  const reasonsGrid = $('#reasonsGrid');
  reasons.forEach((text, i) => {
    const card = document.createElement('div');
    card.className = 'flip-card';
    card.innerHTML = `
      <div class="flip-card-inner">
        <div class="flip-front">
          <span class="num">${String(i + 1).padStart(2, '0')}</span>
          <span class="heart-icon">❤️</span>
          <span class="tap-label">tap to reveal</span>
        </div>
        <div class="flip-back">${text}</div>
      </div>
    `;
    card.addEventListener('click', () => card.classList.toggle('flipped'));
    reasonsGrid.appendChild(card);
  });

  /* ---------------------------------------------------------
     14. Finale — fireworks, lanterns, hearts, stars
  --------------------------------------------------------- */
  const finaleSection = $('#finaleSection');
  const fireworksCanvas = $('#fireworksCanvas');
  const fwCtx = fireworksCanvas.getContext('2d');
  let fireworkParticles = [];
  let fireworksRunning = false;
  let fireworksRAF = null;

  function spawnFirework() {
    const x = rand(window.innerWidth * 0.15, window.innerWidth * 0.85);
    const y = rand(window.innerHeight * 0.2, window.innerHeight * 0.55);
    const colors = ['#FFD700', '#8B0000', '#FFF8E7', '#F2C94C', '#F7E7CE'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const count = 36;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const speed = rand(1.5, 4.2);
      fireworkParticles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color,
        size: rand(1.5, 3)
      });
    }
  }

  function fireworksLoop() {
    fwCtx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    fwCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    fireworkParticles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.025;
      p.alpha -= 0.012;
      fwCtx.beginPath();
      fwCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      fwCtx.fillStyle = hexToRgba(p.color, Math.max(p.alpha, 0));
      fwCtx.shadowColor = p.color;
      fwCtx.shadowBlur = 8;
      fwCtx.fill();
    });
    fireworkParticles = fireworkParticles.filter(p => p.alpha > 0);
    if (fireworksRunning) fireworksRAF = requestAnimationFrame(fireworksLoop);
  }

  function hexToRgba(hex, alpha) {
    const v = hex.replace('#', '');
    const r = parseInt(v.substring(0, 2), 16);
    const g = parseInt(v.substring(2, 4), 16);
    const b = parseInt(v.substring(4, 6), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  let fireworksInterval = null;
  function startFinaleSequence() {
    if (fireworksRunning) return;
    fireworksRunning = true;
    fireworksRAF = requestAnimationFrame(fireworksLoop);
    spawnFirework();
    fireworksInterval = setInterval(spawnFirework, 850);

    // lanterns
    const finaleLanterns = $('#finaleLanterns');
    for (let i = 0; i < 4; i++) setTimeout(() => spawnLantern(finaleLanterns), i * 1100);
    const lanternLoop = setInterval(() => spawnLantern(finaleLanterns), 2600);

    // hearts
    const finaleHearts = $('#finaleHearts');
    function spawnFinaleHeart() {
      const h = document.createElement('span');
      h.className = 'fh';
      h.textContent = Math.random() > 0.5 ? '❤️' : '💛';
      h.style.left = rand(5, 95) + '%';
      h.style.setProperty('--s', rand(16, 28) + 'px');
      h.style.setProperty('--dur', rand(7, 13) + 's');
      h.style.setProperty('--drift', rand(-50, 50) + 'px');
      finaleHearts.appendChild(h);
      setTimeout(() => h.remove(), 14000);
    }
    for (let i = 0; i < 8; i++) setTimeout(spawnFinaleHeart, i * 300);
    const heartLoop = setInterval(spawnFinaleHeart, 700);

    // brighter stars
    const finaleStars = $('#finaleStars');
    finaleStars.innerHTML = '';
    for (let i = 0; i < 60; i++) {
      const s = document.createElement('span');
      s.className = 'fstar';
      s.style.left = rand(0, 100) + '%';
      s.style.top = rand(0, 100) + '%';
      s.style.animationDelay = rand(0, 2) + 's';
      finaleStars.appendChild(s);
    }

    // store cleanup refs
    finaleSection._cleanup = () => {
      clearInterval(fireworksInterval);
      clearInterval(lanternLoop);
      clearInterval(heartLoop);
    };
  }

  const finaleObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) startFinaleSequence();
    });
  }, { threshold: 0.4 });
  finaleObserver.observe(finaleSection);

  $('#replayBtn').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      locket.classList.remove('opened');
      setTimeout(() => locket.classList.add('opened'), 500);
    }, 900);
  });

  /* ---------------------------------------------------------
     15. Easter eggs
  --------------------------------------------------------- */
  const eggToast = $('#eggToast');
  let eggToastTimer = null;
  function showEggToast(msg) {
    eggToast.textContent = msg;
    eggToast.classList.add('show');
    clearTimeout(eggToastTimer);
    eggToastTimer = setTimeout(() => eggToast.classList.remove('show'), 3200);
  }

  // Easter egg 1: click hero title 5 times
  let titleClicks = 0;
  const heroTitle = $('.hero-title');
  if (heroTitle) {
    heroTitle.style.cursor = 'pointer';
    heroTitle.addEventListener('click', () => {
      titleClicks++;
      if (titleClicks === 5) {
        showEggToast("Daddy's little girl... forever and always ❤️");
        titleClicks = 0;
        burstHeartsFromPoint(window.innerWidth / 2, window.innerHeight / 3);
      }
    });
  }

  // Easter egg 2: type "DAD" anywhere
  let keyBuffer = '';
  window.addEventListener('keydown', (e) => {
    if (e.key.length === 1) {
      keyBuffer = (keyBuffer + e.key).slice(-10).toUpperCase();
      if (keyBuffer.includes('DAD')) {
        showEggToast("Atul Kumar — Daddy, this whole site is for you ❤️");
        keyBuffer = '';
      }
    }
  });

  // Easter egg 3: triple-click the signature in finale
  let sigClicks = 0;
  const finaleSig = $('.finale-signature');
  if (finaleSig) {
    finaleSig.style.cursor = 'pointer';
    finaleSig.addEventListener('click', () => {
      sigClicks++;
      if (sigClicks >= 3) {
        showEggToast("Every chapter, every page — written with love. ✨");
        sigClicks = 0;
      }
    });
  }

  function burstHeartsFromPoint(x, y) {
    for (let i = 0; i < 20; i++) {
      const h = document.createElement('span');
      h.textContent = Math.random() > 0.5 ? '❤️' : '✨';
      h.style.position = 'fixed';
      h.style.left = x + 'px';
      h.style.top = y + 'px';
      h.style.fontSize = rand(14, 22) + 'px';
      h.style.pointerEvents = 'none';
      h.style.zIndex = 99;
      h.style.transition = 'transform 1.2s ease-out, opacity 1.2s ease-out';
      document.body.appendChild(h);
      const angle = rand(0, Math.PI * 2);
      const dist = rand(80, 220);
      requestAnimationFrame(() => {
        h.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) scale(0.3) rotate(${rand(-90,90)}deg)`;
        h.style.opacity = '0';
      });
      setTimeout(() => h.remove(), 1300);
    }
  }

  /* ---------------------------------------------------------
     16. Tilt effect for chapter cards (subtle 3D)
  --------------------------------------------------------- */
  $$('.chapter-stage').forEach(stage => {
    if (window.matchMedia('(hover: none)').matches || reduceMotion) return;
    stage.style.transformStyle = 'preserve-3d';
    stage.addEventListener('mousemove', (e) => {
      const rect = stage.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      stage.style.transform = `rotateY(${px * 8}deg) rotateX(${-py * 8}deg)`;
    });
    stage.addEventListener('mouseleave', () => {
      stage.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
  });

  /* ---------------------------------------------------------
     17. My Happy Corner — photo slideshow
  --------------------------------------------------------- */
  const slideshow = $('#slideshow');
  if (slideshow) {
    const slides = $$('.slide', slideshow);
    const dotsWrap = $('#slideDots');
    const prevBtn = $('#slidePrev');
    const nextBtn = $('#slideNext');
    const playPauseBtn = $('#slidePlayPause');
    let current = 0;
    let isPlaying = true;
    let autoTimer = null;
    const AUTOPLAY_MS = 4500;

    // Build dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slide-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to photo ${i + 1}`);
      dot.addEventListener('click', () => goTo(i, true));
      dotsWrap.appendChild(dot);
    });
    const dots = $$('.slide-dot', dotsWrap);

    function goTo(index, userInitiated) {
      slides[current].classList.remove('is-active');
      dots[current].classList.remove('active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      dots[current].classList.add('active');
      if (userInitiated) restartAutoplay();
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAutoplay() {
      if (reduceMotion) return;
      clearInterval(autoTimer);
      autoTimer = setInterval(next, AUTOPLAY_MS);
    }
    function stopAutoplay() {
      clearInterval(autoTimer);
    }
    function restartAutoplay() {
      if (isPlaying) startAutoplay();
    }

    prevBtn.addEventListener('click', () => goTo(current - 1, true));
    nextBtn.addEventListener('click', () => goTo(current + 1, true));

    playPauseBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      const iconPause = playPauseBtn.querySelector('.icon-pause');
      const iconPlay = playPauseBtn.querySelector('.icon-play');
      if (isPlaying) {
        startAutoplay();
        iconPause.style.display = '';
        iconPlay.style.display = 'none';
        playPauseBtn.setAttribute('aria-label', 'Pause slideshow');
      } else {
        stopAutoplay();
        iconPause.style.display = 'none';
        iconPlay.style.display = '';
        playPauseBtn.setAttribute('aria-label', 'Play slideshow');
      }
    });

    // Pause on hover, resume on leave (desktop only)
    slideshow.addEventListener('mouseenter', () => { if (isPlaying) stopAutoplay(); });
    slideshow.addEventListener('mouseleave', () => { if (isPlaying) startAutoplay(); });

    // Keyboard navigation when the slideshow is focused/in view
    window.addEventListener('keydown', (e) => {
      const rect = slideshow.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;
      if (e.key === 'ArrowLeft') goTo(current - 1, true);
      if (e.key === 'ArrowRight') goTo(current + 1, true);
    });

    // Swipe support for touch devices
    let touchStartX = 0;
    slideshow.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    slideshow.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) {
        if (dx < 0) goTo(current + 1, true); else goTo(current - 1, true);
      }
    }, { passive: true });

    startAutoplay();
  }

})();
