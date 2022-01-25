import { NextFunction, Request, Response, Router } from 'express';
import { Logger } from 'winston';
import { Container } from 'typedi';
import { isAuth, attachUser } from '../middlewares';
import CharacterService from '../services/CharacterService';
import { celebrate, Joi } from 'celebrate';
import { Character } from '../../entities/Character';

const route = Router();

route.get(
  '/',
  isAuth,
  attachUser,
  async (req: Request, res: Response, next: NextFunction) => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling GET /character endpoint');
    try {
      const characterService = Container.get(CharacterService);
      const characters = await characterService.findByUser(
        req.currentUser.id.toString()
      );
      return res.json(characters).status(200);
    } catch (e) {
      return next(e);
    }
  }
);

route.get(
  '/:id',
  isAuth,
  attachUser,
  async (req: Request, res: Response, next: NextFunction) => {
    const characterId = req.params.id;
    const logger: Logger = Container.get('logger');
    logger.debug(
      `Calling GET to /character/:id endpoint with id: ${characterId}`
    );

    try {
      const characterService = Container.get(CharacterService);
      const character = await characterService.findByCharacter(characterId);

      return res.json(character).status(200);
    } catch (e) {
      return next(e);
    }
  }
);

route.post(
  '/',
  isAuth,
  attachUser,
  celebrate({
    body: Joi.object({
      name: Joi.string().required(),
    }),
  }),
  async (req, res, next) => {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling POST to /character endpoint with body: %o', req.body);
    logger.debug('Called by user: %o', req.currentUser);
    try {
      const characterService = Container.get(CharacterService);
      const character = await characterService.create(
        new Character({ ...req.body, userId: req.currentUser.id.toString() })
      );
      return res.status(201).json(character);
    } catch (e) {
      return next(e);
    }
  }
);

export default route;
