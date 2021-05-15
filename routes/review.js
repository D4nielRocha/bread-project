const router = require('express').Router({mergeParams: true});
const { validateBread, validateReview } = require('../validation/middleware');
const Bread = require('../models/bread');
const Review = require('../models/review');
const wrapAsync = require('../utils/wrapAsync');
const { mongoose, db } = require('../db/mongodb');
const AppError = require('../utils/AppError');

//review routes

router.post('/', validateReview,  wrapAsync(async (req, res) => {
    console.log(req.params);
    const bread = await Bread.findById(req.params.id);
    const review = new Review(req.body.review);
    bread.reviews.push(review);
    await bread.save();
    await review.save();
    req.flash('success', 'Created New Review');
    res.redirect(`/bread/${bread._id}`);
}));

router.delete('/:reviewId', wrapAsync(async(req, res) => {
    const {id, reviewId} = req.params;
    const bread = await Bread.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    const review = await Review.findByIdAndDelete(reviewId);
    req.flash('error', 'Review Deleted');
    res.redirect(`/bread/${id}`);
}))

module.exports = router;