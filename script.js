// Music Control
const musicBtn = document.getElementById('musicBtn');
const bgMusic = document.getElementById('bgMusic');
let isPlaying = false;

function toggleMusic() {
  if (isPlaying) {
    bgMusic.pause();
    musicBtn.classList.add('is-paused');
  } else {
    bgMusic.play();
    musicBtn.classList.remove('is-paused');
  }
  isPlaying = !isPlaying;
}

function startMusic() {
  if (!isPlaying) {
    bgMusic.play().then(() => {
      isPlaying = true;
      musicBtn.classList.remove('is-paused');
    }).catch(() => {});
  }
}

musicBtn.addEventListener('click', toggleMusic);

// Auto-play on WeChat
document.addEventListener('WeixinJSBridgeReady', startMusic);

// Swipe up to play music
let touchStartY = 0;
document.addEventListener('touchstart', function(e) {
  touchStartY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchend', function(e) {
  const touchEndY = e.changedTouches[0].clientY;
  if (touchStartY - touchEndY > 50) {
    startMusic();
  }
}, { passive: true });

// Also try on first scroll
let hasScrolled = false;
window.addEventListener('scroll', function() {
  if (!hasScrolled) {
    hasScrolled = true;
    startMusic();
  }
}, { passive: true });

// Start music on any first interaction
function handleFirstInteraction() {
  startMusic();
  document.removeEventListener('touchstart', handleFirstInteraction);
  document.removeEventListener('click', handleFirstInteraction);
  window.removeEventListener('scroll', handleFirstInteraction);
}
document.addEventListener('touchstart', handleFirstInteraction, { passive: true });
document.addEventListener('click', handleFirstInteraction);
window.addEventListener('scroll', handleFirstInteraction, { passive: true });

// Scroll Animations
const observerOptions = {
  threshold: 0.2,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.section-content, .info-card, .gallery-item').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// Shooting Stars Effect
function createShootingStar() {
  const star = document.createElement('div');
  star.className = 'shooting-star';
  star.style.left = Math.random() * window.innerWidth + 'px';
  star.style.top = Math.random() * (window.innerHeight / 2) + 'px';
  document.body.appendChild(star);
  
  setTimeout(() => {
    star.remove();
  }, 1000);
}

setInterval(createShootingStar, 3000);

// Floating Mayday Images
const floatingContainer = document.createElement('div');
floatingContainer.className = 'floating-elements';
document.body.appendChild(floatingContainer);

const maydayImages = [
  'images/1040g2sg318vg6oi14c7g401fla3oir8hq2nlntg.png',
  'images/1040g2sg318vg6oi14c8g401fla3oir8hqup3bqo.png',
  'images/1040g2sg318vg6oi14c90401fla3oir8huj4hmg8.png',
  'images/1040g2sg318vg6oi14cb0401fla3oir8havn7er8.png',
  'images/1040g2sg318vg6oi14cbg401fla3oir8hs4a8aa0.png',
  'images/1040g2sg318vg6oi14cc0401fla3oir8hbq29vj0.png',
  'images/1040g2sg318vg6oi14ccg401fla3oir8h930ifto.png',
  'images/1040g2sg318vg6oi14cdg401fla3oir8h6ekrffg.png'
];

function createFloatingElement() {
  const element = document.createElement('div');
  element.className = 'floating-item';
  
  const img = document.createElement('img');
  img.src = maydayImages[Math.floor(Math.random() * maydayImages.length)];
  img.alt = 'Mayday';
  element.appendChild(img);
  
  const left = Math.random() * 100;
  const size = 40 + Math.random() * 40;
  const duration = 10 + Math.random() * 15;
  const delay = Math.random() * 3;
  
  element.style.left = left + '%';
  element.style.width = size + 'px';
  element.style.height = size + 'px';
  element.style.animationDuration = duration + 's';
  element.style.animationDelay = delay + 's';
  
  floatingContainer.appendChild(element);
  
  setTimeout(() => {
    element.remove();
  }, (duration + delay) * 1000);
}

function startFloatingElements() {
  for (let i = 0; i < 4; i++) {
    setTimeout(createFloatingElement, i * 800);
  }
  setInterval(createFloatingElement, 3000);
}

startFloatingElements();

// Wishes Feature
const wishName = document.getElementById('wishName');
const wishText = document.getElementById('wishText');
const wishBtn = document.getElementById('wishBtn');
const wishList = document.getElementById('wishList');

function loadWishes() {
  const wishes = JSON.parse(localStorage.getItem('wedding_wishes') || '[]');
  wishList.innerHTML = wishes.map(wish => `
    <div class="wish-item">
      <p class="wish-author">${escapeHtml(wish.name)}</p>
      <p class="wish-content">${escapeHtml(wish.text)}</p>
      <p class="wish-time">${wish.time}</p>
    </div>
  `).join('');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

wishBtn.addEventListener('click', function () {
  const name = wishName.value.trim();
  const text = wishText.value.trim();

  if (!name || !text) {
    alert('请填写您的名字和祝福内容');
    return;
  }

  const wishes = JSON.parse(localStorage.getItem('wedding_wishes') || '[]');
  wishes.unshift({
    name,
    text,
    time: new Date().toLocaleString('zh-CN')
  });
  localStorage.setItem('wedding_wishes', JSON.stringify(wishes));

  wishName.value = '';
  wishText.value = '';
  loadWishes();
});

loadWishes();
