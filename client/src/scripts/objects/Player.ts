import Phaser, { Scene } from "phaser";
import { Character as CharacterEntity } from "../../../../server/src/entities/Character";
import MultiKey from "../tools/MultiKey";
import SceneEx from "./SceneEx";
import { Directions } from "./types";
import playerService from "../services/PlayerService";
import { PlayerInfo } from "../../data/playerDatabase";

export default class Player {
  scene: SceneEx;
  sprite: Phaser.Physics.Matter.Sprite;
  keys: {
    up: MultiKey,
    down: MultiKey,
    left: MultiKey,
    right: MultiKey,
		attack: MultiKey,
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
		facing: Directions,
    destroyed: boolean;
		updateServer: boolean;
  };
  walkingSpeed: number;
	playerInfo: PlayerInfo;

  constructor(scene: SceneEx | Phaser.Scene, character: CharacterEntity, x: number | undefined, y: number | undefined, z: number) {
    this.scene = scene as SceneEx;
    this.state = {
      isTouching: {
        left: false,
        right: false,
        bottom: false,
      },
			facing: Directions.S,
      destroyed: false,
			updateServer: false,
    };
    this.walkingSpeed = 3;

		this.playerInfo = playerService.getByKey(character.playerAssetKey);

    this.createAnimations();
    this.createPlayer(x, y, z);
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
		this.state.updateServer = false;
    if(this.state.destroyed) return;

    const sprite = this.sprite;
    const moving = {
      left: this.keys.left.isDown(),
      right: this.keys.right.isDown(),
      up: this.keys.up.isDown(),
      down: this.keys.down.isDown(),
    };
		const attacking = this.keys.attack.isDown();

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

		if(sprite.body.velocity.x !== 0 || sprite.body.velocity.y !== 0) {
			this.state.updateServer = true;
		}

		this.sprite.flipX = false;
    // Update the animation last and give left/right animations precedence over up/down animations
		if(moving.left) {
			this.state.facing = Directions.W;

			if(attacking) {
				this.sprite.anims.play('attack', true);
			} else {
				this.sprite.anims.play('left', true);
			}
		} else if(moving.right) {
			this.state.facing = Directions.E;

			if(attacking) {
				this.sprite.anims.play('attack', true);
				this.sprite.flipX = true;
			} else {
				this.sprite.anims.play('right', true);
			}
		} else if (moving.up) {
			this.state.facing = Directions.N;

			if(attacking) {
				this.sprite.anims.play('upAttack', true);
			} else {
				this.sprite.anims.play('up', true);
			}
    } else if (moving.down) {
			this.state.facing = Directions.S;

			if(attacking) {
				this.sprite.anims.play('downAttack', true);
			} else {
				this.sprite.anims.play('down', true);
			}
		} else if(attacking && this.state.facing === Directions.N) {
			this.sprite.play('upAttack', true);
    } else if(attacking && this.state.facing === Directions.S) {
			this.sprite.play('downAttack', true);
    } else if(attacking) {
			if(this.state.facing === Directions.E) {
				this.sprite.flipX = true;
			}

			this.sprite.play('attack', true);
    } else {
			let animation = "";
			let frame = 0;

			switch(this.state.facing) {
				case Directions.W:
					animation = "left",
					frame = this.playerInfo.getAnimationByKey('left')?.frames[1] ?? 0
					break;
				case Directions.E:
					animation = "right",
					frame = this.playerInfo.getAnimationByKey('right')?.frames[1] ?? 0
					break;
				case Directions.N:
					animation = "up",
					frame = this.playerInfo.getAnimationByKey('up')?.frames[1] ?? 0
					break;
				case Directions.S:
					animation = "down",
					frame = this.playerInfo.getAnimationByKey('down')?.frames[1] ?? 0
					break;
			}

			this.sprite.anims.play(animation);
      this.sprite.anims.stop();
			this.sprite.setFrame(frame);
    }

		if(this.state.updateServer) {
			this.updateServer();
		}
  }

  createPlayer(x: number | undefined, y: number | undefined, z: number) {
    this.sprite = this.scene.matter.add.sprite(0, 0, this.playerInfo.primarySpritesheetKey, this.playerInfo.defaultFrame).setZ(z).setDepth(z);

    const { width: w, height: h } = this.sprite;
    const mainBody = this.scene.matter.bodies.rectangle(0, h * 0.05, w * 0.6, h * 0.8, {chamfer: {radius: 10}, isSensor: false, label: "Player Main"});
    
    this.sensors = {
      bottom: this.scene.matter.bodies.rectangle(0, h * 0.5, w * 0.25, 2, { isSensor: true, label: "Player Bottom" }),
      left: this.scene.matter.bodies.rectangle(-w * 0.35, h * 0.25 , 2, h * 0.25, { isSensor: true, label: "Player Left" }),
      right: this.scene.matter.bodies.rectangle(w * 0.35, h * 0.25, 2, h * 0.25, { isSensor: true, label: "Player Right" }),
    };
    const compoundBody = this.scene.matter.body.create({
      parts: [mainBody, this.sensors.bottom, this.sensors.left, this.sensors.right],
      render: { sprite: { xOffset: 0.5, yOffset: 0.5 } },
    });
    (this.sprite.setExistingBody(compoundBody) as Phaser.Physics.Matter.Sprite).setFixedRotation().setPosition(x, y);
   
    this.scene.matter.world.on("beforeupdate", this.resetTouching, this);

    this.scene.matterCollision.addOnCollideStart( {
      objectA: [ this.sensors.bottom, this.sensors.left, this.sensors.right ],
      callback: this.onSensorCollide,
      context: this,
    });
    this.scene.matterCollision.addOnCollideActive({
      objectA: [this.sensors.bottom, this.sensors.left, this.sensors.right],
      callback: this.onSensorCollide,
      context: this,
    });
  }

	createAnimations() {
		const anims = this.scene.anims;

		this.playerInfo.animations.forEach(animation => {
			const thisAnimation: Phaser.Types.Animations.Animation = {
				...animation,
				key: `${animation.key}`,
				frames: anims.generateFrameNumbers(animation.spritesheetKey, {
					frames: animation.frames
				}),
			};
	
			anims.create(thisAnimation);
		});	
	}

  createControls() {
    const { LEFT, RIGHT, UP, DOWN, A, S, D, W, SPACE } = Phaser.Input.Keyboard.KeyCodes;
    this.keys = {
      up: new MultiKey(this.scene, [UP, W]),
      down: new MultiKey(this.scene, [DOWN, S]),
      left: new MultiKey(this.scene, [LEFT, A]),
      right: new MultiKey(this.scene, [RIGHT, D]),
			attack: new MultiKey(this.scene, [SPACE]),
    }
  }

  onSensorCollide({ bodyA, bodyB }) {
    if (bodyB.isSensor) return; // We only care about collisions with physical objects

    if (bodyA === this.sensors.left) {
      this.state.isTouching.left = true;
    } else if (bodyA === this.sensors.right) {
      this.state.isTouching.right = true;
    } else if (bodyA === this.sensors.bottom) {
      this.state.isTouching.bottom = true;
    }
  }

  resetTouching() {
    this.state.isTouching = { left: false, right: false, bottom: false };
  }

	updateServer() {
		//console.log('hey');
		//this.scene.socketManager.
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
    this.scene.matterCollision.removeOnCollideStart({ objectA: sensors });
    this.scene.matterCollision.removeOnCollideActive({ objectA: sensors });

    this.state.destroyed = true;
    this.sprite.destroy();
  }
}