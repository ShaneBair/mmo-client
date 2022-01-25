import { Router } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';
import { Logger } from 'winston';
import AuthController from '../controllers/AuthController';

const route = Router();

route.post(
  '/register',
  celebrate({
    body: Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
    }),
  }),
  async (req, res, next) => {
    try {
      const authController: AuthController = Container.get(AuthController);
      const user = await authController.register(req.body);

      return res.status(201).json(user);
    } catch (e) {
      return next(e);
    }
  }
);

route.post(
  '/login',
  celebrate({
    body: Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    }),
  }),
  async (req, res, next) => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling /login endpoint with email: %s', req.body.email);
    try {
      const authController: AuthController = Container.get(AuthController);
      const user = await authController.login(req.body);

      return res.json(user).status(200);
    } catch (e) {
      return next(e);
    }
  }
);

export default route;
