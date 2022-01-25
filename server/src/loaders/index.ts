import { Application } from 'express';
import { Server } from 'http';
import { Container } from 'typedi';
import Logger from '../logger';
import databaseLoader from './database';
import expressLoader from './express';
import socketLoader from './socket';

export default async (app: Application): Promise<Server> => {
  Container.set('logger', Logger);
  try {
    await databaseLoader();
  } catch (err) {
    Logger.error(err);
    throw err;
  }
  Logger.info('Database loaded and connected!');

  expressLoader(app);
  Logger.info('Express loaded!');
  const server = socketLoader(app);
  Logger.info('socket.io loaded!');

  return server;
};
