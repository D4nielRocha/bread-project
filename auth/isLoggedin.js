const Bread = require('../models/bread');
const Review = require('../models/review');

const isLoggedin = (req, res, next) => {
    if(!req.isAuthenticated()){
        //store url requested:
        req.session.returnToUrl = req.originalUrl;
        //redirect back to login
        req.flash('error', 'You must be logged in');
        return res.redirect('/login')
    } 
    next();
}

const isAuthor = async (req, res, next) => {
    const {id} = req.params;
    const foundBread = await Bread.findById(id);
    if(!foundBread.author.equals(req.user._id)){
        req.flash('error', 'You don`t have permission to do that');
        return res.redirect(`/bread/${id}`)
    }
    next();
}

const isReviewAuthor = async (req, res, next) => {
    const {id, reviewId} = req.params
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You don`t have permission to do that! This is not one of your reviews');
        return res.redirect(`/bread/${id}`);    
    }
    next();

}


module.exports = {isLoggedin, isAuthor, isReviewAuthor};