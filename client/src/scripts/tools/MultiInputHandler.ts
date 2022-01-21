import Phaser from 'phaser';

export type AnalogStickValues = {
    UP: number;
    DOWN: number;
    LEFT: number;
    RIGHT: number;
    TIMESTAMP: number;
};
const defaultAnalogStickValues = {
    UP: 0,
    DOWN: 0,
    LEFT: 0,
    RIGHT: 0,
    TIMESTAMP: 0,
};

export type PlayerInput = {
    index: integer;
    interaction: {
        buffer: string;
        device: string;
        pressed: string;
        last: string;
    };
    keys: {
        UP: any[];
        DOWN: any[];
        LEFT: any[];
        RIGHT: any[];
    },
    direction: AnalogStickValues,
    direction_secondary: AnalogStickValues,
    buttons: Record<string, boolean>;
    buttons_timestamp: number;
    gamepad?: Phaser.Input.Gamepad.Gamepad;
	gamepadIndex?: integer;
}
const defaultPlayerInput: PlayerInput = {
    index: -1,
    interaction: {
        buffer: '',
        device: '',
        last: '',
        pressed: '',
    },
    keys: {
        UP: [],
        DOWN: [],
        LEFT: [],
        RIGHT: [],
    },
    direction: defaultAnalogStickValues,
    direction_secondary: defaultAnalogStickValues,
    buttons: {},
    buttons_timestamp: 0
}

export default class MultiInputHandler extends Phaser.Plugins.ScenePlugin {
    eventEmitter: Phaser.Events.EventEmitter;
    scene: Phaser.Scene;

    players: PlayerInput[] = [];
    keys: object = {};
    gamepads: Phaser.Input.Gamepad.Gamepad[] = [];

    constructor(scene, pluginManager) {
        super(scene, pluginManager, 'MultiInputHandler');
        this.scene = scene;
    }

    boot() {
        this.eventEmitter = this.systems.events;
        this.eventEmitter.on('update', this.update, this);

        // Gamepad
        if (typeof this.scene.input.gamepad !== 'undefined') {
			this.scene.input.gamepad.once('connected',  (thisGamepad) => {
				this.refreshGamepads();
				this.setupGamepad(thisGamepad)
			}, this);

			// Check to see if the gamepad has already been setup by the browser
			if (this.scene.input.gamepad.total) {
				this.refreshGamepads();
				for (const thisGamepad of this.gamepads) {
					this.scene.input.gamepad.emit('connected', thisGamepad);
				}
			}

			this.scene.input.gamepad.on('down', this.gamepadButtonDown, this);
			this.scene.input.gamepad.on('up', this.gamepadButtonUp, this);
		}

        // Keyboard
		this.scene.input.keyboard.on('keydown',  (event) => {
			const keyCode = Object.keys(Phaser.Input.Keyboard.KeyCodes).find(key => Phaser.Input.Keyboard.KeyCodes[key] === event.keyCode);
			const playerIndex = this.getPlayerIndexFromKey(keyCode);
			if (playerIndex > -1) {
                const player = this.getPlayer(playerIndex);
                if(player != null)
                    player.interaction.device = 'keyboard';
			}
		}, this);
		this.scene.input.keyboard.on('keyup',  (event) => {
			const keyCode = Object.keys(Phaser.Input.Keyboard.KeyCodes).find(key => Phaser.Input.Keyboard.KeyCodes[key] === event.keyCode);
			const playerIndex = this.getPlayerIndexFromKey(keyCode);
			if (playerIndex > -1) {
                const player = this.getPlayer(playerIndex);
                if(player != null)
                    player.interaction.device = 'keyboard';
			}
		}, this);
    }

    update() {
        for (const thisPlayer of this.players) {
			if (thisPlayer.interaction.pressed != '') {
				thisPlayer.interaction.buffer = '';
			}
			if (thisPlayer.interaction.buffer == '') {
				thisPlayer.interaction.pressed = '';
			}
		}

		this.checkKeyboardInput();
		this.checkGamepadInput();
    }

    addPlayer(index: integer) {
        if(this.players[index] !== undefined) {
            return this.players[index];
        }

        this.players.push(this.setupControls());
		this.players[index].index = index;

        return this.players[this.players.length - 1];
    }

    setupControls() {
        const playerInput = defaultPlayerInput;
        playerInput.index = this.players.length - 1

        return playerInput;
    }

