const router = require('express').Router({mergeParams: true});
const { validateReview } = require('../validation/middleware');
const Bread = require('../models/bread');
const Review = require('../models/review');
const wrapAsync = require('../utils/wrapAsync');
const { mongoose, db } = require('../db/mongodb');
const AppError = require('../utils/AppError');
const {isLoggedin, isReviewAuthor} = require('../auth/isLoggedin');
const reviewController = require('../controllers/review');


//review routes

router.post('/', isLoggedin,  validateReview,  wrapAsync(reviewController.newReview));

router.delete('/:reviewId', isLoggedin, isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;