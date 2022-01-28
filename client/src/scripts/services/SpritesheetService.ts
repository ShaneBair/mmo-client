import spritesheetDatabase, { SpritesheetInfo } from "../../data/spritesheetDatabase";

export class SpritesheetService {
	getByKey(key: string): SpritesheetInfo {
		return { ...spritesheetDatabase[key]};
	}
}

export default new SpritesheetService();
