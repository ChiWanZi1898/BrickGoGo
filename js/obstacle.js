/**
 * Created by aglax2357 on 2017/7/25.
 */

/**
 * create obstacle
 * @param game
 * @param type  the type of obstacle
 * @param id  the id of obstacle
 * @constructor
 */
Obstacle = function (game, type, id) {

  this.game = game;
  this.scene = game.scene;
  this.type = type;
  this.id = id;

  /**
   * whether the obstacle is still active,
   * if not, it will be removed.
   * @type {boolean}
   */
  this.isActive = true;

  /**
   * whether the little brick has passed the obstacle
   * @type {boolean}
   */
  this.isPassed = false;

  this.trackHeight = 0.25;
  this.trackWidth = 1;
  this.trackLength = 8;

  this.wallHeight = 1.5;
  this.wallHeightHigh = 4;
  this.wallWidth = 1;
  this.wallLength = 0.25;

  this.triggerHeight = 0.5;
  this.triggerWidth = 0.25;
  this.triggerLength = 0.25;

  /**
   * the original x position of the obstacle
   * @type {number}
   */
  this.positionX = -24;

  /**
   * the list of all the meshes in this obstacle,
   * such as the track, the walls and so on.
   * @type {Array}
   */
  this.meshList = [];

  /**
   * the list of animations for each mesh.
   * @type {Array}
   */
  this.animationList = [];

  /**
   * get the structure of the obstacle base on its type.
   */
  switch (this.type) {
    case 0:
      this.meshList.push(this.createBasicTrack());
      this.addAnimation(this.meshList[0]);
      this.meshList.push(this.createBasicWall(true, true, -3));
      this.addAnimationNormal(this.meshList[1]);
      break;
    case 1:
      this.meshList.push(this.createBasicTrack());
      this.addAnimation(this.meshList[0]);
      this.meshList.push(this.createBasicWall(true, false, -3));
      this.addAnimationNormal(this.meshList[1]);
      break;
    case 2:
      this.meshList.push(this.createBasicTrack());
      this.addAnimation(this.meshList[0]);
      this.meshList.push(this.createBasicWall(true, true, -3));
      this.addAnimationNormal(this.meshList[1]);
      this.meshList.push(this.createBasicWall(false, true, -3));
      this.addAnimationNormal(this.meshList[2]);
      break;
    case 3:
      this.meshList.push(this.createBasicTrack());
      this.addAnimation(this.meshList[0]);
      this.wallAbove = true;
      this.wallLow = true;
      this.wallPosition = -3;
      this.meshList.push(this.createBasicWall(true, true, -3));
      this.addAnimationNormal(this.meshList[1]);
      this.meshList.push(this.createBasicTrigger());
      this.addAnimationNormal(this.meshList[2]);
      break;
    case 4:
      this.meshList.push(this.createBasicTrack());
      this.addAnimation(this.meshList[0]);
      this.meshList.push(this.createBasicWall(true, true, -3));
      this.addAnimationUpAndDown(this.meshList[1]);
      break;
    case 5:
      this.meshList.push(this.createBasicTrack());
      this.addAnimation(this.meshList[0]);
      this.wallAbove = true;
      this.wallLow = false;
      this.wallPosition = -3;
      this.meshList.push(this.createBasicWall(true, false, -3));
      this.addAnimationNormal(this.meshList[1]);
      this.meshList.push(this.createBasicTrigger());
      this.addAnimationNormal(this.meshList[2]);
      break;
    case 6:
      this.meshList.push(this.createBasicTrack());
      this.addAnimation(this.meshList[0]);
      this.meshList.push(this.createBasicWall(true, false, 2));
      this.addAnimationNormal(this.meshList[1]);
      this.meshList.push(this.createBasicWall(false, false, -2));
      this.addAnimationNormal(this.meshList[2]);
      break;
    case 7:
      this.meshList.push(this.createBasicTrack());
      this.addAnimation(this.meshList[0]);
      this.meshList.push(this.createBasicWall(true, false, -3));
      this.addAnimationNormal(this.meshList[1]);
      this.meshList.push(this.createSwapTrigger());
      this.addAnimationNormal(this.meshList[2]);
      this.meshList.push(this.createBasicWall(false, true, 1));
      this.addAnimationNormal(this.meshList[3]);
      break;
    default:
      this.meshList.push(this.createBasicTrack());
      this.addAnimation(this.meshList[0]);
      this.meshList.push(this.createBasicWall(true, true, -3));
      this.addAnimationNormal(this.meshList[1]);
      break;
  }

};


Obstacle.prototype.constructor = Obstacle;


/**
 * create the track(long white block)
 */
Obstacle.prototype.createBasicTrack = function () {
  var mesh = BABYLON.Mesh.CreateBox("track_" + this.id, 1.0, this.scene);
  mesh.scaling = new BABYLON.Vector3(this.trackLength - 0.5, this.trackHeight, this.trackWidth);
  mesh.position.y = 0;
  mesh.position.x = this.positionX;

  var materialBox = new BABYLON.StandardMaterial("track_texture_" + this.id, this.scene);
  materialBox.diffuseColor = new BABYLON.Color3(228 / 256, 210 / 236, 215 / 256);
  mesh.material = materialBox;
  mesh.material.alpha = 0;

  //mesh.dispose();
  return mesh;
};


