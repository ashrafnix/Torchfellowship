'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  collection, query, where, orderBy, limit, onSnapshot,
  addDoc, updateDoc, doc, serverTimestamp, Timestamp, arrayUnion, arrayRemove,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { useAuth } from '@/hooks/useAuth';
import { ICONS } from '@/src/constants';
import Spinner from '@/components/ui/Spinner';
import { User } from '@/lib/types';
import Button from '@/components/ui/Button';
import { useApi } from '@/hooks/useApi';
import { toast } from 'react-toastify';
import { uploadImage } from '@/services/uploadService';
import EmojiPicker from 'emoji-picker-react';

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface ReactionData { count: number; users: string[] }

interface ChatMessage {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  chatType: 'community' | 'admin' | 'private';
  recipientId?: string;
  participants?: string[];
  isImage?: boolean;
  reactions?: Record<string, ReactionData>;
  read?: boolean;
  delivered?: boolean;
  replyTo?: { messageId: string; content: string; authorName: string };
  created_at: string;
}

interface ActiveChat {
  id: string;
  name: string;
  type: 'community' | 'admin' | 'private';
  avatar?: string;
}

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const tsToIso = (ts: any): string => {
  if (!ts) return new Date().toISOString();
  if (ts instanceof Timestamp) return ts.toDate().toISOString();
  if (typeof ts === 'string') return ts;
  return new Date().toISOString();
};

