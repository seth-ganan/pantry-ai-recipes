const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

function extractJSON(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}


async function standardizeIngredient(name, amount) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        { role: "system", content: "You standardize ingredient names and amounts." },
        { role: "user", content: `Return ONLY JSON: { "name": "...", "amount": "..." } for this ingredient. Name: ${name}, Amount: ${amount}` }
      ],
      max_completion_tokens: 100
    });

    let text = response.choices[0].message.content.trim();
    let parsed = extractJSON(text);
    if (!parsed) {
      console.warn("Parsing failed, retrying once...");
      const retry = await openai.chat.completions.create({
        model: "gpt-5-mini",
        messages: [
          { role: "system", content: "You standardize ingredient names and amounts." },
          { role: "user", content: `Return ONLY JSON: { "name": "...", "amount": "..." } for this ingredient. Name: ${name}, Amount: ${amount}` }
        ],
        max_completion_tokens: 100
      });
      parsed = extractJSON(retry.choices[0].message.content);
    }

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
