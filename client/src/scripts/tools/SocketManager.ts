import { io, Socket } from 'socket.io-client';
import {Character as CharacterEntity} from "../../../../server/src/entities/Character";

export class SocketManager {
	socket: Socket;
	character: CharacterEntity;

	constructor() {
		const apiHost = process.env.API_URL as string;
		this.socket = io(apiHost);
	}
}

const socketManager = new SocketManager();

export default socketManager;