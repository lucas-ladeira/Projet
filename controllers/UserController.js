const User = require('../models/User');

exports.getAllusers = async (req, res) => {
  try {
    if (!req.session.userId || req.session.user.role !== 'admin') {
      return res.redirect(req.session.userId ? '/shop' : '/user/login');
    }
    
    const users = await User.find();

    res.render('Users', { users });

  } catch (error) {
    res.status(500).render('error', { message: error.message });
  }
};

exports.getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    res.render('User', user);

  } catch (error) {
    res.status(500).render('error', { message: error.message });

  }
};

exports.addSingleUser = async (req, res) => {
  try {
    await User.create(req.body);
    res.redirect('/admin/users');

  } catch (error) {
    res.status(500).render('error', { message: error.message });
  }
};

exports.updateSingleUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.body.password === '') {
      delete req.body.password
    }
    await User.findByIdAndUpdate(id, req.body);
    res.redirect('/admin/users');

  } catch (error) {
    res.status(500).render('error', { message: error.message });
  }
};

exports.deleteSingleUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (user.role === 'admin') {
      return res.status(403).render('error', {
        message: 'Admins cannot be deleted.',
      });
    }

    await User.findByIdAndDelete(id);
    res.redirect('/admin/users');

  } catch (error) {
    res.status(500).render('error', { message: error.message });
  }
};
