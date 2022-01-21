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
}

export interface ActorInfo {
	key: string;
	type: ActorType;
	spritesheetKey: string;
	spritesheetPath: string;
	defaultFrame: number;
	animations: AnimationInfo[];
	customShapes?: ShapeInfo[];
	spriteRenderOptions?: MatterJS.IBodyRenderOptionsSprite;
	movement?: {
		walkSpeed?: number,
		changeDirectionFrequency?: number,
		tendency: number,
	},
}

export enum ActorType {
	Actor,
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
	},
	GreySquirrel: {
		key: "GreySquirrel",
		spritesheetKey: "animals2",
		spritesheetPath: "assets/img/spritesheets/animals2.png",
		type: ActorType.Animal,
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
				repeat: -1
			},
			{
				key: 'left',
				frames: [12, 13, 14],
				frameRate: 10,
				repeat: -1
			},
			{
				key: 'right',
				frames: [24, 25, 26],
				frameRate: 10,
				repeat: -1
			},
			{
				key: 'up',
				frames: [36, 37, 38],
				frameRate: 10,
				repeat: -1
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
	},
	ArmedCitizen: {
		key: "ArmedCitizen",
		spritesheetKey: "ArmedCitizen",
		spritesheetPath: "assets/img/spritesheets/ulpc-sheet-test-36x36.png",
		type: ActorType.Animal,
		defaultFrame: 17,
		movement: {
			walkSpeed: 3,
			changeDirectionFrequency: 300,
			tendency: 20,
		},
		animations: [
			{
				key: 'down',
				frames: [17, 18, 19, 20, 21, 22, 23, 24, 25],
				frameRate: 10,
				repeat: -1
			},
			{
				key: 'left',
				frames: [8, 9, 10, 11, 12, 13, 14, 15, 16],
				frameRate: 10,
				repeat: -1
			},
			{
				key: 'right',
				frames: [26, 27, 28, 29, 30, 31, 32, 33, 34],
				frameRate: 10,
				repeat: -1
			},
			{
				key: 'up',
				frames: [0, 1, 2, 3, 4, 5, 6, 7],
				frameRate: 10,
				repeat: -1
			}
		],
		customShapes: [
			{
				shape: ShapeType.Rectangle,
				shapeInfo: {
					x: 0,
					y: 0,
					width: 30,
					height: 36,
					config: { 
						isSensor: false,
						label: "ArmedCitizen"
					}
				},
			}
		],
		spriteRenderOptions: {
			xOffset: 0.05,
			yOffset: 0.3
		}
	}
};

export default actorDB;