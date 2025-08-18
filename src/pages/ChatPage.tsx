import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth.ts';
import { ICONS } from '../constants.tsx';
import Spinner from '../components/ui/Spinner.tsx';
import { ChatMessage, User } from '../types.ts';
import Button from '../components/ui/Button.tsx';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../hooks/useApi.ts';
import { toast } from 'react-toastify';

const ChatPage: React.FC = () => {
    const { user } = useAuth();
    const { apiClient } = useApi();
    const queryClient = useQueryClient();
    
    const [activeChat, setActiveChat] = useState<{ id: string, name: string, isCommunity: boolean, avatar?: string }>({ id: 'community', name: 'Community Chat', isCommunity: true });
    const [input, setInput] = useState('');
    const [showScrollToBottom, setShowScrollToBottom] = useState(false);
    
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    // --- Data Fetching ---

    const { data: users = [] } = useQuery<User[]>({
        queryKey: ['users'],
        queryFn: () => apiClient('/api/users', 'GET'),
        enabled: !!user,
        select: (data) => data.filter((u: User) => u.id !== user?.id)
    });

    const { data: messages = [], isLoading: isLoadingMessages } = useQuery<ChatMessage[]>({
        queryKey: ['messages', activeChat.id],
        queryFn: () => {
            const url = activeChat.isCommunity 
                ? '/api/messages/community' 
                : `/api/messages/private?userId=${activeChat.id}`;
            return apiClient<ChatMessage[]>(url, 'GET');
        },
        enabled: !!user,
    });

    const sendMessageMutation = useMutation({
        mutationFn: (messagePayload: Partial<ChatMessage>) => apiClient<ChatMessage>('/api/messages', 'POST', messagePayload),
        onSuccess: (newMessage) => {
            queryClient.setQueryData(['messages', activeChat.id], (oldData: ChatMessage[] | undefined) => 
                oldData ? [...oldData, newMessage] : [newMessage]
            );
            setTimeout(() => scrollToBottom('smooth'), 0);
        },
        onError: (error: Error) => {
            toast.error(`Failed to send message: ${error.message}`);
        }
    });

    // --- Effects and Handlers ---

    const scrollToBottom = (behavior: 'smooth' | 'auto' = 'smooth') => {
        const container = messagesContainerRef.current;
        if (container) {
            container.scrollTo({
                top: container.scrollHeight,
                behavior,
            });
        }
        setShowScrollToBottom(false);
    };

    useEffect(() => {
        if (messages.length === 0) return;
        const container = messagesContainerRef.current;
        if (container) {
            const isScrolledUp = container.scrollHeight - container.clientHeight - container.scrollTop > 150;
            
            if (isScrolledUp) {
                setShowScrollToBottom(true);
            } else {
                setTimeout(() => scrollToBottom('smooth'), 0);
            }
        }
    }, [messages]);
    
    useEffect(() => {
        scrollToBottom('auto');
    }, [activeChat.id]);
    
    const handleSendMessage = () => {
        if (input.trim() === '' || !user) return;
        
        const messagePayload: Partial<ChatMessage> = {
            content: input,
            authorId: user.id,
            authorName: user.fullName || user.email,
            authorAvatar: user.avatarUrl,
            recipientId: activeChat.isCommunity ? undefined : activeChat.id
        };
        setInput('');
        sendMessageMutation.mutate(messagePayload);
    };

    const handleScroll = () => {
        const container = messagesContainerRef.current;
        if (container) {
            const isAtBottom = container.scrollHeight - container.clientHeight <= container.scrollTop + 1;
            if (isAtBottom) {
                setShowScrollToBottom(false);
            }
        }
    };
    
    return (
        <div className="container mx-auto p-4 md:p-8 h-[calc(100vh-10rem)]">
            <div className="flex h-full bg-brand-surface rounded-lg shadow-2xl border border-brand-muted/50 overflow-hidden">
                {/* Sidebar */}
                <div className="w-1/3 md:w-1/4 bg-brand-dark/50 border-r border-brand-muted/50 p-4 flex flex-col">
                    <h2 className="text-xl font-bold font-serif text-white mb-4">Chats</h2>
                    <div className="flex-grow overflow-y-auto pr-2">
                        {/* Community Chat */}
                        <div 
                            onClick={() => setActiveChat({ id: 'community', name: 'Community Chat', isCommunity: true })}
                            className={`p-3 rounded-md mb-2 cursor-pointer transition-colors ${activeChat.id === 'community' ? 'bg-brand-gold text-brand-dark' : 'hover:bg-brand-muted'}`}
                        >
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-brand-muted rounded-full"><ICONS.Users className="h-5 w-5"/></div>
                                <div>
                                    <h3 className={`font-bold ${activeChat.id === 'community' ? '' : 'text-white'}`}>Community Chat</h3>
                                    <p className={`text-xs ${activeChat.id === 'community' ? 'text-brand-dark/70' : 'text-brand-text-dark'}`}>Global discussion</p>
                                </div>
                            </div>
                        </div>

                        {/* Private Messages */}
                        <h3 className="text-lg font-bold font-serif text-white mt-6 mb-2">Private Messages</h3>
                         {users.map(u => (
                            <div 
                                key={u.id}
                                onClick={() => setActiveChat({ id: u.id, name: u.fullName || u.email, isCommunity: false, avatar: u.avatarUrl || `https://ui-avatars.com/api/?name=${u.fullName || u.email}&background=2B2F36&color=EAEAEA` })}
                                className={`p-3 rounded-md mb-2 cursor-pointer transition-colors ${activeChat.id === u.id ? 'bg-brand-gold text-brand-dark' : 'hover:bg-brand-muted'}`}
                            >
                                <div className="flex items-center space-x-3">
                                     <div className="relative">
                                         <img src={u.avatarUrl || `https://ui-avatars.com/api/?name=${u.fullName || u.email}&background=2B2F36&color=EAEAEA`} alt={u.fullName || ''} className="h-10 w-10 rounded-full object-cover" />
                                         <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-brand-dark/50"></div>
                                     </div>
                                     <div>
                                        <h3 className={`font-bold truncate ${activeChat.id === u.id ? '' : 'text-white'}`}>{u.fullName || u.email}</h3>
                                     </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col relative">
                    {/* Header */}
                    <div className="p-4 border-b border-brand-muted/50 flex items-center space-x-3">
                        { !activeChat.isCommunity && activeChat.avatar && <img src={activeChat.avatar} className="h-10 w-10 rounded-full object-cover" /> }
                        <div>
                            <h2 className="text-xl font-bold text-white">{activeChat.name}</h2>
                            <p className="text-sm text-brand-text-dark">{activeChat.isCommunity ? 'Global discussion for all members' : 'Private conversation'}</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-6 overflow-y-auto" ref={messagesContainerRef} onScroll={handleScroll}>
                        {isLoadingMessages ? <div className="flex justify-center"><Spinner /></div> : (
                            <div className="space-y-1">
                                {messages.length === 0 ? (
                                    <div className="text-center text-brand-text-dark py-16">
                                        <ICONS.MessageSquare className="mx-auto h-12 w-12 text-brand-muted" />
                                        <p className="mt-2">No messages yet. Start the conversation!</p>
                                    </div>
                                ) : (
                                    messages.map((msg, index) => {
                                        const prevMessage = messages[index - 1];
                                        const isSameAuthor = prevMessage && prevMessage.authorId === msg.authorId;
                                        const isMyMessage = msg.authorId === user?.id;

                                        return (
                                            <div key={msg._id} className={`flex items-end gap-3 ${isMyMessage ? 'flex-row-reverse' : ''} ${isSameAuthor ? '' : 'mt-4'}`}>
                                                <div className="w-8 flex-shrink-0">
                                                    {!isSameAuthor && (
                                                        <img src={msg.authorAvatar || `https://ui-avatars.com/api/?name=${msg.authorName}&background=2B2F36&color=EAEAEA`} alt={msg.authorName} className="h-8 w-8 rounded-full object-cover"/>
                                                    )}
                                                </div>
                                                <div>
                                                    {!isSameAuthor && !isMyMessage && <p className="text-xs text-brand-text-dark mb-1 ml-2">{msg.authorName}</p>}
                                                    <div className={`max-w-md rounded-lg px-4 py-3 shadow relative ${isMyMessage ? 'bg-brand-gold text-brand-dark rounded-br-none' : 'bg-brand-muted text-white rounded-bl-none'}`}>
                                                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                                        {isMyMessage && (
                                                            <div className="absolute -right-1.5 -bottom-1.5 text-brand-dark/60">
                                                                <ICONS.CheckCheck className="w-5 h-5"/>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                                {/* Typing Indicator Placeholder */}
                                {/* 
                                This is a UI placeholder. A real implementation would require a WebSocket
                                event to set an `isTyping` state.
                                { isTyping && !activeChat.isCommunity && (
                                <div className="flex items-end gap-3 mt-4">
                                    <div className="w-8 flex-shrink-0">
                                        <img src={activeChat.avatar} alt={activeChat.name} className="h-8 w-8 rounded-full object-cover"/>
                                    </div>
                                    <div className="max-w-md rounded-lg px-4 py-3 shadow bg-brand-muted text-white rounded-bl-none">
                                        <div className="typing-indicator">
                                            <span></span><span></span><span></span>
                                        </div>
                                    </div>
                                </div>
                                )}
                                */}
                            </div>
                        )}
                    </div>
                    
                    {showScrollToBottom && (
                        <Button
                            onClick={() => scrollToBottom()}
                            className="absolute bottom-24 right-8 rounded-full !p-3 shadow-lg"
                        >
                            <ICONS.ChevronDown className="h-6 w-6" />
                        </Button>
                    )}

                    {/* Input */}
                    <div className="p-4 border-t border-brand-muted/50">
                        <div className="flex items-center space-x-3 bg-brand-dark rounded-full px-2">
                             <Button variant="ghost" size="sm" className="rounded-full !p-2 text-brand-text-dark hover:text-white" aria-label="Add emoji">
                                <ICONS.Smile className="h-6 w-6" />
                            </Button>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder={`Message ${activeChat.name}...`}
                                className="flex-1 bg-transparent border-none py-3 px-2 text-white placeholder-gray-500 focus:ring-0"
                                disabled={sendMessageMutation.isPending}
                            />
                            <Button onClick={handleSendMessage} isLoading={sendMessageMutation.isPending} size="sm" className="rounded-full !p-3.5">
                                <ICONS.Send className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                .typing-indicator {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 20px;
                }
                .typing-indicator span {
                    height: 6px;
                    width: 6px;
                    margin: 0 2px;
                    background-color: #9ca3af;
                    border-radius: 50%;
                    display: inline-block;
                    animation: bounce 1.4s infinite ease-in-out both;
                }
                .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
                .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
                @keyframes bounce {
                    0%, 80%, 100% { transform: scale(0); }
                    40% { transform: scale(1.0); }
                }
            `}</style>
        </div>
    );
};

export default ChatPage;