import Phaser from 'phaser';
import MultiInputHandler, { PlayerInput } from '../tools/MultiInputHandler';
import CollisionObject from '../objects/CollisionObject';

export default class Map_0_0 extends Phaser.Scene {
  map: Phaser.Tilemaps.Tilemap;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  playerContainer: Phaser.GameObjects.Container;
  player: Phaser.GameObjects.Sprite;
  mapCollisions: Phaser.GameObjects.GameObject[];
  collisionLayers: any[];
  multiInputHandler: MultiInputHandler;
  playerInput: PlayerInput; 
  sortGroup: Phaser.GameObjects.Group;

  constructor() {
    super({ key: 'Map_0_0' })
    this.collisionLayers = [];
  }

  preload() {
    this.load.scenePlugin('multiInputHandler', MultiInputHandler);
  }

  create() {
    this.sortGroup = this.add.group();

    this.createMap();
    this.createAnimations();
    this.createPlayer();
    this.createCollisions();

    //this.cursors = this.input.keyboard.createCursorKeys();
    this.playerInput = this.multiInputHandler.addPlayer(0);
    this.multiInputHandler
      .defineKeys(0, 'UP', ['W', 'B12'])
      .defineKeys(0, 'DOWN', ['S', 'B13'])
      .defineKeys(0, 'LEFT', ['A', 'B14'])
      .defineKeys(0, 'RIGHT', ['D', 'B15'])
      .defineKeys(0, 'ATTACK', ['J', 'B0']);

  }

  createMap() {
    this.map = this.make.tilemap({ key: "Map_0_0"});

    this.map.addTilesetImage("terrain", "terrain", 16, 16);
    this.map.addTilesetImage("castle", "castle", 16, 16);
    this.map.addTilesetImage("outside", "outside", 16, 16);
    this.map.addTilesetImage("house", "house", 16, 16);

    const baseLayer = this.map.createLayer("Base Terrain", this.map.tilesets);
    this.map.createLayer("Paths", this.map.tilesets);
    const houseLayer = this.map.createLayer("Houses", this.map.tilesets).setZ(20).setDepth(2).setCollisionByExclusion([-1], true);
    const highlightsLayer = this.map.createLayer("Terrain Highlights", this.map.tilesets).setZ(20).setDepth(20).setCollisionByExclusion([-1], true);

    this.collisionLayers.push(houseLayer);
    this.collisionLayers.push(highlightsLayer);
  }

  createCollisions() {
    // this.collisionLayers.forEach(layer => {
    //   //console.log(layer);
    //   this.physics.add.collider(this.playerContainer, layer);
    // });

    const objectConfig: Phaser.Types.Tilemaps.CreateFromObjectLayerConfig = {};
    const collisionObjects = this.map.createFromObjects('Collisions', objectConfig);
    collisionObjects.forEach((object) =>{
      const currentSprite = object as Phaser.GameObjects.Sprite;

      this.physics.world.enable(currentSprite);
      currentSprite.setVisible(false);
      (currentSprite.body as Phaser.Physics.Arcade.Body).setImmovable(true);
      this.physics.add.collider(this.playerContainer, currentSprite);
    })
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
    this.player = this.add.sprite(0, 0, "chara2", 1).setZ(10).setDepth(10);
    this.playerContainer = this.add.container(170, 240).setZ(10).setDepth(10);
    this.playerContainer.setSize(26, 36);
    
    this.physics.world.enable(this.playerContainer);

    this.playerContainer.add(this.player);

    this.updateCamera();

    (this.playerContainer.body as Phaser.Physics.Arcade.Body);//.setCollideWorldBounds(true);
  }

  updateCamera() {
    console.log(this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.startFollow(this.playerContainer);
    this.cameras.main.roundPixels = true;
  }

  update() {
    if(this.playerContainer) {
      const containerBody = this.playerContainer.body as Phaser.Physics.Arcade.Body;

      containerBody.setVelocity(0);

      this.input.gamepad.gamepads.forEach((pad, padIndex) => {
        pad.axes.forEach((axe, axeIndex) => {
          if(axe.value >= axe.threshold) {
            console.log(padIndex, axeIndex, axe);
          }
        });
      });
      if(this.input?.gamepad?.pad1?.down) {
        console.log('down');
      }

      if(this.playerInput.direction.LEFT) {
        containerBody.setVelocityX(-80);
      } else if(this.playerInput.direction.RIGHT) {
        containerBody.setVelocityX(80);
      }

      if(this.playerInput.direction.UP) {
        containerBody.setVelocityY(-80);
      } else if(this.playerInput.direction.DOWN) {
        containerBody.setVelocityY(80);
      }

      // Update the animation last and give left/right animations precedence over up/down animations
      if (this.playerInput.direction.LEFT) {
        this.player.anims.play('left', true);
      } else if (this.playerInput.direction.RIGHT) {
        this.player.anims.play('right', true);
      } else if (this.playerInput.direction.UP) {
        this.player.anims.play('up', true);
      } else if (this.playerInput.direction.DOWN) {
        this.player.anims.play('down', true);
      } else {
        this.player.anims.stop();
      }
    }
  }
}
