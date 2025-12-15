// routes/recipes.js
const express = require('express');
const Recipe = require('../models/Recipe');
const Pantry = require('../models/Pantry');
const { generateRecipeNames, generateRecipeDetails } = require('../utilities/openai');

const router = express.Router();

// GET recipe names from pantry ingredients
router.get("/generate-names", async (req, res) => {
  try {
    const pantryItems = await Pantry.find();
    console.log("Pantry items:", pantryItems);

    if (!pantryItems.length) return res.json([]);

    const ingredients = pantryItems
      .map(i => `${i.quantity} ${i.unit} ${i.name}`)
      .join(", ");
    console.log("Ingredients string sent to OpenAI:", ingredients);

    const recipeNames = await generateRecipeNames(ingredients);
    console.log("OpenAI returned recipeNames:", recipeNames);

    if (!Array.isArray(recipeNames)) return res.json([]);

    res.json(recipeNames);
  } catch (err) {
    console.error("Error generating recipe names:", err);
    res.status(500).json([]);
  }
});





// POST generate full recipe details
router.post('/generate-details', async (req, res) => {
  try {
    const { recipeName } = req.body;
    if (!recipeName) return res.status(400).json({ error: 'Recipe name required' });

    const recipeDetails = await generateRecipeDetails(recipeName);
    console.log("Recipe Details from GPT:", recipeDetails);


    // Save to DB
    const recipe = await Recipe.create({
      name: recipeName,
      ingredients: recipeDetails.ingredients,
      steps: recipeDetails.steps,
      saved: false,
    });

    res.json(recipe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate recipe details' });
  }
});


// POST save a recipe
router.post('/save/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { saved: true },
      { new: true }
    );
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save recipe' });
  }
});

// GET all saved recipes
router.get('/saved', async (req, res) => {
  try {
    const savedRecipes = await Recipe.find({ saved: true }).sort({ createdAt: -1 });
    res.json(savedRecipes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch saved recipes' });
  }
});

module.exports = router;
