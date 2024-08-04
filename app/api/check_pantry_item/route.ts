import { NextRequest, NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { item } = await req.json();

    if (!item) {
      return NextResponse.json({ error: 'Item is required' }, { status: 400 });
    }

    const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are an assistant that only returns boolean values. Respond with lowercased true if the item is a pantry/food   item, otherwise respond with lowercased false."
          },
          {
            role: "user",
            content: `${item}`
          }
        ],
        model: "llama3-8b-8192",
        temperature: 0, 
        max_tokens: 20, 
        top_p: 1,
        stream: false,
        stop: null
      });
        const responseText = chatCompletion.choices[0].message.content
        
        
    return NextResponse.json({ response: responseText});
  } catch (error) {
    console.error('Failed to fetch recipe:', error);
    return NextResponse.json({ error: 'Failed to fetch recipe' }, { status: 500 });
  }
}