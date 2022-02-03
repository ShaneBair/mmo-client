import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";
import { ActorInfo } from "../../data/actorDatabase";
import actorFactory from "../factories/ActorFactory";
import {SocketManager} from "../tools/SocketManager";
import Actor from "./Actors/Actor";
import Player from "./Player";
import { findPropertyByName, TiledProperty } from "./TiledHelpers";
import spritesheetServiceInstance, { SpritesheetService } from "../services/SpritesheetService";
import PlayerActor from "./Actors/PlayerActor";
import PlayerState from "../../../../server/src/game/PlayerState";
import { Coordinates } from "./types";

export interface SceneHandoffData {
    transitionProperties?: TiledProperty[];
		socketManager: SocketManager;
}

export default class SceneEx extends Phaser.Scene {
    matterCollision: PhaserMatterCollisionPlugin;

		map: Phaser.Tilemaps.Tilemap;
		mapKey: string;
    player: Player;
    handoffData: SceneHandoffData;
		actors: Actor[];
		otherPlayers: PlayerActor[];
		socketManager: SocketManager;
		spritesheetService: SpritesheetService;

		constructor(config) {
			super(config);

			this.actors = [];
			this.otherPlayers = [];
			this.spritesheetService = spritesheetServiceInstance;
		}

		init(data: SceneHandoffData) {
			this.handoffData = data;
			this.socketManager = data.socketManager;
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
					objectA: [this.player.playerSensors.left, this.player.playerSensors.right, this.player.playerSensors.bottom],
					objectB: transitionObject,
					callback: () => {
							this.handleSceneTransition(object);
					},
					context: this,
				});
		});
	}

	loadActorSpritesheets(loader: Phaser.Loader.LoaderPlugin, actor: ActorInfo): void {
		actor.spritesheetKeys.forEach(spritesheetKey => {
			const spritesheetInfo = this.spritesheetService.getByKey(spritesheetKey);

			loader.spritesheet(spritesheetInfo.key, spritesheetInfo.path, {
				frameWidth: spritesheetInfo.frameWidth,
				frameHeight: spritesheetInfo.frameHeight		
			});
		});
	}

	createActors() {
		const objectLayer = this.map.getObjectLayer("Actors");

		if(objectLayer === null) return;

		const depth = findPropertyByName(objectLayer.properties as unknown as TiledProperty[], "depth")?.value ?? 0;

		objectLayer.objects.forEach((object: Phaser.Types.Tilemaps.TiledObject) => {
			const actor = actorFactory.createActor(this, object, depth);

			if(actor) 
				this.actors.push(actor);
		});
	}

	removeActor(guid: string) {
		this.actors.forEach( (item, index) => {
			if(item.guid === guid) this.actors.splice(index, 1);
		})
	}

	handleSceneTransition(object: Phaser.Types.Tilemaps.TiledObject) {
		const type = findPropertyByName(object.properties, "type");
		
		if(type?.value !== "transition") return;

		const scene = findPropertyByName(object.properties, "scene");

		if(!scene) return;

		const handoffData: SceneHandoffData = {
			transitionProperties: object.properties,
			socketManager: this.socketManager,
		};
		this.scene.start(scene.value, handoffData);
	}

	createPlayer() {
		const toSpawnIdProperty = findPropertyByName(this.handoffData.transitionProperties, "toSpawnId");

		const spawnLayer = this.map.getObjectLayer("Spawn");
		const tileObject = this.findPlayerSpawnPoint(toSpawnIdProperty?.value),
					x = tileObject.x ?? 0,
					y = tileObject.y ?? 0,
					z = findPropertyByName(spawnLayer.properties as unknown as TiledProperty[], "depth")?.value ?? 0;

		this.player = new Player(this, this.socketManager.character, x, y, z);
		this.mapKey = findPropertyByName(this.handoffData.transitionProperties, "map")?.value;
		this.socketManager.updateMapForPlayer(this.mapKey);
	}

	createMapTileLayers() {
		this.map.layers.forEach(layer => {
			const currentLayer = this.map.createLayer(layer.name, this.map.tilesets).setCollisionByProperty({collides: true});
			const depth = findPropertyByName(layer.properties, "depth")?.value ?? 0;

			currentLayer.setDepth(depth);
			this.matter.world.convertTilemapLayer(currentLayer);
		});
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	update(time: number, delta: number): void {
		this.socketManager.requestSceneStatus(this.mapKey ?? this.scene.key);
	}

	updatePlayersOnScene(data: PlayerState[]) {
		data.forEach( (playerState) => {
			const player = this.otherPlayers.find(p => p?.playerState?.socketId === playerState?.socketId);
			if(player !== undefined) {
				player.sprite.setPosition(playerState.character.location?.x, playerState.character.location?.y, playerState.character.location?.z);
				player.sprite.play(`${playerState.character.playerAssetKey}-${playerState.animation.animationKey}`, true);
				if(playerState.animation.stopAnimation) {
					player.sprite.anims.stop();
					player.sprite.setFrame(playerState.animation.setFrame);
				}
			}
		});
	}

	addPlayerToScene(data: PlayerState) {
		if(data.socketId === this.socketManager.socket.id) return;

		if(!this.otherPlayers.find(p => p?.playerState?.socketId === data.socketId)) {
			const playerActor = new PlayerActor(this, data.character.playerAssetKey, data.character.location as Coordinates, false);
			playerActor.playerState = data;

			this.otherPlayers.push(playerActor);
		}
	}

	removePlayerFromScene(socketId: string) {
		const playerIndex = this.otherPlayers.findIndex(p => p.playerState.socketId === socketId);
		this.otherPlayers[playerIndex]?.destroy();

		this.otherPlayers.slice(playerIndex, 1);
	}
}