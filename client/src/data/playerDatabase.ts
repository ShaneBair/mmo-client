import { ActorInfo, ActorType } from "./actorDatabase";

export class PlayerInfo extends ActorInfo {
	constructor(info: Partial<ActorInfo>) {
		super(info);
	}
}

const playerDB: Record<string, PlayerInfo> = {
	Chara2_1: new PlayerInfo({
		key: "Chara2_1",
		spritesheetKeys: [
			'chara2', 'chara2_1_attacks'
		],
		type: ActorType.Player,
		primarySpritesheetKey: 'chara2',
		defaultFrame: 1,
		movement: {
			walkSpeed: 3,
			tendency: 0,
		},
		animations: [
			{
				spritesheetKey: 'chara2',
				key: 'down',
				frames: [0, 1, 2],
				frameRate: 10,
				repeat: -1
			},
			{
				spritesheetKey: 'chara2',
				key: 'left',
				frames: [12, 13, 14],
				frameRate: 10,
				repeat: -1
			},
			{
				spritesheetKey: 'chara2',
				key: 'right',
				frames: [24, 25, 26],
				frameRate: 10,
				repeat: -1
			},
			{
				spritesheetKey: 'chara2',
				key: 'up',
				frames: [36, 37, 38],
				frameRate: 10,
				repeat: -1
			},
			{
				spritesheetKey: 'chara2_1_attacks',
				key: 'attack',
				frames: [3, 4, 5],
				frameRate: 10,
				repeat: -1
			},
			{
				spritesheetKey: 'chara2_1_attacks',
				key: 'upAttack',
				frames: [30, 31, 32],
				frameRate: 10,
				repeat: -1
			},
			{
				spritesheetKey: 'chara2_1_attacks',
				key: 'downAttack',
				frames: [30, 31, 32],
				frameRate: 10,
				repeat: -1
			},
		]
	}),
	Chara2_2: new PlayerInfo({
		key: "Chara2_2",
		spritesheetKeys: [
			'chara2', 'chara2_2_attacks'
		],
		type: ActorType.Player,
		primarySpritesheetKey: 'chara2',
		defaultFrame: 4,
		movement: {
			walkSpeed: 3,
			tendency: 0,
		},
		animations: [
			{
				spritesheetKey: 'chara2',
				key: 'down',
				frames: [3, 4, 5],
				frameRate: 10,
				repeat: -1
			},
			{
				spritesheetKey: 'chara2',
				key: 'left',
				frames: [15, 16, 17],
				frameRate: 10,
				repeat: -1
			},
			{
				spritesheetKey: 'chara2',
				key: 'right',
				frames: [27, 28, 29],
				frameRate: 10,
				repeat: -1
			},
			{
				spritesheetKey: 'chara2',
				key: 'up',
				frames: [39, 40, 41],
				frameRate: 10,
				repeat: -1
			},
			{
				spritesheetKey: 'chara2_2_attacks',
				key: 'attack',
				frames: [3, 4, 5],
				frameRate: 10,
				repeat: -1
			},
			{
				spritesheetKey: 'chara2_2_attacks',
				key: 'upAttack',
				frames: [30, 31, 32],
				frameRate: 10,
				repeat: -1
			},
			{
				spritesheetKey: 'chara2_2_attacks',
				key: 'downAttack',
				frames: [30, 31, 32],
				frameRate: 10,
				repeat: -1
			},
		]
	}),
	Chara2_3: new PlayerInfo({
		key: "Chara2_3",
		spritesheetKeys: [
			'chara2', 'chara2_3_attacks'
		],
		type: ActorType.Player,
		primarySpritesheetKey: 'chara2',
		defaultFrame: 7,
		movement: {
			walkSpeed: 3,
			tendency: 0,
		},
		animations: [
			{
				spritesheetKey: 'chara2',
				key: 'down',
				frames: [6, 7, 8],
				frameRate: 10,
				repeat: -1
			},
			{
				spritesheetKey: 'chara2',
				key: 'left',
				frames: [18, 19, 20],
				frameRate: 10,
				repeat: -1
			},
			{
				spritesheetKey: 'chara2',
				key: 'right',
				frames: [30, 31, 32],
				frameRate: 10,
				repeat: -1
			},
			{
				spritesheetKey: 'chara2',
				key: 'up',
				frames: [42, 43, 44],
				frameRate: 10,
				repeat: -1
			},
			{
				spritesheetKey: 'chara2_3_attacks',
				key: 'attack',
				frames: [3, 4, 5],
				frameRate: 10,
				repeat: -1
			},
			{
				spritesheetKey: 'chara2_3_attacks',
				key: 'upAttack',
				frames: [30, 31, 32],
				frameRate: 10,
				repeat: -1
			},
			{
				spritesheetKey: 'chara2_3_attacks',
				key: 'downAttack',
				frames: [30, 31, 32],
				frameRate: 10,
				repeat: -1
			},
		]
	}),
	Chara2_4: new PlayerInfo({
		key: "Chara2_4",
		spritesheetKeys: [
			'chara2', 'chara2_4_attacks'
		],
		type: ActorType.Player,
		primarySpritesheetKey: 'chara2',
		defaultFrame: 10,
		movement: {
			walkSpeed: 3,
			tendency: 0,
		},
		animations: [
			{
				spritesheetKey: 'chara2',
				key: 'down',
				frames: [9, 10, 11],
				frameRate: 10,
				repeat: -1
			},
			{
				spritesheetKey: 'chara2',
				key: 'left',
				frames: [21, 22, 23],
				frameRate: 10,
				repeat: -1
			},
			{
				spritesheetKey: 'chara2',
				key: 'right',
				frames: [33, 34, 35],
				frameRate: 10,
				repeat: -1
			},
			{
				spritesheetKey: 'chara2',
				key: 'up',
				frames: [45, 46, 47],
				frameRate: 10,
				repeat: -1
			},
			{
				spritesheetKey: 'chara2_4_attacks',
				key: 'attack',
				frames: [3, 4, 5],
				frameRate: 10,
				repeat: -1
			},
			{
				spritesheetKey: 'chara2_4_attacks',
				key: 'upAttack',
				frames: [30, 31, 32],
				frameRate: 10,
				repeat: -1
			},
			{
				spritesheetKey: 'chara2_4_attacks',
				key: 'downAttack',
				frames: [30, 31, 32],
				frameRate: 10,
				repeat: -1
			},
		]
	}),
	Chara2_5: new PlayerInfo({
		key: "Chara2_5",
		spritesheetKeys: [
			'chara2', 'chara2_5_attacks'
		],
		type: ActorType.Player,
		primarySpritesheetKey: 'chara2',
		defaultFrame: 49,
		movement: {
			walkSpeed: 3,
			tendency: 0,
		},
		animations: [
			{
				spritesheetKey: 'chara2',
				key: 'down',
				frames: [48, 49, 50],
				frameRate: 10,
				repeat: -1
			},
			{
				spritesheetKey: 'chara2',
				key: 'left',
				frames: [60, 61, 62],
				frameRate: 10,
				repeat: -1
			},
			{
				spritesheetKey: 'chara2',
				key: 'right',
				frames: [72, 73, 74],
				frameRate: 10,
				repeat: -1
			},
			{
				spritesheetKey: 'chara2',
				key: 'up',
				frames: [84, 85, 86],
				frameRate: 10,
				repeat: -1
			},
			{
				spritesheetKey: 'chara2_5_attacks',
				key: 'attack',
				frames: [3, 4, 5],
				frameRate: 10,
				repeat: -1
			},
			{
				spritesheetKey: 'chara2_5_attacks',
				key: 'upAttack',
				frames: [30, 31, 32],
				frameRate: 10,
				repeat: -1
			},
			{
				spritesheetKey: 'chara2_5_attacks',
				key: 'downAttack',
				frames: [30, 31, 32],
				frameRate: 10,
				repeat: -1
			},
		]
	}),
	Chara2_6: new PlayerInfo({
		key: "Chara2_6",
		spritesheetKeys: [
			'chara2', 'chara2_6_attacks'
		],
		type: ActorType.Player,
		primarySpritesheetKey: 'chara2',
		defaultFrame: 52,
		movement: {
			walkSpeed: 3,
			tendency: 0,
		},
		animations: [
			{
				spritesheetKey: 'chara2',
				key: 'down',
				frames: [51, 52, 53],
				frameRate: 10,
				repeat: -1
			},
			{
				spritesheetKey: 'chara2',
				key: 'left',
				frames: [63, 64, 65],
				frameRate: 10,
				repeat: -1
			},
			{
				spritesheetKey: 'chara2',
				key: 'right',
				frames: [75, 76, 77],
				frameRate: 10,
				repeat: -1
			},
			{
				spritesheetKey: 'chara2',
				key: 'up',
				frames: [87, 88, 89],
				frameRate: 10,
				repeat: -1
			},
			{
				spritesheetKey: 'chara2_6_attacks',
				key: 'attack',
				frames: [3, 4, 5],
				frameRate: 10,
				repeat: -1
			},
			{
				spritesheetKey: 'chara2_6_attacks',
				key: 'upAttack',
				frames: [30, 31, 32],
				frameRate: 10,
				repeat: -1
			},
			{
				spritesheetKey: 'chara2_6_attacks',
				key: 'downAttack',
				frames: [30, 31, 32],
				frameRate: 10,
				repeat: -1
			},
		]
	}),
	Chara2_7: new PlayerInfo({
		key: "Chara2_7",
		spritesheetKeys: [
			'chara2', 'chara2_7_attacks'
		],
		type: ActorType.Player,
		primarySpritesheetKey: 'chara2',
		defaultFrame: 55,
		movement: {
			walkSpeed: 3,
			tendency: 0,
		},
		animations: [
			{
				spritesheetKey: 'chara2',
				key: 'down',
				frames: [54, 55, 56],
				frameRate: 10,
				repeat: -1
			},
			{
				spritesheetKey: 'chara2',
				key: 'left',
				frames: [66, 67, 68],
				frameRate: 10,
				repeat: -1
			},
			{
				spritesheetKey: 'chara2',
				key: 'right',
				frames: [78, 79, 80],
				frameRate: 10,
				repeat: -1
			},
			{
				spritesheetKey: 'chara2',
				key: 'up',
				frames: [90, 91, 92],
				frameRate: 10,
				repeat: -1
			},
			{
				spritesheetKey: 'chara2_7_attacks',
				key: 'attack',
				frames: [3, 4, 5],
				frameRate: 10,
				repeat: -1
			},
			{
				spritesheetKey: 'chara2_7_attacks',
				key: 'upAttack',
				frames: [30, 31, 32],
				frameRate: 10,
				repeat: -1
			},
			{
				spritesheetKey: 'chara2_7_attacks',
				key: 'downAttack',
				frames: [30, 31, 32],
				frameRate: 10,
				repeat: -1
			},
		]
	}),
	Chara2_8: new PlayerInfo({
		key: "Chara2_8",
		spritesheetKeys: [
			'chara2', 'chara2_8_attacks'
		],
		type: ActorType.Player,
		primarySpritesheetKey: 'chara2',
		defaultFrame: 58,
		movement: {
			walkSpeed: 3,
			tendency: 0,
		},
		animations: [
			{
				spritesheetKey: 'chara2',
				key: 'down',
				frames: [57, 58, 59],
				frameRate: 10,
				repeat: -1
			},
			{
				spritesheetKey: 'chara2',
				key: 'left',
				frames: [69, 70, 71],
				frameRate: 10,
				repeat: -1
			},
			{
				spritesheetKey: 'chara2',
				key: 'right',
				frames: [81, 82, 83],
				frameRate: 10,
				repeat: -1
			},
			{
				spritesheetKey: 'chara2',
				key: 'up',
				frames: [93, 94, 95],
				frameRate: 10,
				repeat: -1
			},
			{
				spritesheetKey: 'chara2_8_attacks',
				key: 'attack',
				frames: [3, 4, 5],
				frameRate: 10,
				repeat: -1
			},
			{
				spritesheetKey: 'chara2_8_attacks',
				key: 'upAttack',
				frames: [30, 31, 32],
				frameRate: 10,
				repeat: -1
			},
			{
				spritesheetKey: 'chara2_8_attacks',
				key: 'downAttack',
				frames: [30, 31, 32],
				frameRate: 10,
				repeat: -1
			},
		]
	}),
};

export default playerDB;