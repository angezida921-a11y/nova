// ============================================
// NOVA - Logique principale (Jour 6 + Splash)
// ============================================

// ---------- VARIABLES GLOBALES ----------
let currentUser = null;
let currentVideoIndex = 0;
let progressInterval = null;

// ---------- DONNÉES DES VIDÉOS (SIMULATION) ----------
const videosData = [
  {
    id: 1,
    user: '@boutique_mode',
    title: 'Robe élégante en soie',
    price: 1500,
    likes: 437000,
    comments: 3279,
    bookmarks: 40000,
    shares: 45000,
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    duration: 15,
    hashtags: '#mode #élégance #luxe'
  },
  {
    id: 2,
    user: '@electronic_store',
    title: 'iPhone 15 Pro Max',
    price: 45000,
    likes: 892000,
    comments: 5678,
    bookmarks: 78000,
    shares: 92000,
    gradient: 'linear-gradient(135deg, #2e1a1a 0%, #3e1616 100%)',
    duration: 20,
    hashtags: '#tech #iphone #apple'
  },
  {
    id: 3,
    user: '@artisan_burkina',
    title: 'Masque traditionnel sculpté',
    price: 8500,
    likes: 234000,
    comments: 1890,
    bookmarks: 23000,
    shares: 34000,
    gradient: 'linear-gradient(135deg, #1a2e1a 0%, #163e16 100%)',
    duration: 12,
    hashtags: '#artisanat #burkina #tradition'
  },
  {
    id: 4,
    user: '@bijoux_luxe',
    title: 'Collier en or 24 carats',
    price: 25000,
    likes: 567000,
    comments: 3456,
    bookmarks: 56000,
    shares: 67000,
    gradient: 'linear-gradient(135deg, #2e2a1a 0%, #3e3816 100%)',
    duration: 18,
    hashtags: '#bijoux #or #luxe'
  },
  {
    id: 5,
    user: '@parfum_premium',
    title: 'Parfum de luxe importé',
    price: 12000,
    likes: 345000,
    comments: 2345,
    bookmarks: 34000,
    shares: 45000,
    gradient: 'linear-gradient(135deg, #2e1a2a 0%, #3e1638 100%)',
    duration: 15,
    hashtags: '#parfum #luxe #fragrance'
  }
];

// ============================================
// ÉCRANS DE CHARGEMENT
// ============================================

// ---------- SPLASH SCREEN ----------
function showSplashScreen() {
  const splash = document.getElementById('splash-screen');
  const status = document.getElementById('splash-status');
  const loaderBar = document.querySelector('.splash-loader-bar');

  if (!splash) return;

  const steps = [
    { text: 'Initialisation...', duration: 800, progress: 20 },
    { text: 'Chargement des ressources...', duration: 800, progress: 45 },
    { text: 'Préparation du feed...', duration: 800, progress: 70 },
    { text: 'Connexion au serveur...', duration: 600, progress: 90 },
    { text: 'Bienvenue sur Nova ✨', duration: 400, progress: 100 }
  ];

  let currentStep = 0;

  function runStep() {
    if (currentStep >= steps.length) {
      setTimeout(() => {
        splash.classList.add('hidden');
        setTimeout(() => {
          splash.style.display = 'none';
        }, 800);
      }, 300);
      return;
    }

    const step = steps[currentStep];
    if (status) status.textContent = step.text;
    if (loaderBar) loaderBar.style.width = step.progress + '%';

    currentStep++;
    setTimeout(runStep, step.duration);
  }

  runStep();
}

// ---------- ÉCRAN DE TRANSITION ----------
function showTransition(text = 'Chargement...', duration = 1500) {
  return new Promise((resolve) => {
    const transition = document.getElementById('transition-screen');
    const transitionText = document.getElementById('transition-text');

    if (!transition) {
      resolve();
      return;
    }

    if (transitionText) transitionText.textContent = text;
    transition.classList.add('visible');

    setTimeout(() => {
      transition.classList.remove('visible');
      setTimeout(resolve, 300);
    }, duration);
  });
}

// ---------- NAVIGATION ENTRE LES VUES ----------
async function showView(viewId) {
  const allViews = document.querySelectorAll('.view');
  const targetView = document.getElementById(viewId);

  if (!targetView) return;
  if (targetView.classList.contains('active')) return;

  // Vues qui déclenchent un écran de transition
  const transitionViews = {
    'view-feed': 'Préparation du feed...',
    'view-profile': 'Chargement du profil...',
    'view-wallet': 'Connexion au NovaWallet...'
  };

  // Si c'est une vue importante, montrer l'écran de transition
  if (transitionViews[viewId]) {
    await showTransition(transitionViews[viewId], 1200);
  }

  const currentView = document.querySelector('.view.active');

  if (currentView) {
    currentView.classList.add('leaving');
    setTimeout(() => {
      currentView.classList.remove('active', 'leaving');
    }, 400);
  }

  setTimeout(() => {
    targetView.classList.add('active');
    window.scrollTo(0, 0);

    const feedContainer = document.getElementById('feed-container');
    if (feedContainer && viewId === 'view-feed') {
      feedContainer.scrollTop = 0;
    }
  }, 50);
}

