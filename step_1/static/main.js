import { init as initWasm } from "./wasm.js";
import { init as initWebgl } from "./webgl.js";
import { sierpinski as sierpinskiJs } from "./sierpinski.js";

export async function main() {
  let { sierpinski: sierpinskiWasm } = await initWasm(
    "../target/wasm32-unknown-unknown/release/wasm.wasm"
  );
  let now = Date.now();
  let vertices = sierpinskiWasm(8);
  console.log(Date.now() - now);
  let canvas = document.getElementById("canvas");
  let gl = canvas.getContext("webgl");
  let { render } = initWebgl(gl, vertices);
  requestAnimationFrame(function frame() {
    render();
    requestAnimationFrame(frame);
  });
}

main();
