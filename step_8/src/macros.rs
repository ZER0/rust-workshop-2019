#[cfg(target_arch = "wasm32")]
#[allow(unused_macros)]
macro_rules! println {
    ($($arg:tt)*) => ({
        let string = std::format_args!($($arg)*).to_string();
        #[allow(unused_unsafe)]
        unsafe {
            $crate::log(&string)
        };
    })
}
