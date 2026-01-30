const User = require('../models/User');

exports.getLogin = async (req, res) => {
  try {
    if (req.session.userId) {
      return req.session.user.role === 'admin' ? res.redirect('/admin') : res.redirect('/shop');
    }
    return res.render('Login', { error: null });
  } catch (error) {
    return res.status(500).render('error', { message: error.message });
  }
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !await user.comparePassword(password)) {
    return res.render('Login', { error: 'Incorrect email and/or password.' });
  }
  req.session.userId = user._id;
  req.session.user = { name: user.name, role: user.role, email: user.email };
  user.role === 'admin' ? res.redirect('/admin') : res.redirect('/shop');
};

exports.getRegister = async (req, res) => {
  try {
    res.render('Register');
  } catch (error) {
    res.status(500).render('error', { message: error.message });
  }
};

exports.postRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    await User.create({ name, email, password });
    res.redirect('/user/login');
  } catch (error) {
    res.status(500).render('error', { message: error.message });
  }
};

exports.getLogout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect('/');
  } catch (error) {
    res.status(500).render('error', { message: error.message });
  }
};