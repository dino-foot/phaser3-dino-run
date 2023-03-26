import Phaser from 'phaser';

import PlayScene from './PlayScene';
import PreloadScene from './PreloadScene';

const config = {
  type: Phaser.AUTO,
  width: 1000,
  height: 500,
  pixelArt: false,
  transparent: true,
  parent: 'phaser',
  dom: {
    createContainer: true,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
  scale: {
    // autoCenter: Phaser.Scale.CENTER_BOTH,
    // mode: Phaser.Scale.FIT,
    orientation: Phaser.Scale.Orientation.PORTRAIT,
  },
  scene: [PreloadScene, PlayScene],
};

new Phaser.Game(config);
