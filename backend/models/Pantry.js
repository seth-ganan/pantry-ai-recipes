const mongoose = require("mongoose");

const PantrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    amount: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const Pantry = mongoose.model('Pantry', pantrySchema);

module.exports = Pantry;
