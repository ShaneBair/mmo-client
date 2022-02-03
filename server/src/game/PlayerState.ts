import { Character } from '../entities/Character';

export type animationInfo = {
  animationKey: string;
  stopAnimation: boolean;
  setFrame: number;
};

export default class PlayerState {
  character: Character;
  socketId: string;
  animation: animationInfo;

  constructor(data: Character, id: string) {
    this.character = data;
    this.socketId = id;

    this.animation = {
      animationKey: '',
      stopAnimation: false,
      setFrame: 0,
    };
  }
}