    checkKeyboardInput(): void {
		// Loop through players and check for keypresses - use of 'entries()' gives us an index to use for the player
		for (const [playerIndex, thisPlayer] of this.players.entries()) {
			// Loop through all the keys assigned to this player
			for (const thisKey in thisPlayer.keys) {
				let action = false;
				for (const thisValue of thisPlayer.keys[thisKey]) {
					// Check if the key is down
					action = (this.keys[thisValue].isDown) ? true : action;

					// Emit events based on the key down and up values
					if (Phaser.Input.Keyboard.JustDown(this.keys[thisValue])) {
						this.eventEmitter.emit('multiInputHandler', { device: 'keyboard', value: 1, player: playerIndex, action: thisKey, state: 'DOWN' });
						// Update the last button state
						thisPlayer.interaction.pressed = thisKey;
						thisPlayer.interaction.buffer = thisKey;
						thisPlayer.interaction.last = thisKey;

					}
					if (Phaser.Input.Keyboard.JustUp(this.keys[thisValue])) {
						this.eventEmitter.emit('multiInputHandler', { device: 'keyboard', value: 1, player: playerIndex, action: thisKey, state: 'UP' });
					}
				}

				// Set the action in the player object
				if (['UP', 'DOWN', 'LEFT', 'RIGHT'].includes(thisKey)) {
					thisPlayer.direction[thisKey] = action;
					thisPlayer.direction.TIMESTAMP = Date.now();
				}
				else if (['ALT_UP', 'ALT_DOWN', 'ALT_LEFT', 'ALT_RIGHT'].includes(thisKey)) {
					thisPlayer.direction_secondary[thisKey.replace('ALT_', '')] = action;
					if (action) {
						thisPlayer.direction_secondary.TIMESTAMP = Date.now();
					}
				}
				else {
					thisPlayer.buttons[thisKey] = action;
					if (action) {
						thisPlayer.buttons_timestamp = Date.now();
					}
				}

				// Set the latest interaction flag
				if (action) {
					thisPlayer.interaction.device = 'keyboard';
				}
			}
		}
	}

    getPlayer(index: integer): PlayerInput | null {
		return typeof this.players[index] !== 'undefined' ? this.players[index] : null;
	}

    getPlayerIndexFromKey(key): integer {
		for (const thisPlayer of this.players) {
			// Loop through all the keys assigned to this player
			for (const thisKey in thisPlayer.keys) {
				for (const thisValue of thisPlayer.keys[thisKey]) {
					if (thisValue == key) {
						return thisPlayer.index;
					}
				}
			}
		}
		return -1;
	}

	getPlayerIndexFromGamepadIndex(gamepadIndex: integer): integer | null {
		let playerIndex: integer | null = null;
		
		this.players.forEach(player => {
			if(player.gamepadIndex === gamepadIndex) {
				playerIndex = player.index;
			}
		});

		return playerIndex;
	}

    defineKeys(player: number, action: string, values: string[]) {
        values.forEach( value => {
            this.defineKey(player, action, value, true);
        });

        return this;
    }

    defineKey(player: number, action: string, value: string, append = false) {
		// Set up a new player if none defined
		// if (typeof this.players[player] === 'undefined') {
		// 	this.addPlayer(this.players.length);
		// }

		if (['UP', 'DOWN', 'LEFT', 'RIGHT', 'ALT_UP', 'ALT_DOWN', 'ALT_LEFT', 'ALT_RIGHT', 'B0', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10', 'B11', 'B12', 'B13', 'B14', 'B15', 'B16'].includes(action)) {
			if (append && (typeof this.players[player].keys[action] !== 'undefined')) {
				this.players[player].keys[action].push(value);
			}
			else {
				this.players[player].keys[action] = [];
				this.players[player].keys[action].push(value);
			}

			this.keys[value] = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[value]);
		}

		return this;
	}

    refreshGamepads() {
		// Sometimes, gamepads are undefined. For some reason.
		this.gamepads = this.scene.input.gamepad.gamepads.filter(function (el) {
			return el != null && !el.id.includes('Surface Dock Extender');
		});

		for (const [index, thisGamepad] of this.gamepads.entries()) {
			thisGamepad.index = index; // Overwrite the gamepad index, in case we had undefined gamepads earlier
		}
	}

    setupGamepad(thisGamepad: Phaser.Input.Gamepad.Gamepad): integer {
		let playerIndex = -1;
		let playerFound = false;
		this.players.forEach( player => {
			if (!playerFound && typeof player.gamepad === 'undefined') {
				playerIndex = player.index;
				this.eventEmitter.emit('multiInputHandler', { device: 'gamepad', id: thisGamepad.id, player: playerIndex, action: 'Connected' });
				this.players[playerIndex].gamepadIndex = thisGamepad.index;
				this.players[playerIndex].gamepad = thisGamepad;
				playerFound = true;
			}
		});

		return playerIndex;
	}

