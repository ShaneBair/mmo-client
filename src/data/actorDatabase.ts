export interface AnimationInfo {
	key: string;
	frames: number[];
	frameRate: number;
	repeat: number;
}

export interface ActorInfo {
	key: string;
	type: ActorType;
	spritesheetKey: string;
	spritesheetPath: string;
	defaultFrame: number;
	animations: AnimationInfo[];
}

enum ActorType {
	NPC,
	Enemy,
	Animal,
	Predator
}

const actorDB: Record<string, ActorInfo> = {
	BrownRabbit: {
			key: "BrownRabbit",
			spritesheetKey: "animals2",
			spritesheetPath: "assets/img/spritesheets/animals2.png",
			type: ActorType.Animal,
			defaultFrame: 19,
			animations: [
				{
					key: 'down',
					frames: [6, 7, 8],
					frameRate: 10,
					repeat: -1
				},
				{
					key: 'left',
					frames: [18, 19, 20],
					frameRate: 10,
					repeat: -1
				},
				{
					key: 'right',
					frames: [30, 31, 32],
					frameRate: 10,
					repeat: -1
				},
				{
					key: 'up',
					frames: [42, 43, 44],
					frameRate: 10,
					repeat: -1
				}
			]
	}
};

export default actorDB;