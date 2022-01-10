import Phaser, { Physics } from "phaser";
import MultiKey from "../tools/MultiKey";
import SceneEx from "./SceneEx";

export default class Player {
  scene: Phaser.Scene;
  sprite: Phaser.Physics.Matter.Sprite;
  keys: {
    up: MultiKey,
    down: MultiKey,
    left: MultiKey,
    right: MultiKey,
  };
  sensors: { 
    bottom: MatterJS.BodyType; 
    left: MatterJS.BodyType; 
    right: MatterJS.BodyType; 
  };
  state: {
    isTouching: {
      left: boolean;
      right: boolean;
      bottom: boolean;
    },
    destroyed: boolean;
  };
  walkingSpeed: number;

  constructor(scene: Phaser.Scene, x: number | undefined, y: number | undefined) {
    this.scene = scene;
    this.state = {
      isTouching: {
        left: false,
        right: false,
        bottom: false,
      },
      destroyed: false,
    };
    this.walkingSpeed = 4;

    this.createAnimations();
    this.createPlayer(x, y);
    this.createControls();

    this.state.destroyed = false;
    this.scene.events.on("update", this.update, this);
    this.scene.events.once("shutdown", this.destroy, this);
    this.scene.events.once("destroy", this.destroy, this);

  }

  freeze() {
    this.sprite.setStatic(true);
  }

  update() {
    if(this.state.destroyed) return;

    const sprite = this.sprite;
    const moving = {
      left: this.keys.left.isDown(),
      right: this.keys.right.isDown(),
      up: this.keys.up.isDown(),
      down: this.keys.down.isDown(),
    };

    sprite.setVelocity(0);
    if(moving.left) {
      sprite.setVelocityX(-1 * this.walkingSpeed);
    } else if(moving.right) {
      sprite.setVelocityX(this.walkingSpeed);
    }

    if(moving.up) {
      sprite.setVelocityY(-1 * this.walkingSpeed);
    } else if(moving.down) {
      sprite.setVelocityY(this.walkingSpeed);
    }

    // Update the animation last and give left/right animations precedence over up/down animations
    if (moving.left) {
      this.sprite.anims.play('left', true);
    } else if (moving.right) {
      this.sprite.anims.play('right', true);
    } else if (moving.up) {
      this.sprite.anims.play('up', true);
    } else if (moving.down) {
      this.sprite.anims.play('down', true);
    } else {
      this.sprite.anims.stop();
    }
  }

  createPlayer(x: number | undefined, y: number | undefined) {
    this.sprite = this.scene.matter.add.sprite(0, 0, "chara2", 1).setZ(10).setDepth(10);

    const { width: w, height: h } = this.sprite;
    const mainBody = this.scene.matter.bodies.rectangle(0, 0, w * 0.6, h, {chamfer: {radius: 10}});
    this.sensors = {
      bottom: this.scene.matter.bodies.rectangle(0, h * 0.5, w * 0.25, 2, { isSensor: true }),
      left: this.scene.matter.bodies.rectangle(-w * 0.35, 0, 2, h * 0.5, { isSensor: true }),
      right: this.scene.matter.bodies.rectangle(w * 0.35, 0, 2, h * 0.5, { isSensor: true }),
    };
    const compoundBody = this.scene.matter.body.create({
      parts: [mainBody, this.sensors.bottom, this.sensors.left, this.sensors.right],
      render: { sprite: { xOffset: 0.5, yOffset: 0.5 } },
    });
    (this.sprite.setExistingBody(compoundBody) as Phaser.Physics.Matter.Sprite).setFixedRotation().setPosition(x, y);
   
    this.scene.matter.world.on("beforeupdate", this.resetTouching, this);

    (this.scene as SceneEx).matterCollision.addOnCollideStart( {
      objectA: [ this.sensors.bottom, this.sensors.left, this.sensors.right ],
      callback: this.onSensorCollide,
      context: this,
    });
    (this.scene as SceneEx).matterCollision.addOnCollideActive({
      objectA: [this.sensors.bottom, this.sensors.left, this.sensors.right],
      callback: this.onSensorCollide,
      context: this,
    });
  }

  createAnimations() {
    const anims = this.scene.anims;

    const leftAnimation: Phaser.Types.Animations.Animation = {
      key: 'left',
      frames: anims.generateFrameNumbers('chara2', {
        frames: [12, 13, 14]
      }),
      frameRate: 10,
      repeat: -1
    };
    const rightAnimation: Phaser.Types.Animations.Animation = {
      key: 'right',
      frames: anims.generateFrameNumbers('chara2', {
        frames: [24, 25, 26]
      }),
      frameRate: 10,
      repeat: -1
    };
    const upAnimation: Phaser.Types.Animations.Animation = {
      key: 'up',
      frames: anims.generateFrameNumbers('chara2', {
        frames: [36, 37, 38]
      }),
      frameRate: 10,
      repeat: -1
    };
    const downAnimation: Phaser.Types.Animations.Animation = {
      key: 'down',
      frames: anims.generateFrameNumbers('chara2', {
        frames: [0, 1, 2]
      }),
      frameRate: 10,
      repeat: -1
    };

    anims.create(leftAnimation);
    anims.create(rightAnimation);
    anims.create(upAnimation);
    anims.create(downAnimation);
  }

  createControls() {
    const { LEFT, RIGHT, UP, DOWN, A, S, D, W } = Phaser.Input.Keyboard.KeyCodes;
    this.keys = {
      up: new MultiKey(this.scene, [UP, W]),
      down: new MultiKey(this.scene, [DOWN, S]),
      left: new MultiKey(this.scene, [LEFT, A]),
      right: new MultiKey(this.scene, [RIGHT, D]),
    }
  }

  onSensorCollide({ bodyA, bodyB, pair }) {
    if (bodyB.isSensor) return; // We only care about collisions with physical objects

    if (bodyA === this.sensors.left) {
      this.state.isTouching.left = true;
      if (pair.separation > 0.5) this.sprite.x += pair.separation - 0.5;
    } else if (bodyA === this.sensors.right) {
      this.state.isTouching.right = true;
      if (pair.separation > 0.5) this.sprite.x -= pair.separation - 0.5;
    } else if (bodyA === this.sensors.bottom) {
      this.state.isTouching.bottom = true;
    }
  }

  resetTouching() {
    this.state.isTouching = { left: false, right: false, bottom: false };
  }

  destroy() {
    // Clean up any listeners that might trigger events after the player is officially destroyed
    this.scene.events.off("update", this.update, this);
    this.scene.events.off("shutdown", this.destroy, this);
    this.scene.events.off("destroy", this.destroy, this);
    if (this.scene.matter.world) {
      this.scene.matter.world.off("beforeupdate", this.resetTouching, this);
    }
    const sensors = [this.sensors.bottom, this.sensors.left, this.sensors.right];
    (this.scene as SceneEx).matterCollision.removeOnCollideStart({ objectA: sensors });
    (this.scene as SceneEx).matterCollision.removeOnCollideActive({ objectA: sensors });

    this.state.destroyed = true;
    this.sprite.destroy();
  }
}