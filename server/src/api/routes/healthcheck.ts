import { NextFunction, Request, Response, Router } from 'express';
import { Logger } from 'winston';
import { Container } from 'typedi';

const route = Router();

route.get('/', async (req: Request, res: Response, next: NextFunction) => {
  const logger: Logger = Container.get('logger');
  logger.debug('Calling GET /healthcheck endpoint');
  try {
    const message = {
      message: 'Servers Running!',
    };
    return res.json(message).status(200);
  } catch (e) {
    return next(e);
  }
});

export default route;