/**
 * create wall.
 * @param isAbove  whether it is above the track or not.
 * @param isLow  whether it is a low wall or not(then it is a high wall that the brick cannot jump over).
 * @param position
 */
Obstacle.prototype.createBasicWall = function (isAbove = true, isLow = true, position = 0) {

  var height = (isLow === true? this.wallHeight : this.wallHeightHigh);
  var mesh = BABYLON.Mesh.CreateBox("wall_" + this.id, 1.0, this.scene);
  mesh.scaling = new BABYLON.Vector3(this.wallLength, height, this.wallWidth);
  if(isAbove === true)
    mesh.position.y = height / 2 + this.trackHeight / 2;
  else
    mesh.position.y = - height / 2 - this.trackHeight / 2;

  mesh.position.x = this.positionX + position;

  var materialBox = new BABYLON.StandardMaterial("wall_texture_" + this.id, this.scene);
  materialBox.diffuseColor = new BABYLON.Color3(237 / 256, 25 / 236, 69 / 256);
  mesh.material = materialBox;
  mesh.material.alpha = 0;

  var _this = this;
  this.game.brick.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
    {trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: mesh},
    function () {
      console.info(_this.id);
      _this.game.state = -2;
    }));

  this.wall = mesh;

  return mesh;
};


/**
 * create a trigger, which the brick touch will trigger some walls flip.
 */
Obstacle.prototype.createBasicTrigger = function () {

  var mesh = BABYLON.Mesh.CreateBox("trigger_" + this.id, 1.0, this.scene);
  mesh.scaling = new BABYLON.Vector3(this.triggerLength, this.triggerHeight, this.triggerWidth);
  mesh.position.y = this.triggerHeight / 2 + this.trackHeight / 2;
  mesh.position.x = this.positionX + 3;


  var materialBox = new BABYLON.StandardMaterial("trigger_texture_" + this.id, this.scene);
  materialBox.diffuseColor = new BABYLON.Color3(93 / 256, 175 / 236, 70 / 256);
  mesh.material = materialBox;
  mesh.material.alpha = 0;

  var _this = this;
  this.game.brick.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
    {trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: mesh},
    function () {
      _this.meshList[1].dispose();
      _this.meshList[1] = _this.createBasicWall((_this.wallAbove + 1) % 2, _this.wallLow, _this.wallPosition);
      _this.addAnimationNormal(_this.meshList[1], _this.wallAnimation.currentFrame);
    }));

  return mesh;
};


/**
 * create a trigger, which the brick touch will trigger the swap movement of the brick.
 */
Obstacle.prototype.createSwapTrigger = function () {

  var mesh = BABYLON.Mesh.CreateBox("trigger_" + this.id, 1.0, this.scene);
  mesh.scaling = new BABYLON.Vector3(this.triggerLength, this.triggerHeight, this.triggerWidth);
  mesh.position.y = this.triggerHeight / 2 + this.trackHeight / 2;
  mesh.position.x = this.positionX + 3;

  var materialBox = new BABYLON.StandardMaterial("trigger_texture_" + this.id, this.scene);
  materialBox.diffuseColor = new BABYLON.Color3(255 / 256, 120 / 236, 0 / 256);
  mesh.material = materialBox;
  mesh.material.alpha = 0;

  var _this = this;
  this.game.brick.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
    {trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: mesh},
    function () {
      _this.game.brick.swap();
    }));

  return mesh;
};


/**
 * add animation for the mesh
 * @param mesh  which the animation add to.
 * @param start  the start time of its animation, must > 0.
 */
