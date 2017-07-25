/**
 * Created by aglax2357 on 2017/7/25.
 */

/**
 * create the little brick
 * @param game
 * @constructor
 */
Brick = function (game) {

  this.game = game;

  this.scene = game.scene;

  this.upperPositionY = 4.5;
  this.lowerPositionY = 3.5;

  this.isMoving = false;

  var mesh = BABYLON.Mesh.CreateBox("brick", 1.0, this.scene);
  mesh.scaling = new BABYLON.Vector3(0.5, 0.25, 0.5);
  mesh.position.y = this.upperPositionY;

  var materialBox = new BABYLON.StandardMaterial("brick_texture", this.scene);
  materialBox.diffuseColor = new BABYLON.Color3(243 / 256, 150 / 256, 0 / 256);
  mesh.material = materialBox;

  mesh.actionManager = new BABYLON.ActionManager(this.scene);


  this.mesh = mesh;
};


Brick.prototype.constructor = Brick;


/**
 * the swap movement
 */
Brick.prototype.swap = function () {
  //console.log("swap");
  if (this.isMoving === true)
    return;
  var offset = 1;
  if (this.mesh.position.y === this.upperPositionY) {
    offset = -1;
  }

  var animation = new BABYLON.Animation("animation",
    "position",
    30,
    BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  var keys = [];
  keys.push({frame: 0, value: this.mesh.position});
  keys.push({frame: 5, value: this.mesh.position.add(new BABYLON.Vector3(0, offset, 0))});
  animation.setKeys(keys);
  this.mesh.animations.push(animation);
  var _this = this;
  this.scene.beginAnimation(this.mesh, 0, 5, false, 4, function () {
    _this.isMoving = false;
  });
  _this.isMoving = true;

};


/**
 * the jump movement
 */
Brick.prototype.jump = function () {

  if (this.isMoving === true)
    return;
  var _this = this;
  var offset = function (x) {
    if (_this.mesh.position.y === _this.upperPositionY) {
      return -x * (x - 59) / 250;
    }
    else if (_this.mesh.position.y === _this.lowerPositionY)
      return x * (x - 59) / 250;
    else
      return 0;
  };
  var animation = new BABYLON.Animation("animation",
    "position",
    30,
    BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  var keys = [];
  for (let i = 0; i < 60; i++) {
    keys.push({frame: i, value: this.mesh.position.add(new BABYLON.Vector3(0, offset(i), 0))});
  }

  animation.setKeys(keys);
  this.mesh.animations.push(animation);
  this.scene.beginAnimation(this.mesh, 0, 60, false, 4, function () {
    _this.isMoving = false;
  });
  this.isMoving = true;
};


/**
 * remove the brick.
 */
Brick.prototype.remove = function () {
  this.mesh.dispose();
};
