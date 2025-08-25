
import { create } from 'zustand';
import { getAIResponseStream } from '../services/geminiService';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

interface AIAssistantState {
  isOpen: boolean;
  isLoading: boolean;
  messages: Message[];
  input: string;
}

interface AIAssistantActions {
  toggleOpen: () => void;
  setInput: (input: string) => void;
  insertEmoji: (emoji: string) => void;
  handleSend: () => Promise<void>;
}

const getTimestamp = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export const useAIAssistantStore = create<AIAssistantState & AIAssistantActions>((set, get) => ({
  isOpen: false,
  isLoading: false,
  messages: [
    {
      id: 1,
      text: "Hello! I'm your AI assistant. How can I help you today?",
      sender: 'ai',
      timestamp: getTimestamp(),
    },
  ],
  input: '',
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  setInput: (input: string) => set({ input }),
  insertEmoji: (emoji: string) => set((state) => ({ input: state.input + emoji })),
  handleSend: async () => {
    const { input, isLoading, messages } = get();
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: getTimestamp(),
    };
    
    set(state => ({ 
        messages: [...state.messages, userMessage],
        isLoading: true,
        input: ''
    }));

    const aiResponseId = Date.now() + 1;
    const aiPlaceholderMessage: Message = { id: aiResponseId, text: '▋', sender: 'ai', timestamp: '' };
    set(state => ({ messages: [...state.messages, aiPlaceholderMessage] }));

    try {
        const geminiHistory = messages
            .filter(m => m.text)
            .map(m => ({
                role: m.sender === 'user' ? 'user' : 'model',
                parts: [{ text: m.text }],
        }));

        const stream = await getAIResponseStream(geminiHistory, input);
        if (!stream) throw new Error("Stream is null");
        
        const reader = stream.pipeThrough(new TextDecoderStream()).getReader();
        let fullText = '';
        
        while(true) {
            const { done, value } = await reader.read();
            if (done) break;

            fullText += value;

            set(state => ({
                messages: state.messages.map(m => 
                    m.id === aiResponseId ? { ...m, text: fullText + '▋', timestamp: getTimestamp() } : m
                )
            }));
        }
        
        set(state => ({
            messages: state.messages.map(m => 
                m.id === aiResponseId ? { ...m, text: fullText.trim() } : m
            )
        }));

    } catch (error) {
        console.error("Error communicating with AI:", error);
        set(state => ({
            messages: state.messages.map(m => 
                m.id === aiResponseId ? { ...m, text: "Sorry, I encountered an error. Please try again.", timestamp: getTimestamp() } : m
            )
        }));
    } finally {
        set({ isLoading: false });
    }
  },
}));
