import 'phaser'
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';
import PreloadScene from './scenes/preloadScene';
import AutoScene from './scenes/AutoScene';

const DEFAULT_WIDTH = 640;
const DEFAULT_HEIGHT = 360;

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  backgroundColor: '#ffffff',
  scale: {
    parent: 'phaser-game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT
  },
  input: {
    gamepad: true
  },
  scene: [ PreloadScene, AutoScene],
  physics: {
    default: 'matter',
    // arcade: {
    //   debug: true,
    //   gravity: { y: 0 }
    // }
    matter: {
      debug: false,
      gravity:  false,
    },
  },
  plugins: {
    scene: [
      {
        plugin: PhaserMatterCollisionPlugin, // The plugin class
        key: "matterCollision", // Where to store in Scene.Systems, e.g. scene.sys.matterCollision
        mapping: "matterCollision", // Where to store in the Scene, e.g. scene.matterCollision
      },
    ],
}
}

window.addEventListener('load', () => {
  const game = new Phaser.Game(config)
})
