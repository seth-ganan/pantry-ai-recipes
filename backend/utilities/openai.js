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
    // Fallback to original input
    return { name, amount };
  }
}

module.exports = { standardizeIngredient };
