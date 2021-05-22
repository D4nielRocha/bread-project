const router = require('express').Router();
const { validateBread, validateReview } = require('../validation/middleware');
const Bread = require('../models/bread');
const Review = require('../models/review');
const wrapAsync = require('../utils/wrapAsync');
const { mongoose, db } = require('../db/mongodb');
const AppError = require('../utils/AppError');
const bcrypt = require('bcrypt');
const flash = require('connect-flash');
const cloudinary = require('cloudinary').v2;
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapboxToken})





module.exports.index = async (req, res) => {
    const bread = await Bread.find();
    res.render('bread/index', {bread });
}

module.exports.getNew = (req, res) => {
    res.render('bread/new')
}

module.exports.postNew = async (req, res, next) => {  
    const countryInput = req.body.bread.country.charAt(0).toUpperCase() + req.body.bread.country.slice(1);  
    console.log(countryInput);
    const geoData = await geocoder.forwardGeocode({
        query:  countryInput,
        limit: 1
    }).send()
    // res.send(geoData.body.features[0].geometry.coordinates); 
    const bread = new Bread(req.body.bread);
    bread.geometry = geoData.body.features.length != 0 ? geoData.body.features[0].geometry : {type: "Point", coordinates: [-6.268388557204144 ,53.31957532907056]};
    bread.author = req.user._id;//req.user is added in by passport
    //create an array with images uploaded by user and store in bread.image (model - array)
    bread.images = req.files.map( f => ({url: f.path, filename: f.filename}) );
    await bread.save();
    console.log(bread)
    req.flash('success', "New Bread Created Successfully");
    res.redirect(`/bread/${bread._id}`);
}

module.exports.getShow = async(req, res, next) => {
    const bread = await Bread.findById(req.params.id).populate(
        //populate all reviews in Bread
        {path: 'reviews',
        //populate author in each review
        populate: {
            path: 'author'
        }}
        //populate author in Bread  
        ).populate('author');
    // console.log(bread);
    if(!bread){
        req.flash('error', 'Cannot find this Post');
        return res.redirect('/bread');
        // throw new AppError("This Post doesn`t exist...Yet", 500);
    }
    // res.render('bread/show', {bread, msg: req.flash('success')});
    res.render('bread/show', { bread });
}

module.exports.getEditForm = async(req, res, next) => {
    const bread = await Bread.findById(req.params.id);
    if(!bread){
        req.flash('error', 'Cannot find this Post');
        return res.redirect('/bread');
    }
    res.render('bread/edit', {bread})
}

module.exports.clusterMap = async (req, res) => {
    const bread = await Bread.find();
    res.render('bread/world', {bread});
}

// module.exports.update = async (req, res, next) => {
//     const {id} = req.params;
//     //find and update bread post 
//     const bread = await Bread.findByIdAndUpdate(id, {...req.body.bread}, {runValidators: true})
//     //returns an new array of images from cloudinary - req.files
//     const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
//     //push each image to the existing images array (spread )
//     bread.images.push(...imgs);
//     //save new bread with new images
//     await bread.save();
//     if(req.body.deleteImages){
//         console.log(req.body.deleteImages)
//         await bread.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
//         console.log(bread);
//     }
//     req.flash('success', 'Successfully updated Bread Post');
//     res.redirect(`/bread/${bread._id}`)
// }

module.exports.update = async (req, res, next) => {
    const {id} = req.params;
    //find bread post by Id
    const bread = await Bread.findById(id);
    //gets an array of files - images
    const imgs = req.files.map( f => ({url: f.path, filename: f.filename}));
    //push new images to bread.images - model
    bread.images.push(...imgs);
    // console.log(`bread after img push`, bread);
     //update bread
     await bread.save();
    if(req.body.deleteImages){
        console.log(req.body.deleteImages);
        for(let image of req.body.deleteImages){
            cloudinary.uploader.destroy(image);
        }
        await bread.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }
    console.log(bread);
    req.flash('success', 'Successfully updated Bread Post');
    res.redirect(`/bread/${bread._id}`)
}

module.exports.delete = async (req, res) => {
    const {id} = req.params;
    const bread = await Bread.findByIdAndDelete(id);
    req.flash('error', 'Deleted Bread Post');
    res.redirect('/bread');
}
