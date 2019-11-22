import * as webgl from "./webgl.js";

let canvas = document.getElementById("canvas");
let gl = canvas.getContext("webgl");
let vertices = [
    -0.5, -0.5, 0.0,
     0.5, -0.5, 0.0,
    -0.5,  0.5, 0.0,
    -0.5,  0.5, 0.0,
     0.5, -0.5, 0.0,
     0.5,  0.5, 0.0,
];
let { render } = webgl.init(gl, vertices);
requestAnimationFrame(function renderFrame() {
  render();
  requestAnimationFrame(renderFrame);
});
