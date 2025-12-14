const express = require("express");
const Pantry = require("../models/Pantry");
const { standardizeIngredient } = require("../utilities/openai");


const router = express.Router();

// GET all pantry items
router.get("/", async (req, res) => {
  try {
    const items = await Pantry.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch pantry items" });
  }
});

// POST new pantry item
router.post("/", async (req, res) => {
  console.log("POST body:", req.body);
  const { name, amount } = req.body;

  if (!name || !amount) return res.status(400).json({ error: "Name & amount required" });

  try {
    const standardized = await standardizeIngredient(name, amount);
    const item = await Pantry.create({ 
        name: standardized.name, 
        amount: standardized.amount});
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add pantry item" });
  }
});


// PUT update pantry item
router.post("/", async (req, res) => {
  console.log("POST body:", req.body);
  const { name, amount } = req.body;

  if (!name || !amount) return res.status(400).json({ error: "Name & amount required" });

  try {
    const standardized = await standardizeIngredient(name, amount);

    const normalizedName = standardized.name.trim().toLowerCase();
    const numericAmount = Number(standardized.amount);

    const existingItem = await Pantry.findOne({ name: { $regex: `^${normalizedName}$`, $options: 'i' } });

    if (existingItem) {
      existingItem.amount = Number(existingItem.amount) + numericAmount;
      await existingItem.save();
      return res.status(200).json(existingItem);
    }
    const item = await Pantry.create({
      name: standardized.name,
      amount: numericAmount,
    });
    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add pantry item" });
  }
});

// DELETE pantry item
router.delete("/:id", async (req, res) => {
    try {
        const item = await Pantry.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({ error: "Pantry item not found" });
        }
        res.json({ message: "Pantry item deleted" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete item" });
    }
});
module.exports = router;
