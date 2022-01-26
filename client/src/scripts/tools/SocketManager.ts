import { io, Socket } from 'socket.io-client';
import config from '../../config';

export class SocketManager {
	socket: Socket;

	constructor() {
		this.socket = io(config.apiHost);
	}
}

const socketManager = new SocketManager();

export default socketManager;