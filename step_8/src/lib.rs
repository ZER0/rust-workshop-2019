#![allow(dead_code)]

#[macro_use]
mod macros;

mod math;
mod sierpinski;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[allow(dead_code)]
    #[wasm_bindgen(js_namespace = console)]
    pub fn log(s: &str);
}

#[wasm_bindgen]
pub extern "C" fn sierpinski(level: u32) -> Vec<f32> {
    sierpinski::sierpinski(level)
}
