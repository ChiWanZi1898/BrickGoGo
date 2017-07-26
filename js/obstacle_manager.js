/**
 * Created by aglax2357 on 2017/7/25.
 */

/**
 * control the action of obstacles.
 * @param game
 * @constructor
 */
ObstacleManager = function (game) {
  this.game = game;

  /**
   * the current number of obstacles.
   * @type {number}
   */
  this.count = 0;

  this.obstacleList = [];

  /**
   * the interval of creating a new obstacle.
   * @type {number}
   */
  this.interval = 1000.0;
  this.remainTime = this.interval;

  /**
   * whether this manager is creating obstacles or not.
   * @type {boolean}
   */
  this.running = false;

  /**
   * the choice of obstacle type.
   * @type {number}
   */
  this.choice = 0;

  var _this = this;
  this.game.scene.registerBeforeRender(function () {
    /**
     * create a new obstacle, when the timer countdown to 0
     */
    if (_this.running === false)
      return;
    _this.remainTime -= _this.game.engine.getDeltaTime();
    _this.scoreRemainTime -= _this.game.engine.getDeltaTime();
    if (_this.remainTime <= 0 && _this.game.state === 1) {
      _this.remainTime = _this.interval;
      _this.createObstacle();

    }

    /**
     * check if the brick has passed a obstacle.
     */
    for (var i = 0; i < _this.obstacleList.length; i++) {
      if (_this.obstacleList[i].isPassed === false) {
        if (_this.obstacleList[i].meshList[0].position.x > 4.5) {
          _this.game.score++;
          _this.obstacleList[i].isPassed = true;
          document.getElementById("score").innerHTML = _this.game.score;

        }
      }
      if (_this.obstacleList[i].isActive !== true) {
        _this.obstacleList[i].remove();
        _this.obstacleList = _this.obstacleList.slice(1, _this.obstacleList.length);

      }
    }


  });
};

ObstacleManager.prototype.constructor = ObstacleManager;


/**
 * reset the status of this manager.
 */
ObstacleManager.prototype.reset = function () {
  this.count = 0;

  this.obstacleList = [];

  this.interval = 1000.0;
  this.remainTime = this.interval;

  this.running = false;
};


/**
 * create a new obstacle.
 */
ObstacleManager.prototype.createObstacle = function () {

  this.choice = Math.floor(Math.random() * 11);
  var obstacle = new Obstacle(this.game, this.choice, this.count);

  this.obstacleList.push(obstacle);
  this.count++;
};


/**
 * clean up a obstacle.
 */
ObstacleManager.prototype.cleanUp = function () {
  this.obstacleList.forEach(function (obstacle) {
    obstacle.remove();
  });
};


/**
 * pause all obstacles' movements.
 */
ObstacleManager.prototype.pauseAll = function () {
  this.obstacleList.forEach(function (obstacle) {
    obstacle.pause();
  })

};


/**
 * start creating.
 */
ObstacleManager.prototype.run = function () {
  this.running = true;
};
