const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

async function standardizeIngredient(name, amount) {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-5-mini",
      messages: [
        {
          role: "system",
          content: "You are an assistant that standardizes ingredient names and amounts for a recipe database."
        },
        {
          role: "user",
          content: `Standardize this ingredient:\nName: ${name}\nAmount: ${amount}\nReturn JSON like {"name": "...", "amount": "..."}`
        }
      ],
      max_tokens: 50
    });

    const text = response.data.choices[0].message.content.trim();
    return JSON.parse(text);
  } catch (err) {
    console.error("OpenAI error:", err);
    return { name, amount };
  }
}

module.exports = { standardizeIngredient };
