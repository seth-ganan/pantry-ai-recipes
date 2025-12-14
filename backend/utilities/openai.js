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
  "name": "<standardized ingredient name>",
  "amount": "<standardized amount>"
}
No extra text, explanation, or comments.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-5.2",
      messages: [
        { role: "user", content: prompt }
      ],
      max_completion_tokens: 150
    });

    const text = response.choices[0].message.content;

    const parsed = JSON.parse(text);
    if (!parsed.name || !parsed.amount) {
      throw new Error("Incomplete JSON returned from OpenAI");
    }

    return parsed;
  } catch (err) {
    console.error("OpenAI error:", err.message);
    return { name, amount };
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

  try {
    return JSON.parse(response.choices[0].message.content);
  } catch {
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
    max_completion_tokens: 300
  });

  try {
    return JSON.parse(response.choices[0].message.content);
  } catch {
    return { ingredients: [], steps: [] };
  }
}


module.exports = { standardizeIngredient };
