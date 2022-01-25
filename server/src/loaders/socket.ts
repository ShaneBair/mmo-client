import { Application } from 'express';
import { Server, createServer } from 'http';
import { Server as socketServer } from 'socket.io';
import { useSocketServer } from 'socket-controllers';
import PlayerSocketController from '../api/socket-controllers/PlayerSocketController';

export default (app: Application): Server => {
  const httpServer = createServer(app);
  const io = new socketServer(httpServer);

  // io.use((socket: any, next: any) => {
  //   console.log('custom middleware');
  //   next();
  // });

  useSocketServer(io, {
    controllers: [PlayerSocketController],
  });

  return httpServer;
};
