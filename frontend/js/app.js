// ============================================
// NOVA - Logique principale (Jour 9 + Navigation instantanée)
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

// ---------- SPLASH SCREEN (2,5s) ----------
function showSplashScreen() {
  const splash = document.getElementById('splash-screen');
  const status = document.getElementById('splash-status');
  const loaderBar = document.querySelector('.splash-loader-bar');

  if (!splash) return;

  const steps = [
    { text: 'Initialisation...', duration: 500, progress: 20 },
    { text: 'Chargement des ressources...', duration: 500, progress: 45 },
    { text: 'Préparation du feed...', duration: 500, progress: 70 },
    { text: 'Connexion au serveur...', duration: 500, progress: 90 },
    { text: 'Bienvenue sur Nova ✨', duration: 500, progress: 100 }
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

// ---------- ÉCRAN DE TRANSITION (pour opérations longues uniquement) ----------
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

// ============================================
// NAVIGATION ENTRE LES VUES (INSTANTANÉE)
// ============================================
async function showView(viewId) {
  const allViews = document.querySelectorAll('.view');
  const targetView = document.getElementById(viewId);

  if (!targetView) return;
  if (targetView.classList.contains('active')) return;

  // Cacher l'ancienne vue (transition CSS)
  const currentView = document.querySelector('.view.active');
  if (currentView) {
    currentView.classList.add('leaving');
    setTimeout(() => {
      currentView.classList.remove('active', 'leaving');
    }, 300);
  }

  // Afficher la nouvelle vue (transition CSS)
  setTimeout(() => {
    targetView.classList.add('active');
    window.scrollTo(0, 0);

    const feedContainer = document.getElementById('feed-container');
    if (feedContainer && viewId === 'view-feed') {
      feedContainer.scrollTop = 0;
    }
  }, 50);

  // Charger les publications quand on va sur le profil
  if (viewId === 'view-profile') {
    setTimeout(() => loadMyPublications(), 300);
  }

}

// ---------- FORMATAGE DES NOMBRES ----------
function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
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
  }, { threshold: 0.6 });

  feedItems.forEach(item => observer.observe(item));
}

// ---------- ÉTATS LIKES / FAVORIS ----------
function updateLikeState(videoId) {
  const likeBtn = document.querySelector('.like-btn');
  if (!likeBtn) return;
  const saved = localStorage.getItem(`nova_like_${videoId}`);
  if (saved === 'true') likeBtn.classList.add('active');
  else likeBtn.classList.remove('active');
}

function updateBookmarkState(videoId) {
  const bookmarkBtn = document.querySelector('.bookmark-btn');
  if (!bookmarkBtn) return;
  const saved = localStorage.getItem(`nova_bookmark_${videoId}`);
  if (saved === 'true') bookmarkBtn.classList.add('active');
  else bookmarkBtn.classList.remove('active');
}

// ---------- INTERACTIONS DU FEED ----------
function attachFeedInteractions() {
  document.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const videoId = videosData[currentVideoIndex].id;
      const key = `nova_like_${videoId}`;
      const isActive = this.classList.toggle('active');
      localStorage.setItem(key, isActive ? 'true' : 'false');
    });
  });

  document.querySelectorAll('.bookmark-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const videoId = videosData[currentVideoIndex].id;
      const key = `nova_bookmark_${videoId}`;
      const isActive = this.classList.toggle('active');
      localStorage.setItem(key, isActive ? 'true' : 'false');
    });
  });

  const followBtn = document.getElementById('follow-btn');
  if (followBtn) {
    followBtn.addEventListener('click', function () {
      this.classList.toggle('following');

      if (this.classList.contains('following')) {
        this.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
      } else {
        this.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
      }
    });
  }

  const buyBtn = document.querySelector('.buy-btn');
  if (buyBtn) {
    buyBtn.addEventListener('click', function () {
      const video = videosData[currentVideoIndex];
      alert(`Achat de "${video.title}" pour ${video.price.toLocaleString('fr-FR')} Nova`);
    });
  }

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

  if (progressInterval) clearInterval(progressInterval);

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

function goToNextVideo() {
  const feedContainer = document.getElementById('feed-container');
  if (!feedContainer) return;

  const nextIndex = currentVideoIndex + 1;
  if (nextIndex < videosData.length) {
    const nextVideo = feedContainer.querySelector(`[data-video-id="${videosData[nextIndex].id}"]`);
    if (nextVideo) nextVideo.scrollIntoView({ behavior: 'smooth' });
  }
}

// ---------- GESTION DE L'AVATAR ----------
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
  console.log("💾 Utilisateur sauvegardé :", user);
}

