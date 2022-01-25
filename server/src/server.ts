import 'reflect-metadata';
import express from 'express';
import Logger from './logger';
import { Server } from 'http';

const server = async () => {
  const app = express();
  let httpServer: Server;

  try {
    const loaders = await import('./loaders');
    httpServer = await loaders.default(app);
  } catch (err) {
    Logger.error(err);
    Logger.error('Loader failed. Server shutting down...');
    return;
  }
  return httpServer;
};

export default server;
