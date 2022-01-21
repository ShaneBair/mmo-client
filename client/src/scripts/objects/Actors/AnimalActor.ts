import Actor from "./Actor";

export default class AnimalActor extends Actor {
	update(time: number) {
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
}