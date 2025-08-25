import { GoogleGenerativeAI } from '@google/generative-ai';
import AppError from '../utils/AppError.js';

let genAI = null;

const getGenAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
        console.error('❌ GEMINI_API_KEY not found in environment variables');
        return null;
    }
    
    if (!genAI) {
        try {
            genAI = new GoogleGenerativeAI(apiKey);
            console.log('✅ GoogleGenAI initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize GoogleGenAI:', error.message);
            return null;
        }
    }
    return genAI;
};

export const streamChat = async (req, res, next) => {
    const aiClient = getGenAI();
    if (!aiClient) {
        return next(new AppError('AI service is not configured on the server.', 503));
    }

    try {
        const { history, newMessage } = req.body;

        if (!Array.isArray(history) || typeof newMessage !== 'string') {
            return next(new AppError('Invalid request body. `history` must be an array and `newMessage` must be a string.', 400));
        }

        const model = aiClient.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: "You are a sophisticated AI assistant for the Torch Fellowship community, a vibrant Christian group in Mutundwe, Uganda. Your purpose is to help users with their spiritual questions, provide information about the fellowship's events and teachings, and offer encouragement. Be warm, empathetic, and align your responses with Christian values. Do not answer questions outside of this scope.",
        });

        const contents = [
            ...history,
            { role: 'user', parts: [{ text: newMessage }] }
        ];

        const result = await model.generateContentStream({ contents });

        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Transfer-Encoding', 'chunked');

        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
                res.write(chunkText);
            }
        }

        res.end();

    } catch (error) {
        console.error("Error in AI stream chat:", error);
        if (!res.headersSent) {
            const errorMessage = error.message || 'An unexpected error occurred while communicating with the AI service.';
            next(new AppError(errorMessage, 500));
        } else {
            res.end();
        }
    }
};