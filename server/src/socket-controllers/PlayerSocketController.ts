import {
  OnConnect,
  SocketController,
  ConnectedSocket,
  OnDisconnect,
  MessageBody,
  OnMessage,
  SocketId,
  EmitOnSuccess,
} from 'socket-controllers';
import CharacterService from '../api/services/CharacterService';
import Logger from '../logger';
import { Container } from 'typedi';

@SocketController()
export default class PlayerSocketController {
  characterService: CharacterService;

  constructor() {
    this.characterService = Container.get(CharacterService);
  }

  @OnConnect()
  async connection(@ConnectedSocket() socket: any, @SocketId() id: string) {
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

  @OnMessage('player:load_character')
  @EmitOnSuccess('player:character_loaded')
  async loadCharacter(
    @ConnectedSocket() socket: any,
    @MessageBody() message: any
  ) {
    Logger.debug(`loadCharacter`, message);

    // Obviously this is not desirable and POC
    const character = await this.characterService.findRandomCharacter();

    return character;
  }
}
