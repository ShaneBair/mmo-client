import { findPropertyByName } from "../objects/TiledHelpers";
import SceneEx from "../objects/SceneEx";
import mapService from "../services/MapService";
import tilesetService from "../services/TilesetService";

export default class AutoScene extends SceneEx {
	constructor() {
		super({ key: 'AutoScene' });
	}

	preload() {
		const mapKey = findPropertyByName(this.handoffData.transitionProperties, "map");
		const mapData = mapService.getMapByKey(mapKey?.value);

		this.load.tilemapTiledJSON(mapData.key, mapData.path);
	}

	create() {
		const mapKey = findPropertyByName(this.handoffData.transitionProperties, "map");
		const loader = new Phaser.Loader.LoaderPlugin(this);

		this.map = this.make.tilemap({ key: mapKey?.value});

		this.map.tilesets.forEach(tileset => {
			loader.image(tileset.name, tilesetService.getTilesetByKey(tileset.name).path);
		});

		loader.once(Phaser.Loader.Events.COMPLETE, () => {
			this.createScene();
		})

		loader.start();
	}

	createScene() {
		this.map.tilesets.forEach(tileset => {
			this.map.addTilesetImage(tileset.name, tileset.name, 16, 16);
		});

		this.createMapTileLayers();
		this.createPlayer();
		this.createActors();
		
		this.updateCamera();
		this.createTransitionPoints();
		this.cameras.main.fadeIn(1000, 0, 0, 0);
	}

	updateCamera() {
		this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
		this.cameras.main.startFollow(this.player.sprite, false, 0.5, 0.5);
	}

	update() {
			// shh red lines
	}
}