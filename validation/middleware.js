
const {breadJoiSchema, reviewJoiSchema} = require('./validationSchema.js');
const AppError = require('../utils/AppError');


const validateBread = (req, res, next) => { 
    const {error} = breadJoiSchema.validate(req.body)
    if(error){
        const message = error.details.map(el => el.message).join(',');
        throw new AppError(message, 400)
    }
    next();
}

const validateReview = (req, res, next) => {
    const {error} = reviewJoiSchema.validate(req.body)
    if(error){
        const message = error.details.map(el => el.message).join(',');
        throw new AppError(message, 400);
    }
    next();
}


module.exports = {
    validateBread, validateReview
}