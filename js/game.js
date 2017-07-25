/**
 * Created by aglax2357 on 2017/7/23.
 */

/**
 *
 * @param scene Babylon.js scene
 * @param engine Babylon.js engine
 * @constructor Game
 */
Game = function (scene, engine) {

  this.scene = scene;

  this.engine = engine;

  /**
   * the speed of all animation in this game
   * @type {number}
   */
  this.speed = 1;

  var background = new BABYLON.Layer("background", null, scene);
  background.texture = new BABYLON.DynamicTexture("dynamic texture", 512, scene, true);
  var textureContext = background.texture.getContext();
  var size = background.texture.getSize();

  textureContext.clearRect(0, 0, size.width, size.height);

  var gradient = textureContext.createLinearGradient(0, 0, 0, 512);
  gradient.addColorStop(0, "#28a3b3");
  gradient.addColorStop(0.8, "#39d3d1");

  textureContext.fillStyle = gradient;
  textureContext.fillRect(0, 0, 512, 512);
  background.texture.update();

  /**
   * keep the state of this game.
   * (0: welcome scene, -1: initializing game scene, 1: game scene,
   *  -2: cleaning game scene, 2: game over scene.)
   * @type {number}
   */
  this.state = 0;

  /**
   * keep the score of player.
   * @type {number}
   */
  this.score = 0;

  /**
   * manager the creation, the movement and the removal
   * of all the obstacles.
   * @type {ObstacleManager}
   */
  this.obstacleManager = new ObstacleManager(this);

  var _this = this;
  this.scene.registerBeforeRender(function () {

    /**
     * set up game scene.
     */
    if (_this.state === -1) {
      _this.removeStartScene();
      _this.createGameScene();
      _this.gameStartAnimation();
      _this.state = 1;
    }

    /**
     * set up game over scene.
     */
    else if (_this.state === -2) {
      _this.createGameOverScene();

      _this.state = 2;
    }
  });

  document.addEventListener('keydown', function (event) {
    _this.handleEvent(event);
  }, false);

  this.createStartScene();

};

Game.prototype.handleEvent = function (event) {

  /**
   * go to the game scene.
   */
  if (this.state === 0) {
    switch (event.keyCode) {
      case 32:
        this.state = -1;
        break;
    }
  }
  else if (this.state === 1) {
    switch (event.keyCode) {
      case 83:
        this.brick.swap();
        break;
      case 32:
        this.brick.jump();
        break;
    }
  }

  /**
   * restart.
   */
  else if (this.state === 2) {
    switch (event.keyCode) {
      case 32:
        this.removeGameScene();
        this.createStartScene();
        this.state = 0;
        break;
    }
  }


};


Game.prototype.constructor = Game;


/**
 * create start(welcome) scene.
 */
Game.prototype.createStartScene = function () {
  this.scene.activeCamera.radius = 4;
  this.brick = new Brick(this);
  this.state = 0;
  document.getElementById("welcome").style.visibility = "visible";
};


/**
 * create game scene.
 */
Game.prototype.createGameScene = function () {
  this.state = 1;
  this.score = 0;
  this.obstacleManager.run();
  this.cloud = new Cloud(this);
  this.cloud_2 = new Cloud(this, 960, 0, 4, 10);

  document.getElementById("score").innerHTML = "SCORE: " + this.score;
};


/**
 * create game over scene.
 */
Game.prototype.createGameOverScene = function () {
  this.cloud.pause();
  this.cloud_2.pause();
  this.obstacleManager.pauseAll();
  document.getElementById("gameover").style.visibility = "visible";
};


/**
 * remove start scene.
 */
Game.prototype.removeStartScene = function () {
  document.getElementById("welcome").style.visibility = "hidden";
};


/**
 * clean up game scene.
 */
Game.prototype.removeGameScene = function () {

  this.state = 0;
  this.obstacleManager.cleanUp();
  this.obstacleManager.reset();
  this.cloud.remove();
  this.cloud_2.remove();
  this.brick.remove();
  document.getElementById("gameover").style.visibility = "hidden";
  document.getElementById("score").innerHTML = "";
};


/**
 * set up the animation of starting game.
 */
Game.prototype.gameStartAnimation = function(){

  var animation = new BABYLON.Animation("animation",
    "activeCamera.radius",
    30,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  var keys = [];
  keys.push({frame: 0, value: 4});
  keys.push({frame: 120, value: 50});
  animation.setKeys(keys);
  console.info("move like jager")
  this.scene.beginDirectAnimation(this.scene, [animation], 0, 120, false, 4);
  console.info("move like jager")
};
