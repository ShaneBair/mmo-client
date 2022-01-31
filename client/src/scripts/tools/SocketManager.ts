import { io, Socket } from 'socket.io-client';
import {Character as CharacterEntity} from "../../../../server/src/entities/Character";

export enum EventType {
  PLAYER_NEW = 'player:new',
  CHARACTER_LOAD = 'player:load_character',
  CHARACTER_LOADED = 'player:character_loaded',
  CHARACTER_UNLOAD = 'player:unload_character',
  CHARACTER_UNLOADED = 'player:character_unloaded',
	JOIN_MAP = 'player:join_map',

	SOCKET_NOT_FOUND = 'connection:socket_404',
}

export class SocketManager {
	socket: Socket;
	character: CharacterEntity;

	constructor() {
		const apiHost = process.env.API_URL as string;
		console.log(`SocketManager:constructor - apiHost = ${apiHost}`);
		this.socket = io(apiHost);
	}

	updateMapForPlayer(mapName: string | undefined) {
		this.socket.emit(EventType.JOIN_MAP, { data: mapName});
	}
}

const socketManager = new SocketManager();

export default socketManager;