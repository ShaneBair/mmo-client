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
import { Socket } from 'socket.io';

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
    @ConnectedSocket() socket: Socket,
    @SocketId() id: string,
    @MessageBody() request: SocketRequest
  ) {
    Logger.debug(`joinMap`, request);

    const playerState = this.gameState.getPlayerBySocketId(id);

    if (playerState === undefined) {
      throw new Error('Socket Not Found');
    }

    const oldMapName = playerState.character.location.mapName;
    const mapName = request.data;

    const newLocation = {
      ...playerState.character.location,
      mapName: mapName,
    };

    this.characterService.update(playerState.character.id.toString(), {
      location: newLocation,
    });
    playerState.character.location = newLocation;

    socket
      .to(oldMapName)
      .emit(EventType.PLAYER_LEFT_MAP, { data: playerState.socketId });
    socket.leave(oldMapName);
    socket.join(mapName);
    socket.to(mapName).emit(EventType.NEW_PLAYER_ON_MAP, { data: playerState });
  }

  @OnMessage(EventType.SCENE_UPDATE_REQUEST)
  @EmitOnSuccess(EventType.SCENE_UPDATE)
  async sceneUpdate(
    @ConnectedSocket() socket: Socket,
    @SocketId() id: string,
    @MessageBody() request: SocketRequest
  ): Promise<SocketResponse> {
    return {
      data: this.gameState.getPlayersInMap(request.data),
    };
  }
}
