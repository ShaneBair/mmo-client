import { Router } from 'express';
import auth from './auth';
import user from './user';
import character from './character';
import healthcheck from './healthcheck';
import gameState from './gameState';

const routes = Router();

routes.use('/auth', auth);
routes.use('/user', user);
routes.use('/character', character);
routes.use('/healthcheck', healthcheck);
routes.use('/gameState', gameState);

export default routes;
