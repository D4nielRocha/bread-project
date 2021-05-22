if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require('express');
const app = express();
//for views and static content
const path = require('path');
const mongoose = require('mongoose');
//Put and Delete override for ejs forms
const methodOverride = require('method-override');
//logger
const morgan = require('morgan');
//ejs template - boilerplate - layout
const ejsMate = require('ejs-mate');
//Class + contructor = error handling 
const AppError = require('./utils/AppError');
const router = express.Router();
const cookieParser = require('cookie-parser');
const cookieSginature = require('cookie-signature');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
//local strategy with passport 
const localStrategy = require('passport-local');
const User = require('./models/user');




app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname , 'public')));


app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}))
app.use(flash());
// app.use(morgan("dev"));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use( (req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.loggedUser = req.user;
    next();
})

app.use('/', require('./routes/user.js'))
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
    console.log(err);
    res.status(status).render('404', {err});
})


app.listen(3000, () => {
    console.log(`Server connected at port 3000`);
})



module.exports = router;