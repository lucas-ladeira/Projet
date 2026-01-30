const express = require('express');
const { getLogin, postLogin, getRegister, postRegister, getLogout } = require('../controllers/AccessController');
const router = express.Router();

router.route('/login')
    .get(getLogin)
    .post(postLogin);

router.route('/register')
    .get(getRegister)
    .post(postRegister);

router.route('/logout')
    .get(getLogout);

module.exports = router;
