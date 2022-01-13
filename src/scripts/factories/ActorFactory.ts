import { ActorType } from "../../data/actorDatabase";
import Actor from "../objects/Actors/Actor";
import AnimalActor from "../objects/Actors/AnimalActor";
import SceneEx from "../objects/SceneEx";
import { Coordinates } from "../objects/types";
import actorService from "../services/ActorService";

class ActorFactory {

	createActor(scene: SceneEx, createPoint: Phaser.Types.Tilemaps.TiledObject, depth: number): Actor | undefined {
		if(!createPoint.x || !createPoint.y) return;

		let actor: Actor;

		const actorInfo = actorService.getActorByKey(createPoint.name);
		const spawnPoint: Coordinates = {
			x: createPoint.x,
			y: createPoint.y,
			z: depth
		};

		switch(actorInfo.type) {
			case ActorType.Animal:
				actor = new AnimalActor(scene, spawnPoint, actorInfo);
				break;
			default:
				actor = new Actor(scene, spawnPoint, actorInfo);
		}
		
		return actor;
	}
}

const actorFactory = new ActorFactory();

export default actorFactory;