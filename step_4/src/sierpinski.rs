pub fn sierpinski(level: u32) -> Vec<f32> {
    println!("Generating sierpinski tetrahedron with level {} in Rust", level);
    return vec![
        -0.5, -0.5, 0.0,
        0.5, -0.5, 0.0,
        -0.5, 0.5, 0.0,
        -0.5, 0.5, 0.0,
        0.5, -0.5, 0.0,
        0.5, 0.5, 0.0,
    ];
}