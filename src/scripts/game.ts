import 'phaser'
import Map_0_0 from './scenes/Map_0_0'
import PreloadScene from './scenes/preloadScene'

const DEFAULT_WIDTH = 640;
const DEFAULT_HEIGHT = 360;

const config = {
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
  scene: [PreloadScene, Map_0_0],
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: { y: 0 }
    }
  }
}

window.addEventListener('load', () => {
  const game = new Phaser.Game(config)
})
