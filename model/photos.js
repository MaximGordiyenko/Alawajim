import mongoose from 'mongoose';
import Business from "./businesses";
import Review from "./reviews";

const PhotoSchema = new mongoose.Schema({
  userid: {
    type: Number,
    required: true
  },
  businessid: {
    type: Number,
    required: true,
  },
  caption: {
    type: String,
    required: false
  },
  business: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business"
  }],
  review: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Review"
  }]
});

const Photo = mongoose.model('Photo', PhotoSchema);
export default Photo;