import { Service } from 'typedi';
import PlayerState from './PlayerState';

@Service()
export default class GameState {
  players: PlayerState[];

  getPlayersInMap(mapKey: string): PlayerState[] {
    const playersFound = this.players.filter((playerState) => {
      return playerState.character.location.mapName === mapKey ? true : false;
    });

    return playersFound;
  }
}
