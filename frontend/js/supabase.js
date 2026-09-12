// ============================================
// NOVA - Client Supabase
// ============================================

// Vérifier que la config est chargée
if (!window.NovaConfig) {
  console.error('❌ NovaConfig non trouvé. Vérifie que config.js est bien chargé AVANT supabase.js.');
}

// Vérifier que Supabase est chargé (depuis le CDN)
if (typeof supabase === 'undefined') {
  console.error('❌ Supabase JS non chargé. Vérifie le CDN dans index.html.');
}

// Créer le client Supabase
const supabaseClient = supabase.createClient(
  window.NovaConfig.SUPABASE_URL,
  window.NovaConfig.SUPABASE_ANON_KEY
);

console.log('✅ Client Supabase initialisé');

// Export
window.NovaSupabase = supabaseClient;