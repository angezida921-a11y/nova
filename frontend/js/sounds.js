// ============================================
// NOVA - Bruitages (Web Audio API)
// ============================================

// Contexte audio (créé au premier clic utilisateur)
let audioContext = null;

// Initialiser le contexte audio (au premier clic)
function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
}

// Fonction générique pour jouer un son
function playTone(frequency, duration, type = 'sine', volume = 0.15) {
  if (!audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

  gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
}

// ---------- SONS PRÉDÉFINIS ----------

// Son "Like" : Pop cristallin (deux tons qui montent)
function playLikeSound() {
  playTone(880, 0.1, 'sine', 0.2);
  setTimeout(() => playTone(1320, 0.15, 'sine', 0.15), 50);
}

// Son "Favori" : Ding doré (trois tons harmonieux)
function playBookmarkSound() {
  playTone(1046, 0.08, 'triangle', 0.15);
  setTimeout(() => playTone(1318, 0.1, 'triangle', 0.12), 60);
  setTimeout(() => playTone(1568, 0.15, 'triangle', 0.1), 120);
}

// Son "Suivre" : Click satisfaisant (deux tons courts)
function playFollowSound() {
  playTone(600, 0.05, 'square', 0.1);
  setTimeout(() => playTone(900, 0.08, 'square', 0.08), 40);
}

// Son "Navigation" : Whoosh subtil (fréquence qui descend)
function playNavSound() {
  if (!audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.2);

  gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.2);
}

// Son "Bouton" : Tap luxueux (deux tons bas)
function playButtonSound() {
  playTone(523, 0.06, 'sine', 0.12);
  setTimeout(() => playTone(659, 0.1, 'sine', 0.1), 50);
}

// Son "Acheter" : Son luxueux (accord majeur)
function playBuySound() {
  playTone(659, 0.1, 'sine', 0.15);  // E
  setTimeout(() => playTone(830, 0.1, 'sine', 0.12), 80);  // G#
  setTimeout(() => playTone(987, 0.2, 'sine', 0.1), 160);  // B
}

// Son "Réserver" : Son élégant (deux tons)
function playReserveSound() {
  playTone(740, 0.1, 'triangle', 0.15);
  setTimeout(() => playTone(987, 0.15, 'triangle', 0.12), 80);
}

// Son "Erreur" : Buzzer discret
function playErrorSound() {
  playTone(200, 0.15, 'sawtooth', 0.1);
  setTimeout(() => playTone(150, 0.2, 'sawtooth', 0.08), 100);
}

// Son "Succès" : Petit jingle joyeux
function playSuccessSound() {
  playTone(523, 0.08, 'sine', 0.15);
  setTimeout(() => playTone(659, 0.08, 'sine', 0.12), 80);
  setTimeout(() => playTone(784, 0.08, 'sine', 0.12), 160);
  setTimeout(() => playTone(1046, 0.2, 'sine', 0.15), 240);
}

// ---------- ACTIVATION AU PREMIER CLIC ----------
document.addEventListener('click', function activateAudio() {
  initAudio();
  document.removeEventListener('click', activateAudio);
}, { once: true });

document.addEventListener('touchstart', function activateAudioTouch() {
  initAudio();
  document.removeEventListener('touchstart', activateAudioTouch);
}, { once: true });

// ---------- EXPORT (pour utilisation dans app.js) ----------
window.NovaSounds = {
  like: playLikeSound,
  bookmark: playBookmarkSound,
  follow: playFollowSound,
  nav: playNavSound,
  button: playButtonSound,
  buy: playBuySound,
  reserve: playReserveSound,
  error: playErrorSound,
  success: playSuccessSound
};