import { PlayerInfo } from "../../../data/playerDatabase";
import SceneEx from "../SceneEx";
import Actor from "./Actor";
import { Coordinates } from "../types";
import playerService from "../../services/PlayerService";
import PlayerState from "../../../../../server/src/game/PlayerState";

export default class PlayerActor extends Actor {
	playerInfo: PlayerInfo;
	walkingSpeed: number;
	playerState: PlayerState;

	constructor(scene: SceneEx, playerAssetKey: string, spawnCoords: Coordinates, currentPlayer: boolean) {
		const playerInfo = playerService.getByKey(playerAssetKey);
		super(scene, spawnCoords, playerInfo);

		this.playerInfo = playerInfo;
		this.walkingSpeed = 3;

		if(!currentPlayer) {
			this.create(spawnCoords);
		}
	}
}