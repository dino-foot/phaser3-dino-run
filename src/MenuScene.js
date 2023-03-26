import Phaser from 'phaser';

class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  init() {
    const jumpDomBtn = window.document.getElementById('jump');
    const duckDomBtn = window.document.getElementById('duck');
    duckDomBtn.style.visibility = 'hidden'; // Show
    jumpDomBtn.style.visibility = 'hidden'; // Show
  }

  preload() {
    this.load.image('logo', 'assets/ecoflow_logo.png');
    this.load.image('play', 'assets/play.png');

    this.load.audio('jump', 'assets/jump.m4a');
    this.load.audio('hit', 'assets/hit.m4a');
    this.load.audio('reach', 'assets/reach.m4a');

    this.load.image('ground', 'assets/ground.png');
    // this.load.image('dino-idle', 'assets/dino-idle.png');
    // this.load.image('dino-hurt', 'assets/dino-hurt.png');
    this.load.image('restart', 'assets/restart.png');
    this.load.image('game-over', 'assets/game-over.png');
    // this.load.image('cloud', 'assets/cloud.png');
  }

  create() {
    // this.scene.start('PreloadScene');
    const logo = this.add.image(this.cameras.main.width / 2, 180, 'logo');
    logo.setOrigin(0.5);
    logo.setScale(0.65);
    // logo.setInteractive();

    const play = this.add
      .image(this.cameras.main.width / 2, 450, 'play')
      .setOrigin(0.5)
      .setScale(0.65)
      .setInteractive();

    play.on(
      'pointerdown',
      () => {
        this.scene.start('PreloadScene');
      },
      this
    );
  }
}

export default MenuScene;
