export enum ShapeType {
	Rectangle
}

export interface ShapeInfo {
	shape: ShapeType,
	shapeInfo: {
		x: number,
		y: number,
		width: number,
		height: number,
		config: MatterJS.IChamferableBodyDefinition,
	}
}

export interface AnimationInfo {
	key: string;
	frames: number[];
	frameRate: number;
	repeat: number;
	spritesheetKey: string;
}

export class ActorInfo {
	key: string;
	type: ActorType;
	spritesheetKeys: string[];
	primarySpritesheetKey: string;
	defaultFrame: number;
	animations: AnimationInfo[];
	customShapes?: ShapeInfo[];
	spriteRenderOptions?: MatterJS.IBodyRenderOptionsSprite;
	movement?: {
		walkSpeed?: number,
		changeDirectionFrequency?: number,
		tendency: number,
	};

	constructor(info: Partial<ActorInfo>) {
		this.key = info.key ?? '';
		this.type = info.type ?? ActorType.Actor;
		this.spritesheetKeys = info.spritesheetKeys ?? [];
		this.primarySpritesheetKey = info.primarySpritesheetKey ?? '';
		this.defaultFrame = info.defaultFrame ?? 1;
		this.animations = info.animations ?? [];
		this.customShapes = info.customShapes ?? undefined;
		this.spriteRenderOptions = info.spriteRenderOptions ?? undefined;
		this.movement = info.movement ?? undefined;
	}

	getAnimationByKey(animationKey: string): AnimationInfo | undefined {
		let result;

		this.animations.forEach(animation => {
			if(animation.key === animationKey)
				result = animation;
		})

		return result;
	}
}

export enum ActorType {
	Actor,
	NPC,
	Enemy,
	Animal,
	Predator,
	Player
}

const actorDB: Record<string, ActorInfo> = {
	BrownRabbit: new ActorInfo({
		key: "BrownRabbit",
		spritesheetKeys: [ 'animals2' ],
		type: ActorType.Animal,
		primarySpritesheetKey: 'animals2',
		defaultFrame: 19,
		movement: {
			walkSpeed: 3,
			changeDirectionFrequency: 300,
			tendency: 10,
		},
		animations: [
			{
				key: 'down',
				frames: [6, 7, 8],
				frameRate: 10,
				repeat: -1,
				spritesheetKey: 'animals2',
			},
			{
				key: 'left',
				frames: [18, 19, 20],
				frameRate: 10,
				repeat: -1,
				spritesheetKey: 'animals2',
			},
			{
				key: 'right',
				frames: [30, 31, 32],
				frameRate: 10,
				repeat: -1,
				spritesheetKey: 'animals2',
			},
			{
				key: 'up',
				frames: [42, 43, 44],
				frameRate: 10,
				repeat: -1,
				spritesheetKey: 'animals2',
			}
		],
		customShapes: [
			{
				shape: ShapeType.Rectangle,
				shapeInfo: {
					x: 0,
					y: 0,
					width: 25,
					height: 25,
					config: { 
						isSensor: false,
						label: "BrownRabbit"
					}
				},
			}
		],
		spriteRenderOptions: {
			xOffset: 0.05,
			yOffset: 0.3
		}
	}),
	GreySquirrel: new ActorInfo({
		key: "GreySquirrel",
		spritesheetKeys: [ 'animals2' ],
		type: ActorType.Animal,
		primarySpritesheetKey: 'animals2',
		defaultFrame: 1,
		movement: {
			walkSpeed: 2,
			changeDirectionFrequency: 300,
			tendency: 10,
		},
		animations: [
			{
				key: 'down',
				frames: [0, 1, 2],
				frameRate: 10,
				repeat: -1,
				spritesheetKey: 'animals2',
			},
			{
				key: 'left',
				frames: [12, 13, 14],
				frameRate: 10,
				repeat: -1,
				spritesheetKey: 'animals2',
			},
			{
				key: 'right',
				frames: [24, 25, 26],
				frameRate: 10,
				repeat: -1,
				spritesheetKey: 'animals2',
			},
			{
				key: 'up',
				frames: [36, 37, 38],
				frameRate: 10,
				repeat: -1,
				spritesheetKey: 'animals2',
			}
		],
		customShapes: [
			{
				shape: ShapeType.Rectangle,
				shapeInfo: {
					x: 0,
					y: 0,
					width: 25,
					height: 15,
					config: { 
						isSensor: false,
						label: "GreySquirrel"
					}
				},
			}
		],
		spriteRenderOptions: {
			xOffset: 0.0,
			yOffset: 0.3
		}
	}),
};

export default actorDB;