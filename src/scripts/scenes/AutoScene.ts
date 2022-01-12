import { EventData } from "phaser-matter-collision-plugin";
import { findPropertyByName } from "../objects/TiledHelpers";
import Player from "../objects/Player";
import SceneEx, { SceneHandoffData } from "../objects/SceneEx";
import mapService from "../services/MapService";

export default class DemoScene extends SceneEx {
    map: Phaser.Tilemaps.Tilemap;
    player: Player;
    handoffData: SceneHandoffData;

    constructor() {
        super({ key: 'AutoScene' });
    }

    init(data: SceneHandoffData) {
        this.handoffData = data;
    }

    preload() {
        const mapKey = findPropertyByName(this.handoffData.transitionProperties, "map");
        const mapData = mapService.getMapByKey(mapKey?.value);

        this.load.image('terrain', 'assets/map/tiles/terrain.png');
        this.load.image('castle', 'assets/map/tiles/castle.png');
        this.load.image('outside', 'assets/map/tiles/outside.png');
        this.load.image('house', 'assets/map/tiles/house.png');
        this.load.image('doors', 'assets/map/tiles/animated/doors.png');
        this.load.image('water', 'assets/map/tiles/water.png');
        this.load.image('inside', 'assets/map/tiles/inside.png');

        this.load.tilemapTiledJSON(mapData.key, mapData.path);

        this.load.spritesheet("chara2", 'assets/img/spritesheets/chara2.png', {
            frameWidth: 26,
            frameHeight: 36,
        });
    }

    create() {
        const mapKey = findPropertyByName(this.handoffData.transitionProperties, "map");
        const toSpawnIdProperty = findPropertyByName(this.handoffData.transitionProperties, "toSpawnId");

        this.map = this.make.tilemap({ key: mapKey?.value});

        this.map.addTilesetImage("terrain", "terrain", 16, 16);
        this.map.addTilesetImage("castle", "castle", 16, 16);
        this.map.addTilesetImage("outside", "outside", 16, 16);
        this.map.addTilesetImage("house", "house", 16, 16);
        this.map.addTilesetImage("doors", "doors", 16, 16);
        this.map.addTilesetImage('water', 'water', 16, 16);
        this.map.addTilesetImage('inside', 'inside', 16, 16);

        this.createMapTileLayers();

        const { x, y } = this.findPlayerSpawnPoint(toSpawnIdProperty?.value);
        //const z = findPropertyByName(th, "depth")?.value);
        this.player = new Player(this, x, y);

        this.updateCamera();

        this.createTransitionPoints();
        this.cameras.main.fadeIn(1000, 0, 0, 0);
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
                callback: (eventData) => {
                    this.handleSceneTransition(object, eventData);
                },
                context: this,
              });
        });
    }

    handleSceneTransition(
        object: Phaser.Types.Tilemaps.TiledObject, 
        eventData: EventData<MatterJS.BodyType, MatterJS.BodyType>
    ) {
        const type = findPropertyByName(object.properties, "type");
        
        if(type?.value !== "transition") return;

        const scene = findPropertyByName(object.properties, "scene");

        if(!scene) return;

        const handoffData: SceneHandoffData = {
            transitionProperties: object.properties
        };
        this.scene.start(scene.value, handoffData);
    }

    createMapTileLayers() {
        this.map.layers.forEach(layer => {
            const currentLayer = this.map.createLayer(layer.name, this.map.tilesets).setCollisionByProperty({collides: true});
            const depth = findPropertyByName(layer.properties, "depth")?.value ?? 0;

            currentLayer.setDepth(depth);
            this.matter.world.convertTilemapLayer(currentLayer);
        });
    }

    updateCamera() {
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player.sprite, false, 0.5, 0.5);
      }

    update() {
        // shh red lines
    }
}