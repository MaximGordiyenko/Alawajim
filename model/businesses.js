import mongoose from 'mongoose';
const Schema = require("mongoose");
import Review from "./reviews";
import Photo from "./photos";

const BusinessSchema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true
  },
  ownerid: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zip: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  subcategory: {
    type: String,
    required: true
  },
  website: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false
  },
  review: {
    type: Schema.Types.ObjectId,
    ref: "Review"
  },
  photo: {
    type: Schema.Types.ObjectId,
    ref: "Photo"
  }
});

const Business = mongoose.model('Business', BusinessSchema);
export default Business;