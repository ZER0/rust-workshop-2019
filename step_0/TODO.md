# Step 0

* In `/Cargo.toml`, add `step_0` to `workspace.members`.

* In `/step_0/`, run the following command:
  
      cargo init --lib

* In `/step_0/Cargo.toml`, change `package.name` to `step_0_wasm`.
  
* In `/step_0/Cargo.toml`, add the following lines:

      [lib]
      crate_type = ["cdylib"]

* In `/step_0/static`, create the following new files:

  * `wasm.js`