    /**
	 * When a gamepad button is pressed down, this function will emit a multiInputHandler event in the global registry.
	 * The event contains a reference to the player assigned to the gamepad, and passes a mapped action and value
	 * @param {number} index Button index
	 * @param {number} value Button value
	 * @param {Phaser.Input.Gamepad.Button} button Phaser Button object
	 */
	gamepadButtonDown(pad: Phaser.Input.Gamepad.Gamepad, button: Phaser.Input.Gamepad.Button, value) {
		let playerIndex = this.getPlayerIndexFromGamepadIndex(pad.index);

		console.log(playerIndex, pad, button, value);
		console.log(this.debug());

		if(playerIndex === null) {
			playerIndex = this.setupGamepad(pad);
			console.log(playerIndex, pad, button, value);
		}

		this.players[playerIndex].interaction.device = 'gamepad';

		this.eventEmitter.emit('multiInputHandler', { device: 'gamepad', value: value, player: playerIndex, action: 'B' + button.index, state: 'DOWN' });

		// DPad mapping
		if (button.index === 12) {
			this.eventEmitter.emit('multiInputHandler', { device: 'gamepad', value: 1, player: playerIndex, action: 'UP', state: 'DOWN' });
			this.players[playerIndex].interaction.pressed = 'UP';
			this.players[playerIndex].interaction.last = 'UP';
			this.players[playerIndex].interaction.buffer = 'UP';
		}
		if (button.index === 13) {
			this.eventEmitter.emit('multiInputHandler', { device: 'gamepad', value: 1, player: playerIndex, action: 'DOWN', state: 'DOWN' });
			this.players[playerIndex].interaction.pressed = 'DOWN';
			this.players[playerIndex].interaction.last = 'DOWN';
			this.players[playerIndex].interaction.buffer = 'DOWN';
		}
		if (button.index === 14) {
			this.eventEmitter.emit('multiInputHandler', { device: 'gamepad', value: 1, player: playerIndex, action: 'LEFT', state: 'DOWN' });
			this.players[playerIndex].interaction.pressed = 'LEFT';
			this.players[playerIndex].interaction.last = 'LEFT';
			this.players[playerIndex].interaction.buffer = 'LEFT';
		}
		if (button.index === 15) {
			this.eventEmitter.emit('multiInputHandler', { device: 'gamepad', value: 1, player: playerIndex, action: 'RIGHT', state: 'DOWN' });
			this.players[playerIndex].interaction.pressed = 'RIGHT';
			this.players[playerIndex].interaction.last = 'RIGHT';
			this.players[playerIndex].interaction.buffer = 'RIGHT';
		}

		// Last button pressed
		// Update the last button state
		this.players[playerIndex].interaction.pressed = 'B' + button.index;
		this.players[playerIndex].interaction.last = 'B' + button.index;
		this.players[playerIndex].interaction.buffer = 'B' + button.index;
		this.players[playerIndex].buttons_timestamp = Date.now();
		if ([12, 13, 14, 15].includes(button.index)) {
			this.players[playerIndex].direction.TIMESTAMP = Date.now();
		}
	}

	/**
	 * When a gamepad button is released, this function will emit a multiInputHandler event in the global registry.
	 * The event contains a reference to the player assigned to the gamepad, and passes a mapped action and value
	 * @param {number} index Button index
	 * @param {number} value Button value
	 * @param {Phaser.Input.Gamepad.Button} button Phaser Button object
	 */
	gamepadButtonUp(pad, button, value) {
		const playerIndex = this.getPlayerIndexFromGamepadIndex(pad.index);

		if(playerIndex === null) return;

		this.players[playerIndex].interaction.device = 'gamepad';
		this.eventEmitter.emit('multiInputHandler', { device: 'gamepad', value: value, player: playerIndex, action: 'B' + button.index, state: 'UP' });
		// DPad mapping
		if (button.index === 12) {
			this.eventEmitter.emit('multiInputHandler', { device: 'gamepad', value: 1, player: playerIndex, action: 'UP', state: 'UP' });
		}
		if (button.index === 13) {
			this.eventEmitter.emit('multiInputHandler', { device: 'gamepad', value: 1, player: playerIndex, action: 'DOWN', state: 'UP' });
		}
		if (button.index === 14) {
			this.eventEmitter.emit('multiInputHandler', { device: 'gamepad', value: 1, player: playerIndex, action: 'LEFT', state: 'UP' });
		}
		if (button.index === 15) {
			this.eventEmitter.emit('multiInputHandler', { device: 'gamepad', value: 1, player: playerIndex, action: 'RIGHT', state: 'UP' });
		}

		if (![12, 13, 14, 15].includes(button.index)) {
			// Update the last button state
			this.players[playerIndex].buttons_timestamp = Date.now();
		}
		else {
			this.players[playerIndex].direction.TIMESTAMP = Date.now();
		}
	}

