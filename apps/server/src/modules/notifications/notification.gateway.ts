import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/notifications', cors: { origin: '*' } })
export class NotificationGateway {
  @WebSocketServer() server!: Server;

  private userSockets = new Map<string, Set<string>>();

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      if (!this.userSockets.has(userId)) this.userSockets.set(userId, new Set());
      this.userSockets.get(userId)!.add(client.id);
      client.join(`user:${userId}`);
      client.data.userId = userId;
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    if (userId && this.userSockets.has(userId)) {
      this.userSockets.get(userId)!.delete(client.id);
      if (this.userSockets.get(userId)!.size === 0) this.userSockets.delete(userId);
    }
  }

  sendToUser(userId: string, event: string, data: any) {
    this.server.to(`user:${userId}`).emit(event, data);
  }

  sendToAll(event: string, data: any) {
    this.server.emit(event, data);
  }

  getOnlineUsers(): number {
    return this.userSockets.size;
  }
}
