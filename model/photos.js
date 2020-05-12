import mongoose from 'mongoose';
const Schema = require("mongoose");
import Business from "./businesses";
import Review from "./reviews";

const PhotoSchema = new mongoose.Schema({
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
  caption: {
    type: String,
    required: false
  },
  business: {
    type: Schema.Types.ObjectId,
    ref: "Business"
  },
  review: {
    type: Schema.Types.ObjectId,
    ref: "Review"
  }
});

const Photo = mongoose.model('Photo', PhotoSchema);
export default Photo;