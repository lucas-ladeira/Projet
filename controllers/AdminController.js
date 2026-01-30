const User = require('../models/User');
const Product = require('../models/Product');

exports.getAdminDashboard = async (req, res) => {
  try {
    if (!req.session.userId || req.session.user.role !== 'admin') {
      return res.redirect(req.session.userId ? '/shop' : '/user/login');
    }

    const users = await User.find();
    const products = await Product.find();
    res.render('AdminDashboard', { users, products });
  } catch (error) {
    res.status(500).render('error', { message: error.message });
  }
};
