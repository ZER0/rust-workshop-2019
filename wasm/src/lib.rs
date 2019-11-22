#[no_mangle]
pub extern fn generate_vertices() -> Box<[f32]> {
    vec![1.0, 2.0, 3.0].into_boxed_slice()
}
