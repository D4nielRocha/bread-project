const router = require('express').Router();
const wrapAsync = require('../utils/wrapAsync');
const { mongoose, db } = require('../db/mongodb');
const AppError = require('../utils/AppError');
const User = require('../models/user');
const passport = require('passport');


module.exports.getRegister = (req, res) => {
    res.render('user/register');
}

module.exports.postRegister = async (req, res, next) => {
    try{
        const { email, username, password } = req.body;
        const user = new User({email, username});
        const newUser = await User.register(user, password);
        req.login(newUser, err => {
            if(err) return next(err);
        }); 
        req.flash('success', `Welcome ${username}`);
        res.redirect('/bread'); 
    }catch(e){
        req.flash('error', e.message);
        res.redirect('/register');
    }
           
}

module.exports.getLoginForm = (req, res) => {
    res.render('user/login');
}

module.exports.login = async (req, res) => {
    req.flash('success', `Welcome back ${req.body.username}`)
    const redirectUserUrl = req.session.returnToUrl || '/bread';
    delete req.session.returnToUrl;
    res.redirect(redirectUserUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'You have been successfully logged out');
    res.redirect('/bread');
}

module.exports.getDetails = (req, res) => {
    res.render('user/details');
}