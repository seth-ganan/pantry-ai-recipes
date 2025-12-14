const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

async function standardizeIngredient(name, amount) {
  const prompt = `Standardize the following ingredient for a recipe database:\nName: ${name}\nAmount: ${amount}\nReturn JSON like {"name": "...", "amount": "..."}`;
  
  const response = await openai.createCompletion({
    model: "gpt-5-mini",
    prompt,
    max_tokens: 50
  });

  try {
    const jsonText = response.data.choices[0].text.trim();
    return JSON.parse(jsonText);
  } catch (err) {
    console.error("OpenAI parse error:", err);
    return { name, amount };
  }
}

module.exports = { standardizeIngredient };
