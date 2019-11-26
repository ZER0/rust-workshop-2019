# Step 1

* In `/src/lib.rs`, add the following lines:
  
      #![allow(dead_code)]

      extern "C" {
          fn alert(level: u32);
      }

      #[no_mangle]
      extern "C" fn sierpinski(level: u32) {
          unsafe {
              alert(level);
          }
      }

* In `/static/wasm.js`, add the following lines:

      export async function init(url) {
        let response = await fetch(url);
        let buffer = await response.arrayBuffer();
        let result = await WebAssembly.instantiate(buffer, {
            env: { alert }
        });
        return result.instance.exports;
      }

* In `/static/main.js`, add the following line:

      import { init as initWasm } from "./wasm.js";

* In `/static/main.js`:

  * Replace the following lines:

        export async function main() {
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
        }

  * With:

        export async function main() {
          let { sierpinski: sierpinskiWasm } = await initWasm("/rust_workshop/target/wasm32-unknown-unknown/release/step_1_wasm.wasm"
          );
          sierpinskiWasm(8);
        }