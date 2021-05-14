
const mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@stoxdb.mia28.mongodb.net/portfolioProject?retryWrites=true&w=majority`, {
useNewUrlParser: true,
useCreateIndex: true,
useUnifiedTopology: true,
useFindAndModify: false
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once('open', () => {
    console.log("MongoDB connected!");
})


module.exports = {
    mongoose,
    db
};