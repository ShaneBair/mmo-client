import { io, Socket } from 'socket.io-client';

export class SocketManager {
	socket: Socket;

	constructor() {
		const apiHost = process.env.API_URL as string;
		this.socket = io(apiHost);
	}
}

const socketManager = new SocketManager();

export default socketManager;