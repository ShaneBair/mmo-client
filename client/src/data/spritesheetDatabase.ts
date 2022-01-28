export interface SpritesheetInfo {
	key: string;
	path: string;
	frameWidth: number;
	frameHeight: number;
}

const spritesheetDatabase: Record<string, SpritesheetInfo> = {
	chara2: {
		key: "chara2",
		path: "assets/img/spritesheets/chara2.png",
		frameWidth: 26,
		frameHeight: 36,
	},
	chara2_1_attacks: {
		key: "chara2_1_attacks", 
		path: 'assets/img/spritesheets/chara2_1_attacks.png',
		frameWidth: 48,
		frameHeight: 36
	},
	chara2_2_attacks: {
		key: "chara2_2_attacks", 
		path: 'assets/img/spritesheets/chara2_2_attacks.png',
		frameWidth: 48,
		frameHeight: 36
	},
	chara2_3_attacks: {
		key: "chara2_3_attacks", 
		path: 'assets/img/spritesheets/chara2_3_attacks.png',
		frameWidth: 48,
		frameHeight: 36
	},
	chara2_4_attacks: {
		key: "chara2_4_attacks", 
		path: 'assets/img/spritesheets/chara2_4_attacks.png',
		frameWidth: 48,
		frameHeight: 36
	},
	chara2_5_attacks: {
		key: "chara2_5_attacks", 
		path: 'assets/img/spritesheets/chara2_5_attacks.png',
		frameWidth: 48,
		frameHeight: 36
	},
	chara2_6_attacks: {
		key: "chara2_6_attacks", 
		path: 'assets/img/spritesheets/chara2_6_attacks.png',
		frameWidth: 48,
		frameHeight: 36
	},
	chara2_7_attacks: {
		key: "chara2_7_attacks", 
		path: 'assets/img/spritesheets/chara2_7_attacks.png',
		frameWidth: 48,
		frameHeight: 36
	},
	chara2_8_attacks: {
		key: "chara2_8_attacks", 
		path: 'assets/img/spritesheets/chara2_8_attacks.png',
		frameWidth: 48,
		frameHeight: 36
	},
	animals2: {
		key: 'animals2', 
		path: 'assets/img/spritesheets/animals2.png', 
		frameWidth: 42,
		frameHeight: 36,
	},
};

export default spritesheetDatabase;