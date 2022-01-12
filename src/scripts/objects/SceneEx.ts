import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";
import actorService from "../services/ActorService";
import Actor from "./Actor";
import Player from "./Player";
import { findPropertyByName, TiledProperty } from "./TiledHelpers";

export interface SceneHandoffData {
    transitionProperties?: TiledProperty[];
}

export default class SceneEx extends Phaser.Scene {
    matterCollision: PhaserMatterCollisionPlugin;

		map: Phaser.Tilemaps.Tilemap;
    player: Player;
    handoffData: SceneHandoffData;
		actors: Actor[];

		constructor(config) {
			super(config);

			this.actors = [];
		}

		init(data: SceneHandoffData) {
			this.handoffData = data;
		}

		findPlayerSpawnPoint(spawnId?: number | undefined) : Phaser.Types.Tilemaps.TiledObject {
			let tiledObject: Phaser.Types.Tilemaps.TiledObject;

			if(spawnId) {
				tiledObject = this.map.findObject("Spawn", (obj) => {
					const currentObject = obj as unknown as Phaser.Types.Tilemaps.TiledObject;

					if(currentObject.id === spawnId)
						return currentObject;
					else
						return undefined;
				});
			} else {
				tiledObject = this.map.findObject("Spawn", obj => obj.name === "Spawn Point");
			}

			return tiledObject;
	}

	createTransitionPoints() {
		const objectLayer = this.map.getObjectLayer("Transitions");

		objectLayer.objects.forEach(object => {
			if(!object.x || !object.y || !object.width || !object.height) return;
			const transitionObject = this.matter.add.rectangle(object.x + (object.width / 2) , object.y + (object.height / 2), object.width, object.height, { isStatic: true, isSensor: true });

			(this as SceneEx).matterCollision.addOnCollideStart( {
					objectA: [this.player.sensors.left, this.player.sensors.right, this.player.sensors.bottom],
					objectB: transitionObject,
					callback: () => {
							this.handleSceneTransition(object);
					},
					context: this,
				});
		});
	}

	createActors() {
		const objectLayer = this.map.getObjectLayer("Actors");

		objectLayer.objects.forEach((object: Phaser.Types.Tilemaps.TiledObject) => {
			if(!object.x || !object.y) return;
	
			const actorInfo = actorService.getActorByKey(object.name);

			this.actors.push(new Actor(
				this, 
				{
					x: object.x, 
					y: object.y, 
					z: findPropertyByName(objectLayer.properties as unknown as TiledProperty[], "depth")?.value ?? 0
				}, 
				actorInfo)
			);
		});
	}

	handleSceneTransition(object: Phaser.Types.Tilemaps.TiledObject) {
		const type = findPropertyByName(object.properties, "type");
		
		if(type?.value !== "transition") return;

		const scene = findPropertyByName(object.properties, "scene");

		if(!scene) return;

		const handoffData: SceneHandoffData = {
			transitionProperties: object.properties
		};
		this.scene.start(scene.value, handoffData);
	}

	createPlayer() {
		const toSpawnIdProperty = findPropertyByName(this.handoffData.transitionProperties, "toSpawnId");

		const spawnLayer = this.map.getObjectLayer("Spawn");
		const { x, y } = this.findPlayerSpawnPoint(toSpawnIdProperty?.value);
		const z = findPropertyByName(spawnLayer.properties as unknown as TiledProperty[], "depth")?.value ?? 0;

		this.player = new Player(this, x, y, z);
	}

	createMapTileLayers() {
		this.map.layers.forEach(layer => {
			const currentLayer = this.map.createLayer(layer.name, this.map.tilesets).setCollisionByProperty({collides: true});
			const depth = findPropertyByName(layer.properties, "depth")?.value ?? 0;

			currentLayer.setDepth(depth);
			this.matter.world.convertTilemapLayer(currentLayer);
		});
	}
}