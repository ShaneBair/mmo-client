import playerDB, { PlayerInfo } from "../../data/playerDatabase";

export class PlayerService {
    
    getByKey(key: string): PlayerInfo {
      return new PlayerInfo({ ...playerDB[key]});
    }
}

const playerService = new PlayerService();

export default playerService;