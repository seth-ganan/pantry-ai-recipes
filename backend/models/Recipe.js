const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  recipeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pantry',  // References Pantry model
    required: true
  },
  saved: {
    type: Boolean,  // Duration in seconds
    required: true,
    default: false
  },
}, {
  timestamps: true
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
