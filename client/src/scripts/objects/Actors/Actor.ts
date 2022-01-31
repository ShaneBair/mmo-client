import { CollidingObject, EventData } from "phaser-matter-collision-plugin";
import { ActorInfo, ActorType, ShapeInfo, ShapeType } from "../../../data/actorDatabase";
import SceneEx from "../SceneEx";
import { Coordinates, Guid } from "../types";

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

    this.scene.events.on("update", this.update, this);
    this.scene.events.once("shutdown", this.destroy, this);
    this.scene.events.once("destroy", this.destroy, this);

		this.guid = Guid.newGuid();

		if(this.actorInfo.type === ActorType.Actor) {
			this.create(spawnCoords);
		}
  }

	create(spawnCoords: Coordinates) {
		this.createAnimations();
		this.createSprite(spawnCoords);
	}

	createSprite(spawnCoords: Coordinates) {
		const matter = this.scene.matter;
		const actorInfo = this.actorInfo;

		this.sprite = matter.add.sprite(spawnCoords.x, spawnCoords.y, actorInfo.primarySpritesheetKey, actorInfo.defaultFrame).setZ(spawnCoords.z).setDepth(spawnCoords.z);

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

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	onSensorsCollideWithPlayer(eventData: EventData<MatterJS.BodyType, CollidingObject>) {
		//this.destroy();
		// this.sprite.setVelocity(0);
		// this.scene.player.sprite.setVelocity(0);
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	onSensorCollide(eventData: EventData<MatterJS.BodyType, CollidingObject>) {
    // console.log(`${this.actorInfo.key} hit something!`);
		// console.log(eventData.bodyA);
		// console.log(eventData.bodyB);
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
				frames: anims.generateFrameNumbers(this.actorInfo.primarySpritesheetKey, {
					frames: animation.frames
				}),
			};
	
			anims.create(thisAnimation);
		});	
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	update(time: number) {
		//console.log('actor update');
	}

	destroy() {
		// Clean up any listeners that might trigger events after the player is officially destroyed
    this.scene.events.off("update", this.update, this);
    this.scene.events.off("shutdown", this.destroy, this);
    this.scene.events.off("destroy", this.destroy, this);
    this.sprite.destroy();

		switch(this.actorInfo.type) {
			case ActorType.Actor:
			default:
				this.scene.removeActor(this.guid);
				break;
		}
	}
}