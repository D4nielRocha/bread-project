const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const AppError = require('./utils/AppError');
const router = express.Router();
const cookieParser = require('cookie-parser');
const cookieSginature = require('cookie-signature');
const session = require('express-session');
const flash = require('connect-flash');
require('dotenv').config();





app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname , 'public')));


app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(cookieParser('mysecret'));
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000* 60 * 60 * 24 * 7,
        maxAge: 1000* 60 * 60 * 24 * 7,
    }
}))
app.use(flash());
// app.use(morgan("dev"));
app.use( (req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next();
})

app.use('/bread', require('./routes/bread.js'))
app.use('/bread/:id/review', require('./routes/review.js'))

app.get('/', (req, res) => {
    res.render('home')
})

//404 handler
app.all('*', (req, res, next) => {
    next( new AppError('Page not Found!', 404))
})




//error handler
app.use((err, req, res, next) => {
    const {status = 500} = err;
    if(!err.message) err.message = 'Something went wrong!';
    res.status(status).render('404', {err,});
})


app.listen(3000, () => {
    console.log(`Server connected at port 3000`);
})



module.exports = router;