const formatTime = (iso: string): string => {
  const date = new Date(iso);
  const diffH = (Date.now() - date.getTime()) / 3_600_000;
  return diffH < 24
    ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const REACTIONS = ['👍', '❤️', '😂', '🙏', '🔥'];

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */
const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const { apiClient } = useApi();

  /* UI state */
  const [activeChat, setActiveChat] = useState<ActiveChat>({ id: 'community', name: 'Community Chat', type: 'community' });
  const [input, setInput] = useState('');
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [hoveredMessage, setHoveredMessage] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  /* Data state — driven by Firestore onSnapshot */
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const unsubRef = useRef<(() => void) | null>(null);

  /* ───── Firebase Auth readiness ───── */
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);
  useEffect(() => {
    import('@/lib/firebase/client').then(({ auth }) => {
      const unsub = auth.onAuthStateChanged((u) => {
        setIsFirebaseReady(!!u);
      });
      return () => unsub();
    });
  }, []);

  /* ───── Firestore real-time messages listener ───── */
  useEffect(() => {
    if (!user || !isFirebaseReady) return;

    setLoadingMessages(true);
    setMessages([]);

    // Unsubscribe from previous listener
    if (unsubRef.current) unsubRef.current();

    const col = collection(db, 'messages');
    let q;

    if (activeChat.type === 'community') {
      q = query(col, where('chatType', '==', 'community'), orderBy('created_at', 'asc'), limit(150));
    } else if (activeChat.type === 'admin') {
      q = query(col, where('chatType', '==', 'admin'), orderBy('created_at', 'asc'), limit(150));
    } else {
      // private: filter by participants array
      q = query(
        col,
        where('chatType', '==', 'private'),
        where('participants', 'array-contains', user.id),
        orderBy('created_at', 'asc'),
        limit(150)
      );
    }

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const msgs: ChatMessage[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            content: data.content ?? '',
            authorId: data.authorId ?? '',
            authorName: data.authorName ?? 'Unknown',
            authorAvatar: data.authorAvatar,
            chatType: data.chatType,
            recipientId: data.recipientId,
            participants: data.participants,
            isImage: data.isImage ?? false,
            reactions: data.reactions ?? {},
            read: data.read ?? false,
            delivered: data.delivered ?? false,
            replyTo: data.replyTo,
            created_at: tsToIso(data.created_at),
          } as ChatMessage;
        });
        setMessages(msgs);
        setLoadingMessages(false);
      },
      (error) => {
        console.error('Firestore listener error:', error);
        setLoadingMessages(false);
        // If index missing, show helpful message
        if (error.message?.includes('index')) {
          toast.error('Chat index is building. Messages will appear shortly.');
        } else if (error.message?.includes('permission')) {
          toast.error('Permission denied to read chat messages.');
        }
      }
    );

    unsubRef.current = unsub;
    return () => unsub();
  }, [user, isFirebaseReady, activeChat.id, activeChat.type]);

  /* ───── Load users once (for sidebar) ───── */
  useEffect(() => {
    if (!user) return;
    apiClient<User[]>('/api/users', 'GET')
      .then((data) => setUsers(data.filter((u) => u.id !== user.id)))
      .catch(() => {});
  }, [user]);

  /* ───── Auto-scroll ───── */
  const scrollToBottom = useCallback((behavior: 'smooth' | 'auto' = 'smooth') => {
    const el = messagesContainerRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior });
    setShowScrollToBottom(false);
  }, []);

  useEffect(() => {
    if (messages.length === 0) return;
    const el = messagesContainerRef.current;
    if (!el) return;
    const isScrolledUp = el.scrollHeight - el.clientHeight - el.scrollTop > 150;
    if (isScrolledUp) setShowScrollToBottom(true);
    else setTimeout(() => scrollToBottom('smooth'), 30);
  }, [messages, scrollToBottom]);

  useEffect(() => { scrollToBottom('auto'); }, [activeChat.id]);

  /* ───── Send message ───── */
  const handleSend = useCallback(async () => {
    if (!input.trim() || !user || sending) return;
    const content = input.trim();
    setInput('');
    setReplyingTo(null);
    setSending(true);

    try {
      const payload: Record<string, any> = {
        content,
        authorId: user.id,
        authorName: user.fullName || user.email,
        authorAvatar: user.avatarUrl ?? null,
        chatType: activeChat.type,
        reactions: {},
        read: false,
        delivered: activeChat.type !== 'private',
        created_at: serverTimestamp(),
      };

      if (activeChat.type === 'private') {
        payload.recipientId = activeChat.id;
        payload.participants = [user.id, activeChat.id].sort();
      }

      if (replyingTo) {
        payload.replyTo = {
          messageId: replyingTo.id,
          content: replyingTo.isImage ? 'Image' : replyingTo.content.slice(0, 60),
          authorName: replyingTo.authorName,
        };
      }

      await addDoc(collection(db, 'messages'), payload);
    } catch (err: any) {
      toast.error(`Failed to send: ${err.message}`);
      setInput(content); // restore input on failure
    } finally {
      setSending(false);
    }
  }, [input, user, sending, activeChat, replyingTo]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /* ───── Image upload ───── */
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB.'); return; }

    setUploadingImage(true);
    try {
      const imageUrl = await uploadImage(file, 'chat-images');
      await addDoc(collection(db, 'messages'), {
        content: imageUrl,
        authorId: user.id,
        authorName: user.fullName || user.email,
        authorAvatar: user.avatarUrl ?? null,
        chatType: activeChat.type,
        isImage: true,
        reactions: {},
        read: false,
        delivered: activeChat.type !== 'private',
        created_at: serverTimestamp(),
        ...(activeChat.type === 'private' && {
          recipientId: activeChat.id,
          participants: [user.id, activeChat.id].sort(),
        }),
      });
    } catch { toast.error('Image upload failed.'); }
    finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  /* ───── Reactions (written directly to Firestore) ───── */
  const addReaction = async (messageId: string, emoji: string) => {
    if (!user) return;
    const msgRef = doc(db, 'messages', messageId);
    try {
      const snap = await getDoc(msgRef);
      if (!snap.exists()) return;
      const data = snap.data();
      const reactions: Record<string, ReactionData> = { ...(data.reactions ?? {}) };

      if (!reactions[emoji]) reactions[emoji] = { count: 0, users: [] };
      const idx = reactions[emoji].users.indexOf(user.id);
      if (idx > -1) {
        reactions[emoji].users.splice(idx, 1);
        reactions[emoji].count = Math.max(0, reactions[emoji].count - 1);
        if (reactions[emoji].count === 0) delete reactions[emoji];
      } else {
        reactions[emoji].users.push(user.id);
        reactions[emoji].count++;
      }
      await updateDoc(msgRef, { reactions });
    } catch { toast.error('Failed to update reaction.'); }
  };

  /* ───── Emoji picker close on outside click ───── */
  useEffect(() => {
    if (!showEmojiPicker) return;
    const handler = (e: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showEmojiPicker]);

  /* ───── Status icon ───── */
  const statusIcon = (msg: ChatMessage, isMe: boolean) => {
    if (!isMe) return null;
    if (msg.read) return <ICONS.CheckCheck className="w-4 h-4 text-blue-400" />;
    if (msg.delivered) return <ICONS.CheckCheck className="w-4 h-4 text-gray-400" />;
    return <ICONS.Check className="w-4 h-4 text-gray-400" />;
  };

  /* ───── Sidebar chat list ───── */
  const chatList: ActiveChat[] = [
    { id: 'community', name: 'Community Chat', type: 'community' },
    ...(user?.role === 'Admin' || user?.role === 'Super-Admin'
      ? [{ id: 'admin', name: 'Admin Chat', type: 'admin' as const }]
      : []),
    ...users.map((u) => ({ id: u.id, name: u.fullName || u.email, type: 'private' as const, avatar: u.avatarUrl ?? undefined })),
  ];

  /* ────────────────────────────────────
     Render
  ──────────────────────────────────── */
  if (!user) {
    return (
      <div className="flex h-[calc(100vh-10rem)] items-center justify-center text-brand-text-dark">
        Please log in to access chat.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-2 md:p-8 h-[calc(100vh-8rem)] md:h-[calc(100vh-10rem)]">
      <div className="flex h-full bg-brand-surface rounded-lg shadow-2xl border border-brand-muted/50 overflow-hidden relative">

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* ── Sidebar ── */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static z-50 md:z-auto top-0 left-0 h-full w-72 md:w-64 bg-brand-dark border-r border-brand-muted/40 flex flex-col transition-transform duration-300`}>
          <div className="p-4 border-b border-brand-muted/40 flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Chats</h2>
            <button className="md:hidden text-brand-text-dark" onClick={() => setSidebarOpen(false)}>
              <ICONS.X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {chatList.map((chat) => (
              <button
                key={chat.id}
                onClick={() => { setActiveChat(chat); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-brand-muted/40 ${activeChat.id === chat.id ? 'bg-brand-gold/10 border-l-2 border-brand-gold' : ''}`}
              >
                {chat.avatar
                  ? <img src={chat.avatar} alt={chat.name} className="w-9 h-9 rounded-full object-cover" />
                  : <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-gold to-yellow-600 flex items-center justify-center text-brand-dark font-bold text-sm flex-shrink-0">{chat.name.charAt(0).toUpperCase()}</div>
                }
                <div className="min-w-0">
                  <p className={`text-sm font-medium truncate ${activeChat.id === chat.id ? 'text-brand-gold' : 'text-white'}`}>{chat.name}</p>
                  <p className="text-xs text-brand-text-dark capitalize">{chat.type}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Main chat area ── */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Header */}
          <div className="h-16 px-4 flex items-center gap-3 border-b border-brand-muted/40 bg-brand-dark flex-shrink-0">
            <button className="md:hidden text-brand-text-dark mr-1" onClick={() => setSidebarOpen(true)}>
              <ICONS.Menu className="w-5 h-5" />
            </button>
            {activeChat.avatar
              ? <img src={activeChat.avatar} alt={activeChat.name} className="w-9 h-9 rounded-full object-cover" />
              : <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-gold to-yellow-600 flex items-center justify-center text-brand-dark font-bold text-sm">{activeChat.name.charAt(0)}</div>
            }
            <div>
              <p className="font-semibold text-white text-sm">{activeChat.name}</p>
              <p className="text-xs text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
                Live
              </p>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={messagesContainerRef}
            onScroll={() => {
              const el = messagesContainerRef.current;
              if (!el) return;
              setShowScrollToBottom(el.scrollHeight - el.clientHeight - el.scrollTop > 150);
            }}
            className="flex-1 overflow-y-auto p-4 space-y-1"
          >
            {loadingMessages ? (
              <div className="flex h-full items-center justify-center"><Spinner /></div>
            ) : messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-brand-text-dark">
                <ICONS.MessageSquare className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm">No messages yet. Say hello!</p>
              </div>
            ) : (
              messages.map((msg, i) => {
                const isMe = msg.authorId === user.id;
                const prev = messages[i - 1];
                const isSameAuthor = prev?.authorId === msg.authorId;

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'} ${isSameAuthor ? 'mt-0.5' : 'mt-4'} group`}
                    onMouseEnter={() => setHoveredMessage(msg.id)}
                    onMouseLeave={() => setHoveredMessage(null)}
                  >
                    {/* Avatar (other users) */}
                    {!isMe && !isSameAuthor && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-gold to-yellow-600 flex items-center justify-center text-brand-dark font-bold text-xs mr-2 flex-shrink-0 self-end">
                        {msg.authorAvatar
                          ? <img src={msg.authorAvatar} alt={msg.authorName} className="w-8 h-8 rounded-full object-cover" />
                          : msg.authorName.charAt(0).toUpperCase()
                        }
                      </div>
                    )}
                    {!isMe && isSameAuthor && <div className="w-8 mr-2 flex-shrink-0" />}

                    <div className={`relative max-w-[72%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                      {!isSameAuthor && !isMe && (
                        <p className="text-xs text-brand-text-dark mb-1 ml-1">{msg.authorName}</p>
                      )}

                      {/* Quick reaction popup */}
                      {hoveredMessage === msg.id && (
                        <div className={`absolute -top-8 ${isMe ? 'right-0' : 'left-0'} flex gap-1 bg-[#1a1a2e]/95 border border-brand-muted/40 rounded-full px-2 py-1 z-20 shadow-lg`}>
                          {REACTIONS.map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => addReaction(msg.id, emoji)}
                              title={emoji}
                              className="text-base hover:scale-125 transition-transform leading-none p-0.5"
                            >
                              {emoji}
                            </button>
                          ))}
                          <button
                            onClick={() => setReplyingTo(msg)}
                            className="text-white text-xs px-2 py-0.5 hover:bg-white/20 rounded-full transition-colors ml-1 border-l border-white/20 pl-2"
                          >
                            Reply
                          </button>
                        </div>
                      )}

                      {/* Bubble */}
                      <div className={`rounded-2xl px-4 py-2.5 relative ${
                        isMe
                          ? 'bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-lg'
                          : 'bg-gradient-to-br from-[#303238] to-[#222428] text-[#F5F5F5] border border-white/5 shadow-md'
                      }`}>
                        {/* Reply preview */}
                        {msg.replyTo && (
                          <div className="mb-2 px-2 py-1.5 bg-black/25 rounded-lg border-l-2 border-white/40">
                            <p className="text-xs font-semibold opacity-70">{msg.replyTo.authorName}</p>
                            <p className="text-xs opacity-60 truncate">{msg.replyTo.content}</p>
                          </div>
                        )}

                        {/* Content */}
                        {msg.isImage ? (
                          <img
                            src={msg.content}
                            alt="Shared image"
                            className="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity max-h-64 object-contain"
                            onClick={() => setFullscreenImage(msg.content)}
                          />
                        ) : (
                          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
                        )}

                        {/* Footer: time + status */}
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span className="text-[10px] opacity-50">{formatTime(msg.created_at)}</span>
                          {statusIcon(msg, isMe)}
                        </div>

                        {/* Reactions display */}
                        {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {Object.entries(msg.reactions).map(([emoji, data]) => (
                              <button
                                key={emoji}
                                onClick={() => addReaction(msg.id, emoji)}
                                className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs border transition-colors ${
                                  data.users.includes(user.id)
                                    ? 'bg-brand-gold/20 border-brand-gold/50 text-brand-gold'
                                    : 'bg-black/20 border-white/10 hover:bg-black/30'
                                }`}
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
                );
              })
            )}
          </div>

          {/* Scroll to bottom FAB */}
          {showScrollToBottom && (
            <button
              onClick={() => scrollToBottom('smooth')}
              className="absolute bottom-20 right-6 w-10 h-10 bg-brand-gold text-brand-dark rounded-full shadow-lg flex items-center justify-center hover:bg-yellow-400 transition-colors z-10"
            >
              <ICONS.ChevronDown className="w-5 h-5" />
            </button>
          )}

          {/* Reply bar */}
          {replyingTo && (
            <div className="px-4 py-2 bg-brand-dark border-t border-brand-muted/30 flex items-center gap-2 text-sm">
              <div className="flex-1 pl-2 border-l-2 border-brand-gold">
                <p className="text-brand-gold text-xs font-semibold">{replyingTo.authorName}</p>
                <p className="text-brand-text-dark text-xs truncate">{replyingTo.isImage ? '📷 Image' : replyingTo.content}</p>
              </div>
              <button onClick={() => setReplyingTo(null)} className="text-brand-text-dark hover:text-white">
                <ICONS.X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Input bar */}
          <div className="px-3 py-3 border-t border-brand-muted/40 bg-brand-dark flex items-center gap-2">
            <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageUpload} className="hidden" />

            {/* Emoji */}
            <div ref={emojiPickerRef} className="relative flex-shrink-0">
              <button onClick={() => setShowEmojiPicker((v) => !v)} className="text-brand-text-dark hover:text-brand-gold transition-colors p-1">
                <ICONS.Smile className="w-5 h-5" />
              </button>
              {showEmojiPicker && (
                <div className="absolute bottom-12 left-0 z-50">
                  <EmojiPicker onEmojiClick={(data) => { setInput((p) => p + data.emoji); setShowEmojiPicker(false); }} theme={'dark' as any} />
                </div>
              )}
            </div>

            {/* Image upload */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImage}
              className="text-brand-text-dark hover:text-brand-gold transition-colors p-1 flex-shrink-0"
            >
              {uploadingImage ? <Spinner /> : <ICONS.Image className="w-5 h-5" />}
            </button>

            {/* Text input */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${activeChat.name}…`}
              className="flex-1 bg-brand-muted border border-brand-muted rounded-full px-4 py-2 text-sm text-brand-text placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold transition-all"
            />

            {/* Send */}
            <button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="w-9 h-9 bg-brand-gold rounded-full flex items-center justify-center text-brand-dark hover:bg-yellow-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              {sending ? <Spinner /> : <ICONS.Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen image modal */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setFullscreenImage(null)}
        >
          <img src={fullscreenImage} alt="Full size" className="max-w-full max-h-full object-contain rounded-lg" />
          <button className="absolute top-4 right-4 text-white hover:text-brand-gold">
            <ICONS.X className="w-8 h-8" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
