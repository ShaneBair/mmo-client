import { NextFunction, Request, Response, Router } from 'express';
import { Logger } from 'winston';
import { Container } from 'typedi';
import { isAuth, checkRole } from '../middlewares';
import GameState from 'src/game/GameState';
import GameStateController from '../controllers/GameStateController';

const route = Router();

route.get(
  '/',
  isAuth,
  checkRole('admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const gameStateController: GameStateController = Container.get(
        GameStateController
      );
      const state = await gameStateController.state();

      return res.status(201).json(state);
    } catch (e) {
      return next(e);
    }
  }
);

export default route;
