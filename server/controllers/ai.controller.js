import { GoogleGenAI } from '@google/genai';
import AppError from '../utils/AppError.js';

if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY environment variable not set for Gemini. AI features will fail.");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const streamChat = async (req, res, next) => {
    if (!process.env.GEMINI_API_KEY) {
        return next(new AppError('AI service is not configured on the server.', 503));
    }

    try {
        const { history, newMessage } = req.body;

        if (!Array.isArray(history) || !newMessage) {
            return next(new AppError('Invalid request body. `history` array and `newMessage` string are required.', 400));
        }
        
        const contents = [
            ...history,
            { role: 'user', parts: [{ text: newMessage }] }
        ];

        const result = await ai.models.generateContentStream({
            model: "gemini-2.5-flash",
            contents: contents,
            config: {
                systemInstruction: `You are a sophisticated AI assistant for the Torch Fellowship community.`,
            }
        });

        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Transfer-Encoding', 'chunked');
        
        for await (const chunk of result) {
            res.write(chunk.text);
        }
        
        res.end();

    } catch (error) {
        console.error("Error in AI stream chat:", error);
        if (!res.headersSent) {
            next(new AppError('Failed to get response from AI service.', 500));
        } else {
            res.end();
        }
    }
};