import { ActorInfo } from "../../data/actorDatabase";
import { Coordinates } from "./types";

export default class Actor {
	scene: Phaser.Scene;
  sprite: Phaser.Physics.Matter.Sprite;
	actorInfo: ActorInfo;



	constructor(scene: Phaser.Scene, spawnCoords: Coordinates, actorInfo: ActorInfo) {
    this.scene = scene;
		this.actorInfo = actorInfo;

    this.createAnimations();
    this.createPlayer(spawnCoords);

    this.scene.events.on("update", this.update, this);
    this.scene.events.once("shutdown", this.destroy, this);
    this.scene.events.once("destroy", this.destroy, this);
  }

	createPlayer(spawnCoords: Coordinates) {
		this.sprite = this.scene.matter.add.sprite(spawnCoords.x, spawnCoords.y, this.actorInfo.spritesheetKey, this.actorInfo.defaultFrame).setZ(spawnCoords.z).setDepth(spawnCoords.z);

		const { width: w, height: h } = this.sprite;
    const mainBody = this.scene.matter.bodies.rectangle(0, 0, w, h, {chamfer: {radius: 10}, isSensor: true});
		//const mainBody = this.scene.matter.bodies.rectangle(0, h * 0.05, w * 0.6, h * 0.8, {chamfer: {radius: 10}, isSensor: true});

		const compoundBody = this.scene.matter.body.create({
      parts: [mainBody],
      render: { sprite: { xOffset: 0, yOffset: 0 } },
    });
    (this.sprite.setExistingBody(compoundBody) as Phaser.Physics.Matter.Sprite).setFixedRotation().setPosition(spawnCoords.x, spawnCoords.y);
	}

	createAnimations() {
		const anims = this.scene.anims;

		this.actorInfo.animations.forEach(animation => {
			const thisAnimation: Phaser.Types.Animations.Animation = {
				...animation,
				frames: anims.generateFrameNumbers(this.actorInfo.spritesheetKey, {
					frames: animation.frames
				}),
			};
	
			anims.create(thisAnimation);
		});	
	}

	update() {
		// things
	}

	destroy() {
		// Clean up any listeners that might trigger events after the player is officially destroyed
    this.scene.events.off("update", this.update, this);
    this.scene.events.off("shutdown", this.destroy, this);
    this.scene.events.off("destroy", this.destroy, this);
    this.sprite.destroy();
	}
}