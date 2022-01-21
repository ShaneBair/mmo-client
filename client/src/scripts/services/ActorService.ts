import actorDB, { ActorInfo } from "../../data/actorDatabase";

export class ActorService {
    
    getActorByKey(key: string): ActorInfo {
      return { ...actorDB[key]};
    }
}

const actorService = new ActorService();

export default actorService;