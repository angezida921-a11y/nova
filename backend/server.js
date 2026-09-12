// ============================================
// NOVA - Backend Node.js + Express
// ============================================

// ---------- IMPORTS ----------
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// ---------- CONFIGURATION ----------
const app = express();
const PORT = process.env.PORT || 3000;

// ---------- MIDDLEWARE ----------
app.use(cors());
app.use(express.json());

// ---------- CONNEXION SUPABASE ----------
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

console.log('✅ Connexion Supabase initialisée');
console.log('📍 URL :', process.env.SUPABASE_URL);

// ============================================
// ROUTES
// ============================================

// ---------- ROUTE DE TEST ----------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Nova Backend est en ligne !',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// ---------- ROUTE : TOUS LES PRODUITS ----------
app.get('/api/products', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      count: data.length,
      products: data
    });
  } catch (error) {
    console.error('❌ Erreur /api/products :', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ---------- ROUTE : UN PORTEFEUILLE ----------
app.get('/api/wallet/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;

    res.json({
      success: true,
      wallet: data
    });
  } catch (error) {
    console.error('❌ Erreur /api/wallet :', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ---------- ROUTE : UN UTILISATEUR ----------
app.get('/api/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;

    res.json({
      success: true,
      user: data
    });
  } catch (error) {
    console.error('❌ Erreur /api/users :', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ---------- ROUTE : TOUS LES UTILISATEURS ----------
app.get('/api/users', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      count: data.length,
      users: data
    });
  } catch (error) {
    console.error('❌ Erreur /api/users :', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ---------- ROUTE 404 (par défaut) ----------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route non trouvée',
    path: req.path
  });
});

// ============================================
// DÉMARRAGE DU SERVEUR
// ============================================
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 ====================================');
  console.log(`🚀 Nova Backend démarré sur le port ${PORT}`);
  console.log(`🚀 http://localhost:${PORT}`);
  console.log('🚀 ====================================');
  console.log('');
});