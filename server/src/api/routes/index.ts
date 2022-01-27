import { Router } from 'express';
import auth from './auth';
import user from './user';
import character from './character';
import healthcheck from './healthcheck';

const routes = Router();

routes.use('/auth', auth);
routes.use('/user', user);
routes.use('/character', character);
routes.use('/healthcheck', healthcheck);

export default routes;
