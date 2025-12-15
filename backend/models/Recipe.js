const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },
    ingredients: [{ 
      type: String, 
      required: true, 
      trim: true }],
    steps: [{ 
      type: String, 
      required: true, 
      trim: true }],
    saved: { 
      type: Boolean, 
      default: false 
    },
  },
  { timestamps: true }
);


const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
