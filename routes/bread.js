const router = require('express').Router();
const { validateBread, validateReview } = require('../validation/middleware');
const Bread = require('../models/bread');
const Review = require('../models/review');
const wrapAsync = require('../utils/wrapAsync');
const { mongoose, db } = require('../db/mongodb');
const AppError = require('../utils/AppError');



//Bread Routes
router.get('/', (req, res) => {
    res.render('home')
})

router.get('/bread', async (req, res) => {
    const bread = await Bread.find();
    res.render('bread/index', {bread});
})

router.get('/bread/new', (req, res) => {
    res.render('bread/new')
})


router.post('/bread', validateBread, wrapAsync(async (req, res, next) => {    
        const bread = new Bread(req.body.bread);
        await bread.save();
        res.redirect(`/bread/${bread._id}`);
}))



router.get('/bread/:id', wrapAsync(async(req, res, next) => {
    const bread = await Bread.findById(req.params.id).populate('reviews')
    // console.log(bread);
    if(!bread){
        throw new AppError("This Post doesn`t exist...Yet", 500);
    }
    res.render('bread/show', {bread})
}))




router.get('/bread/:id/edit', wrapAsync(async(req, res, next) => {
    const bread = await Bread.findById(req.params.id);
    if(!bread){
        throw new AppError("Something went wrong with this post", 400);
    }
    res.render('bread/edit', {bread})
}))



router.put('/bread/:id', validateBread, wrapAsync(async (req, res, next) => {
  
    const {id} = req.params;
    const bread = await Bread.findByIdAndUpdate(id, {...req.body.bread}, {runValidators: true})
    if(!bread){
        throw new AppError('Something went wrong updataing this post', 400 )
    }
    res.redirect(`/bread/${bread._id}`)
}))

router.delete('/bread/:id', async (req, res) => {
    const {id} = req.params;
    const bread = await Bread.findByIdAndDelete(id);
    res.redirect('/bread');
})


//review routes

router.post('/bread/:id/review', validateReview,  wrapAsync(async (req, res) => {
    const bread = await Bread.findById(req.params.id);
    const review = new Review(req.body.review);
    bread.reviews.push(review);
    await bread.save();
    await review.save();
    res.redirect(`/bread/${bread._id}`);
}));

router.delete('/bread/:id/review/:reviewId', wrapAsync(async(req, res) => {
    const {id, reviewId} = req.params;
    const bread = await Bread.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    const review = await Review.findByIdAndDelete(reviewId);
    res.redirect(`/bread/${id}`);
}))


module.exports = router;