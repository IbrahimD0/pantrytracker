import { NextRequest, NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const schema = {
  $defs: {
    Ingredient: {
      properties: {
        name: { title: "Name", type: "string" },
        quantity: { title: "Quantity", type: "string" },
        quantity_unit: {
          anyOf: [{ type: "string" }, { type: "null" }],
          title: "Quantity Unit",
        },
      },
      required: ["name", "quantity", "quantity_unit"],
      title: "Ingredient",
      type: "object",
    },
  },
  properties: {
    recipe_name: { title: "Recipe Name", type: "string" },
    ingredients: {
      items: { $ref: "#/$defs/Ingredient" },
      title: "Ingredients",
      type: "array",
    },
    directions: {
      items: { type: "string" },
      title: "Directions",
      type: "array",
    },
  },
  required: ["recipe_name", "ingredients", "directions"],
  title: "Recipe",
  type: "object",
};
export async function POST(req: NextRequest) {
  try {
    const { item } = await req.json();

    if (!item) {
      return NextResponse.json({ error: 'Item is required' }, { status: 400 });
    }
    const jsonSchema = JSON.stringify(schema, null, 4);
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a world class chef that can create any recipe with the given ingredients in JSON format.  The JSON schema must match the following schema" ${jsonSchema}`
        },
        {
          role: "user",
          content: `Give me a recipe using ${item}`
        }
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0,
      top_p: 1,
      stream: false,
      stop: null,
      response_format: {
        type  : "json_object"
      },
    });

    return NextResponse.json({ recipe: chatCompletion.choices[0].message.content });
  } catch (error) {
    console.error('Failed to fetch recipe:', error);
    return NextResponse.json({ error: 'Failed to fetch recipe' }, { status: 500 });
  }
}