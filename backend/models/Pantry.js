const mongoose = require('mongoose');

const pantrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    default: 0
  },
  generic_name: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Pantry = mongoose.model('Pantry', pantrySchema);

module.exports = Pantry;
