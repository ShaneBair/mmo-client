import { io, Socket } from 'socket.io-client';
import { Character as CharacterEntity } from "../../../../server/src/entities/Character";
import { PlayerStateAction, SocketRequest } from "../../../../server/src/socket-controllers/SocketSupport";

export enum EventType {
  PLAYER_NEW = 'player:new',
  CHARACTER_LOAD = 'player:load_character',
  CHARACTER_LOADED = 'player:character_loaded',
  CHARACTER_UNLOAD = 'player:unload_character',
  CHARACTER_UNLOADED = 'player:character_unloaded',
	JOIN_MAP = 'player:join_map',
	PLAYER_STATE_UPDATE = 'player:state_update',
  PLAYER_STATE_UPDATED = 'player:stated_updated',

	SCENE_UPDATE_REQUEST = 'scene:update_request',
	SCENE_UPDATE = 'scene:update',

	SOCKET_NOT_FOUND = 'connection:socket_404',
}

export enum SocketActionTypes {
  Generic = '',
  PlayerState = 'PlayerState',
	SceneUpdate = 'SceneUpdate',
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

	sendPlayerState(stateUpdate: PlayerStateAction) {
		const request = {
			data: stateUpdate,
			type: SocketActionTypes.PlayerState,
		}
		this.socket.emit(EventType.PLAYER_STATE_UPDATE, request);
	}

	requestSceneStatus(sceneKey: string) {
		this.socket.emit(EventType.SCENE_UPDATE_REQUEST, { type: SocketActionTypes.SceneUpdate, data: sceneKey} );
	}
}

const socketManager = new SocketManager();

export default socketManager;