// ---------- FORMATAGE DES NOMBRES ----------
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// ---------- GÉNÉRATEUR DE FEED ----------
function generateFeed() {
  const feedContainer = document.getElementById('feed-container');
  if (!feedContainer) return;

  feedContainer.innerHTML = '';

  videosData.forEach(video => {
    const feedItem = document.createElement('div');
    feedItem.className = 'feed-item';
    feedItem.dataset.videoId = video.id;

    feedItem.innerHTML = `
      <div class="video-bg" style="background: ${video.gradient};">
        <div class="video-progress">
          <div class="video-progress-bar" data-video-id="${video.id}"></div>
        </div>

        <div class="video-info">
          <p class="video-user">${video.user}</p>
          <p class="video-title">${video.title}</p>
          <p class="video-hashtags">${video.hashtags}</p>
          <p class="video-price">${video.price.toLocaleString('fr-FR')} Nova</p>
        </div>
      </div>
    `;

    feedContainer.appendChild(feedItem);
  });

  console.log(`${videosData.length} vidéos générées`);
}

// ---------- METTRE À JOUR LES ACTIONS DU FEED ----------
function updateFeedActions(index) {
  const video = videosData[index];
  if (!video) return;

  const counts = document.querySelectorAll('.action-count');
  if (counts[0]) counts[0].textContent = formatNumber(video.likes);
  if (counts[1]) counts[1].textContent = formatNumber(video.comments);
  if (counts[2]) counts[2].textContent = formatNumber(video.bookmarks);
  if (counts[3]) counts[3].textContent = formatNumber(video.shares);

  if (video.user) {
    const sellerName = video.user.replace('@', '');
    setAvatarInitials(sellerName, 'feed-avatar');
  }

  const progressBar = document.querySelector('.video-progress-bar');
  if (progressBar) {
    progressBar.style.width = '0%';
    progressBar.dataset.videoId = video.id;
    startProgressBar();
  }
}

// ---------- DÉTECTION DE LA VIDÉO ACTIVE ----------
function observeFeedItems() {
  const feedItems = document.querySelectorAll('.feed-item');
  if (feedItems.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const videoId = parseInt(entry.target.dataset.videoId);
        const index = videosData.findIndex(v => v.id === videoId);

        if (index !== -1 && index !== currentVideoIndex) {
          currentVideoIndex = index;
          console.log(`Vidéo active : ${videoId} (${videosData[index].title})`);

          updateFeedActions(index);
          updateLikeState(videosData[index].id);
          updateBookmarkState(videosData[index].id);
        }
      }
    });
  }, {
    threshold: 0.6
  });

  feedItems.forEach(item => observer.observe(item));
}

// ---------- METTRE À JOUR L'ÉTAT DES LIKES ----------
function updateLikeState(videoId) {
  const likeBtn = document.querySelector('.like-btn');
  if (!likeBtn) return;

  const saved = localStorage.getItem(`nova_like_${videoId}`);
  if (saved === 'true') {
    likeBtn.classList.add('active');
  } else {
    likeBtn.classList.remove('active');
  }
}

// ---------- METTRE À JOUR L'ÉTAT DES FAVORIS ----------
function updateBookmarkState(videoId) {
  const bookmarkBtn = document.querySelector('.bookmark-btn');
  if (!bookmarkBtn) return;

  const saved = localStorage.getItem(`nova_bookmark_${videoId}`);
  if (saved === 'true') {
    bookmarkBtn.classList.add('active');
  } else {
    bookmarkBtn.classList.remove('active');
  }
}

// ---------- INTERACTIONS DU FEED ----------
function attachFeedInteractions() {
  // Like
  document.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const videoId = videosData[currentVideoIndex].id;
      const key = `nova_like_${videoId}`;

      const isActive = this.classList.toggle('active');
      localStorage.setItem(key, isActive ? 'true' : 'false');

      console.log(`Like vidéo ${videoId} :`, isActive);
    });
  });

  // Favoris
  document.querySelectorAll('.bookmark-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const videoId = videosData[currentVideoIndex].id;
      const key = `nova_bookmark_${videoId}`;

      const isActive = this.classList.toggle('active');
      localStorage.setItem(key, isActive ? 'true' : 'false');

      console.log(`Favori vidéo ${videoId} :`, isActive);
    });
  });

  // Suivre
  const followBtn = document.getElementById('follow-btn');
  if (followBtn) {
    followBtn.addEventListener('click', function () {
      this.classList.toggle('following');

      if (this.classList.contains('following')) {
        this.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        `;
      } else {
        this.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        `;
      }
    });
  }

  // ACHETER
  const buyBtn = document.querySelector('.buy-btn');
  if (buyBtn) {
    buyBtn.addEventListener('click', function () {
      const video = videosData[currentVideoIndex];
      alert(`Achat de "${video.title}" pour ${video.price.toLocaleString('fr-FR')} Nova`);
    });
  }

  // RÉSERVER
  const reserveBtn = document.querySelector('.reserve-btn');
  if (reserveBtn) {
    reserveBtn.addEventListener('click', function () {
      const video = videosData[currentVideoIndex];
      alert(`Réservation de "${video.title}" pour ${video.price.toLocaleString('fr-FR')} Nova`);
    });
  }
}

