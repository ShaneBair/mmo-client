import actorDB, { ActorInfo } from "../../data/actorDatabase";

export class ActorService {
    
    getByKey(key: string): ActorInfo {
      return new ActorInfo({ ...actorDB[key]});
    }
}

const actorService = new ActorService();

export default actorService;