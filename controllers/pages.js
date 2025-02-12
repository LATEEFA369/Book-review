

const Review = require("../models/review");


const home = async (req, res) => {
    const reviews = await Review.find().populate('reviewer')
    res.render('index.ejs', {title: 'My App', reviews })
}

module.exports = {
    home,
}