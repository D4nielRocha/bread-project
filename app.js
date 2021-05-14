const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const AppError = require('./utils/AppError');
const router = require('express').Router();
require('dotenv').config();





app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
// app.use(morgan("dev"));

app.use('/', require('./routes/bread.js'))



//404 handler
app.all('*', (req, res, next) => {
    next( new AppError('Page not Found!', 404))
})


//error handler
app.use((err, req, res, next) => {
    const { status = 500, message = 'something went wrong'} = err;
    // if(!err.message) err.message = "Something went wrong"
    res.status(status).render('404', {err});
    // res.send("Oh Bow, something went wrong!");
})


app.listen(3000, () => {
    console.log(`Server connected at port 3000`);
})



module.exports = router;