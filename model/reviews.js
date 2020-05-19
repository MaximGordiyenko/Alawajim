import mongoose from 'mongoose';
import Business from "./businesses";
import Photo from "./photos";

const reviewSchema = new mongoose.Schema({
  userid: {
    type: Number,
    required: true
  },
  businessid: {
    type: Number,
    required: true,
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
  },
  business: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business"
  }],
  photo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Photo"
  }]
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;