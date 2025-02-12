const mongoose = require('mongoose')


const reviewSchema = new mongoose.Schema({
   title: {
  type: String,
  required: true,
},
  author: {
    type: String, 
    required: true
  },
  rating: { 
    type: Number, 
    min: 1, 
    max: 5, 
    required: true 
  },
  reviewText: { 
    type: String, 
    required: true 
  },
    reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema)
module.exports = Review
