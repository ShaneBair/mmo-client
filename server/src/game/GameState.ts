import { Service } from 'typedi';
import PlayerState from './PlayerState';
import Logger from '../logger';

@Service()
export default class GameState {
  protected players: PlayerState[];

  constructor() {
    this.players = [];
  }

  getPlayersInMap(mapKey: string): PlayerState[] {
    const playersFound = this.players.filter((playerState) => {
      return playerState.character.location.mapName === mapKey ? true : false;
    });

    return playersFound;
  }

  addPlayer(playerState: PlayerState) {
    this.players.push(playerState);
    Logger.debug(`GameState.players.length: ${this.players.length}`);
  }

  removePlayer(socketId: string) {
    const index = this.players.findIndex(
      (player) => player.socketId === socketId
    );
    if (index === -1) return;

    this.players.splice(
      this.players.findIndex((player) => player.socketId === socketId),
      1
    );

    Logger.debug(`GameState.players.length: ${this.players.length}`);
  }
}
