import {
  OnConnect,
  SocketController,
  ConnectedSocket,
  OnDisconnect,
  MessageBody,
  OnMessage,
  SocketId,
} from 'socket-controllers';
import Logger from '../../logger';

@SocketController()
export default class PlayerSocketController { 
  @OnConnect()
  connection(@ConnectedSocket() socket: any, @SocketId() id: string) {
    Logger.debug('client connected:' + id);
    socket.broadcast.emit('player:new');
  }

  @OnDisconnect()
  disconnect(@ConnectedSocket() socket: any, @SocketId() id: string) {
    Logger.debug('client disconnected:' + id);
  }

  @OnMessage('save')
  save(@ConnectedSocket() socket: any, @MessageBody() message: any) {
    Logger.debug('received message:', message);
    Logger.debug('setting id to the message and sending it back to the client');
    message.id = 545;
    socket.emit('message_saved', message);
  }
}
