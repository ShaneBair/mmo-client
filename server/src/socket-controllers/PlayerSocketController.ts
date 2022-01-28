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
import GameState from '../game/GameState';
import PlayerState from '../game/PlayerState';

@SocketController()
export default class PlayerSocketController {
  characterService: CharacterService;
  gameState: GameState;

  constructor() {
    this.characterService = Container.get(CharacterService);
    this.gameState = Container.get(GameState);
  }

  @OnConnect()
  async connection(@ConnectedSocket() socket: any, @SocketId() id: string) {
    Logger.debug('client connected:' + id);
    socket.broadcast.emit('player:new');
  }

  @OnDisconnect()
  disconnect(@ConnectedSocket() socket: any, @SocketId() id: string) {
    Logger.debug('client disconnected:' + id);

    this.unloadCharacter(socket, id);
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
    @SocketId() id: string,
    @MessageBody() message: any
  ) {
    Logger.debug(`loadCharacter`, message);

    // Obviously this is not desirable and POC
    const character = await this.characterService.findRandomCharacter();

    this.gameState.addPlayer(new PlayerState(character, id));

    return character;
  }

  @OnMessage('player:unload_character')
  @EmitOnSuccess('player:character_unloaded')
  async unloadCharacter(
    @ConnectedSocket() socket: any,
    @SocketId() id: string,
    @MessageBody() message?: any
  ) {
    Logger.debug(`unloadCharacter`, message);

    this.gameState.removePlayer(id);
  }
}
