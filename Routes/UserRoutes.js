const express = require('express');
const router = express.Router();
const {signUp,login} = require('../Controllers/userController');


//signup route
router.route('/signup').post(signUp);

//login route
router.route('/login').post(login);

module.exports = router;