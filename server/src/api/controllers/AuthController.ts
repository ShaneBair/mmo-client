import { Container, Service } from 'typedi';
import UserService from '../services/UserService';
import { Logger } from 'winston';
import { User } from '../entities/User';

interface AuthResponse {
  user: User;
  token: string;
}

interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

@Service()
export default class AuthController {
  public async register(request: RegisterRequest): Promise<AuthResponse> {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling /register endpoint with body: %o', request);

    const userServiceInstance = Container.get(UserService);
    const { user, token } = await userServiceInstance.register(request);

    return { user, token };
  }

  public async login(request: LoginRequest): Promise<AuthResponse> {
    const logger: Logger = Container.get('logger');
    logger.debug('Calling /login endpoint with email: %s', request.email);

    const userServiceInstance = Container.get(UserService);
    const { user, token } = await userServiceInstance.login(
      request.email,
      request.password
    );
    return { user, token };
  }
}