    /**
	 * Iterate through gamepads and handle interactions
	 */
	checkGamepadInput() {
		// Check for gamepad input
		for (const thisGamepad of this.gamepads) {
			const playerIndex = this.getPlayerIndexFromGamepadIndex(thisGamepad.index);

			if(playerIndex === null) return;

			// Set up a player if we don't have one, presumably due to race conditions in detecting gamepads
			if (typeof this.players[playerIndex] === 'undefined') {
				this.addPlayer(this.players.length);
			}

			// Directions
			if (thisGamepad.leftStick.y < -0.5) {
				this.players[playerIndex].direction.UP = Math.abs(thisGamepad.leftStick.y)
				this.players[playerIndex].direction.TIMESTAMP = Date.now();
			}
			else if (thisGamepad.leftStick.y > 0.5) {
				this.players[playerIndex].direction.DOWN = thisGamepad.leftStick.y
				this.players[playerIndex].direction.TIMESTAMP = Date.now();
			}
			else if (this.players[playerIndex].interaction.device === 'gamepad') {
				// DPad
				this.players[playerIndex].direction.UP = thisGamepad.up ? 1 : 0;
				this.players[playerIndex].direction.DOWN = thisGamepad.down ? 1 : 0;
			}

			if (thisGamepad.leftStick.x < -0.5) {
				this.players[playerIndex].direction.LEFT = Math.abs(thisGamepad.leftStick.x)
				this.players[playerIndex].direction.TIMESTAMP = Date.now();
			}
			else if (thisGamepad.leftStick.x > 0.5) {
				this.players[playerIndex].direction.RIGHT = thisGamepad.leftStick.x
				this.players[playerIndex].direction.TIMESTAMP = Date.now();
			}
			else if (this.players[playerIndex].interaction.device === 'gamepad') {
				// DPad
				this.players[playerIndex].direction.LEFT = thisGamepad.left ? 1 : 0;
				this.players[playerIndex].direction.RIGHT = thisGamepad.right ? 1 : 0;
			}

			// Secondary
			if (thisGamepad.rightStick.y < -0.5) {
				this.players[playerIndex].direction_secondary.UP = Math.abs(thisGamepad.rightStick.y)
				this.players[playerIndex].direction_secondary.TIMESTAMP = Date.now();
			}
			else if (thisGamepad.rightStick.y > 0.5) {
				this.players[playerIndex].direction_secondary.DOWN = thisGamepad.rightStick.y
				this.players[playerIndex].direction_secondary.TIMESTAMP = Date.now();
			}
			else {
				this.players[playerIndex].direction_secondary.UP = 0;
				this.players[playerIndex].direction_secondary.DOWN = 0;
			}

			if (thisGamepad.rightStick.x < -0.5) {
				this.players[playerIndex].direction_secondary.LEFT = Math.abs(thisGamepad.rightStick.x)
				this.players[playerIndex].direction_secondary.TIMESTAMP = Date.now();
			}
			else if (thisGamepad.rightStick.x > 0.5) {
				this.players[playerIndex].direction_secondary.RIGHT = thisGamepad.rightStick.x
				this.players[playerIndex].direction_secondary.TIMESTAMP = Date.now();
			}
			else {
				this.players[playerIndex].direction_secondary.LEFT = 0;
				this.players[playerIndex].direction_secondary.RIGHT = 0;
			}

			if (this.players[playerIndex].interaction.device === 'gamepad') {
				// Buttons

				for (let b = 0; b < thisGamepad.buttons.length; b++) {
					const button = thisGamepad.buttons[b];
					this.players[playerIndex].buttons['B' + b] = Boolean(button.value);
				}
			}
		}
	}

    debug() {
		// Debug variables
		const debug: Record<any, any>= { input: {}};
		debug.input.gamepads = [];
		for (let i = 0; i < this.gamepads.length; i++) {
			const pad = this.gamepads[i];
			const buttons = {};
			const axes = {};

			for (let b = 0; b < pad.buttons.length; b++) {
				const button = pad.buttons[b];
				buttons['B' + button.index] = button.value;
			}

			for (let a = 0; a < pad.axes.length; a++) {
				const axis = pad.axes[a];
				axes['A' + axis.index] = axis.getValue();
			}

			debug.input.gamepads.push({
				'ID': pad.id,
				'Index': pad.index,
				'Buttons': buttons,
				'Axes': axes
			});
		}

		debug.players = [];
		for (const thisPlayer of this.players) {
			debug.players.push({
				'interaction': thisPlayer.interaction,
				'device': thisPlayer.interaction.device,
				'buttons': thisPlayer.buttons,
				'direction': thisPlayer.direction,
				'direction_secondary': thisPlayer.direction_secondary,
				'keys': thisPlayer.keys
			})
		}

		return debug;
	}
}