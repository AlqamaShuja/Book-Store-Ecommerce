const express = require("express");

const router = express.Router();

//import
const { signup, signin, signout, requireSignin } = require('../controllers/auth');
const { userSignUpValidator } = require('../validator/index');

router.post('/signup', userSignUpValidator, signup);
router.post('/signin', signin);
router.get('/signout', signout);

module.exports = router;