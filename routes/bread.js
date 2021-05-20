const router = require('express').Router();
const { validateBread, validateReview } = require('../validation/middleware');
const Bread = require('../models/bread');
const Review = require('../models/review');
const wrapAsync = require('../utils/wrapAsync');
const { mongoose, db } = require('../db/mongodb');
const AppError = require('../utils/AppError');
const bcrypt = require('bcrypt');
const flash = require('connect-flash');
const {isLoggedin, isAuthor} = require('../auth/isLoggedin');
const breadController = require('../controllers/bread');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});


//Bread Routes

router.route('/')
    .get(wrapAsync(breadController.index))
    .post(isLoggedin, upload.array('image'), validateBread, wrapAsync(breadController.postNew))
    
router.get('/new', isLoggedin, breadController.getNew);


 router.route('/:id')
    .get(wrapAsync(breadController.getShow))
    .put(isLoggedin, isAuthor, validateBread, wrapAsync(breadController.update))
    .delete(isLoggedin, isAuthor, wrapAsync(breadController.delete))



router.get('/:id/edit', isLoggedin, isAuthor, wrapAsync(breadController.getEditForm));



module.exports = router;