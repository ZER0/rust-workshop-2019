import * as wasm from "./wasm.js";
import * as webgl from "./webgl.js";

export async function main() {
  let { generateVertices } = await wasm.init(
    "../target/wasm32-unknown-unknown/debug/wasm.wasm"
  );
  let canvas = document.getElementById("canvas");
  let gl = canvas.getContext("webgl");
  let { renderVertices } = webgl.init(gl, generateVertices());
  requestAnimationFrame(function renderFrame() {
    renderVertices();
    requestAnimationFrame(renderFrame);
  });
}

main();
