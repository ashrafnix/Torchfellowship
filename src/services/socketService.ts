import { io, Socket } from 'socket.io-client';
import { getApiUrl } from '../config/api';

class SocketService {
  private socket: Socket | null = null;

  connect(token: string) {
    if (this.socket?.connected) return this.socket;
    
    // Use environment variable for socket URL if available, fallback to API base URL
    const socketUrl = (import.meta.env as any).VITE_SOCKET_URL || getApiUrl('').replace('/api', '');
    
    console.log(`Connecting to socket server at: ${socketUrl}`);
    
    this.socket = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return this.socket;
  }

  joinRoom(roomId: string) {
    this.socket?.emit('join-room', roomId);
  }

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

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export const socketService = new SocketService();