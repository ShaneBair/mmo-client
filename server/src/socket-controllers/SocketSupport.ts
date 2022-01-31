import { Location } from '../entities/Location';

export type SocketRequest = {
  type: SocketActionTypes;
  data: any;
};

export type SocketResponse = {
  data: any;
};

export enum SocketActionTypes {
  Generic = '',
  PlayerState = 'PlayerState',
}

export type PlayerStateAction = {
  location?: Location;
  animationKey?: string;
};
