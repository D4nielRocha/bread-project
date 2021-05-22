const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

const imageSchema = new Schema({
        url: String,
        filename: String
})

//image virtuals
imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
})

const opts = {toJSON: {virtuals: true}};


const BreadSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Name cannot be blank']
    },
    lowCarb: Schema.Types.Boolean,
    functional: Schema.Types.Boolean,
    glutenFree: Schema.Types.Boolean,
    keto: Schema.Types.Boolean,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    recipe:{
        type: String,
        required: true
    },
    cookingTime: {
        type: Number,
        required: true,
        min: 0
    },
    country: {
        type: String,
        required: false
    },
    geometry: {
        type: {
          type: String, 
          enum: ['Point'],
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    images: [imageSchema],
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
}, opts);



//Bread Virtuals

BreadSchema.virtual('properties.title').get(function(){
    return this.title;
})

BreadSchema.virtual('properties.id').get(function(){
    return this._id;
})


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