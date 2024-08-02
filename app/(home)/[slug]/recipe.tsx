import OpenAI from "openai";

const openai = new OpenAI();

export async function Recipes(mainIngredient: string, pantryItems: string[]) {
  
  const prompt = `Here are the ingredients I have: ${pantryItems.join(', ')}. Can you suggest a recipe that I can make using these ingredients with the main ingredigent being ${mainIngredient}?`;

  // Make the API request with the prompt
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: prompt },
    ],
    model: "gpt-4o-mini",
  });

  console.log(completion.choices[0]);
}

