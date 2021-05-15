const router = require('express').Router();
const { validateBread, validateReview } = require('../validation/middleware');
const Bread = require('../models/bread');
const Review = require('../models/review');
const wrapAsync = require('../utils/wrapAsync');
const { mongoose, db } = require('../db/mongodb');
const AppError = require('../utils/AppError');
const flash = require('connect-flash');




//Bread Routes

router.get('/', wrapAsync( async (req, res) => {
    const bread = await Bread.find();
    res.render('bread/index', {bread });
}))

router.get('/new', (req, res) => {
    res.render('bread/new')
})


router.post('/', validateBread, wrapAsync(async (req, res, next) => {    
        const bread = new Bread(req.body.bread);
        await bread.save();
        req.flash('success', "New Bread Created Successfully");
        res.redirect(`/bread/${bread._id}`);
}))



router.get('/:id', wrapAsync(async(req, res, next) => {
    const bread = await Bread.findById(req.params.id).populate('reviews')
    // console.log(bread);
    if(!bread){
        req.flash('error', 'Cannot find this Post');
        return res.redirect('/bread');
        // throw new AppError("This Post doesn`t exist...Yet", 500);
    }
    // res.render('bread/show', {bread, msg: req.flash('success')});
    res.render('bread/show', { bread });
}))




router.get('/:id/edit', wrapAsync(async(req, res, next) => {
    const bread = await Bread.findById(req.params.id);
    if(!bread){
        req.flash('error', 'Cannot find this Post');
        return res.redirect('/bread');
    }
    res.render('bread/edit', {bread})
}))



router.put('/:id', validateBread, wrapAsync(async (req, res, next) => {
  
    const {id} = req.params;
    const bread = await Bread.findByIdAndUpdate(id, {...req.body.bread}, {runValidators: true})
    req.flash('success', 'Successfully updated Bread Post');
    res.redirect(`/bread/${bread._id}`)
}))

router.delete('/:id', wrapAsync(async (req, res) => {
    const {id} = req.params;
    const bread = await Bread.findByIdAndDelete(id);
    req.flash('error', 'Deleted Bread Post');
    res.redirect('/bread');
}))





module.exports = router;