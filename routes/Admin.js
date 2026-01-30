const express = require('express');
const { getAdminDashboard } = require('../controllers/AdminController');
const { getAllusers, getSingleUser, addSingleUser, updateSingleUser, deleteSingleUser } = require('../controllers/UserController');
const { getAllProducts, getSingleProduct, addSingleProduct, updateSingleProduct, deleteSingleProduct, uploadImage } = require('../controllers/ProductController');
const router = express.Router();

router.route('/')
  .get(getAdminDashboard);

router.route('/users')
  .get(getAllusers)
  .post(addSingleUser);

router.route('/users/:id')
  .get(getSingleUser)
  .put(updateSingleUser)
  .delete(deleteSingleUser);

// Products Routes
router.route('/products')
  .get(getAllProducts)
  .post(uploadImage, addSingleProduct); // Ajout de uploadImage

router.route('/products/:id')
  .get(getSingleProduct)
  .put(uploadImage, updateSingleProduct) // Ajout de uploadImage
  .delete(deleteSingleProduct);

module.exports = router;