import {
  SocketController,
  ConnectedSocket,
  OnDisconnect,
  MessageBody,
  OnMessage,
  SocketId,
  EmitOnSuccess,
  EmitOnFail,
} from 'socket-controllers';
import Logger from '../logger';
import { Container } from 'typedi';
import GameState from '../game/GameState';
import { EventType } from './EventType';
import CharacterService from '../api/services/CharacterService';
import { PlayerStateAction, SocketRequest } from './SocketSupport';

@SocketController()
export default class GameSocketController {
  gameState: GameState;
  characterService: CharacterService;

  constructor() {
    this.characterService = Container.get(CharacterService);
    this.gameState = Container.get(GameState);
  }

  @OnMessage(EventType.PLAYER_STATE_UPDATE)
  async playerStateUpdate(
    @ConnectedSocket() socket: any,
    @SocketId() id: string,
    @MessageBody() request: SocketRequest
  ) {
    const data = request.data as PlayerStateAction;
    const playerState = this.gameState.getPlayerBySocketId(id);
    if (playerState === undefined) {
      Logger.debug('player state failed');
      throw new Error('playerStateUpdate - Socket Not Found - ' + id);
    }

    playerState.character.location = {
      ...playerState.character.location,
      x: data.location.x,
      y: data.location.y,
      z: data.location.z,
    };
    playerState.animationKey = data.animationKey;
  }
}
