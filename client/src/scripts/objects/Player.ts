import Phaser from "phaser";
import { Character as CharacterEntity } from "../../../../server/src/entities/Character";
import MultiKey from "../tools/MultiKey";
import SceneEx from "./SceneEx";
import { Coordinates, Directions } from "./types";
import PlayerActor from "./Actors/PlayerActor";
import { ActorType } from "../../data/actorDatabase";

export default class Player extends PlayerActor {
  keys: {
    up: MultiKey,
    down: MultiKey,
    left: MultiKey,
    right: MultiKey,
		attack: MultiKey,
  };
  playerSensors: { 
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
		attacking: boolean;
    destroyed: boolean;
		updateServer: boolean;
  };
  
  constructor(scene: SceneEx, character: CharacterEntity, x: number, y: number, z: number) {
		super(scene, character.playerAssetKey, {x, y, z}, true);
		this.playerInfo.type = ActorType.CurrentPlayer;

    this.state = {
      isTouching: {
        left: false,
        right: false,
        bottom: false,
      },
			facing: Directions.S,
			attacking: false,
      destroyed: false,
			updateServer: false,
    };
		
		this.create({x,y,z});
    this.createControls();

    this.state.destroyed = false;
  }

  freeze() {
    this.sprite.setStatic(true);
  }

  update() {
		const oldUpdate = this.state.updateServer;
		let stopAnimation = false;
		let setFrame = -1;

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

		if(sprite.body.velocity.x !== 0 || sprite.body.velocity.y !== 0 || attacking) {
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
			stopAnimation = true;
			setFrame = frame;
    }

		if(this.state.updateServer || oldUpdate !== this.state.updateServer) {
			this.updateServer(stopAnimation, setFrame);
		}
  }

  createSprite(spawnCoords: Coordinates) {
    this.sprite = this.scene.matter.add.sprite(0, 0, this.playerInfo.primarySpritesheetKey, this.playerInfo.defaultFrame).setZ(spawnCoords.z).setDepth(spawnCoords.z);

    const { width: w, height: h } = this.sprite;
    const mainBody = this.scene.matter.bodies.rectangle(0, h * 0.05, w * 0.6, h * 0.8, {chamfer: {radius: 10}, isSensor: false, label: "Player Main"});
    
    this.playerSensors = {
      bottom: this.scene.matter.bodies.rectangle(0, h * 0.5, w * 0.25, 2, { isSensor: true, label: "Player Bottom" }),
      left: this.scene.matter.bodies.rectangle(-w * 0.35, h * 0.25 , 2, h * 0.25, { isSensor: true, label: "Player Left" }),
      right: this.scene.matter.bodies.rectangle(w * 0.35, h * 0.25, 2, h * 0.25, { isSensor: true, label: "Player Right" }),
    };
    const compoundBody = this.scene.matter.body.create({
      parts: [mainBody, this.playerSensors.bottom, this.playerSensors.left, this.playerSensors.right],
      render: { sprite: { xOffset: 0.5, yOffset: 0.5 } },
    });
    (this.sprite.setExistingBody(compoundBody) as Phaser.Physics.Matter.Sprite).setFixedRotation().setPosition(spawnCoords.x, spawnCoords.y);
   
    this.scene.matter.world.on("beforeupdate", this.resetTouching, this);

    this.scene.matterCollision.addOnCollideStart( {
      objectA: [ this.playerSensors.bottom, this.playerSensors.left, this.playerSensors.right ],
      callback: this.onSensorCollide,
      context: this,
    });
    this.scene.matterCollision.addOnCollideActive({
      objectA: [this.playerSensors.bottom, this.playerSensors.left, this.playerSensors.right],
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

    if (bodyA === this.playerSensors.left) {
      this.state.isTouching.left = true;
    } else if (bodyA === this.playerSensors.right) {
      this.state.isTouching.right = true;
    } else if (bodyA === this.playerSensors.bottom) {
      this.state.isTouching.bottom = true;
    }
  }

  resetTouching() {
    this.state.isTouching = { left: false, right: false, bottom: false };
  }

	updateServer(stopAnimation: boolean, setFrame: number) {
		this.scene.socketManager.sendPlayerState({
			location: {
				x: this.sprite.x,
				y: this.sprite.y,
				z: this.sprite.z,
			},
			animationKey: this.sprite.anims.currentAnim.key,
			stopAnimation: stopAnimation,
			setFrame: setFrame,
		});
	}

  destroy() {
		// Clean up any listeners that might trigger events after the player is officially destroyed
    if (this.scene.matter.world) {
      this.scene.matter.world.off("beforeupdate", this.resetTouching, this);
    }
    const sensors = [this.playerSensors.bottom, this.playerSensors.left, this.playerSensors.right];
    this.scene.matterCollision.removeOnCollideStart({ objectA: sensors });
    this.scene.matterCollision.removeOnCollideActive({ objectA: sensors });

    this.state.destroyed = true;

		super.destroy();
  }
}