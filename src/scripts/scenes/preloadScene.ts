export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    this.load.image('terrain', 'assets/map/tiles/terrain.png');
    this.load.image('castle', 'assets/map/tiles/castle.png');
    this.load.image('outside', 'assets/map/tiles/outside.png');
    this.load.image('house', 'assets/map/tiles/house.png');

    this.load.tilemapTiledJSON('Map_0_0', 'assets/map/map-0-0-town.json');

    this.load.spritesheet("chara2", 'assets/img/spritesheets/chara2.png', {
      frameWidth: 26,
      frameHeight: 36,
     });
  }

  create() {
    this.scene.start('Map_0_0')

    /**
     * This is how you would dynamically import the mainScene class (with code splitting),
     * add the mainScene to the Scene Manager
     * and start the scene.
     * The name of the chunk would be 'mainScene.chunk.js
     * Find more about code splitting here: https://webpack.js.org/guides/code-splitting/
     */
    // let someCondition = true
    // if (someCondition)
    //   import(/* webpackChunkName: "mainScene" */ './mainScene').then(mainScene => {
    //     this.scene.add('MainScene', mainScene.default, true)
    //   })
    // else console.log('The mainScene class will not even be loaded by the browser')
  }
}
