import { CollidingObject, EventData } from "phaser-matter-collision-plugin";
import { ActorInfo, ShapeInfo, ShapeType } from "../../data/actorDatabase";
import SceneEx from "./SceneEx";
import { Coordinates, Guid } from "./types";

export default class Actor {
	guid: string;
	scene: SceneEx;
  sprite: Phaser.Physics.Matter.Sprite;
	actorInfo: ActorInfo;
	sensors: MatterJS.BodyType[];
	lastMovementStart: number;

	constructor(scene: SceneEx, spawnCoords: Coordinates, actorInfo: ActorInfo) {
    this.scene = scene;
		this.actorInfo = actorInfo;
		this.sensors = [];
		this.lastMovementStart = 1;

    this.createAnimations();
    this.createActor(spawnCoords);

    this.scene.events.on("update", this.update, this);
    this.scene.events.once("shutdown", this.destroy, this);
    this.scene.events.once("destroy", this.destroy, this);

		this.guid = Guid.newGuid();
  }

	createActor(spawnCoords: Coordinates) {
		const matter = this.scene.matter;
		const actorInfo = this.actorInfo;

		this.sprite = matter.add.sprite(spawnCoords.x, spawnCoords.y, actorInfo.spritesheetKey, actorInfo.defaultFrame).setZ(spawnCoords.z).setDepth(spawnCoords.z);

		if(actorInfo.customShapes) {
			const bodyParts: MatterJS.BodyType[] = [];

			actorInfo.customShapes.forEach(customShape => {
				const newPart = this.createShape(customShape);

				bodyParts.push(newPart);
			});

			const compoundBody = matter.body.create({
				parts: bodyParts,
				render: { sprite: actorInfo.spriteRenderOptions}
			});

			(this.sprite.setExistingBody(compoundBody) as Phaser.Physics.Matter.Sprite).setFixedRotation().setPosition(spawnCoords.x, spawnCoords.y);
		}

		(this.scene as SceneEx).matterCollision.addOnCollideStart( {
			objectA: this.sensors,
			objectB: this.scene.player.sprite,
			callback: this.onSensorsCollideWithPlayer,
			context: this,
		});

		(this.scene as SceneEx).matterCollision.addOnCollideStart( {
      objectA: this.sensors,
      callback: this.onSensorCollide,
      context: this,
    });
    (this.scene as SceneEx).matterCollision.addOnCollideActive({
      objectA: this.sensors,
      callback: this.onSensorCollide,
      context: this,
    });
	}

	onSensorsCollideWithPlayer(eventData: EventData<MatterJS.BodyType, CollidingObject>) {
		//this.destroy();
		// this.sprite.setVelocity(0);
		// this.scene.player.sprite.setVelocity(0);
	}

	onSensorCollide(eventData: EventData<MatterJS.BodyType, CollidingObject>) {
    console.log(`${this.actorInfo.key} hit something!`);
		console.log(eventData.bodyA);
		console.log(eventData.bodyB);
		//this.sprite.setVelocity(0);
  }

	createShape(customShape: ShapeInfo): MatterJS.BodyType {
		let shape: MatterJS.BodyType;

		switch(customShape.shape) {
			case ShapeType.Rectangle: {
					shape = this.scene.matter.bodies.rectangle(
						customShape.shapeInfo.x, 
						customShape.shapeInfo.y, 
						customShape.shapeInfo.width, 
						customShape.shapeInfo.height,
						{
							...customShape.shapeInfo.config,
							chamfer: {
								radius: 10
							},
						});

					if(customShape.shapeInfo.config?.isSensor) {
						this.sensors.push(shape);
					}
				}
		}

		return shape;
	}

	createAnimations() {
		const anims = this.scene.anims;

		this.actorInfo.animations.forEach(animation => {
			const thisAnimation: Phaser.Types.Animations.Animation = {
				...animation,
				key: `${this.actorInfo.key}-${animation.key}`,
				frames: anims.generateFrameNumbers(this.actorInfo.spritesheetKey, {
					frames: animation.frames
				}),
			};
	
			anims.create(thisAnimation);
		});	
	}

	update(time: number, delta: number) {
		if(this.actorInfo.movement?.walkSpeed === undefined) return;

		if(this.lastMovementStart && this.actorInfo.movement.changeDirectionFrequency && time - this.lastMovementStart > this.actorInfo.movement.changeDirectionFrequency)
		{
			const direction = Math.floor(Math.random() * this.actorInfo.movement.tendency);
			this.lastMovementStart = time;

			this.sprite.setVelocity(0);
			switch(direction) {
				case 0:
					this.sprite.setVelocityY(-1 * this.actorInfo.movement.walkSpeed);
					this.sprite.anims.play(`${this.actorInfo.key}-up`);
					break;
				case 1:
					this.sprite.setVelocityY(this.actorInfo.movement.walkSpeed);
					this.sprite.anims.play(`${this.actorInfo.key}-down`);
					break;
				case 2:
					this.sprite.setVelocityX(-1 * this.actorInfo.movement.walkSpeed);
					this.sprite.anims.play(`${this.actorInfo.key}-left`);
					break;
				case 3:
					this.sprite.setVelocityX(this.actorInfo.movement.walkSpeed);
					this.sprite.anims.play(`${this.actorInfo.key}-right`);
					break;
				default:
					this.sprite.anims.stop();
			}
		}
	}

	destroy() {
		// Clean up any listeners that might trigger events after the player is officially destroyed
    this.scene.events.off("update", this.update, this);
    this.scene.events.off("shutdown", this.destroy, this);
    this.scene.events.off("destroy", this.destroy, this);
		this.scene.removeActor(this.guid);
    this.sprite.destroy();
	}
}