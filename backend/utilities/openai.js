// utilities/openai.js
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

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
          content: `Standardize this ingredient:\nName: ${name}\nAmount: ${amount}\nReturn JSON like {"name": "...", "amount": "..."}`
        }
      ],
      max_completion_tokens: 50 
    });

    const text = response.choices[0].message.content.trim();
    return JSON.parse(text);
  } catch (err) {
    console.error("OpenAI error:", err);
    return { name, amount }; 
  }
}

module.exports = { standardizeIngredient };
