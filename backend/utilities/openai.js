const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function standardizeIngredient(name, amount) {
  try {
    const prompt = `
You are a helpful assistant that standardizes ingredient names and amounts.
Input:
  name: "${name}"
  amount: "${amount}"
Output strictly as JSON:
{
  "name": "<standardized ingredient name, remove any parentheses or percentages>",
  "amount": "<standardized amount using only these units: lb, oz, g, kg, cup, can, onion>"
}
Rules:
- Do NOT leave 'amount' empty. If you can't detect a number, use "1 unit".
- Remove all parentheticals or extra descriptors from the name.
- Only return JSON, no extra text.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-5.2",
      messages: [{ role: "user", content: prompt }],
      max_completion_tokens: 150
    });

    const text = response.choices[0].message.content;

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { name, amount: "1 unit" };
    }

    if (!parsed.name || parsed.name.trim() === "") parsed.name = name;
    if (!parsed.amount || parsed.amount.trim() === "") parsed.amount = "1 unit";

    return parsed;
  } catch (err) {
    console.error("OpenAI error:", err.message);
    return { name, amount: "1 unit" };
  }
}


async function generateRecipeNames(ingredients) {
  const prompt = `
You are a helpful chef. Based on these ingredients:
${ingredients}
Suggest 5 short, catchy recipe names in JSON array format:
["Recipe 1", "Recipe 2", ...]
No extra text.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-5.2",
    messages: [{ role: "user", content: prompt }],
    max_completion_tokens: 150
  });
  console.log("OpenAI response:", response.choices[0].message.content);

  try {
    return JSON.parse(response.choices[0].message.content);
  } catch (err) {
    console.error("Failed to parse OpenAI JSON:", err);
    return [];
  }
}

async function generateRecipeDetails(recipeName) {
  const prompt = `
You are a professional chef. Create a recipe for "${recipeName}".
Output strictly in JSON:
{
  "ingredients": ["2 cups flour", "1 tsp salt", ...],
  "steps": ["Step 1", "Step 2", ...]
}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-5.2",
    messages: [{ role: "user", content: prompt }],
    max_completion_tokens: 500,
  });

  const text = response.choices[0].message.content;

  // Try to extract JSON using regex to handle extra text
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error("Failed to extract JSON from GPT output:", text);
    return { ingredients: [], steps: [] };
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]);
    // Ensure arrays exist
    parsed.ingredients = parsed.ingredients || [];
    parsed.steps = parsed.steps || [];
    return parsed;
  } catch (err) {
    console.error("Failed to parse JSON from GPT output:", err, text);
    return { ingredients: [], steps: [] };
  }
}



module.exports = { standardizeIngredient, generateRecipeNames, generateRecipeDetails };
