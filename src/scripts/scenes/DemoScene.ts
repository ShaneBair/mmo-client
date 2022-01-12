import Player from "../objects/Player";

export default class DemoScene extends Phaser.Scene {
    map: Phaser.Tilemaps.Tilemap;
    player: Player;

    preload() {
        this.load.image('terrain', 'assets/map/tiles/terrain.png');
        this.load.image('castle', 'assets/map/tiles/castle.png');
        this.load.image('outside', 'assets/map/tiles/outside.png');
        this.load.image('house', 'assets/map/tiles/house.png');

        this.load.tilemapTiledJSON('DemoScene', 'assets/map/DemoScene.json');

        this.load.spritesheet("chara2", 'assets/img/spritesheets/chara2.png', {
        frameWidth: 26,
        frameHeight: 36,
        });
    }

    create() {
        this.map = this.make.tilemap({ key: "DemoScene"});

        this.map.addTilesetImage("terrain", "terrain", 16, 16);
        this.map.addTilesetImage("castle", "castle", 16, 16);
        this.map.addTilesetImage("outside", "outside", 16, 16);
        this.map.addTilesetImage("house", "house", 16, 16);

        this.map.createLayer("Ground", this.map.tilesets);

        const pathLayer = this.map.createLayer("Paths", this.map.tilesets).setCollisionByProperty( {collides: true});
        const worldLayer = this.map.createLayer("World", this.map.tilesets).setCollisionByProperty( {collides: true});
        const abovePlayerLayer = this.map.createLayer("Above Player", this.map.tilesets).setCollisionByProperty( {collides: true}).setDepth(20);

        this.matter.world.convertTilemapLayer(pathLayer);
        this.matter.world.convertTilemapLayer(worldLayer);
        this.matter.world.convertTilemapLayer(abovePlayerLayer);

        const { x, y } = this.map.findObject("Spawn", obj => obj.name === "Spawn Point");
        this.player = new Player(this, x, y);

        this.updateCamera();

        // const houseLayer = this.map.createLayer("Houses", this.map.tilesets).setZ(20).setDepth(2).setCollisionByExclusion([-1], true);
        // const highlightsLayer = this.map.createLayer("Terrain Highlights", this.map.tilesets).setZ(20).setDepth(20).setCollisionByExclusion([-1], true);
    }

    updateCamera() {
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player.sprite, false, 0.5, 0.5);
      }

    update() {
        // shh red lines
    }
}