function loadUser() {
  const stored = localStorage.getItem('nova_user');
  if (stored) {
    try {
      currentUser = JSON.parse(stored);
      console.log("📂 Utilisateur chargé :", currentUser);
      updateUIWithUser();
      return currentUser;
    } catch (e) {
      console.error("Erreur parsing user :", e);
      return null;
    }
  }
  return null;
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

  // Mettre à jour le wallet
  const walletBalance = document.getElementById('wallet-balance');
  if (walletBalance) {
    walletBalance.textContent = currentUser.balance || 0;
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

// ============================================
// AUTHENTIFICATION SUPABASE
// ============================================

// ---------- INSCRIPTION ----------
const registerForm = document.getElementById('register-form');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    console.log("📝 Formulaire d'inscription soumis");

    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const passwordConfirm = document.getElementById('register-password-confirm').value;
    const phone = document.getElementById('register-phone').value.trim();
    const birthdate = document.getElementById('register-birthdate').value;
    const address = document.getElementById('register-address').value.trim();
    const city = document.getElementById('register-city').value.trim();
    const country = document.getElementById('register-country').value.trim();

    if (password !== passwordConfirm) {
      alert("❌ Les mots de passe ne correspondent pas.");
      return;
    }

    if (password.length < 6) {
      alert("❌ Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    const submitBtn = registerForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Création en cours...";
    submitBtn.disabled = true;

    try {
      console.log("📝 Tentative d'inscription pour :", email);

      const { data, error } = await window.NovaSupabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: name,
            phone: phone,
            birthdate: birthdate,
            address: address,
            city: city,
            country: country
          }
        }
      });

      if (error) {
        console.error("❌ Erreur inscription :", error);
        alert(`❌ Erreur : ${error.message}`);
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        return;
      }

      console.log("✅ Inscription réussie :", data);

      const user = {
        id: data.user?.id,
        name: name,
        email: email,
        phone: phone,
        address: address,
        city: city,
        country: country,
        registeredAt: new Date().toISOString()
      };

      saveUser(user);
      updateUIWithUser();

      // Navigation instantanée vers le feed
      await showView('view-feed');

    } catch (error) {
      console.error("❌ Erreur inattendue :", error);
      alert("❌ Une erreur est survenue : " + error.message);
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

// ---------- CONNEXION ----------
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    console.log("🔐 Formulaire de connexion soumis");

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
      alert("❌ Email et mot de passe obligatoires.");
      return;
    }

    const submitBtn = loginForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Connexion...";
    submitBtn.disabled = true;

    try {
      console.log("🔐 Tentative de connexion pour :", email);

      const { data, error } = await window.NovaSupabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (error) {
        console.error("❌ Erreur connexion :", error);
        alert(`❌ Erreur : ${error.message}`);
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        return;
      }

      console.log("✅ Connexion réussie :", data);

      const user = {
        id: data.user.id,
        name: data.user.user_metadata?.full_name || email.split('@')[0],
        email: data.user.email,
        phone: data.user.user_metadata?.phone || '',
        address: data.user.user_metadata?.address || '',
        city: data.user.user_metadata?.city || '',
        country: data.user.user_metadata?.country || '',
        loggedInAt: new Date().toISOString()
      };

      saveUser(user);
      updateUIWithUser();

      // Navigation instantanée vers le feed
      await showView('view-feed');

    } catch (error) {
      console.error("❌ Erreur inattendue :", error);
      alert("❌ Une erreur est survenue : " + error.message);
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

// ---------- DÉCONNEXION ----------
async function logout() {
  try {
    console.log("🚪 Déconnexion...");
    await window.NovaSupabase.auth.signOut();
    currentUser = null;
    localStorage.removeItem('nova_user');

    // Navigation instantanée vers la connexion
    await showView('view-login');
  } catch (error) {
    console.error("❌ Erreur déconnexion :", error);
  }
}

// ---------- VÉRIFICATION DE SESSION ----------
async function checkSession() {
  try {
    const { data, error } = await window.NovaSupabase.auth.getSession();

    if (error) {
      console.error("❌ Erreur session :", error);
      return null;
    }

    if (data.session) {
      console.log("✅ Session active :", data.session.user.email);

      const { data: userData, error: userError } = await window.NovaSupabase
        .from('users')
        .select('*')
        .eq('id', data.session.user.id)
        .single();

      if (userError) {
        console.error("❌ Erreur récupération user :", userError);
        const user = {
          id: data.session.user.id,
          name: data.session.user.user_metadata?.full_name || data.session.user.email.split('@')[0],
          email: data.session.user.email
        };
        saveUser(user);
updateUIWithUser();
loadTransactions();
loadMyPublications(); // ← AJOUTE CETTE LIGNE
return user;
      }

      const { data: walletData } = await window.NovaSupabase
        .from('wallets')
        .select('balance_nova')
        .eq('user_id', data.session.user.id)
        .single();

      const user = {
        id: userData.id,
        name: userData.full_name,
        email: userData.email,
        phone: userData.phone,
        address: userData.location_address,
        city: userData.city,
        country: userData.country,
        isSeller: userData.is_seller,
        isDeliverer: userData.is_deliverer,
        balance: walletData?.balance_nova || 0
      };

      saveUser(user);
      updateUIWithUser();
      return user;
    }

    console.log("ℹ️ Aucune session active");
    return null;
  } catch (error) {
    console.error("❌ Erreur vérification session :", error);
    return null;
  }
}

// ---------- ÉCOUTE DES CHANGEMENTS D'AUTH ----------
window.NovaSupabase.auth.onAuthStateChange((event, session) => {
  console.log("🔄 Auth state changed :", event);

  if (event === 'SIGNED_OUT') {
    currentUser = null;
    localStorage.removeItem('nova_user');
  }
});

// ---------- DÉMARRAGE ----------
document.addEventListener('DOMContentLoaded', async () => {
  console.log("🚀 Nova est prêt !");

  showSplashScreen();

  setTimeout(async () => {
    const user = await checkSession();

    initFeed();

    if (user) {
      await showView('view-feed');
    } else {
      await showView('view-login');
    }
  
  
  }, 2500);

  
});

// ============================================
// JOUR 10 : MODALE DE DÉPÔT
// ============================================
let selectedPaymentMethod = 'orange_money';

function openDepositModal() {
  const modal = document.getElementById('deposit-modal');
  if (modal) {
    modal.classList.add('visible');
    document.getElementById('deposit-amount-fcfa').value = '';
    document.getElementById('deposit-conversion').textContent = '0 Nova';
  }
}

function closeDepositModal() {
  const modal = document.getElementById('deposit-modal');
  if (modal) modal.classList.remove('visible');
}

async function confirmDeposit() {
  if (!currentUser) { alert("❌ Connecte-toi."); return; }
  const fcfa = parseFloat(document.getElementById('deposit-amount-fcfa').value);
  if (!fcfa || fcfa < 100) { alert("❌ Montant minimum : 100 FCFA."); return; }

  const nova = fcfa / 10;
  const confirmBtn = document.getElementById('deposit-confirm-btn');
  confirmBtn.textContent = 'Traitement...';
  confirmBtn.disabled = true;

  try {
    const response = await fetch('http://localhost:3000/api/wallet/deposit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser.id, amountNova: nova, amountFCFA: fcfa, paymentMethod: selectedPaymentMethod })
    });

    const result = await response.json();
    if (!result.success) { alert(`❌ ${result.error}`); return; }

    currentUser.balance = result.wallet.balance_nova;
    saveUser(currentUser);
    updateUIWithUser();

    alert(`✅ Dépôt de ${fcfa} FCFA effectué ! Tu as ${result.wallet.balance_nova} Nova.`);
    closeDepositModal();
    loadTransactions();
  } catch (error) {
    alert("❌ Erreur : " + error.message);
  } finally {
    confirmBtn.textContent = 'Confirmer le dépôt';
    confirmBtn.disabled = false;
  }
}

