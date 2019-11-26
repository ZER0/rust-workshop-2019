import { init as initWasm } from "./wasm.js";
import { init as initWebgl } from "./webgl.js";
import { sierpinski as sierpinskiJs } from "./sierpinski.js";

export async function main() {
  let { sierpinski: sierpinskiWasm } = await initWasm(
    "/rust_workshop/target/wasm32-unknown-unknown/release/step_2_wasm.wasm"
  );
  sierpinskiWasm(8);
  /*
  let now = Date.now();
  let vertices = sierpinskiJs(8);
  console.log(Date.now() - now);
  let canvas = document.getElementById("canvas");
  let gl = canvas.getContext("webgl");
  let { render } = initWebgl(gl, vertices);
  requestAnimationFrame(function frame() {
    render();
    requestAnimationFrame(frame);
  });
  */
}

main();
