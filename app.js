/* =========================
   Helpers
========================= */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* =========================
   1) Smooth scroll cho anchor
========================= */
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute('href');
  if (id.length <= 1) return;
  const target = $(id);
  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

/* =========================
   2) Music button: autoplay + toggle
========================= */
const audio = $('#bg-music');
const musicBtn = $('#music-btn');

function setBtnState(playing) {
    if (!musicBtn) return;
    musicBtn.classList.toggle('playing', playing);
    const icon = playing ? '💖' : '🎶';
    const label = playing ? 'Tắt Nhạc' : 'Phát Nhạc';
    musicBtn.innerHTML = `<span class="music-icon">${icon}</span><span class="music-text">${label}</span>`;
    musicBtn.setAttribute('aria-pressed', playing ? 'true' : 'false');
}

window.addEventListener('load', () => {
    if (audio) {
        audio.play()
            .then(() => setBtnState(true))
            .catch(() => setBtnState(false));
    }
});

if (musicBtn && audio) {
    musicBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().then(() => setBtnState(true));
        } else {
            audio.pause();
            setBtnState(false);
        }
    });
}

/* =========================
   3) Tim nổi khi click chuột
========================= */
(function heartsOnClick() {
  const colors = ['#ff9acb','#ffd6ec','#fff','#fecaca','#fda4af'];
  document.addEventListener('click', (e) => {
    // bỏ qua khi click vào nút/anchor để không vướng UX
    if (e.target.closest('button, a, input, textarea, select')) return;
    const h = document.createElement('span');
    h.textContent = '❤';
    h.style.position = 'fixed';
    h.style.left = e.clientX + 'px';
    h.style.top  = e.clientY + 'px';
    h.style.fontSize = (14 + Math.random()*8) + 'px';
    h.style.color = colors[(Math.random()*colors.length)|0];
    h.style.pointerEvents = 'none';
    h.style.filter = 'drop-shadow(0 0 6px rgba(255,255,255,.8))';
    h.style.transition = 'transform 1.2s ease, opacity 1.2s ease';
    document.body.appendChild(h);
    requestAnimationFrame(() => {
      h.style.transform = `translate(${(Math.random()*60-30)}px, -90px) scale(1.4)`;
      h.style.opacity = '0';
    });
    setTimeout(() => h.remove(), 1200);
  });
})();

/* =========================
   4) Scroll-reveal (IntersectionObserver)
========================= */
(function revealOnScroll() {
  const targets = $$('.card, .photo-card, .section-heading');
  if (!('IntersectionObserver' in window) || targets.length === 0) return;

  targets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) {
        target.style.transition = 'opacity .6s ease, transform .6s ease';
        target.style.opacity = '1';
        target.style.transform = 'translateY(0)';
        io.unobserve(target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => io.observe(el));
})();

/* =========================
   5) Typewriter cho .subtitle
========================= */
(function typeWriter() {
  const el = $('.subtitle');
  if (!el) return;
  const full = el.getAttribute('data-typewriter') || el.textContent.trim();
  el.textContent = '';
  let i = 0;
  const tick = () => {
    if (i <= full.length) {
      el.textContent = full.slice(0, i);
      i++;
      setTimeout(tick, 28); // tốc độ gõ
    }
  };
  tick();
})();

/* =========================
    6) Lightbox cho ảnh trong .photos-grid
========================= */
(function lightbox() {
  const imgs = $$('.photos-grid img');
  if (imgs.length === 0) return;

  const overlay = document.createElement('div');
  overlay.style.cssText = `
     position: fixed; inset:0; background: rgba(0,0,0,.75);
     display:none; align-items:center; justify-content:center; z-index:1000;
  `;
  const big = document.createElement('img');
  big.style.maxWidth = '92vw';
  big.style.maxHeight = '90vh';
  big.style.borderRadius = '14px';
  big.style.boxShadow = '0 20px 60px rgba(0,0,0,.6)';
  big.style.transition = 'transform 0.3s ease'; // Thêm hiệu ứng mềm mại
  overlay.appendChild(big);
  document.body.appendChild(overlay);

  const close = () => {
     big.style.transform = 'scale(0)'; // Hiệu ứng thu nhỏ khi đóng
     setTimeout(() => (overlay.style.display = 'none'), 300); // Đợi hiệu ứng hoàn thành
  };
  overlay.addEventListener('click', close);
  window.addEventListener('keydown', (e) => e.key === 'Escape' && close());

  imgs.forEach(img => {
     img.style.cursor = 'zoom-in';
     img.addEventListener('click', () => {
        big.src = img.src;
        big.style.transform = 'scale(1)'; // Hiệu ứng phóng to khi mở
        overlay.style.display = 'flex';
     });
  });
})();

/* =========================
   7) Bộ đếm ngày yêu: <span id="love-days" data-start="YYYY-MM-DD"></span>
========================= */
(function loveCounter() {
  const el = $('#love-days');
  if (!el) return;
  const startStr = el.getAttribute('data-start');
  if (!startStr) return;
  const start = new Date(startStr + 'T00:00:00');
  if (isNaN(start)) return;

  const update = () => {
    const now = new Date();
    const days = Math.floor((now - start) / (1000*60*60*24));
    el.textContent = days.toString();
  };
  update();
  setInterval(update, 60 * 60 * 1000);
})();

/* =========================
   8) Parallax nhẹ cho .overlay-glow
========================= */
(function parallaxGlow() {
  const glow = $('.overlay-glow');
  if (!glow) return;
  let x = 0, y = 0;
  window.addEventListener('mousemove', (e) => {
    const dx = (e.clientX / window.innerWidth  - 0.5) * 10;
    const dy = (e.clientY / window.innerHeight - 0.5) * 10;
    x = dx; y = dy;
    glow.style.transform = `translate(${x}px, ${y}px)`;
  });
})();
