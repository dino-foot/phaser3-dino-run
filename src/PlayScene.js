import Phaser from 'phaser';
var isJump = false;
var timer = null;
var backgroundTile = null;
class PlayScene extends Phaser.Scene {
  constructor() {
    super('PlayScene');
  }

  create() {
    const jumpDomBtn = window.document.getElementById('jump');
    const duckDomBtn = window.document.getElementById('duck');
    duckDomBtn.style.visibility = 'visible'; // Show
    jumpDomBtn.style.visibility = 'visible'; // Show

    jumpDomBtn.addEventListener(
      'mousedown',
      () => {
        this.jumpBtn();
      },
      this
    );

    duckDomBtn.addEventListener(
      'mousedown',
      () => {
        this.duckBtnDown();
      },
      this
    );

    // duckDomBtn.addEventListener(
    //   'mouseup',
    //   () => {
    //     this.duckBtnUp();
    //   },
    //   this
    // );

    // console.log('canvas', jumpDomBtn);

    isJump = false;
    const music = this.sound.add('music', { volume: 0.4 });
    music.play();

    const { height, width } = this.game.config;
    this.gameSpeed = 10;
    this.isGameRunning = false;
    this.respawnTime = 0;
    this.score = 0;

    this.jumpSound = this.sound.add('jump', { volume: 0.2 });
    this.hitSound = this.sound.add('hit', { volume: 0.2 });
    this.reachSound = this.sound.add('reach', { volume: 0.2 });

    this.startTrigger = this.physics.add.sprite(0, 10).setOrigin(0, 1).setImmovable();
    this.ground = this.add.tileSprite(0, height, 88, 26, 'ground').setOrigin(0, 1);
    this.dino = this.physics.add.sprite(0, height, 'jug_run', 0).setCollideWorldBounds(true).setGravityY(5000).setDepth(1).setOrigin(0, 1);
    this.dino.body.setSize(this.dino.width - 100, this.dino.height);
    // console.log(this.dino.body); // 66, 123
    // setBodySize(44, 92)
    this.dino.setScale(0.35);

    this.scoreText = this.add.text(width, 0, '00000', { fill: '#535353', font: '900 35px Courier', resolution: 5 }).setOrigin(1, 0).setAlpha(0);
    this.highScoreText = this.add.text(0, 0, '00000', { fill: '#535353', font: '900 35px Courier', resolution: 5 }).setOrigin(1, 0).setAlpha(0);

    backgroundTile = this.add.tileSprite(640, 300, 1280, 600, 'background').setScale(1).setDepth(-1);

    // background.setScrollFactor(20, 1);

    this.environment = this.add.group();
    this.environment.addMultiple([this.add.image(width / 2, 170, 'cloud'), this.add.image(width - 80, 80, 'cloud'), this.add.image(width / 1.3, 100, 'cloud')]);
    this.environment.setAlpha(0);

    this.gameOverScreen = this.add.container(width / 2, height / 2 - 50).setAlpha(0);
    this.gameOverText = this.add.image(0, 0, 'gameover').setScale(0.25).setOrigin(0.5);
    this.restart = this.add.image(0, 80, 'restart').setInteractive();
    this.gameOverScreen.add([this.gameOverText, this.restart]);

    this.obsticles = this.physics.add.group();

    this.initAnims();
    this.initStartTrigger();
    this.initColliders();
    this.handleInputs();
    this.handleScore();
  }

  initColliders() {
    this.physics.add.collider(
      this.dino,
      this.obsticles,
      () => {
        this.highScoreText.x = this.scoreText.x - this.scoreText.width - 20;

        const highScore = this.highScoreText.text.substr(this.highScoreText.text.length - 5);
        const newScore = Number(this.scoreText.text) > Number(highScore) ? this.scoreText.text : highScore;

        this.highScoreText.setText('HI ' + newScore);
        this.highScoreText.setAlpha(1);

        this.physics.pause();
        this.isGameRunning = false;
        this.anims.pauseAll();
        // this.dino.setTexture('dino-hurt');
        this.respawnTime = 0;
        this.gameSpeed = 10;
        this.gameOverScreen.setAlpha(1);
        this.score = 0;
        this.hitSound.play();
      },
      null,
      this
    );
  }

  initStartTrigger() {
    const { width, height } = this.game.config;
    this.physics.add.overlap(
      this.startTrigger,
      this.dino,
      () => {
        if (this.startTrigger.y === 10) {
          this.startTrigger.body.reset(0, height);
          return;
        }

        this.startTrigger.disableBody(true, true);

        const startEvent = this.time.addEvent({
          delay: 1000 / 60,
          loop: true,
          callbackScope: this,
          callback: () => {
            this.dino.setVelocityX(80);
            this.dino.play('dino-run', true);

            if (this.ground.width < width) {
              this.ground.width += 17 * 2;
            }

            if (this.ground.width >= 1000) {
              this.ground.width = width;
              this.isGameRunning = true;
              this.dino.setVelocityX(0);
              this.scoreText.setAlpha(0); // remove cloud
              startEvent.remove();
            }
          },
        });
      },
      null,
      this
    );
  }

