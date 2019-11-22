use std::slice;

#[no_mangle]
pub extern fn generate_vertices() -> Box<[f32]> {
    vec![
        -0.5, -0.5, 0.0,
         0.5, -0.5, 0.0,
        -0.5,  0.5, 0.0,
        -0.5,  0.5, 0.0,
         0.5, -0.5, 0.0,
         0.5,  0.5, 0.0,
    ].into_boxed_slice()
}

#[no_mangle]
pub unsafe extern fn free(data: *mut f32, len: usize) {
    Box::from_raw(slice::from_raw_parts_mut(data, len));
}
