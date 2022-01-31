import { PlayerInfo } from "../../../data/playerDatabase";
import SceneEx from "../SceneEx";
import Actor from "./Actor";
import { Coordinates } from "../types";
import playerService from "../../services/PlayerService";


export default class PlayerActor extends Actor {
	playerInfo: PlayerInfo;
	walkingSpeed: number;

	constructor(scene: SceneEx, playerAssetKey: string, spawnCoords: Coordinates) {
		const playerInfo = playerService.getByKey(playerAssetKey);
		super(scene, spawnCoords, playerInfo);

		this.playerInfo = playerInfo;
		this.walkingSpeed = 3;
	}
}