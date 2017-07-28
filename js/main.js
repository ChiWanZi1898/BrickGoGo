/**
 * Created by aglax2357 on 2017/7/25.
 */


window.addEventListener('DOMContentLoaded', function () {
  var canvas = document.querySelector("#renderCanvas");
  var engine = new BABYLON.Engine(canvas, true);

  var createScene = function () {
    var scene = new BABYLON.Scene(engine);

    var camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 0.9, 4, new BABYLON.Vector3(0, 4.5, 0), scene);
    camera.attachControl(canvas, false);

    var light1 = new BABYLON.DirectionalLight("Dir0", new BABYLON.Vector3(-1, -1, 1), scene);
    light1.intensity = 0.8;
    var light2 = new BABYLON.DirectionalLight("Dir0", new BABYLON.Vector3(-1, -1, -1), scene);
    light2.intensity = 1;
    var light3 = new BABYLON.DirectionalLight("Dir0", new BABYLON.Vector3(-1, -0.4, -1), scene);
    light3.intensity = 0.5;
    var light4 = new BABYLON.DirectionalLight("Dir0", new BABYLON.Vector3(1, 0, 0), scene);
    light4.intensity = 0.3;

    new Game(scene, engine);

    return scene;
  };

  var scene = createScene();

  engine.runRenderLoop(function () {
    scene.render();
  });

  window.addEventListener("resize", function () {
    engine.resize();
  });

});

document.addEventListener('touchmove', function (event) {
  event.preventDefault();
}, false);