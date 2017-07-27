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

  engine.loadingUIBackgroundColor = "#39d3d1";

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
   * keep the best score
   * @type {number}
   */
  this.bestScore = 0;

  /**
   * the remain lives of the player.
   * @type {number}
   */
  this.lives = 3;

  this.isInvicible = false;
  this.invicibleCountdown = 1000;

  /**
   * manager the creation, the movement and the removal
   * of all the obstacles.
   * @type {ObstacleManager}
   */
  this.obstacleManager = new ObstacleManager(this);

  this.sound = new Sound(this);

  this.assetsManager = new BABYLON.AssetsManager(this.scene);
  this.loadResources();
  this.assetsManager.load();

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

    /**
     * rotate the camera
     */
    else if (_this.state === 0) {
      _this.scene.activeCamera.alpha += 0.002;
      if (_this.scene.activeCamera.alpha >= Math.PI * 2) {
        _this.scene.activeCamera.alpha -= Math.PI * 2;
      }
    }

    else if ( _this.state === 2) {
      _this.scene.activeCamera.alpha += 0.01;
      if (_this.scene.activeCamera.alpha >= Math.PI * 2) {
        _this.scene.activeCamera.alpha -= Math.PI * 2;
      }
    }

    else if (_this.state === 1) {
      if (_this.isInvicible === true) {
        _this.invicibleCountdown -= _this.engine.getDeltaTime();
        if (_this.invicibleCountdown <= 0) {
          _this.brick.mesh.material.diffuseColor = new BABYLON.Color3(243 / 256, 150 / 256, 0 / 256);
          _this.isInvicible = false;
          _this.invicibleCountdown = 1000;
        }
      }

      if (_this.lives <= 0) {
        _this.state = -2;
      }
    }

  });

  document.addEventListener('keydown', function (event) {
    _this.handleEvent(event);
  }, false);

  document.addEventListener('touchstart', function (event) {
    _this.touchStartX = event.changedTouches[0].clientX;
    _this.touchStartY = event.changedTouches[0].clientY;
  }, false);

  document.addEventListener('touchend', function (event) {
    _this.touchEndHandler(event);
  }, false);

  //this.createStartScene();

};


Game.prototype.constructor = Game;


Game.prototype.touchEndHandler = function (event) {

  if (this.state === 0) {
    console.info(Math.abs(event.changedTouches[0].clientX - this.touchStartX),
      Math.abs(event.changedTouches[0].clientY - this.touchStartY))
    if (Math.abs(event.changedTouches[0].clientX - this.touchStartX) < 10
        && Math.abs(event.changedTouches[0].clientY - this.touchStartY) < 10) {
      this.state = -1;
      }
  }

  else if (this.state === 1) {
    if (event.changedTouches[0].clientY < this.touchStartY) {
      if (this.brick.mesh.position.y > 4) {
        this.brick.jump();
      }
      else {
        this.brick.swap();
      }
    }
    else if (event.changedTouches[0].clientY > this.touchStartY) {
      if (this.brick.mesh.position.y > 4) {
        this.brick.swap();
      }
      else {
        this.brick.jump();
      }
    }
  }

  /**
   * restart.
   */
  else if (this.state === 2) {
    if (Math.abs(event.changedTouches[0].clientX - this.touchStartX) < 10
      && Math.abs(event.changedTouches[0].clientY - this.touchStartY) < 10) {
      this.removeGameScene();
      this.createStartScene();
      this.state = 0;
    }
  }
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


/**
 * create start(welcome) scene.
 */
Game.prototype.createStartScene = function () {
  this.scene.activeCamera.radius = 4;
  this.brick = new Brick(this);
  this.state = 0;
  document.getElementById("welcome").style.visibility = "visible";

  this.sound.start_music.play();
  this.sound.start_music.setVolume(1);

  document.getElementById("tutorial").innerHTML = "Press SPACE or TOUCH to Start";
};


/**
 * create game scene.
 */
Game.prototype.createGameScene = function () {
  this.state = 1;
  this.score = 0;
  this.lives = 3;
  this.isInvicible = false;
  this.obstacleManager.run();
  this.cloud = new Cloud(this);
  this.cloud_2 = new Cloud(this, 960, 0, 4, 10);

  document.getElementById("score").innerHTML = this.score;
  $("img").attr("src", "pictures/heart.png");
  $("img").css("visibility", "visible");

  this.sound.game_music.play(2.1);

  document.getElementById("tutorial").innerHTML = "Press SPACE to Jump, Press S to Swap</br>Or Swipe to Move";
};


/**
 * create game over scene.
 */
Game.prototype.createGameOverScene = function () {
  this.cloud.pause();
  this.cloud_2.pause();
  this.obstacleManager.pauseAll();
  if(document.cookie.length > 0)
  {
    var n = document.cookie.indexOf("=");
    this.bestScore = decodeURI(document.cookie.substring(n + 1));
  }
  if(this.score > this.bestScore) {
    this.bestScore = this.score;
    document.cookie = "best=" + encodeURI(this.bestScore);
  }
  console.info(document.cookie)
  document.getElementById("gameover").innerHTML = "Valar Morghulis</br>"
                                                  + "Score: " + this.score
                                                  + " Best: " + this.bestScore;
  document.getElementById("gameover").style.visibility = "visible";

  $("img").css("visibility", "hidden");

  document.getElementById("score").innerHTML = "";

  this.sound.game_music.stop();

  document.getElementById("tutorial").innerHTML = "Press SPACE or TOUCH to Go Back";
};


/**
 * remove start scene.
 */
Game.prototype.removeStartScene = function () {
  document.getElementById("welcome").style.visibility = "hidden";

  this.sound.start_music.setVolume(0, 2);
  this.sound.start_music.stop(2.1);
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
  keys.push({frame: 120, value: 30});
  animation.setKeys(keys);

  var animationAlpha = new BABYLON.Animation("animation",
    "activeCamera.alpha",
    30,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  var keysAlpha = [];
  keysAlpha.push({frame: 0, value: this.scene.activeCamera.alpha});
  keysAlpha.push({frame: 120, value: 1});
  animationAlpha.setKeys(keysAlpha);

  this.scene.beginDirectAnimation(this.scene, [animation, animationAlpha], 0, 120, false, 4);
};


/**
 * load all the resources such as music.
 */
Game.prototype.loadResources = function () {
  var _this = this;
  var binaryTask = this.assetsManager.addBinaryFileTask("start_music task", "sounds/start_music.mp3");
  binaryTask.onSuccess = function (task) {
    _this.sound.start_music = new BABYLON.Sound("start_music", task.data, _this.scene, soundReady, { loop: true });
  };
  var binaryTask2 = this.assetsManager.addBinaryFileTask("game_music task", "sounds/game_music.mp3");
  binaryTask2.onSuccess = function (task) {
    _this.sound.game_music = new BABYLON.Sound("game_music", task.data, _this.scene, soundReady, { loop: true });
  };

  var readied = 0;
  function soundReady() {
    readied++;
    if(readied === 2) {
      _this.createStartScene();
    }
  }
};


Game.prototype.increaseLives = function () {

  if(this.lives < 3) {
    this.lives++;
    $("#image" + this.lives).attr("src", "pictures/heart.png");
  }
};


Game.prototype.decreaseLives = function () {
  $("#image" + this.lives).attr("src", "pictures/heart_grey.png");
  this.lives--;
};