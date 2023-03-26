import Phaser from 'phaser';

class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload() {
    this.load.audio('jump', 'assets/jump.m4a');
    this.load.audio('hit', 'assets/hit.m4a');
    this.load.audio('reach', 'assets/reach.m4a');

    this.load.image('ground', 'assets/ground.png');
    this.load.image('dino-idle', 'assets/dino-idle.png');
    this.load.image('dino-hurt', 'assets/dino-hurt.png');
    this.load.image('restart', 'assets/restart.png');
    this.load.image('game-over', 'assets/game-over.png');
    this.load.image('cloud', 'assets/cloud.png');

    this.load.spritesheet('star', 'assets/stars.png', {
      frameWidth: 9,
      frameHeight: 9,
    });

    this.load.spritesheet('moon', 'assets/moon.png', {
      frameWidth: 20,
      frameHeight: 40,
    });

    this.load.spritesheet('dino', 'assets/dino-run.png', {
      frameWidth: 88,
      frameHeight: 94,
    });

    this.load.spritesheet('dino-down', 'assets/dino-down.png', {
      frameWidth: 118,
      frameHeight: 94,
    });

    this.load.spritesheet('enemy-bird', 'assets/enemy-bird.png', {
      frameWidth: 92,
      frameHeight: 77,
    });

    // this.load.image('obsticle-1', 'assets/cactuses_small_1.png');
    // this.load.image('obsticle-2', 'assets/cactuses_small_2.png');
    // this.load.image('obsticle-3', 'assets/cactuses_small_3.png');
    // this.load.image('obsticle-4', 'assets/cactuses_big_1.png');
    // this.load.image('obsticle-5', 'assets/cactuses_big_2.png');
    // this.load.image('obsticle-6', 'assets/cactuses_big_3.png');

    // new
    this.load.image('obsticle-1', 'assets/coffe_cup.png');
    this.load.image('obsticle-2', 'assets/spoon.png');
    this.load.image('obsticle-3', 'assets/coffe_cup.png');
    this.load.image('obsticle-4', 'assets/spoon.png');
    this.load.image('obsticle-5', 'assets/coffe_cup.png');
    this.load.image('obsticle-6', 'assets/coffe_cup.png');

    this.load.image('gameover', 'assets/gameover.png');

    this.load.image('background', 'assets/background.png');

    this.load.image('duck', 'assets/duck.png');
    this.load.image('jump', 'assets/jump.png');

    this.load.audio('music', 'assets/music.mp3');

    this.load.spritesheet('jug_duck', 'assets/jug_duck.png', {
      frameWidth: 315,
      frameHeight: 280,
    });
    this.load.spritesheet('jug_run', 'assets/jug_run.png', {
      frameWidth: 290,
      frameHeight: 352,
    });
  }

  create() {
    this.scene.start('PlayScene');
  }
}

export default PreloadScene;
