import { Inject, Service } from 'typedi';
import { MongoRepository, ObjectID } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Logger } from 'winston';
import CRUD from './CRUD';
import { Character } from '../../entities/Character';

@Service()
export default class CharacterService extends CRUD<Character> {
  constructor(
    @InjectRepository(Character)
    protected repo: MongoRepository<Character>,
    @Inject('logger')
    protected logger: Logger
  ) {
    super(repo, logger);
  }

  getRepo(): MongoRepository<Character> {
    return this.repo;
  }

  async create(character: Character): Promise<Character> {
    return await super.create(character, 'name');
  }

  async findByUser(userId: string): Promise<Character[]> {
    const characters = await this.repo.find({ userId: userId });

    return characters;
  }

  async findByCharacter(characterId: string): Promise<Character> {
    return this.findOne(characterId);
  }

  async findRandomCharacter(): Promise<Character> {
    const characters = await this.find();

    return characters[Math.floor(Math.random() * characters.length)];
  }
}