// ---------- BARRE DE PROGRESSION ----------
function startProgressBar() {
  const progressBar = document.querySelector('.video-progress-bar');
  if (!progressBar) return;

  if (progressInterval) {
    clearInterval(progressInterval);
  }

  let progress = 0;
  progressBar.style.width = '0%';

  progressInterval = setInterval(() => {
    progress += 1;
    progressBar.style.width = progress + '%';

    if (progress >= 100) {
      clearInterval(progressInterval);
      goToNextVideo();
    }
  }, 150);
}

// ---------- PASSER À LA VIDÉO SUIVANTE ----------
function goToNextVideo() {
  const feedContainer = document.getElementById('feed-container');
  if (!feedContainer) return;

  const nextIndex = currentVideoIndex + 1;
  if (nextIndex < videosData.length) {
    const nextVideo = feedContainer.querySelector(`[data-video-id="${videosData[nextIndex].id}"]`);
    if (nextVideo) {
      nextVideo.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

// ---------- GESTION DE L'AVATAR (Initiales) ----------
function setAvatarInitials(fullName, elementId) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const names = fullName.trim().split(' ');
  let initials = '';

  if (names.length >= 2) {
    initials = names[0][0] + names[names.length - 1][0];
  } else if (names.length === 1) {
    initials = names[0][0];
  }

  element.innerHTML = `<span>${initials.toUpperCase()}</span>`;
}

// ---------- GESTION DE L'UTILISATEUR ----------
function saveUser(user) {
  currentUser = user;
  localStorage.setItem('nova_user', JSON.stringify(user));
  console.log("Utilisateur sauvegardé :", user);
}

function loadUser() {
  const stored = localStorage.getItem('nova_user');
  if (stored) {
    try {
      currentUser = JSON.parse(stored);
      console.log("Utilisateur chargé :", currentUser);
      updateUIWithUser();
      return currentUser;
    } catch (e) {
      console.error("Erreur parsing user :", e);
      return null;
    }
  }
  return null;
}

function logout() {
  currentUser = null;
  localStorage.removeItem('nova_user');
  console.log("Utilisateur déconnecté");
  showView('view-login');
}

function updateUIWithUser() {
  if (!currentUser) return;

  const profileName = document.getElementById('profile-name');
  const profileEmail = document.getElementById('profile-email');

  if (profileName) profileName.textContent = currentUser.name || "Utilisateur";
  if (profileEmail) profileEmail.textContent = currentUser.email || "email@nova.com";

  if (currentUser.name) {
    setAvatarInitials(currentUser.name, 'feed-avatar');
    setAvatarInitials(currentUser.name, 'profile-avatar');
  }
}

// ---------- GÉOLOCALISATION ----------
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        console.log(`Position : ${lat}, ${lng}`);
        alert(`Position récupérée : ${lat}, ${lng}`);
      },
      (error) => {
        alert("Impossible de récupérer ta position. Saisis-la manuellement.");
      }
    );
  } else {
    alert("La géolocalisation n'est pas supportée par ton navigateur.");
  }
}

// ---------- INITIALISATION DU FEED ----------
function initFeed() {
  generateFeed();
  updateFeedActions(0);
  attachFeedInteractions();
  observeFeedItems();
}

// ---------- AUTHENTIFICATION ----------
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;

    const user = {
      name: email.split('@')[0],
      email: email,
      loggedInAt: new Date().toISOString()
    };

    saveUser(user);
    await showView('view-feed');
  });
}

const registerForm = document.getElementById('register-form');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const phone = document.getElementById('register-phone').value;
    const address = document.getElementById('register-address').value;
    const city = document.getElementById('register-city').value;
    const country = document.getElementById('register-country').value;

    const user = {
      name: name,
      email: email,
      phone: phone,
      address: address,
      city: city,
      country: country,
      registeredAt: new Date().toISOString()
    };

    saveUser(user);
    await showView('view-feed');
  });
}

// ---------- DÉMARRAGE ----------
document.addEventListener('DOMContentLoaded', () => {
  console.log("Nova est prêt !");

  // Lancer le splash screen
  showSplashScreen();

  // Charger l'utilisateur et initialiser le feed APRÈS le splash
  setTimeout(() => {
    const user = loadUser();
    initFeed();

    if (user) {
      showView('view-feed');
    } else {
      showView('view-login');
    }
  }, 3800);
});