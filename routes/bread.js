const router = require('express').Router();
const { validateBread, validateReview } = require('../validation/middleware');
const Bread = require('../models/bread');
const Review = require('../models/review');
const wrapAsync = require('../utils/wrapAsync');
const { mongoose, db } = require('../db/mongodb');
const AppError = require('../utils/AppError');
const bcrypt = require('bcrypt');
const flash = require('connect-flash');


// const hashPassword = async(password) => {
//     const salt = await bcrypt.genSalt(12);
//     const hash = await bcrypt.hash(password, salt);
//     console.log(salt);
//     console.log(hash);
// }


const hashPassword = async(password) => {
    const hash = await bcrypt.hash(password, 12);
    // console.log(salt);
    console.log(hash);
}

 const login = async (password, hashedPw) => {
    const result = await bcrypt.compare(password, hashedPw);
    if(result){
        console.log('Logged you in successfully', result);
    } else {
        console.log('Incorrect password!!');
    }
 }

// hashPassword('daniel88');
login('daniell88', "$2b$12$S9Na4SaqlUIgJBpoqg1L.eUlLDmyEPFyrOQV7MWGZbTqUmRMy7fxe")





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