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

// ---------- ROUTE : DÉPÔT DANS LE WALLET ----------
app.post('/api/wallet/deposit', async (req, res) => {
  try {
    const { userId, amountNova, amountFCFA, paymentMethod } = req.body;

    // Validation
    if (!userId || !amountNova || amountNova <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Données invalides : userId et amountNova requis'
      });
    }

    // 1. Récupérer le wallet actuel
    const { data: wallet, error: walletError } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (walletError) throw walletError;

    // 2. Calculer le nouveau solde
    const newBalance = parseFloat(wallet.balance_nova) + parseFloat(amountNova);

    // 3. Mettre à jour le wallet
    const { data: updatedWallet, error: updateError } = await supabase
      .from('wallets')
      .update({
        balance_nova: newBalance,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (updateError) throw updateError;

    // 4. Enregistrer la transaction
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        type: 'deposit',
        amount_nova: amountNova,
        amount_fcfa: amountFCFA || amountNova * 10,
        status: 'completed',
        reference: paymentMethod || 'simulation'
      })
      .select()
      .single();

    if (transactionError) throw transactionError;

    // 5. Renvoyer le résultat
    res.json({
      success: true,
      message: 'Dépôt effectué avec succès',
      wallet: updatedWallet,
      transaction: transaction
    });

  } catch (error) {
    console.error('❌ Erreur /api/wallet/deposit :', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ---------- ROUTE : HISTORIQUE DES TRANSACTIONS ----------
app.get('/api/transactions/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    res.json({
      success: true,
      count: data.length,
      transactions: data
    });
  } catch (error) {
    console.error('❌ Erreur /api/transactions :', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============================================
// ROUTE : PUBLICATION D'UN PRODUIT (PAYANTE)
// ============================================
app.post('/api/products/publish', async (req, res) => {
  try {
    const { userId, title, description, mediaUrl, mediaType, priceNova, stock, duration } = req.body;

    // Validation
    if (!userId || !title || !mediaUrl || !mediaType || !priceNova) {
      return res.status(400).json({ success: false, error: 'Champs obligatoires manquants' });
    }

    if (!['video', 'photo'].includes(mediaType)) {
      return res.status(400).json({ success: false, error: 'mediaType doit être "video" ou "photo"' });
    }

    // ---------- CALCUL DES FRAIS ----------
    let feeNova = 0;
    if (mediaType === 'photo') {
      feeNova = 0.5;
    } else if (mediaType === 'video') {
      if (!duration || duration <= 30) feeNova = 1;
      else if (duration <= 60) feeNova = 1.2;
      else feeNova = 1.5;
    }

    console.log(`💰 Frais de publication : ${feeNova} Nova`);

    // ---------- VÉRIFIER LE SOLDE ----------
    const { data: wallet, error: walletError } = await supabase
      .from('wallets').select('*').eq('user_id', userId).single();

    if (walletError) throw walletError;

    if (parseFloat(wallet.balance_nova) < feeNova) {
      return res.status(400).json({
        success: false,
        error: `Solde insuffisant. Tu as ${wallet.balance_nova} Nova, il faut ${feeNova} Nova.`,
        required: feeNova,
        current: wallet.balance_nova
      });
    }

    // ---------- DÉBITER LE WALLET ----------
    const newBalance = parseFloat(wallet.balance_nova) - feeNova;
    const { data: updatedWallet, error: updateError } = await supabase
      .from('wallets')
      .update({ balance_nova: newBalance, updated_at: new Date().toISOString() })
      .eq('user_id', userId).select().single();

    if (updateError) throw updateError;

    // ---------- CRÉER LE PRODUIT ----------
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        seller_id: userId,
        title: title,
        description: description || '',
        media_url: mediaUrl,
        media_type: mediaType,
        price_nova: priceNova,
        stock: stock || 1,
        is_active: true
      })
      .select().single();

    if (productError) throw productError;

    // ---------- ENREGISTRER LA TRANSACTION ----------
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        type: 'publication_fee',
        amount_nova: -feeNova,
        amount_fcfa: -feeNova * 10,
        status: 'completed',
        reference: `publication_${product.id}`
      })
      .select().single();

    if (transactionError) throw transactionError;

    // ---------- RÉPONSE ----------
    res.json({
      success: true,
      message: 'Publication réussie',
      product: product,
      wallet: updatedWallet,
      transaction: transaction,
      fee: feeNova
    });

  } catch (error) {
    console.error('❌ Erreur /api/products/publish :', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// ROUTE : PRODUITS D'UN VENDEUR
// ============================================
app.get('/api/products/seller/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { data, error } = await supabase
      .from('products').select('*').eq('seller_id', userId).order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, count: data.length, products: data });
  } catch (error) {
    console.error('❌ Erreur /api/products/seller :', error);
    res.status(500).json({ success: false, error: error.message });
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