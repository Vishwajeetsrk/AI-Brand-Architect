import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket, MessageBody, WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

@WebSocketGateway({
  cors: { origin: process.env.CORS_ORIGIN || '*', credentials: true },
  namespace: '/realtime',
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server!: Server;

  private presence = new Map<string, Set<string>>();
  private userSockets = new Map<string, Set<string>>();

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: AuthenticatedSocket): Promise<void> {
    try {
      const token = client.handshake.auth?.token || client.handshake.query?.token;
      if (!token) { client.disconnect(); return; }

      const payload = await this.jwtService.verifyAsync(token as string, {
        secret: process.env.JWT_SECRET || 'nexora-dev-secret-key-change-in-production',
      });
      client.userId = payload.sub;
      client.userRole = payload.role;

      const sockets = this.userSockets.get(payload.sub) || new Set();
      sockets.add(client.id);
      this.userSockets.set(payload.sub, sockets);

      client.join(`user:${payload.sub}`);

      if (!this.presence.has(payload.sub)) {
        this.presence.set(payload.sub, new Set());
        this.server.emit('presence:online', { userId: payload.sub });
      }
      this.presence.get(payload.sub)!.add(client.id);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket): void {
    if (!client.userId) return;

    const sockets = this.userSockets.get(client.userId);
    if (sockets) {
      sockets.delete(client.id);
      if (sockets.size === 0) this.userSockets.delete(client.userId);
    }

    const pres = this.presence.get(client.userId);
    if (pres) {
      pres.delete(client.id);
      if (pres.size === 0) {
        this.presence.delete(client.userId);
        this.server.emit('presence:offline', { userId: client.userId });
      }
    }
  }

  @SubscribeMessage('join:room')
  handleJoinRoom(client: AuthenticatedSocket, @MessageBody() data: { room: string }): void {
    if (!client.userId) throw new WsException('Not authenticated');
    client.join(data.room);
    client.to(data.room).emit('room:joined', { userId: client.userId, room: data.room });
  }

  @SubscribeMessage('leave:room')
  handleLeaveRoom(client: AuthenticatedSocket, @MessageBody() data: { room: string }): void {
    client.leave(data.room);
    client.to(data.room).emit('room:left', { userId: client.userId, room: data.room });
  }

  @SubscribeMessage('typing:start')
  handleTypingStart(client: AuthenticatedSocket, @MessageBody() data: { room: string }): void {
    client.to(data.room).emit('typing:start', { userId: client.userId, room: data.room });
  }

  @SubscribeMessage('typing:stop')
  handleTypingStop(client: AuthenticatedSocket, @MessageBody() data: { room: string }): void {
    client.to(data.room).emit('typing:stop', { userId: client.userId, room: data.room });
  }

  @SubscribeMessage('presence:get')
  handleGetPresence(client: AuthenticatedSocket): void {
    const online = [...this.presence.keys()];
    client.emit('presence:list', { online });
  }

  getOnlineUsers(): string[] {
    return [...this.presence.keys()];
  }

  isOnline(userId: string): boolean {
    return this.presence.has(userId) && (this.presence.get(userId)?.size ?? 0) > 0;
  }

  emitToUser(userId: string, event: string, data: unknown): void {
    this.server.to(`user:${userId}`).emit(event, data);
  }

  emitToRoom(room: string, event: string, data: unknown): void {
    this.server.to(room).emit(event, data);
  }

  emitToAll(event: string, data: unknown): void {
    this.server.emit(event, data);
  }
}
