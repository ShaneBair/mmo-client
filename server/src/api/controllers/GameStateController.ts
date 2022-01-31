import { Container, Service } from 'typedi';
import { Logger } from 'winston';
import GameState from '../../game/GameState';

@Service()
export default class GameStateController {
  public async state(): Promise<GameState> {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling /gameState endpoint');

    const gameStateInstance = Container.get(GameState);
    return gameStateInstance;
  }
}
