/**
 * Created by aglax2357 on 2017/7/25.
 */

/**
 * the cloud for decoration.
 * @param game
 * @param duration  the duration of the cloud
 * @param delay  the delay of the cloud
 * @param positionY  the original y(height) position of the cloud
 * @param positionZ  the original z position of the cloud
 * @constructor
 */
Cloud = function (game, duration = 1080, delay = 0, positionY = 8, positionZ = -5) {

  this.game = game;
  this.scene = game.scene;
  this.speed = game.speed;

  /**
   * the orginal x position of the cloud.
   * @type {number}
   */
  this.positionX = -40;

  this.positionY = positionY;
  this.positionZ = positionZ;

  this.duration = duration;

  /**
   * the list of small cloud(cubic) that make up for the big cloud.
   * @type {Array}
   */
  this.subCloudList = [];

  /**
   * the list of animations of small cloud.
   * @type {Array}
   */
  this.animationList = [];

  for (var i = 0; i < 25; i++) {
    this.subCloudList.push(this.generateSubCloud())
  }

};

Cloud.prototype.constructor = Cloud;


Cloud.prototype.generateSubCloud = function () {

  /**
   * create a box with random size.
   */
  var mesh = BABYLON.Mesh.CreateBox("cloud", 1.0, this.scene);
  mesh.scaling = new BABYLON.Vector3(this.nd() + 0.4, this.nd() + 0.3, this.nd() + 0.4);
  mesh.position.y = this.positionY + this.nd() * 2;
  mesh.position.x = this.positionX + this.nd() * 6;
  mesh.position.z = this.positionZ + this.nd();

  var materialBox = new BABYLON.StandardMaterial("cloud_texture", this.scene);
  materialBox.diffuseColor = new BABYLON.Color3(228 / 256, 210 / 236, 215 / 256);
  mesh.material = materialBox;
  mesh.material.alpha = 0;

  /**
   * add position transition to sub cloud
   */
  var animationP = new BABYLON.Animation("animationP",
    "position",
    30,
    BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
    BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
  var keysP = [];
  keysP.push({frame: 0, value: mesh.position});
  keysP.push({frame: this.duration, value: mesh.position.add(new BABYLON.Vector3(this.duration / 120 * 8, 0, 0))});
  //keysP.push({frame: 600, value: mesh.position.add(new BABYLON.Vector3(5 * this.trackLength, 0, 0))});
  animationP.setKeys(keysP);

  /**
   * add alpha(transparency) transition to sub cloud.
   */
  var animationA = new BABYLON.Animation("animationA",
    "material.alpha",
    30,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
  var keysA = [];
  keysA.push({frame: 0, value: 0});
  keysA.push({frame: 30, value: 0.7});
  keysA.push({frame: this.duration - 30, value: 0.7});
  keysA.push({frame: this.duration, value: 0});
  animationA.setKeys(keysA);

  let anima = this.scene.beginDirectAnimation(mesh, [animationP, animationA], 0, this.duration, true, 4);
  this.animationList.push(anima);


  return mesh;
};


/**
 * generate a random number that follows the Gaussian distribution.
 * @returns {number}
 */
Cloud.prototype.nd = function () {
  var u = 0, v = 0;
  while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  return Math.abs(Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v) / 4);
};


Cloud.prototype.remove = function () {
  this.subCloudList.forEach(function (mesh) {
    mesh.material.dispose();
    mesh.dispose();
  });
};


/**
 * stop all the sub clouds
 */
Cloud.prototype.pause = function () {
  this.animationList.forEach(function (animation) {
    animation.pause();
  })
};