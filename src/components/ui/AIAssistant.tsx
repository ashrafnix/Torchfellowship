
import React, { useRef, useEffect } from 'react';
import { ICONS } from '../../constants';
import Button from './Button';
import { useAIAssistantStore } from '../../stores/aiAssistantStore';

const AIAssistant: React.FC = () => {
    const { 
        isOpen, 
        isLoading, 
        messages, 
        input, 
        toggleOpen, 
        setInput, 
        handleSend 
    } = useAIAssistantStore();

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    return (
        <>
            <div className="fixed bottom-5 right-5 z-40">
                <button
                    onClick={toggleOpen}
                    className="bg-brand-gold text-brand-dark rounded-full p-4 shadow-lg hover:bg-brand-gold-dark transition-transform transform hover:scale-110"
                    aria-label="Toggle AI Assistant"
                >
                    <ICONS.MessageSquare className="h-8 w-8" />
                </button>
            </div>
            {isOpen && (
                <div className="fixed bottom-24 right-5 z-50 w-full max-w-sm h-[60vh] bg-brand-surface rounded-lg shadow-2xl flex flex-col border border-brand-muted animate-fadeIn">
                    <div className="flex items-center justify-between p-3 border-b border-brand-muted">
                        <h3 className="font-bold text-lg text-white">AI Assistant</h3>
                        <button onClick={toggleOpen} className="text-brand-text-dark hover:text-white">
                            <ICONS.X className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto">
                        <div className="flex flex-col space-y-4">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={`max-w-xs rounded-lg px-4 py-2 ${msg.sender === 'user' ? 'bg-brand-gold text-brand-dark rounded-br-none' : 'bg-brand-muted text-white rounded-bl-none'}`}>
                                        <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                    </div>
                                    {msg.timestamp && <span className="text-xs text-brand-text-dark mt-1">{msg.timestamp}</span>}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                    <div className="p-3 border-t border-brand-muted">
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask me anything..."
                                className="flex-1 bg-brand-dark border-none rounded-full py-2 px-4 text-white placeholder-brand-text-dark focus:ring-2 focus:ring-brand-gold"
                                disabled={isLoading}
                            />
                            <Button onClick={handleSend} isLoading={isLoading} size="sm" className="rounded-full !p-3">
                                <ICONS.Send className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AIAssistant;