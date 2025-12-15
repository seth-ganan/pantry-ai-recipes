const express = require("express");
const Pantry = require("../models/Pantry");
const { standardizeIngredient } = require("../utilities/openai");

const router = express.Router();

// Helper to parse amounts like "1 lb", "2 cups", "1/2 oz"
function parseAmount(amountStr) {
  if (!amountStr || typeof amountStr !== "string") {
    return { quantity: 1, unit: "unit" };
  }

  const cleaned = amountStr.trim().toLowerCase();

  // Extract number (supports fractions)
  const numberMatch = cleaned.match(/(\d+(\.\d+)?|\d+\/\d+)/);
  let quantity = 1;

  if (numberMatch) {
    const raw = numberMatch[0];
    if (raw.includes("/")) {
      const [n, d] = raw.split("/").map(Number);
      quantity = d ? n / d : 1;
    } else {
      quantity = Number(raw);
    }
  }

  // Extract unit
  let unit = cleaned.replace(numberMatch?.[0] ?? "", "").trim();

  const unitMap = {
    pound: "lb",
    pounds: "lb",
    lbs: "lb",
    lb: "lb",
    ounce: "oz",
    ounces: "oz",
    oz: "oz",
    gram: "g",
    grams: "g",
    kilogram: "kg",
    kilograms: "kg",
    cup: "cup",
    cups: "cup",
    can: "can",
    cans: "can",
    onion: "onion",
    onions: "onion"
  };

  unit = unitMap[unit] || unit || "unit";

  return {
    quantity: Number.isFinite(quantity) ? quantity : 1,
    unit
  };
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

// POST add/update pantry item
router.post("/", async (req, res) => {
  const { name, amount } = req.body;

  if (!name || !amount) {
    return res.status(400).json({ error: "Name & amount required" });
  }

  try {
    // Standardize ingredient using OpenAI
    const standardized = await standardizeIngredient(name, amount);

    // Normalize name (remove parentheses, lowercase)
    const normalizedName = standardized.name
      .trim()
      .toLowerCase()
      .replace(/\(.*\)/, "");

    // Parse amount safely
    let { quantity, unit } = parseAmount(standardized.amount || "1 unit");
    quantity = Number.isFinite(quantity) ? quantity : 1;
    unit = unit || "unit";

    console.log("Adding ingredient:", { normalizedName, quantity, unit });

    // Find existing item by name + unit
    const existingItem = await Pantry.findOne({ name: normalizedName, unit });
    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
      console.log("Merged with existing item:", existingItem);
      return res.status(200).json(existingItem);
    }

    // Create new pantry item
    const item = await Pantry.create({
      name: standardized.name,
      quantity,
      unit
    });

    console.log("Created new item:", item);
    res.status(201).json(item);
  } catch (err) {
    console.error("Pantry POST error:", err);
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
