// ============================================
// NOVA - Logique principale
// ============================================

// ---------- NAVIGATION ENTRE LES VUES ----------
function showView(viewId) {
  const allViews = document.querySelectorAll('.view');
  allViews.forEach(view => view.classList.remove('active'));

  const targetView = document.getElementById(viewId);
  if (targetView) {
    targetView.classList.add('active');
  }

  window.scrollTo(0, 0);
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
/**
 * Affiche les initiales d'un utilisateur dans l'avatar
 * @param {string} fullName - Nom complet de l'utilisateur
 * @param {string} elementId - ID de l'élément avatar
 */
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

// ---------- INTERACTIONS DES ICÔNES ----------

// Like
document.querySelectorAll('.like-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    this.classList.toggle('active');
  });
});

// Favoris
document.querySelectorAll('.bookmark-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    this.classList.toggle('active');
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

// ---------- SIMULATION D'AUTHENTIFICATION ----------
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    console.log("Connexion simulée :", email);

    // Exemple : mettre à jour l'avatar avec un nom fictif
    // setAvatarInitials("Awa Diallo", "feed-avatar");
    // setAvatarInitials("Awa Diallo", "profile-avatar");

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

    // Mettre à jour l'avatar avec les initiales du nouvel utilisateur
    setAvatarInitials(name, 'feed-avatar');
    setAvatarInitials(name, 'profile-avatar');

    // Mettre à jour le nom et l'email dans le profil
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