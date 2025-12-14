const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

function safeParseJSON(text) {
  try {
    const match = text.match(/\{.*\}/s);
    if (!match) return null;
    return JSON.parse(match[0]);
  } catch (err) {
    return null;
  }
}

async function standardizeIngredient(name, amount) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        {
          role: "system",
          content: "You standardize ingredient names and amounts."
        },
        {
          role: "user",
          content: `Standardize this ingredient. Return only a single JSON object with keys "name" and "amount". Do not include any text or explanation outside the JSON.
Name: ${name}
Amount: ${amount}`
        }
      ],
      max_completion_tokens: 100
    });

    const text = response.choices[0].message.content.trim();
    const parsed = safeParseJSON(text);

    if (!parsed || !parsed.name || !parsed.amount) {
      console.warn("OpenAI returned invalid JSON, using original values");
      return { name, amount };
    }

    return parsed;
  } catch (err) {
    console.error("OpenAI error:", err);
    return { name, amount };
  }
}

module.exports = { standardizeIngredient };
