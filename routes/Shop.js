const express = require('express');
const { getShopRoot, getAllProductsForShop, getCartForShop, addToCartForShop, updateCart, removeToCartForShop, getCheckout } = require('../controllers/ShopController');
const router = express.Router();

router.route('/')
  .get(getShopRoot);

// Route pour afficher les produits aux utilisateurs normaux
router.route('/products')
  .get(getAllProductsForShop)
  .post(addToCartForShop);

// router.route('/products/:id')

router.route('/cart')
  .get(getCartForShop)
  .post(removeToCartForShop);

router.route('/cart/update')
  .post(updateCart);

router.route('/checkout')
  .get(getCheckout);

module.exports = router;