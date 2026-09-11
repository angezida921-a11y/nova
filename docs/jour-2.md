# Jour 2 : Structure HTML + Design

## Ce qu'on a fait

### 1. Structure HTML complète (SPA)
- 8 vues créées : Connexion, Inscription, Feed, Profil, Wallet, Publier, Recherche, Notifications.
- Chaque vue est une `<section>` avec un `id` unique.
- Une seule vue est visible à la fois (`display: flex` sur `.active`).

### 2. Design Luxe (Noir + Or)
- Palette : noir profond `#0a0a0a` + or `#D4AF37`.
- Police : `Inter` (texte) + `Playfair Display` (titres).
- Logo NOVA en dégradé or avec glow.
- Boutons principaux en dégradé or.
- Cartes et bordures avec accents dorés.

### 3. Icônes SVG (pas d'emoji, pas de sticker)
- Toutes les icônes sont des SVG vectoriels.
- Une seule couleur par icône (via `currentColor`).
- États actifs : Like (rouge), Favoris (or), Acheter (or), Réserver (bleu), Nav (or).

### 4. Animations
- Like : pulse (scale 1 → 1.4 → 0.9 → 1).
- Favoris : pop + rotation.
- Suivre : le "+" devient "✓".
- Navigation : scale + glow doré.

### 5. Avatar (Correction)
- Suppression du "ballon de rugby" (image cassée).
- Avatar = cercle doré avec initiales du nom.
- Fonction `setAvatarInitiales()` dans `app.js`.

### 6. Simulation d'authentification
- Le formulaire d'inscription/connexion bascule vers le feed.
- À remplacer au Jour 9 par Supabase Auth.

## Fichiers modifiés
- `frontend/index.html`
- `frontend/css/style.css`
- `frontend/js/app.js`

## Prochaine étape (Jour 3)
- CSS avancé : animations, transitions, responsive.
- Amélioration du feed (vidéos, scroll vertical).