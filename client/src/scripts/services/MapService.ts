import mapDB, { MapInfo } from "../../data/mapDatabase";

export class MapService {
    
    getByKey(key: string): MapInfo {
        return mapDB[key];
    }
}

const mapService = new MapService();

export default mapService;