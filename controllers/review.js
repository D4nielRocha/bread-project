const router = require('express').Router({mergeParams: true});
const { validateReview } = require('../validation/middleware');
const Bread = require('../models/bread');
const Review = require('../models/review');
const wrapAsync = require('../utils/wrapAsync');
const { mongoose, db } = require('../db/mongodb');
const AppError = require('../utils/AppError');


module.exports.newReview = async (req, res) => {
    console.log(req.params);
    //find bread in DB
    const bread = await Bread.findById(req.params.id);
    //create new Review Object
    const review = new Review(req.body.review);
    //set review.author to passport user._id
    review.author = req.user._id;
    //push the new review to bread.reviews array
    bread.reviews.push(review);
    //save review in review collection
    await review.save();
    //save bread with review array updated 
    await bread.save();
    //flash image if successfull
    req.flash('success', 'Created New Review');
    //redirect user to the show page
    res.redirect(`/bread/${bread._id}`);
}

module.exports.deleteReview = async(req, res) => {
    const {id, reviewId} = req.params;
    const bread = await Bread.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    const review = await Review.findByIdAndDelete(reviewId);
    req.flash('error', 'Review Deleted');
    res.redirect(`/bread/${id}`);
}