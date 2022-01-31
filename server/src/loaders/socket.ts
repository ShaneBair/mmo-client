import { Application } from 'express';
import { Server, createServer } from 'http';
import { Server as socketServer } from 'socket.io';
import { useSocketServer } from 'socket-controllers';
import PlayerSocketController from '../socket-controllers/PlayerSocketController';
import { Container } from 'typedi';
import Logger from '../logger';
import MapSocketController from '../socket-controllers/MapSocketController';
import GameSocketController from '../socket-controllers/GameSocketController';

export default (app: Application): Server => {
  Container.set('logger', Logger);

  Logger.debug('Cors Origin: ' + process.env.CORS_ORIGINS);
  const httpServer = createServer(app);
  const io = new socketServer(httpServer, {
    perMessageDeflate: false,
    cors: {
      origin: process.env.CORS_ORIGINS,
    },
  });

  // io.use((socket: any, next: any) => {
  //   console.log('custom middleware');
  //   next();
  // });

  useSocketServer(io, {
    controllers: [
      PlayerSocketController,
      MapSocketController,
      GameSocketController,
    ],
  });

  return httpServer;
};
