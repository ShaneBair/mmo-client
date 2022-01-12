import tilesetDB, { TilesetInfo } from "../../data/tilesetDatabase";

export class TilesetService {
    
    getTilesetByKey(key: string): TilesetInfo {
        return tilesetDB[key];
    }
}

const tilesetService = new TilesetService();

export default tilesetService;