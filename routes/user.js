const router = require('express').Router();
const wrapAsync = require('../utils/wrapAsync');
const { mongoose, db } = require('../db/mongodb');
const AppError = require('../utils/AppError');
const User = require('../models/user');
const passport = require('passport');
const userController = require('../controllers/user')


router.route('/register')
    .get(userController.getRegister)
    .post(wrapAsync(userController.postRegister))

router.route('/login')
    .get(userController.getLoginForm)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: ('/login')}) , userController.login)


router.get('/logout', userController.logout);

router.get('/details', userController.getDetails);



module.exports = router;