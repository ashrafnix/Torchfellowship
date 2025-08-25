import { io, Socket } from 'socket.io-client';
import { getApiUrl } from '../config/api';

class SocketService {
  private socket: Socket | null = null;

  connect(token: string) {
    if (this.socket?.connected) return this.socket;
    
    // Use environment variable for socket URL if available, fallback to API base URL
    const socketUrl = (import.meta.env as any).VITE_SOCKET_URL || getApiUrl('').replace('/api', '');
    
    console.log(`🔌 Connecting to socket server at: ${socketUrl}`);
    
    this.socket = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('🟢 Connected to server - Real-time features active');
    });

    this.socket.on('disconnect', () => {
      console.log('🔴 Disconnected from server - Real-time features inactive');
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
    });

    return this.socket;
  }

  // --- Room Management ---
  joinRoom(roomId: string) {
    console.log(`🏠 Joining room: ${roomId}`);
    this.socket?.emit('join-room', roomId);
  }

  leaveRoom(roomId: string) {
    console.log(`🚪 Leaving room: ${roomId}`);
    this.socket?.emit('leave-room', roomId);
  }

  // --- Connection Events ---
  onConnect(callback: () => void) {
    this.socket?.on('connect', callback);
  }

  onDisconnect(callback: () => void) {
    this.socket?.on('disconnect', callback);
  }

  offConnect() {
    this.socket?.off('connect');
  }

  offDisconnect() {
    this.socket?.off('disconnect');
  }

  // --- Message Events ---
  onNewMessage(callback: (message: any) => void) {
    this.socket?.on('new-message', callback);
  }

  offNewMessage() {
    this.socket?.off('new-message');
  }

  onMessageRead(callback: (data: { messageId: string; userId: string }) => void) {
    this.socket?.on('message-read', callback);
  }

  offMessageRead() {
    this.socket?.off('message-read');
  }

  onMessageStatusUpdated(callback: (data: { messageId: string; delivered?: boolean; read?: boolean }) => void) {
    this.socket?.on('message-status-updated', callback);
  }

  offMessageStatusUpdated() {
    this.socket?.off('message-status-updated');
  }

  confirmMessageDelivered(messageId: string) {
    this.socket?.emit('message-delivered', messageId);
  }

  // --- Typing Indicators ---
  emitTyping(chatId: string, userName: string) {
    this.socket?.emit('user-typing', { chatId, userName });
  }

  emitStoppedTyping(chatId: string) {
    this.socket?.emit('user-stopped-typing', { chatId });
  }

  onUserTyping(callback: (data: { userId: string; userName: string; chatId: string }) => void) {
    this.socket?.on('user-typing', callback);
  }

  onUserStoppedTyping(callback: (data: { userId: string; chatId: string }) => void) {
    this.socket?.on('user-stopped-typing', callback);
  }

  offUserTyping() {
    this.socket?.off('user-typing');
  }

  offUserStoppedTyping() {
    this.socket?.off('user-stopped-typing');
  }

  // --- Online Status ---
  onUserOnline(callback: (data: { userId: string; userName: string }) => void) {
    this.socket?.on('user-online', callback);
  }

  onUserOffline(callback: (data: { userId: string }) => void) {
    this.socket?.on('user-offline', callback);
  }

  offUserOnline() {
    this.socket?.off('user-online');
  }

  offUserOffline() {
    this.socket?.off('user-offline');
  }

  // --- User Activity ---
  emitUserActivity() {
    this.socket?.emit('user-activity');
  }

  onUserActivity(callback: (data: { userId: string; timestamp: number }) => void) {
    this.socket?.on('user-activity', callback);
  }

  offUserActivity() {
    this.socket?.off('user-activity');
  }

  // --- Reactions ---
  emitReaction(messageId: string, emoji: string) {
    this.socket?.emit('message-reaction', { messageId, emoji });
  }

  onReactionAdded(callback: (data: { messageId: string; emoji: string; userId: string; userName: string }) => void) {
    this.socket?.on('reaction-added', callback);
  }

  offReactionAdded() {
    this.socket?.off('reaction-added');
  }

  // --- Connection Status ---
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // --- Cleanup ---
  disconnect() {
    if (this.socket) {
      console.log('🔌 Disconnecting socket...');
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();