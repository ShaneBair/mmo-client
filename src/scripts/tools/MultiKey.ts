/**
 * A small class to allow multiple Phaser keys to treated as one input. E.g. the left arrow and "A"
 * key can be wrapped up into one "input" so that we can check whether the player pressed either
 * button.
 * @export
 * @class MultiKey
 */
export default class MultiKey {
  keys: Phaser.Input.Keyboard.Key[];

  /**
	 * Creates an instance of MultiKey.
	 * @param {Phaser.Scene} scene
	 * @param {*} keys
	 * @memberof MultiKey
	 */
	constructor(scene: Phaser.Scene, keys) {
    if (!Array.isArray(keys)) keys = [keys];
    this.keys = keys.map(key => scene.input.keyboard.addKey(key));
  }

  /**
	 * Are any of the keys down?
	 *
	 * @return {*} 
	 * @memberof MultiKey
	 */
	isDown() {
    return this.keys.some(key => key.isDown);
  }

  
  /**
	 * Are all of the keys up?
	 *
	 * @return {*} 
	 * @memberof MultiKey
	 */
	isUp() {
    return this.keys.every(key => key.isUp);
  }
}