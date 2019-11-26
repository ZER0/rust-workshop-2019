use crate::wasm;

pub fn sierpinski(level: u32) {
    unsafe { wasm::alert(level); }
}