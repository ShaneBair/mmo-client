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
import { SocketRequest, SocketResponse } from './SocketSupport';

@SocketController()
export default class MapSocketController {
  gameState: GameState;
  characterService: CharacterService;

  constructor() {
    this.characterService = Container.get(CharacterService);
    this.gameState = Container.get(GameState);
  }

  @OnMessage(EventType.JOIN_MAP)
  @EmitOnFail(EventType.SOCKET_NOT_FOUND)
  async joinMap(
    @ConnectedSocket() socket: any,
    @SocketId() id: string,
    @MessageBody() request: SocketRequest
  ) {
    Logger.debug(`joinMap`, request);

    const playerState = this.gameState.getPlayerBySocketId(id);

    if (playerState === undefined) {
      throw new Error('Socket Not Found');
    }

    const newLocation = {
      ...playerState.character.location,
      mapName: request.data,
    };

    this.characterService.update(playerState.character.id.toString(), {
      location: newLocation,
    });
    this.gameState.getPlayerBySocketId(id).character.location = newLocation;
  }

  @OnMessage(EventType.SCENE_UPDATE_REQUEST)
  @EmitOnSuccess(EventType.SCENE_UPDATE)
  async sceneUpdate(
    @ConnectedSocket() socket: any,
    @SocketId() id: string,
    @MessageBody() request: SocketRequest
  ): Promise<SocketResponse> {
    return {
      data: this.gameState.getPlayersInMap(request.data),
    };
  }
}
