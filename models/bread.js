const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;


const BreadSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Name cannot be blank']
    },
    lowCarb: Schema.Types.Boolean,
    functional: Schema.Types.Boolean,
    glutenFree: Schema.Types.Boolean,
    keto: Schema.Types.Boolean,
    recipe:{
        type: String,
        required: true
    },
    cookingTime: {
        type: Number,
        require: true,
        min: 0
    },
    country: String,
    image: String,
    cost: {
        type: Schema.Types.Decimal128,
        min: 0
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

BreadSchema.post('findOneAndDelete', async function(bread){
    if(bread){
        await Review.remove({
            _id: {
                $in: bread.reviews
            }
        })
    }
})



module.exports = mongoose.model('Bread', BreadSchema); 