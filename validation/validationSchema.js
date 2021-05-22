const Joi = require('joi');

const breadJoiSchema = Joi.object({
    bread:Joi.object({
        title: Joi.string().required(),
        recipe: Joi.string().required(),
        country: Joi.string(),
        // images: Joi.string(),
        cost: Joi.number().required().min(0),
        cookingTime: Joi.string().required()
    }).required(),
    deleteImages: Joi.array()
}) 

const reviewJoiSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required(),
        rating: Joi.number().required().min(1).max(5)
    }).required()
})


module.exports = {breadJoiSchema, reviewJoiSchema};