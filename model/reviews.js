import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true
  },
  userid: {
    type: Number,
    required: true
  },
  businessid: {
    type: Number,
    required: true
  },
  dollars: {
    type: Number,
    required: true
  },
  stars: {
    type: Number,
    required: true
  },
  review: {
    type: String,
    required: false
  }
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;