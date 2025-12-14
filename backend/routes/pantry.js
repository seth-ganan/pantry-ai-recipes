const express = require("express");
const Pantry = require("../models/Pantry");
const { standardizeIngredient } = require("../utilities/openai");


const router = express.Router();

function parseAmount(amountStr) {
  if (!amountStr || typeof amountStr !== "string") {
    return { quantity: 1, unit: "unit" };
  }

  const match = amountStr
    .trim()
    .toLowerCase()
    .match(/^([\d.\/]+)\s*(.+)$/);

  if (!match) {
    return { quantity: 1, unit: amountStr.toLowerCase() };
  }

  let quantity = match[1];
  let unit = match[2];

  if (quantity.includes("/")) {
    const [num, den] = quantity.split("/").map(Number);
    quantity = num / den;
  } else {
    quantity = Number(quantity);
  }

  const unitMap = {
    pound: "lb",
    pounds: "lb",
    lbs: "lb",
    lb: "lb",
    ounces: "oz",
    ounce: "oz",
    oz: "oz",
    grams: "g",
    gram: "g",
    kilograms: "kg",
    kilogram: "kg",
    cups: "cup",
    cup: "cup",
    cans: "can",
    can: "can",
    onions: "onion",
    onion: "onion"
  };

  unit = unitMap[unit] || unit;

  return { quantity, unit };
}

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
  const { name, amount } = req.body;

  if (!name || !amount) {
    return res.status(400).json({ error: "Name & amount required" });
  }

  try {
    const standardized = await standardizeIngredient(name, amount);
    const { quantity, unit } = parseAmount(standardized.amount);
    const normalizedName = standardized.name.trim().toLowerCase();
    const existingItem = await Pantry.findOne({
      name: { $regex: `^${normalizedName}$`, $options: "i" },
      unit
    });

    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
      return res.status(200).json(existingItem);
    }
    const item = await Pantry.create({
      name: standardized.name,
      quantity,
      unit
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
