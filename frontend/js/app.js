// ============================================
// NOVA - Logique principale
// ============================================

// ---------- NAVIGATION ENTRE LES VUES (avec transitions) ----------
function showView(viewId) {
  const allViews = document.querySelectorAll('.view');
  const targetView = document.getElementById(viewId);

  if (!targetView) return;

  // Jouer le son de navigation
  if (window.NovaSounds) {
    window.NovaSounds.nav();
  }

  // Cacher toutes les vues actives avec une transition
  allViews.forEach(view => {
    if (view.classList.contains('active')) {
      view.classList.add('leaving');
      setTimeout(() => {
        view.classList.remove('active', 'leaving');
      }, 300);
    }
  });

  // Afficher la nouvelle vue après un léger délai
  setTimeout(() => {
    targetView.classList.add('active');
    window.scrollTo(0, 0);

    const feedContainer = document.getElementById('feed-container');
    if (feedContainer && viewId === 'view-feed') {
      feedContainer.scrollTop = 0;
    }
  }, 300);
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

// ---------- INTERACTIONS DES ICÔNES (avec sons) ----------

// Like
document.querySelectorAll('.like-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    this.classList.toggle('active');
    
    if (this.classList.contains('active') && window.NovaSounds) {
      window.NovaSounds.like();
    } else if (window.NovaSounds) {
      window.NovaSounds.button();
    }
  });
});

// Favoris
document.querySelectorAll('.bookmark-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    this.classList.toggle('active');
    
    if (this.classList.contains('active') && window.NovaSounds) {
      window.NovaSounds.bookmark();
    } else if (window.NovaSounds) {
      window.NovaSounds.button();
    }
  });
});

// Suivre
const followBtn = document.getElementById('follow-btn');
if (followBtn) {
  followBtn.addEventListener('click', function () {
    this.classList.toggle('following');

    if (this.classList.contains('following')) {
      if (window.NovaSounds) window.NovaSounds.follow();
      this.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      `;
    } else {
      if (window.NovaSounds) window.NovaSounds.button();
      this.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      `;
    }
  });
}

// Boutons ACHETER et RÉSERVER
document.querySelectorAll('.buy-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    if (window.NovaSounds) window.NovaSounds.buy();
  });
});

document.querySelectorAll('.reserve-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    if (window.NovaSounds) window.NovaSounds.reserve();
  });
});

// Boutons principaux
document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('click', function () {
    if (window.NovaSounds) window.NovaSounds.button();
  });
});

// Boutons secondaires
document.querySelectorAll('.btn-secondary').forEach(btn => {
  btn.addEventListener('click', function () {
    if (window.NovaSounds) window.NovaSounds.button();
  });
});

// ---------- SIMULATION D'AUTHENTIFICATION ----------
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    console.log("Connexion simulée :", email);
    showView('view-feed');
  });
}

const registerForm = document.getElementById('register-form');
if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    console.log("Inscription simulée :", name, email);

    setAvatarInitials(name, 'feed-avatar');
    setAvatarInitials(name, 'profile-avatar');

    const profileName = document.getElementById('profile-name');
    const profileEmail = document.getElementById('profile-email');
    if (profileName) profileName.textContent = name;
    if (profileEmail) profileEmail.textContent = email;

    showView('view-feed');
  });
}

// ---------- DÉMARRAGE ----------
document.addEventListener('DOMContentLoaded', () => {
  showView('view-login');
  console.log("Nova est prêt !");
});