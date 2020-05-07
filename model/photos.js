import mongoose from 'mongoose';

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
  }
});

const Photo = mongoose.model('Photo', PhotoSchema);
export default Photo;