//importing modules
const express = require('express')
const userController = require('../Controllers/userController')
const { signup, login, emailVerif } = userController
const userAuth = require('../Middlewares/userAuth.js')
const app = express();

const router = express.Router();



//signup route
router.post('/signup', userAuth.saveUser, signup
);

//login route
router.post('/login', login);

//email verification
router.get('/verify/:token', emailVerif);

module.exports = router