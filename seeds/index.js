const mongoose = require('mongoose');
const Bread = require('../models/bread');
const {breads, countries} = require('./stoxsSeeds');
require('dotenv').config();



mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@stoxdb.mia28.mongodb.net/portfolioProject?retryWrites=true&w=majority`, {
useNewUrlParser: true,
useNewUrlParser: true,
useUnifiedTopology: true
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once('open', () => {
    console.log("MongoDB connected!");
})

const seedDb = async() => {
    await Bread.deleteMany({});
    for(let i = 0; i < 10; i++){
        const bread = new Bread({
            title: `${sample(breads)}`,
            country: `${sample(countries).name}`,
            images: [
                {
                  url: 'https://res.cloudinary.com/dwaqzhpcj/image/upload/v1621521391/bread/aglt6y8i6hrksusmsjrv.jpg',
                  filename: 'bread/aglt6y8i6hrksusmsjrv'
                },
                {
                  url: 'https://res.cloudinary.com/dwaqzhpcj/image/upload/v1621521391/bread/og2rkdush3nexivkyxvz.jpg',
                  filename: 'bread/og2rkdush3nexivkyxvz'
                },
                {
                  url: 'https://res.cloudinary.com/dwaqzhpcj/image/upload/v1621521391/bread/ddjeg59viivtaoth3nvg.jpg',
                  filename: 'bread/ddjeg59viivtaoth3nvg'
                }
              ],
            geometry: {type: "Point", coordinates: [-6.268388557204144 ,53.31957532907056]},
            cookingTime: 120,
            recipe: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui, id",
            lowCarb: true,
            author: "60a503ed154307452425464a"
        })
    await bread.save();
    }
}

seedDb();