# Step 2

* In the file `/step_2/src/lib.rs`:
  
  * Replace the following lines:

        extern "C" {
            fn alert(level: u32);
        }

        #[no_mangle]
        extern "C" fn sierpinski(level: u32) {
            unsafe {
                alert(level);
            }
        }

  * With:
  
        extern "C" {
            fn console_log(data: u32, len: u32);
        }

        #[no_mangle]
        extern "C" fn sierpinski(level: u32) {
            println!(
                "Generating Sierpinski tetrahedron with level {} in Rust",
                level
            );
        }

* In the file `/step_2/src/lib.rs`, add the following lines:

      #![macro_use]
      mod macros;

* In the file `/step_2/static/wasm.js`, in the function `main`, add the following lines:

      function consoleLog(data, len) {
        console.log(
          decoder.decode(new Uint8Array(exports.memory.buffer, data, len))
        );
      }

      let decoder = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });

* In the file `/step_2/static/wasm.js`:

  * Replace the following line:

        env: { alert }

  * With:

        env: { console_log: consoleLog }


* In the file `/step_2/static/wasm.js`:

  * Replace the following line:

        return result.instance.exports;

  * With:

        let { exports } = result.instance;
        return exports;