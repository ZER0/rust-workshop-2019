import { init as initWasm } from "./wasm.js";
import { init as initWebgl } from "./webgl.js";
// import { sierpinski as sierpinskiJs } from "./sierpinski.js";

export async function main() {
  let { sierpinski: sierpinskiWasm } = await initWasm(
    "/rust_workshop/target/wasm32-unknown-unknown/release/step_5_wasm.wasm"
  );
  console.log(sierpinskiWasm(8));
}

main();
