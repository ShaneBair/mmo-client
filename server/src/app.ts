import server from './server';
import config from './config';
import Logger from './logger';
import 'reflect-metadata';
import dotenv from 'dotenv';

dotenv.config();

const startServer = async () => {
  const app = await server();

  app.listen(config.port, () => {
    Logger.info(`
      ################################################
      #  Server listening on port: ${config.port}    
      ################################################
    `);
  });
};

Logger.debug(`NODE_ENV: ${process.env.NODE_ENV}`);
startServer();
