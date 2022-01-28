import { SceneHandoffData } from "../objects/SceneEx";
import socketManager from "../tools/SocketManager";
import mapService from "../services/MapService";
import {Character as CharacterEntity} from "../../../../server/src/entities/Character";

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    this.load.image('terrain', 'assets/map/tiles/terrain.png');
    this.load.image('castle', 'assets/map/tiles/castle.png');
    this.load.image('outside', 'assets/map/tiles/outside.png');
    this.load.image('house', 'assets/map/tiles/house.png');
    this.load.image('doors', 'assets/map/tiles/animated/doors.png');
    this.load.image('water', 'assets/map/tiles/water.png');
    this.load.image('inside', 'assets/map/tiles/inside.png');

		this.load.spritesheet("animals2", 'assets/img/spritesheets/animals2.png', {
			frameWidth: 42,
			frameHeight: 36		
		});
  }

  create() {
		socketManager.socket.on('player:character_loaded', (character: CharacterEntity) => {
			console.log(character);
			socketManager.character = character;

			if(character?.location?.mapName === undefined) return;

			const mapInfo = mapService.getByKey(character.location.mapName);

			const handoffData: SceneHandoffData = {
				transitionProperties: [
					{
						name: "scene",
						value: mapInfo?.key ? "AutoScene" : character.location.mapName,
						type: "string"
					},
					{
						name: "map",
						value: mapInfo?.key,
						type: "string"
					},
					{
						name: "type",
						value: "transition",
						type: "string"
					},
					{
						name: "transitionEffect",
						value: "fade",
						type: "string"
					}
				],
				socketManager: socketManager,
			};
			this.scene.start("AutoScene", handoffData);
		});

		socketManager.socket.emit("player:load_character");
    

    /**
     * This is how you would dynamically import the mainScene class (with code splitting),
     * add the mainScene to the Scene Manager
     * and start the scene.
     * The name of the chunk would be 'mainScene.chunk.js
     * Find more about code splitting here: https://webpack.js.org/guides/code-splitting/
     */
    // let someCondition = true
    // if (someCondition)
    //   import(/* webpackChunkName: "mainScene" */ './mainScene').then(mainScene => {
    //     this.scene.add('MainScene', mainScene.default, true)
    //   })
    // else console.log('The mainScene class will not even be loaded by the browser')
  }
}
