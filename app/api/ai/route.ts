import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { verifyAuth, unauthorized, apiError } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const user = await verifyAuth(req);
  if (!user) return unauthorized();

  try {
    const { prompt } = await req.json();
    if (!prompt) return apiError('Prompt is required.', 400);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error('AI route error:', error);
    return apiError('Failed to generate AI response.');
  }
}