async function loadTransactions() {
  if (!currentUser) return;
  try {
    const response = await fetch(`http://localhost:3000/api/transactions/${currentUser.id}`);
    const result = await response.json();
    const container = document.getElementById('wallet-transactions');
    if (!container) return;

    if (!result.transactions || result.transactions.length === 0) {
      container.innerHTML = '<p class="empty-state">Aucune transaction.</p>';
      return;
    }

    container.innerHTML = result.transactions.map(t => `
      <div class="transaction-item">
        <div class="transaction-icon">${t.type === 'deposit' ? '📥' : t.type === 'withdrawal' ? '📤' : '💳'}</div>
        <div class="transaction-info">
          <p class="transaction-type">${t.type}</p>
          <p class="transaction-date">${new Date(t.created_at).toLocaleDateString('fr-FR')}</p>
        </div>
        <div class="transaction-amount ${t.amount_nova > 0 ? 'positive' : 'negative'}">
          ${t.amount_nova > 0 ? '+' : ''}${t.amount_nova} Nova
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error("❌ Transactions :", error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const amountInput = document.getElementById('deposit-amount-fcfa');
  if (amountInput) {
    amountInput.addEventListener('input', function () {
      const fcfa = parseFloat(this.value) || 0;
      document.getElementById('deposit-conversion').textContent = (fcfa / 10).toFixed(2) + ' Nova';
    });
  }

  document.querySelectorAll('.payment-method').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.payment-method').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      selectedPaymentMethod = this.dataset.method;
    });
  });
});

// ============================================
// JOUR 11 : PUBLICATION PAYANTE
// ============================================
const publishForm = document.getElementById('publish-form');
if (publishForm) {
  publishForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log("📝 Formulaire de publication soumis");

    if (!currentUser) {
      alert("❌ Tu dois être connecté.");
      return;
    }

    const title = document.getElementById('publish-title').value.trim();
    const description = document.getElementById('publish-description').value.trim();
    const priceNova = parseFloat(document.getElementById('publish-price').value);
    const stock = parseInt(document.getElementById('publish-stock').value) || 1;
    const mediaFile = document.getElementById('publish-media').files[0];

    if (!title || !priceNova || !mediaFile) {
      alert("❌ Titre, prix et média obligatoires.");
      return;
    }

    const mediaType = mediaFile.type.startsWith('video/') ? 'video' : 'photo';
    const feeNova = mediaType === 'photo' ? 0.5 : 1;

    console.log(`📤 Publication : ${title}, type: ${mediaType}, frais: ${feeNova} Nova`);

    const submitBtn = publishForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Publication en cours...";
    submitBtn.disabled = true;

    try {
      // 1. Upload du média
      const fileName = `${Date.now()}_${mediaFile.name}`;
      console.log("📤 Upload du fichier :", fileName);

      const { data: uploadData, error: uploadError } = await window.NovaSupabase
        .storage
        .from('media')
        .upload(fileName, mediaFile);

      if (uploadError) {
        console.error("❌ Erreur upload :", uploadError);
        alert("❌ Erreur d'upload : " + uploadError.message);
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        return;
      }

      console.log("✅ Upload réussi :", uploadData);

      // Récupérer l'URL publique
      const { data: urlData } = window.NovaSupabase
        .storage
        .from('media')
        .getPublicUrl(fileName);
      const mediaUrl = urlData.publicUrl;

      console.log("🔗 URL du média :", mediaUrl);

      // 2. Appeler l'API de publication
      const response = await fetch('http://localhost:3000/api/products/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          title: title,
          description: description,
          mediaUrl: mediaUrl,
          mediaType: mediaType,
          priceNova: priceNova,
          stock: stock,
          duration: mediaType === 'video' ? 30 : null
        })
      });

      const result = await response.json();
      console.log("📥 Réponse API :", result);

      if (!result.success) {
        alert(`❌ ${result.error}`);
        return;
      }

      currentUser.balance = result.wallet.balance_nova;
      saveUser(currentUser);
      updateUIWithUser();

      alert(`✅ Produit publié ! Frais : ${result.fee} Nova. Nouveau solde : ${result.wallet.balance_nova} Nova.`);
      publishForm.reset();
      await showView('view-feed');

    } catch (error) {
      console.error("❌ Erreur publication :", error);
      alert("❌ Une erreur est survenue : " + error.message);
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

// Afficher les frais en temps réel
const publishMediaInput = document.getElementById('publish-media');
if (publishMediaInput) {
  publishMediaInput.addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;
    const isVideo = file.type.startsWith('video/');
    const feeElement = document.getElementById('publish-fee-amount');
    if (feeElement) feeElement.textContent = isVideo ? '1' : '0.5';
  });
}

console.log("✅ Module de publication chargé");

// ============================================
// MES PUBLICATIONS (Grille)
// ============================================
async function loadMyPublications() {
  if (!currentUser) return;

  const container = document.getElementById('my-publications-list');
  if (!container) return;

  try {
    const response = await fetch(`http://localhost:3000/api/products/seller/${currentUser.id}`);
    const result = await response.json();

    if (!result.success || !result.products || result.products.length === 0) {
      container.innerHTML = '<p class="empty-state">Aucune publication pour l\'instant.</p>';
      return;
    }

    container.innerHTML = result.products.map((p) => {
      // Stats simulées
      const views = Math.floor(((p.id.charCodeAt(0) || 50) * 7) % 2000) + 50;
      const thumbnail = p.media_type === 'video' ? '🎬' : '📷';

      return `
        <div class="publication-grid-item" onclick="alert('${p.title}')">
          <div class="publication-thumb">${thumbnail}</div>
          <div class="publication-overlay">
            <span class="publication-views">👁️ ${views}</span>
            <span class="publication-grid-price">${p.price_nova} N</span>
          </div>
        </div>
      `;
    }).join('');

    console.log(`📦 ${result.products.length} publications chargées`);

  } catch (error) {
    console.error("❌ Erreur chargement publications :", error);
    container.innerHTML = '<p class="empty-state">Erreur de chargement.</p>';
  }
}

// ============================================
// GESTION DES ONGLETS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.profile-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', function () {
      // Désactiver tous les onglets
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      // Cacher tous les contenus
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      // Afficher le bon contenu
      const tabName = this.dataset.tab;
      const content = document.getElementById(`tab-${tabName}`);
      if (content) content.classList.add('active');
    });
  });
});