import mongoose from 'mongoose';
const Schema = require("mongoose");
import Business from "./businesses";
import Photo from "./photos";

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
  },
  business: {
    type: Schema.Types.ObjectId,
    ref: "Business"
  },
  photo: {
    type: Schema.Types.ObjectId,
    ref: "Photo"
  }
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;