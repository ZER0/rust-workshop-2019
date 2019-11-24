use crate::sierpinski;
use std::mem;

macro_rules! println {
    ($($arg:tt)*) => ({
        let string = std::format_args!($($arg)*).to_string();
        #[allow(unused_unsafe)]
        unsafe {
            $crate::wasm::console_log(string.as_ptr() as u32, string.len() as u32)
        };
    })
}

extern "C" {
    fn console_log(data: u32, len: u32);
}

#[no_mangle]
pub extern "C" fn sierpinski(level: u32) -> u32 {
    unsafe { vec_f32_into_js(sierpinski::sierpinski(level)) }
}

#[no_mangle]
pub unsafe extern "C" fn free_vec_f32(raw_parts: u32) {
    let [ptr, length, capacity] = *Box::from_raw(raw_parts as *mut [u32; 3]);
    Vec::from_raw_parts(ptr as *mut f32, length as usize, capacity as usize);
}

unsafe fn vec_f32_into_js(mut vec: Vec<f32>) -> u32 {
    let raw_parts = Box::new([
        vec.as_mut_ptr() as u32,
        vec.len() as u32,
        vec.capacity() as u32,
    ]);
    mem::forget(vec);
    Box::into_raw(raw_parts) as u32
}
