const express = require("express");
const Recipe = require("../models/Recipe");
const Pantry = require("../models/Pantry");
const { generateRecipeNames, generateRecipeDetails } = require("../utilities/openai");

const router = express.Router();

// GET recipes from pantry ingredients
router.get("/generate-names", async (req, res) => {
  try {
    const pantryItems = await Pantry.find();
    const ingredients = pantryItems.map(i => `${i.amount} ${i.name}`).join(", ");

    const recipeNames = await generateRecipeNames(ingredients);

    res.json(recipeNames);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate recipe names" });
  }
});

// POST to generate full recipe details
router.post("/generate-details", async (req, res) => {
  try {
    const { recipeName } = req.body;
    if (!recipeName) return res.status(400).json({ error: "Recipe name required" });

    const recipeDetails = await generateRecipeDetails(recipeName);
    
    // Save to DB
    const recipe = await Recipe.create({
      name: recipeName,
      ingredients: recipeDetails.ingredients,
      steps: recipeDetails.steps
    });

    res.json(recipe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate recipe details" });
  }
});

// GET saved recipes
router.get("/saved", async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch saved recipes" });
  }
});

module.exports = router;
