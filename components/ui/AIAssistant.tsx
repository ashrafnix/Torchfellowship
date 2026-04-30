'use client'


import React, { useRef, useEffect, useState } from 'react';
import { ICONS } from '@/src/constants';
import Button from './Button';
import { useAIAssistantStore } from '@/stores/aiAssistantStore';
import EmojiPicker from 'emoji-picker-react';

const AIAssistant: React.FC = () => {
    const { 
        isOpen, 
        isLoading, 
        messages, 
        input, 
        toggleOpen, 
        setInput, 
        insertEmoji,
        handleSend 
    } = useAIAssistantStore();

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const onEmojiClick = (emojiData: any) => {
        insertEmoji(emojiData.emoji);
        setShowEmojiPicker(false);
    };

    // Close emoji picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        };
        
        if (showEmojiPicker) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showEmojiPicker]);

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
                        <button onClick={toggleOpen} className="text-brand-text-dark hover:text-white" aria-label="Close AI Assistant">
                            <ICONS.X className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto admin-scroll">
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
                    <div className="p-3 border-t border-brand-muted relative">
                        {/* Emoji Picker */}
                        {showEmojiPicker && (
                            <div ref={emojiPickerRef} className="absolute bottom-20 left-4 z-50">
                                <EmojiPicker
                                    onEmojiClick={onEmojiClick}
                                    width={300}
                                    height={400}
                                    previewConfig={{
                                        showPreview: false
                                    }}
                                    skinTonesDisabled
                                    searchDisabled={false}
                                />
                            </div>
                        )}
                        
                        <div className="flex items-center space-x-3 bg-brand-dark rounded-full px-2">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="rounded-full !p-2 text-brand-text-dark hover:text-white" 
                                aria-label="Add emoji"
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            >
                                <ICONS.Smile className="h-5 w-5" />
                            </Button>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask me anything..."
                                className="flex-1 bg-transparent border-none py-3 px-2 text-white placeholder-gray-500 focus:ring-0 focus:outline-none"
                                disabled={isLoading}
                            />
                            <Button 
                                onClick={handleSend} 
                                isLoading={isLoading} 
                                variant="ghost" 
                                size="sm" 
                                className="rounded-full !p-2 text-brand-text-dark hover:text-white"
                            >
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