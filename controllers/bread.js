const router = require('express').Router();
const { validateBread, validateReview } = require('../validation/middleware');
const Bread = require('../models/bread');
const Review = require('../models/review');
const wrapAsync = require('../utils/wrapAsync');
const { mongoose, db } = require('../db/mongodb');
const AppError = require('../utils/AppError');
const bcrypt = require('bcrypt');
const flash = require('connect-flash');

module.exports.index = async (req, res) => {
    const bread = await Bread.find();
    res.render('bread/index', {bread });
}

module.exports.getNew = (req, res) => {
    res.render('bread/new')
}

module.exports.postNew = async (req, res, next) => {    
    const bread = new Bread(req.body.bread);
    bread.author = req.user._id;//req.user is added in by passport
    //create an array with images uploaded by user and store in bread.image (model - array)
    bread.images = req.files.map( f => ({url: f.path, filename: f.filename}) );
    await bread.save();
    console.log(bread)
    req.flash('success', "New Bread Created Successfully");
    res.redirect(`/bread/${bread._id}`);
}

module.exports.getShow = async(req, res, next) => {
    const bread = await Bread.findById(req.params.id).populate(
        //populate all reviews in Bread
        {path: 'reviews',
        //populate author in each review
        populate: {
            path: 'author'
        }}
        //populate author in Bread  
        ).populate('author');
    // console.log(bread);
    if(!bread){
        req.flash('error', 'Cannot find this Post');
        return res.redirect('/bread');
        // throw new AppError("This Post doesn`t exist...Yet", 500);
    }
    // res.render('bread/show', {bread, msg: req.flash('success')});
    res.render('bread/show', { bread });
}

module.exports.getEditForm = async(req, res, next) => {
    const bread = await Bread.findById(req.params.id);
    if(!bread){
        req.flash('error', 'Cannot find this Post');
        return res.redirect('/bread');
    }
    res.render('bread/edit', {bread})
}

module.exports.update = async (req, res, next) => {
    const {id} = req.params;
    const bread = await Bread.findByIdAndUpdate(id, {...req.body.bread}, {runValidators: true})
    // bread.images = req.files.map( f => ({url: f.path, filename: f.filename}))
    console.log(bread);
    req.flash('success', 'Successfully updated Bread Post');
    res.redirect(`/bread/${bread._id}`)
}

module.exports.delete = async (req, res) => {
    const {id} = req.params;
    const bread = await Bread.findByIdAndDelete(id);
    req.flash('error', 'Deleted Bread Post');
    res.redirect('/bread');
}