import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ICONS } from '../constants';
import Spinner from '../components/ui/Spinner';
import { ChatMessage, User } from '../types';
import Button from '../components/ui/Button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../hooks/useApi';
import { toast } from 'react-toastify';
import { socketService } from '../services/socketService';
import { uploadImage } from '../services/uploadService';
import EmojiPicker from 'emoji-picker-react';

const ChatPage: React.FC = () => {
    const { user } = useAuth();
    const { apiClient } = useApi();
    const queryClient = useQueryClient();
    
    const [activeChat, setActiveChat] = useState<{ id: string, name: string, type: 'community' | 'admin' | 'private', avatar?: string }>({ id: 'community', name: 'Community Chat', type: 'community' });
    const [input, setInput] = useState('');
    const [showScrollToBottom, setShowScrollToBottom] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
    const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
    const [hoveredMessage, setHoveredMessage] = useState<string | null>(null);
    
    // Real-time features state
    const [isTyping, setIsTyping] = useState(false);
    const [typingUsers, setTypingUsers] = useState<{ [userId: string]: { name: string, timestamp: number } }>({});
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
    const [isConnected, setIsConnected] = useState(false);
    const [unreadCounts, setUnreadCounts] = useState<{ [chatId: string]: number }>({});
    const [lastActivity, setLastActivity] = useState<{ [userId: string]: number }>({});
    
    const typingTimeoutRef = useRef<number | null>(null);
    const lastTypingEmitRef = useRef<number>(0);
    
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- Data Fetching ---

    const { data: users = [] } = useQuery<User[]>({
        queryKey: ['users'],
        queryFn: () => apiClient('/api/users', 'GET'),
        enabled: !!user,
        select: (data) => data.filter((u: User) => u.id !== user?.id),
        refetchInterval: 30000, // Refresh every 30 seconds for real-time user updates
        staleTime: 15000,
    });

    const { data: messages = [], isLoading: isLoadingMessages } = useQuery<ChatMessage[]>({
        queryKey: ['messages', activeChat.id],
        queryFn: () => {
            let url;
            if (activeChat.type === 'community') {
                url = '/api/messages/community';
            } else if (activeChat.type === 'admin') {
                url = '/api/messages/admin';
            } else {
                url = `/api/messages/private?userId=${activeChat.id}`;
            }
            return apiClient<ChatMessage[]>(url, 'GET');
        },
        enabled: !!user,
        refetchInterval: 5000, // More frequent updates for real-time feel
        staleTime: 3000,
    });

    const sendMessageMutation = useMutation({
        mutationFn: (messagePayload: Partial<ChatMessage>) => apiClient<ChatMessage>('/api/messages', 'POST', messagePayload),
        onSuccess: (newMessage) => {
            queryClient.setQueryData(['messages', activeChat.id], (oldData: ChatMessage[] | undefined) => {
                if (!oldData) return [newMessage];
                const exists = oldData.some(msg => msg._id === newMessage._id);
                return exists ? oldData : [...oldData, newMessage];
            });
            setTimeout(() => scrollToBottom('smooth'), 0);
        },
        onError: (error: Error) => {
            toast.error(`Failed to send message: ${error.message}`);
        }
    });

    // --- Enhanced Socket.IO Setup with Real-time Features ---
    useEffect(() => {
        if (!user) return;
        
        const token = localStorage.getItem('token');
        if (token) {
            socketService.connect(token);
            
            // Connection status
            socketService.onConnect(() => {
                setIsConnected(true);
                console.log('🟢 Socket connected - Real-time features active');
            });
            
            socketService.onDisconnect(() => {
                setIsConnected(false);
                console.log('🔴 Socket disconnected - Real-time features inactive');
            });
            
            // Message events
            socketService.onNewMessage((message: ChatMessage) => {
                let roomId;
                if (message.chatType === 'admin') {
                    roomId = 'admin';
                } else if (message.recipientId) {
                    roomId = [message.authorId, message.recipientId].sort().join('-');
                } else {
                    roomId = 'community';
                }
                
                let currentRoomId;
                if (activeChat.type === 'admin') {
                    currentRoomId = 'admin';
                } else if (activeChat.type === 'community') {
                    currentRoomId = 'community';
                } else {
                    currentRoomId = [user.id, activeChat.id].sort().join('-');
                }
                    
                if (roomId === currentRoomId) {
                    queryClient.setQueryData(['messages', activeChat.id], (oldData: ChatMessage[] | undefined) => {
                        if (!oldData) return [message];
                        const exists = oldData.some(msg => msg._id === message._id);
                        return exists ? oldData : [...oldData, message];
                    });
                    
                    // Auto-scroll to new message
                    setTimeout(() => scrollToBottom('smooth'), 100);
                    
                    // Mark as read for private messages to me
                    if (message.recipientId === user.id && message._id) {
                        socketService.confirmMessageDelivered(message._id);
                        setTimeout(() => markAsRead(message._id!), 1000);
                    }
                } else {
                    // Update unread count for other chats
                    if (message.recipientId === user.id || (message.chatType === 'community' && message.authorId !== user.id)) {
                        setUnreadCounts(prev => ({
                            ...prev,
                            [message.chatType === 'community' ? 'community' : message.authorId]: (prev[message.chatType === 'community' ? 'community' : message.authorId] || 0) + 1
                        }));
                    }
                }
            });
            
            // Typing indicators
            socketService.onUserTyping(({ userId, userName, chatId }) => {
                if (userId !== user.id && chatId === activeChat.id) {
                    setTypingUsers(prev => ({
                        ...prev,
                        [userId]: { name: userName, timestamp: Date.now() }
                    }));
                    
                    // Auto-clear typing indicator after 3 seconds
                    setTimeout(() => {
                        setTypingUsers(prev => {
                            const updated = { ...prev };
                            delete updated[userId];
                            return updated;
                        });
                    }, 3000);
                }
            });
            
            socketService.onUserStoppedTyping(({ userId }) => {
                setTypingUsers(prev => {
                    const updated = { ...prev };
                    delete updated[userId];
                    return updated;
                });
            });
            
            // Online status
            socketService.onUserOnline(({ userId }) => {
                setOnlineUsers(prev => new Set([...prev, userId]));
                setLastActivity(prev => ({ ...prev, [userId]: Date.now() }));
            });
            
            socketService.onUserOffline(({ userId }) => {
                setOnlineUsers(prev => {
                    const updated = new Set(prev);
                    updated.delete(userId);
                    return updated;
                });
            });
            
            // User activity
            socketService.onUserActivity(({ userId }) => {
                setLastActivity(prev => ({ ...prev, [userId]: Date.now() }));
            });
            
            // Message status updates
            socketService.onMessageRead(({ messageId, userId }) => {
                queryClient.setQueryData(['messages', activeChat.id], (oldData: ChatMessage[] | undefined) => {
                    if (!oldData) return oldData;
                    return oldData.map(msg => 
                        msg._id === messageId ? { ...msg, read: true, delivered: true } : msg
                    );
                });
            });
            
            socketService.onMessageStatusUpdated(({ messageId, delivered, read }) => {
                queryClient.setQueryData(['messages', activeChat.id], (oldData: ChatMessage[] | undefined) => {
                    if (!oldData) return oldData;
                    return oldData.map(msg => {
                        if (msg._id === messageId) {
                            return { 
                                ...msg, 
                                ...(delivered !== undefined && { delivered }),
                                ...(read !== undefined && { read })
                            };
                        }
                        return msg;
                    });
                });
            });
        }
        
        return () => {
            socketService.offNewMessage();
            socketService.offMessageRead();
            socketService.offMessageStatusUpdated();
            socketService.offUserTyping();
            socketService.offUserStoppedTyping();
            socketService.offUserOnline();
            socketService.offUserOffline();
            socketService.offUserActivity();
            socketService.offConnect();
            socketService.offDisconnect();
        };
    }, [user, activeChat.id, activeChat.type, queryClient]);
    
    useEffect(() => {
        if (!user) return;
        
        let roomId;
        if (activeChat.type === 'admin') {
            roomId = 'admin';
        } else if (activeChat.type === 'community') {
            roomId = 'community';
        } else {
            roomId = [user.id, activeChat.id].sort().join('-');
        }
        socketService.joinRoom(roomId);
    }, [activeChat, user]);

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
            recipientId: activeChat.type === 'private' ? activeChat.id : undefined,
            chatType: activeChat.type,
            ...(replyingTo && {
                replyTo: {
                    messageId: replyingTo._id!,
                    content: replyingTo.isImage ? 'Image' : replyingTo.content.slice(0, 50),
                    authorName: replyingTo.authorName
                }
            })
        };
        setInput('');
        setReplyingTo(null);
        sendMessageMutation.mutate(messagePayload);
        setSidebarOpen(false); // Close sidebar on mobile after sending
    };
    
    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
        
        if (diffInHours < 24) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    };
    
    const markAsRead = async (messageId: string) => {
        try {
            await apiClient(`/api/messages/${messageId}/read`, 'PUT');
        } catch (error) {
            console.error('Failed to mark message as read:', error);
        }
    };
    
    const getMessageStatusIcon = (message: ChatMessage, isMyMessage: boolean) => {
        if (!isMyMessage) return null;
        
        if (message.read) {
            return <ICONS.CheckCheck className="w-4 h-4 text-blue-400" />;
        } else if (message.delivered) {
            return <ICONS.CheckCheck className="w-4 h-4 text-gray-400" />;
        } else {
            return <ICONS.Check className="w-4 h-4 text-gray-400" />;
        }
    };
    
    const onEmojiClick = (emojiData: any) => {
        setInput(prev => prev + emojiData.emoji);
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
    
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image file is too large. Please use a file under 5MB.');
            return;
        }
        
        setUploadingImage(true);
        try {
            const imageUrl = await uploadImage(file, 'chat-images');
            const messagePayload: Partial<ChatMessage> = {
                content: imageUrl,
                authorId: user!.id,
                authorName: user!.fullName || user!.email,
                authorAvatar: user!.avatarUrl,
                recipientId: activeChat.type === 'private' ? activeChat.id : undefined,
                chatType: activeChat.type,
                isImage: true
            };
            sendMessageMutation.mutate(messagePayload);
        } catch (error) {
            toast.error('Failed to upload image');
        } finally {
            setUploadingImage(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };
    
    const addReaction = async (messageId: string, emoji: string) => {
        try {
            await apiClient(`/api/messages/${messageId}/react`, 'POST', { emoji });
            queryClient.invalidateQueries({ queryKey: ['messages', activeChat.id] });
        } catch (error) {
            toast.error('Failed to add reaction');
        }
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
    
    // --- Real-time Typing Indicator Logic ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInput(value);
        
        const now = Date.now();
        const timeSinceLastEmit = now - lastTypingEmitRef.current;
        
        if (value.length > 0 && !isTyping && timeSinceLastEmit > 1000) {
            setIsTyping(true);
            socketService.emitTyping(activeChat.id, user?.fullName || user?.email || 'Anonymous');
            lastTypingEmitRef.current = now;
        }
        
        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        
        // Set new timeout to stop typing
        typingTimeoutRef.current = setTimeout(() => {
            if (isTyping) {
                setIsTyping(false);
                socketService.emitStoppedTyping(activeChat.id);
            }
        }, 2000);
        
        // Stop typing immediately if input is empty
        if (value.length === 0 && isTyping) {
            setIsTyping(false);
            socketService.emitStoppedTyping(activeChat.id);
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        }
    };
    
    // Clear unread count when switching chats
    useEffect(() => {
        setUnreadCounts(prev => {
            const updated = { ...prev };
            delete updated[activeChat.id];
            return updated;
        });
    }, [activeChat.id]);
    
    // --- User Activity Tracking ---
    useEffect(() => {
        if (!user || !isConnected) return;
        
        const handleUserActivity = () => {
            socketService.emitUserActivity();
        };
        
        // Track various user activities
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        
        events.forEach(event => {
            document.addEventListener(event, handleUserActivity, { passive: true });
        });
        
        // Send activity ping every 30 seconds
        const activityInterval = setInterval(handleUserActivity, 30000);
        
        return () => {
            events.forEach(event => {
                document.removeEventListener(event, handleUserActivity);
            });
            clearInterval(activityInterval);
        };
    }, [user, isConnected]);
    
    // Clean up typing timeout on unmount
    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);
    
    return (
        <div className="container mx-auto p-2 md:p-8 h-[calc(100vh-8rem)] md:h-[calc(100vh-10rem)]">
            <div className="flex h-full bg-brand-surface rounded-lg shadow-2xl border border-brand-muted/50 overflow-hidden relative">
                {/* Mobile Sidebar Overlay */}
                {sidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black/50 z-40 md:hidden" 
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
                
                {/* Sidebar */}
                <div className={`${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } md:translate-x-0 fixed md:relative z-50 md:z-auto w-80 md:w-1/4 h-full bg-brand-dark/50 border-r border-brand-muted/50 p-4 flex flex-col transition-transform duration-300 ease-in-out`}>
                    <h2 className="text-xl font-bold font-serif text-white mb-4">Chats</h2>
                    <div className="flex-grow overflow-y-auto pr-2 admin-scroll">
                        {/* Community Chat */}
                        <div 
                            onClick={() => {
                                setActiveChat({ id: 'community', name: 'Community Chat', type: 'community' });
                                setSidebarOpen(false);
                            }}
                            className={`p-3 rounded-md mb-2 cursor-pointer transition-colors relative ${activeChat.id === 'community' ? 'bg-brand-gold text-brand-dark' : 'hover:bg-brand-muted'}`}
                        >
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-brand-muted rounded-full"><ICONS.Users className="h-5 w-5"/></div>
                                <div className="flex-1">
                                    <h3 className={`font-bold ${activeChat.id === 'community' ? '' : 'text-white'}`}>Community Chat</h3>
                                    <p className={`text-xs ${activeChat.id === 'community' ? 'text-brand-dark/70' : 'text-brand-text-dark'}`}>Global discussion • {onlineUsers.size} online</p>
                                </div>
                                {unreadCounts.community > 0 && (
                                    <div className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center unread-badge">
                                        {unreadCounts.community > 9 ? '9+' : unreadCounts.community}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Admin Chat */}
                        {(user?.role === 'Admin' || user?.role === 'Super-Admin') && (
                            <div 
                                onClick={() => {
                                    setActiveChat({ id: 'admin', name: 'Admin Chat', type: 'admin' });
                                    setSidebarOpen(false);
                                }}
                                className={`p-3 rounded-md mb-2 cursor-pointer transition-colors ${activeChat.id === 'admin' ? 'bg-brand-gold text-brand-dark' : 'hover:bg-brand-muted'}`}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-red-600 rounded-full"><ICONS.Shield className="h-5 w-5 text-white"/></div>
                                    <div>
                                        <h3 className={`font-bold ${activeChat.id === 'admin' ? '' : 'text-white'}`}>Admin Chat</h3>
                                        <p className={`text-xs ${activeChat.id === 'admin' ? 'text-brand-dark/70' : 'text-brand-text-dark'}`}>Admin only</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Private Messages */}
                        <h3 className="text-lg font-bold font-serif text-white mt-6 mb-2">Private Messages</h3>
                         {users.map(u => {
                            const isOnline = onlineUsers.has(u.id);
                            const unreadCount = unreadCounts[u.id] || 0;
                            const lastSeen = lastActivity[u.id];
                            
                            return (
                                <div 
                                    key={u.id}
                                    onClick={() => {
                                        setActiveChat({ id: u.id, name: u.fullName || u.email, type: 'private', avatar: u.avatarUrl || `https://ui-avatars.com/api/?name=${u.fullName || u.email}&background=2B2F36&color=EAEAEA` });
                                        setSidebarOpen(false);
                                    }}
                                    className={`p-3 rounded-md mb-2 cursor-pointer transition-colors relative ${activeChat.id === u.id ? 'bg-brand-gold text-brand-dark' : 'hover:bg-brand-muted'}`}
                                >
                                    <div className="flex items-center space-x-3">
                                         <div className="relative">
                                             <img src={u.avatarUrl || `https://ui-avatars.com/api/?name=${u.fullName || u.email}&background=2B2F36&color=EAEAEA`} alt={u.fullName || ''} className="h-10 w-10 rounded-full object-cover" />
                                             <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-brand-dark/50 ${
                                                isOnline ? 'bg-green-500' : 'bg-gray-500'
                                             }`}></div>
                                         </div>
                                         <div className="flex-1 min-w-0">
                                            <h3 className={`font-bold truncate ${activeChat.id === u.id ? '' : 'text-white'}`}>{u.fullName || u.email}</h3>
                                            <p className={`text-xs truncate ${activeChat.id === u.id ? 'text-brand-dark/70' : 'text-brand-text-dark'}`}>
                                                {isOnline ? 'Online now' : 
                                                 lastSeen ? `Last seen ${new Date(lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 
                                                 'Offline'}
                                            </p>
                                         </div>
                                         {unreadCount > 0 && (
                                            <div className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0 unread-badge">
                                                {unreadCount > 9 ? '9+' : unreadCount}
                                            </div>
                                         )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col relative">
                    {/* Header */}
                    <div className="p-4 border-b border-brand-muted/50 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="md:hidden !p-2 text-white hover:bg-brand-muted"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <ICONS.Menu className="h-6 w-6" />
                            </Button>
                            { activeChat.type === 'private' && activeChat.avatar && <img src={activeChat.avatar} alt={`${activeChat.name} avatar`} className="h-10 w-10 rounded-full object-cover" /> }
                            { activeChat.type === 'admin' && <div className="p-2 bg-red-600 rounded-full"><ICONS.Shield className="h-6 w-6 text-white"/></div> }
                            { activeChat.type === 'community' && <div className="p-2 bg-brand-muted rounded-full"><ICONS.Users className="h-6 w-6"/></div> }
                            <div>
                                <div className="flex items-center space-x-2">
                                    <h2 className="text-xl font-bold text-white">{activeChat.name}</h2>
                                    {activeChat.type === 'private' && onlineUsers.has(activeChat.id) && (
                                        <div className="flex items-center space-x-1">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                            <span className="text-xs text-green-400 font-medium">Online</span>
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm text-brand-text-dark">
                                    {activeChat.type === 'community' ? `Global discussion for all members • ${onlineUsers.size} online` : 
                                     activeChat.type === 'admin' ? 'Admin-only discussion' : 
                                     onlineUsers.has(activeChat.id) ? 'Online now' : 
                                     lastActivity[activeChat.id] ? `Last seen ${new Date(lastActivity[activeChat.id]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Private conversation'}
                                </p>
                            </div>
                        </div>
                        
                        {/* Real-time Connection Status */}
                        <div className="flex items-center space-x-2">
                            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                                isConnected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${
                                    isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                                }`}></div>
                                <span>{isConnected ? 'Live' : 'Offline'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-6 overflow-y-auto bg-gradient-radial from-white/[0.03] via-transparent to-transparent admin-scroll" ref={messagesContainerRef} onScroll={handleScroll}>
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
                                            <div 
                                                key={`${msg._id}-${index}`} 
                                                className={`flex items-end gap-2 md:gap-3 ${isMyMessage ? 'flex-row-reverse' : ''} ${isSameAuthor ? '' : 'mt-4'} group`}
                                                onMouseEnter={() => setHoveredMessage(msg._id!)}
                                                onMouseLeave={() => setHoveredMessage(null)}
                                            >
                                                <div className="w-6 md:w-8 flex-shrink-0">
                                                    {!isSameAuthor && (
                                                        <img src={msg.authorAvatar || `https://ui-avatars.com/api/?name=${msg.authorName}&background=2B2F36&color=EAEAEA`} alt={msg.authorName} className="h-6 w-6 md:h-8 md:w-8 rounded-full object-cover"/>
                                                    )}
                                                </div>
                                                <div className="max-w-[75%] md:max-w-md relative">
                                                    {!isSameAuthor && !isMyMessage && <p className="text-xs text-brand-text-dark mb-1 ml-2">{msg.authorName}</p>}
                                                    
                                                    {/* Message Actions */}
                                                    {hoveredMessage === msg._id && (
                                                        <div className={`absolute -top-8 ${isMyMessage ? 'right-0' : 'left-0'} flex gap-1 bg-black/80 rounded-full px-2 py-1 z-10`}>
                                                            <button onClick={() => addReaction(msg._id!, '👍')} className="text-sm hover:scale-110 transition-transform">👍</button>
                                                            <button onClick={() => addReaction(msg._id!, '❤️')} className="text-sm hover:scale-110 transition-transform">❤️</button>
                                                            <button onClick={() => addReaction(msg._id!, '😂')} className="text-sm hover:scale-110 transition-transform">😂</button>
                                                            <button onClick={() => setReplyingTo(msg)} className="text-white text-xs px-2 py-1 hover:bg-white/20 rounded transition-colors">Reply</button>
                                                        </div>
                                                    )}
                                                    
                                                    <div className={`rounded-[20px] px-4 md:px-5 py-3 md:py-4 relative transition-all duration-300 ${isMyMessage ? 'bg-gradient-to-br from-[#005BEA] to-[#003DAA] text-white shadow-[0px_20px_40px_-10px_rgba(0,0,0,0.4),0px_8px_15px_-5px_rgba(0,0,0,0.3),0px_4px_6px_-2px_rgba(0,0,0,0.2)]' : 'bg-gradient-to-br from-[#303238] to-[#222428] text-[#F5F5F5] border border-white/5 shadow-[0px_20px_40px_-10px_rgba(0,0,0,0.4),0px_8px_15px_-5px_rgba(0,0,0,0.3),0px_4px_6px_-2px_rgba(0,0,0,0.2)]'}`}>
                                                        {/* Reply Preview */}
                                                        {msg.replyTo && (
                                                            <div className="mb-2 p-2 bg-black/20 rounded-lg border-l-2 border-white/30">
                                                                <p className="text-xs opacity-70">{msg.replyTo.authorName}</p>
                                                                <p className="text-sm opacity-80">{msg.replyTo.content}</p>
                                                            </div>
                                                        )}
                                                        
                                                        {msg.isImage ? (
                                                            <img 
                                                                src={msg.content} 
                                                                alt="Shared image" 
                                                                className="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                                                onClick={() => setFullscreenImage(msg.content)}
                                                            />
                                                        ) : (
                                                            <p className="text-base leading-relaxed whitespace-pre-wrap break-words font-medium">{msg.content}</p>
                                                        )}
                                                        <div className="flex items-center justify-end mt-2">
                                                            <p className="text-xs font-medium opacity-60 mr-2">
                                                                {formatTime(msg.created_at)}
                                                            </p>
                                                            {isMyMessage && (
                                                                <div className="flex-shrink-0 opacity-80">
                                                                    {getMessageStatusIcon(msg, isMyMessage)}
                                                                </div>
                                                            )}
                                                        </div>
                                                        
                                                        {/* Reactions */}
                                                        {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                                                            <div className="flex gap-1 mt-1">
                                                                {Object.entries(msg.reactions).map(([emoji, data]) => (
                                                                    <button
                                                                        key={emoji}
                                                                        onClick={() => addReaction(msg._id!, emoji)}
                                                                        className="bg-black/20 rounded-full px-2 py-1 text-xs flex items-center gap-1 hover:bg-black/30 transition-colors"
                                                                    >
                                                                        <span>{emoji}</span>
                                                                        <span>{data.count}</span>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                                
                                {/* Real-time Typing Indicators */}
                                {Object.keys(typingUsers).length > 0 && (
                                    <div className="flex items-end gap-3 mt-4 animate-fadeIn">
                                        <div className="w-8 flex-shrink-0">
                                            <div className="h-8 w-8 bg-gradient-to-br from-brand-gold to-yellow-500 rounded-full flex items-center justify-center">
                                                <span className="text-brand-dark font-bold text-sm">
                                                    {Object.values(typingUsers)[0].name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="max-w-md rounded-[20px] px-5 py-4 bg-gradient-to-br from-[#303238] to-[#222428] border border-white/5">
                                            <div className="flex items-center space-x-1">
                                                <span className="text-sm text-brand-text-dark">
                                                    {Object.keys(typingUsers).length === 1 
                                                        ? `${Object.values(typingUsers)[0].name} is typing`
                                                        : `${Object.keys(typingUsers).length} people are typing`
                                                    }
                                                </span>
                                                <div className="typing-indicator ml-2">
                                                    <span></span><span></span><span></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    
                    {showScrollToBottom && (
                        <Button
                            onClick={() => scrollToBottom()}
                            className="absolute bottom-24 right-8 rounded-full !p-3 bg-gradient-to-br from-[#303238] to-[#222428] border border-white/5 shadow-[0px_20px_40px_-10px_rgba(0,0,0,0.4),0px_8px_15px_-5px_rgba(0,0,0,0.3),0px_4px_6px_-2px_rgba(0,0,0,0.2)] text-[#F5F5F5] hover:from-[#005BEA] hover:to-[#003DAA] transition-all duration-300"
                        >
                            <ICONS.ChevronDown className="h-6 w-6" />
                        </Button>
                    )}

                    {/* Input */}
                    <div className="p-4 border-t border-brand-muted/50 relative">
                        {/* Emoji Picker */}
                        {showEmojiPicker && (
                            <div ref={emojiPickerRef} className="absolute bottom-20 left-4 z-50">
                                <EmojiPicker
                                    onEmojiClick={onEmojiClick}
                                    theme={'dark' as any}
                                    width={350}
                                    height={450}
                                    emojiStyle={'apple' as any}
                                    previewConfig={{
                                        showPreview: false
                                    }}
                                    skinTonesDisabled
                                    searchDisabled={false}
                                    suggestedEmojisMode={'recent' as any}
                                />
                            </div>
                        )}
                        
                        {/* Reply Preview */}
                        {replyingTo && (
                            <div className="mb-2 p-3 bg-brand-muted/50 rounded-lg border-l-4 border-brand-gold flex justify-between items-center">
                                <div>
                                    <p className="text-xs text-brand-text-dark">Replying to {replyingTo.authorName}</p>
                                    <p className="text-sm text-white">{replyingTo.isImage ? 'Image' : replyingTo.content.slice(0, 50)}...</p>
                                </div>
                                <button onClick={() => setReplyingTo(null)} className="text-brand-text-dark hover:text-white" aria-label="Cancel reply">
                                    <ICONS.X className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                        
                        <div className="flex items-center space-x-3 bg-brand-dark rounded-full px-2">
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="rounded-full !p-2 text-brand-text-dark hover:text-white" 
                                aria-label="Upload image"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploadingImage}
                            >
                                <ICONS.UploadCloud className="h-6 w-6" />
                            </Button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                aria-label="Upload image file"
                            />

                             <Button 
                                variant="ghost" 
                                size="sm" 
                                className="rounded-full !p-2 text-brand-text-dark hover:text-white" 
                                aria-label="Add emoji"
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            >
                                <ICONS.Smile className="h-6 w-6" />
                            </Button>
                            <input
                                type="text"
                                value={input}
                                onChange={handleInputChange}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder={`Message ${activeChat.name}...`}
                                className="flex-1 bg-transparent border-none py-3 px-2 text-white placeholder-gray-500 focus:ring-0 focus:outline-none"
                                disabled={sendMessageMutation.isPending}
                            />
                            <Button onClick={handleSendMessage} isLoading={sendMessageMutation.isPending} variant="ghost" size="sm" className="rounded-full !p-2 text-brand-text-dark hover:text-white">
                                <ICONS.Send className="h-6 w-6" />
                            </Button>
                        </div>
                    </div>
                </div>
                
                {/* Fullscreen Image Viewer */}
                {fullscreenImage && (
                    <div 
                        className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
                        onClick={() => setFullscreenImage(null)}
                    >
                        <div className="relative max-w-full max-h-full">
                            <img 
                                src={fullscreenImage} 
                                alt="Fullscreen view" 
                                className="max-w-full max-h-full object-contain"
                                onClick={(e) => e.stopPropagation()}
                            />
                            <Button
                                variant="ghost"
                                size="sm"
                                className="absolute top-4 right-4 !p-2 bg-black/50 hover:bg-black/70 text-white rounded-full"
                                onClick={() => setFullscreenImage(null)}
                            >
                                <ICONS.X className="h-6 w-6" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
                
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
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                
                .animate-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                
                /* Real-time connection indicator */
                .connection-pulse {
                    animation: connectionPulse 2s ease-in-out infinite;
                }
                
                @keyframes connectionPulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.7; transform: scale(0.95); }
                }
                
                /* Unread message badge animation */
                .unread-badge {
                    animation: unreadBounce 0.4s ease-out;
                }
                
                @keyframes unreadBounce {
                    0% { transform: scale(0) rotate(45deg); }
                    50% { transform: scale(1.2) rotate(22.5deg); }
                    100% { transform: scale(1) rotate(0deg); }
                }
            `}</style>
        </div>
    );
};

export default ChatPage;