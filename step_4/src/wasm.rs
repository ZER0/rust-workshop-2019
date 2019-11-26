use crate::sierpinski;
use std::mem;

extern "C" {
    pub fn console_log(data: u32, len: u32);
}

#[no_mangle]
pub extern "C" fn sierpinski(level: u32) {
    sierpinski::sierpinski(level);
}
