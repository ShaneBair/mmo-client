import Phaser from 'phaser';

export default class Map_0_0 extends Phaser.Scene {
  map: Phaser.Tilemaps.Tilemap;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  playerContainer: Phaser.GameObjects.Container;
  player: Phaser.GameObjects.Sprite;
  mapCollisions: Phaser.GameObjects.GameObject[];
  collisionLayers: any[];

  constructor() {
    super({ key: 'Map_0_0' })
    this.collisionLayers = [];
  }

  create() {
    this.createMap();
    this.createAnimations();
    this.createPlayer();
    this.createCollisions();

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  createMap() {
    this.map = this.make.tilemap({ key: "Map_0_0"});

    this.map.addTilesetImage("terrain", "terrain", 16, 16);
    this.map.addTilesetImage("castle", "castle", 16, 16);
    this.map.addTilesetImage("outside", "outside", 16, 16);
    this.map.addTilesetImage("house", "house", 16, 16);

    const baseLayer = this.map.createLayer("Base Terrain", this.map.tilesets);
    this.map.createLayer("Paths", this.map.tilesets);
    const houseLayer = this.map.createLayer("Houses", this.map.tilesets).setCollisionByExclusion([-1], true);
    const highlightsLayer = this.map.createLayer("Terrain Highlights", this.map.tilesets).setCollisionByExclusion([-1], true);

    this.collisionLayers.push(houseLayer);
    this.collisionLayers.push(highlightsLayer);
  }

  createCollisions() {
    this.collisionLayers.forEach(layer => {
      console.log(layer);
      this.physics.add.collider(this.playerContainer, layer);
    });
  }

  createAnimations() {
    const leftAnimation: Phaser.Types.Animations.Animation = {
      key: 'left',
      frames: this.anims.generateFrameNumbers('chara2', {
        frames: [12, 13, 14]
      }),
      frameRate: 10,
      repeat: -1
    };
    const rightAnimation: Phaser.Types.Animations.Animation = {
      key: 'right',
      frames: this.anims.generateFrameNumbers('chara2', {
        frames: [24, 25, 26]
      }),
      frameRate: 10,
      repeat: -1
    };
    const upAnimation: Phaser.Types.Animations.Animation = {
      key: 'up',
      frames: this.anims.generateFrameNumbers('chara2', {
        frames: [36, 37, 38]
      }),
      frameRate: 10,
      repeat: -1
    };
    const downAnimation: Phaser.Types.Animations.Animation = {
      key: 'down',
      frames: this.anims.generateFrameNumbers('chara2', {
        frames: [0, 1, 2]
      }),
      frameRate: 10,
      repeat: -1
    };

    this.anims.create(leftAnimation);
    this.anims.create(rightAnimation);
    this.anims.create(upAnimation);
    this.anims.create(downAnimation);
  }

  createPlayer() {
    this.player = this.add.sprite(0, 0, "chara2", 1);
    this.playerContainer = this.add.container(170, 240);
    this.playerContainer.setSize(26, 36);
    
    this.physics.world.enable(this.playerContainer);

    this.playerContainer.add(this.player);

    this.updateCamera();

    (this.playerContainer.body as Phaser.Physics.Arcade.Body).setCollideWorldBounds(true);
  }

  updateCamera() {
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.startFollow(this.playerContainer);
    this.cameras.main.roundPixels = true;
  }

  update() {
    if(this.playerContainer) {
      const containerBody = this.playerContainer.body as Phaser.Physics.Arcade.Body;

      containerBody.setVelocity(0);

      // Horizontal movement
      if (this.cursors.left.isDown) {
        containerBody.setVelocityX(-80);
      } else if (this.cursors.right.isDown) {
        containerBody.setVelocityX(80);
      }

      // Vertical movement
      if (this.cursors.up.isDown) {
        containerBody.setVelocityY(-80);
      } else if (this.cursors.down.isDown) {
        containerBody.setVelocityY(80);
      }

      // Update the animation last and give left/right animations precedence over up/down animations
      if (this.cursors.left.isDown) {
        this.player.anims.play('left', true);
      } else if (this.cursors.right.isDown) {
        this.player.anims.play('right', true);
      } else if (this.cursors.up.isDown) {
        this.player.anims.play('up', true);
      } else if (this.cursors.down.isDown) {
        this.player.anims.play('down', true);
      } else {
        this.player.anims.stop();
      }
    }
  }
}
