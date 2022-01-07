import Phaser from "phaser"

export default class CollisionObject extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);
  }
}