  initAnims() {
    this.anims.create({
      key: 'dino-run',
      frames: this.anims.generateFrameNumbers('jug_run', { start: 0, end: 6 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'dino-down-anim',
      frames: this.anims.generateFrameNumbers('jug_duck', { start: 0, end: 6 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  handleScore() {
    this.time.addEvent({
      delay: 1000 / 10,
      loop: true,
      callbackScope: this,
      callback: () => {
        if (!this.isGameRunning) {
          return;
        }

        this.score++;
        this.gameSpeed += 0.01;

        if (this.score % 100 === 0) {
          this.reachSound.play();

          this.tweens.add({
            targets: this.scoreText,
            duration: 100,
            repeat: 3,
            alpha: 0,
            yoyo: true,
          });
        }

        const score = Array.from(String(this.score), Number);
        for (let i = 0; i < 5 - String(this.score).length; i++) {
          score.unshift(0);
        }

        this.scoreText.setText(score.join(''));
      },
    });
  }

  handleInputs() {
    this.restart.on('pointerdown', () => {
      this.dino.setVelocityY(0);
      this.dino.body.setSize(this.dino.width - 100, this.dino.height);
      this.physics.resume();
      this.obsticles.clear(true, true);
      this.isGameRunning = true;
      this.gameOverScreen.setAlpha(0);
      this.anims.resumeAll();
    });

    this.input.keyboard.on('keydown_SPACE', () => {
      if (!this.dino.body.onFloor() || this.dino.body.velocity.x > 0) {
        return;
      }

      this.jumpSound.play();
      this.isJump = true;
      this.dino.body.setSize(this.dino.width - 100, this.dino.height);
      this.dino.body.offset.y = 0;
      this.dino.setVelocityY(-2000);
      // this.dino.setTexture('jug_run', 0);
    });

    this.input.keyboard.on('keydown_DOWN', () => {
      if (!this.dino.body.onFloor() || !this.isGameRunning) {
        return;
      }
      this.dino.play('dino-down-anim', true);
      this.isJump = false;
      this.dino.body.height = 90;
      this.dino.body.offset.y = 24;
    });

    this.input.keyboard.on('keyup_DOWN', () => {
      if (this.score !== 0 && !this.isGameRunning) {
        return;
      }
      this.isJump = true;
      this.dino.body.setSize(this.dino.width - 100, this.dino.height);
      this.dino.body.offset.y = 0;
    });
  }

  jumpBtn() {
    console.log('jumpBtn');
    if (!this.dino.body.onFloor() || this.dino.body.velocity.x > 0) {
      return;
    }

    this.dino.play('dino-run', true);
    this.jumpSound.play();
    this.isJump = true;
    this.dino.body.setSize(this.dino.width - 100, this.dino.height);
    this.dino.body.offset.y = 0;
    this.dino.setVelocityY(-2000);
    // this.dino.setTexture('jug_run', 0);
  }

  //? duck down
  duckBtnDown() {
    if (!this.dino.body.onFloor() || !this.isGameRunning) {
      return;
    }
    this.isJump = false;
    this.dino.body.height = 100;
    this.dino.body.offset.y = 24;
    this.dino.play('dino-down-anim', true);
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      this.duckBtnUp();
    }, 250);
    // console.log('duckBtn down');
  }

  //? duck up
  duckBtnUp() {
    if (this.score !== 0 && !this.isGameRunning) {
      return;
    }
    this.dino.play('dino-run', true);
    this.dino.body.setSize(this.dino.width - 100, this.dino.height);
    this.dino.body.offset.y = 0;
    this.isJump = true;
  }

  placeObsticle() {
    const obsticleNum = Math.floor(Math.random() * 7) + 1;
    const distance = Phaser.Math.Between(600, 900);

    let obsticle;
    if (obsticleNum > 5) {
      console.log('flying dino');
      const enemyHeight = [80, 100];
      obsticle = this.obsticles.create(this.game.config.width + distance, this.game.config.height - enemyHeight[Math.floor(Math.random() * 2)], 'obsticle-4').setOrigin(0, 1);
      obsticle.body.height = obsticle.body.height / 1.5;
      obsticle.setScale(0.1);
    } else {
      obsticle = this.obsticles.create(this.game.config.width + distance, this.game.config.height - 10, 'obsticle-1').setOrigin(0, 1);
      // obsticle.body.offset.y = +10;
      obsticle.setScale(0.1);
      // obsticle.setImmovable();
    }

    obsticle.setImmovable();
  }

  update(time, delta) {
    if (!this.isGameRunning) {
      return;
    }
    backgroundTile.tilePositionX += 0.75;
    this.ground.tilePositionX += this.gameSpeed;
    Phaser.Actions.IncX(this.obsticles.getChildren(), -this.gameSpeed);
    Phaser.Actions.IncX(this.environment.getChildren(), -0.5);

    this.respawnTime += delta * this.gameSpeed * 0.08;
    if (this.respawnTime >= 1500) {
      this.placeObsticle();
      this.respawnTime = 0;
    }

    this.obsticles.getChildren().forEach((obsticle) => {
      if (obsticle.getBounds().right < 0) {
        this.obsticles.killAndHide(obsticle);
      }
    });

    this.environment.getChildren().forEach((env) => {
      if (env.getBounds().right < 0) {
        env.x = this.game.config.width + 30;
      }
    });

    if (this.dino.body.deltaAbsY() > 0) {
      this.dino.anims.stop();
      // this.dino.setTexture('dino', 0);
    } else {
      // this.isJump === false ? this.dino.play('dino-down-anim', true) : this.dino.play('dino-run', true);
      if (!this.isJump) {
        console.log('dino down animation');
        this.dino.play('dino-down-anim', true);
      } else {
        this.dino.play('dino-run', true);
      }
    }
  }
}

export default PlayScene;