Obstacle.prototype.addAnimation = function (mesh, start = 0) {

  let animationP = new BABYLON.Animation("animationP",
    "position",
    30,
    BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
    BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
  var keysP = [];
  keysP.push({frame: 0, value: mesh.position});
  keysP.push({frame: 30, value: mesh.position.add(new BABYLON.Vector3(2, 4, 0))});
  keysP.push({frame: 570, value: mesh.position.add(new BABYLON.Vector3(5 * this.trackLength - 2, 4, 0))});
  keysP.push({frame: 600, value: mesh.position.add(new BABYLON.Vector3(5 * this.trackLength, 0, 0))});
  animationP.setKeys(keysP);

  var animationA = new BABYLON.Animation("animationA",
    "material.alpha",
    30,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
  this.wallAnimation = animationA;
  var keysA = [];
  keysA.push({frame: 0, value: 0});
  keysA.push({frame: 30, value: 1});
  keysA.push({frame: 570, value: 1});
  keysA.push({frame: 600, value: 0});
  animationA.setKeys(keysA);

  var _this = this;
  var anima = this.scene.beginDirectAnimation(mesh, [animationP, animationA], start, 600, false, 4, function () {
    if (_this.isActive === true)
      _this.isActive = false;
  });

  this.animationList.push(anima);

};

/**
 * add animation to the mesh. the mesh will move up and down with random period.
 * @param mesh
 * @param start
 */
Obstacle.prototype.addAnimationUpAndDown = function (mesh, start = 0) {

  var animationPX = new BABYLON.Animation("animationPX",
    "position.x",
    30,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
  var keysPX = [];
  keysPX.push({frame: 0, value: mesh.position.x});
  keysPX.push({frame: 30, value: mesh.position.x + 2});
  keysPX.push({frame: 570, value: mesh.position.x + 5 * this.trackLength - 2});
  keysPX.push({frame: 600, value: mesh.position.x + 5 * this.trackLength});
  animationPX.setKeys(keysPX);


  var animationPY = new BABYLON.Animation("animationPY",
    "position.y",
    30,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
  var keysPY = [];
  keysPY.push({frame: 0, value: mesh.position.y});
  keysPY.push({frame: 30, value: mesh.position.y + 4});
  var segs = Math.floor(Math.random() * 4) * 2 + 4;
  for (var i = 1; i < segs; i++) {
    keysPY.push({
      frame: 30 + 540 / segs * i,
      value: (i % 2 === 0 ? mesh.position.y + 4 : mesh.position.y - this.wallHeight - this.trackHeight + 4)
    })
  }
  keysPY.push({frame: 570, value: mesh.position.y + 4});
  keysPY.push({frame: 600, value: mesh.position.y});
  animationPY.setKeys(keysPY);

  var animationA = new BABYLON.Animation("animationA",
    "material.alpha",
    30,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
  var keysA = [];
  keysA.push({frame: 0, value: 0});
  keysA.push({frame: 30, value: 1});
  keysA.push({frame: 570, value: 1});
  keysA.push({frame: 600, value: 0});
  animationA.setKeys(keysA);

  var _this = this;
  var anima = this.scene.beginDirectAnimation(mesh, [animationPX, animationPY, animationA], start, 600, false, 4, function () {
    if (_this.isActive === true)
      _this.isActive = false;
  });

  this.animationList.push(anima);

};


/**
 * add normal animation to the mesh
 * @param mesh
 * @param start
 */
Obstacle.prototype.addAnimationNormal = function (mesh, start = 0) {

  let animationPX = new BABYLON.Animation("animationPX",
    "position.x",
    30,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
  var keysPX = [];
  keysPX.push({frame: 0, value: mesh.position.x});
  keysPX.push({frame: 30, value: mesh.position.x + 2});
  keysPX.push({frame: 570, value: mesh.position.x + 5 * this.trackLength - 2});
  keysPX.push({frame: 600, value: mesh.position.x + 5 * this.trackLength});
  animationPX.setKeys(keysPX);


  let animationPY = new BABYLON.Animation("animationPY",
    "position.y",
    30,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
  var keysPY = [];
  keysPY.push({frame: 0, value: mesh.position.y});
  keysPY.push({frame: 30, value: mesh.position.y + 4});
  keysPY.push({frame: 570, value: mesh.position.y + 4});
  keysPY.push({frame: 600, value: mesh.position.y});
  animationPY.setKeys(keysPY);

  let animationA = new BABYLON.Animation("animationA",
    "material.alpha",
    30,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
  var keysA = [];
  keysA.push({frame: 0, value: 0});
  keysA.push({frame: 30, value: 1});
  keysA.push({frame: 570, value: 1});
  keysA.push({frame: 600, value: 0});
  animationA.setKeys(keysA);

  var _this = this;
  let anima = this.scene.beginDirectAnimation(mesh, [animationPX, animationPY, animationA], start, 600, false, 4)

  this.animationList.push(anima);

};


/**
 * add the swap animation to the wall, this will happen will some triggers are activated.
 * @param mesh
 */
Obstacle.prototype.addAnimationSwap = function (mesh) {


  let animationPY = new BABYLON.Animation("animationPY",
    "position.y",
    30,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

  animationPY.enableBlending = true;
  animationPY.blendingSpeed = 0.1;

  var keysPY = [];
  keysPY.push({frame: 0, value: mesh.position.y - 1.75});
  keysPY.push({frame: 30, value: mesh.position.y + 4 - 1.75});
  keysPY.push({frame: 570, value: mesh.position.y + 4 - 1.75});
  keysPY.push({frame: 600, value: mesh.position.y - 1.75});
  animationPY.setKeys(keysPY);


  this.animationList.push(anima);

};


/**
 * pause all movement.
 */
Obstacle.prototype.pause = function () {

  this.animationList.forEach(function (animation) {
    animation.pause();
  })

};


/**
 * remove obstacle
 */
Obstacle.prototype.remove = function () {
  for (var i = 0; i < this.meshList.length; i++) {
    this.meshList[i].dispose();
    var material = this.scene.getMaterialByName("track_texture_" + this.id);
    if (material) {
      material.dispose();
    }
    material = this.scene.getMaterialByName("wall_texture_" + this.id);
    if (material) {

      material.dispose();
    }
  }
};