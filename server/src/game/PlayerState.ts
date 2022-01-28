import { Character } from '../entities/Character';

export default class PlayerState {
  character: Character;
  socketId: string;

  constructor(data: Character, id: string) {
    this.character = data;
    this.socketId = id;
  }
}
