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
      playerAssetKey: Joi.string().required(),
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

route.delete('/:id', isAuth, async (req, res, next) => {
  const characterId = req.params.id;
  const logger: Logger = Container.get('logger');
  logger.debug(
    'Calling DELETE to /character/:id endpoint with id: %s',
    characterId
  );
  try {
    const characterService = Container.get(CharacterService);
    await characterService.delete(characterId);
    return res.status(204).end();
  } catch (e) {
    return next(e);
  }
});

route.put(
  '/:id',
  isAuth,
  celebrate({
    body: Joi.object({
      name: Joi.string().optional(),
      level: Joi.number().optional(),
      money: Joi.number().optional(),
      experience: Joi.number().optional(),
      health: Joi.number().optional(),
      maxHealth: Joi.number().optional(),
      mana: Joi.number().optional(),
      maxMana: Joi.number().optional(),
      playerAssetKey: Joi.string().optional(),
    }),
  }),
  async (req, res, next) => {
    const characterId = req.params.id;
    const logger: Logger = Container.get('logger');
    logger.debug(
      'Calling PUT to /company/:id endpoint with body: %o',
      req.body
    );
    try {
      const characterService = Container.get(CharacterService);
      const character = await characterService.update(characterId, req.body);
      return res.status(200).json(character);
    } catch (e) {
      return next(e);
    }
  }
);

export default route;
