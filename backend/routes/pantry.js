const express = require("express");
const Pantry = require("../models/Pantry");
const { standardizeIngredient } = require("../utilities/openai");


const router = express.Router();

function parseAmount(amountStr) {
  if (!amountStr || typeof amountStr !== "string") {
    return { quantity: 1, unit: "unit" };
  }

  const cleaned = amountStr.trim().toLowerCase();

  // extract number (supports fractions)
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



// POST update pantry item
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
