use crate::sierpinski;

extern "C" {
    pub fn alert(level: u32);
}

#[no_mangle]
pub extern "C" fn sierpinski(level: u32) {
    sierpinski::sierpinski(level);
}
