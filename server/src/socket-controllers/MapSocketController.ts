import {
  SocketController,
  ConnectedSocket,
  OnDisconnect,
  MessageBody,
  OnMessage,
  SocketId,
  EmitOnSuccess,
} from 'socket-controllers';
import Logger from '../logger';
import { Container } from 'typedi';
import GameState from '../game/GameState';

@SocketController()
export default class MapSocketController {
  gameState: GameState;

  constructor() {
    this.gameState = Container.get(GameState);
  }
}
