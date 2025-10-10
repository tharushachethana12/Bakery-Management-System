const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CakeSchema = new Schema({
  cakeName: {
    type: String,
    required: true,
  },
  imagePath: {
    type: String,
    required: true,
  },
  modelPath: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Cake', CakeSchema);
