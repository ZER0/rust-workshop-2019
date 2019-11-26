mod math;
mod render_gl;

use math::Mat4;

fn main() {
    let sdl = sdl2::init().unwrap();
    let video_subsystem = sdl.video().unwrap();

    let gl_attr = video_subsystem.gl_attr();

    gl_attr.set_context_profile(sdl2::video::GLProfile::Core);
    gl_attr.set_context_version(4, 1);

    let window = video_subsystem
        .window("OpenGL", 512, 512)
        .opengl()
        .resizable()
        .build()
        .unwrap();

    let _gl_context = window.gl_create_context().unwrap();
    let _gl =
        gl::load_with(|s| video_subsystem.gl_get_proc_address(s) as *const std::os::raw::c_void);

    // set up shader program

    use std::ffi::CString;
    let vert_shader =
        render_gl::Shader::from_vert_source(&CString::new(include_str!("triangle.vert")).unwrap())
            .unwrap();

    let frag_shader =
        render_gl::Shader::from_frag_source(&CString::new(include_str!("triangle.frag")).unwrap())
            .unwrap();

    let shader_program = render_gl::Program::from_shaders(&[vert_shader, frag_shader]).unwrap();

    // set up vertex buffer object
    let vertices: Vec<f32> = step_7_wasm::sierpinski(8);
    let mut model_view_matrix = Mat4::new();

    let mut vbo: gl::types::GLuint = 0;
    unsafe {
        gl::GenBuffers(1, &mut vbo);
    }

    unsafe {
        gl::BindBuffer(gl::ARRAY_BUFFER, vbo);
        gl::BufferData(
            gl::ARRAY_BUFFER,                                                       // target
            (vertices.len() * std::mem::size_of::<f32>()) as gl::types::GLsizeiptr, // size of data in bytes
            vertices.as_ptr() as *const gl::types::GLvoid, // pointer to data
            gl::STATIC_DRAW,                               // usage
        );
        gl::BindBuffer(gl::ARRAY_BUFFER, 0);
    }

    // set up vertex array object

    let mut vao: gl::types::GLuint = 0;
    unsafe {
        gl::GenVertexArrays(1, &mut vao);
    }

    unsafe {
        gl::BindVertexArray(vao);
        gl::BindBuffer(gl::ARRAY_BUFFER, vbo);
        gl::EnableVertexAttribArray(0); // this is "layout (location = 0)" in vertex shader
        gl::VertexAttribPointer(
            0,                     // index of the generic vertex attribute ("layout (location = 0)")
            3,                     // the number of components per generic vertex attribute
            gl::FLOAT,             // data type
            gl::FALSE,             // normalized (int-to-float conversion)
            0 as gl::types::GLint, // stride (byte offset between consecutive attributes)
            std::ptr::null(),      // offset of the first component
        );
        gl::BindBuffer(gl::ARRAY_BUFFER, 0);
        gl::BindVertexArray(0);
    }

    // set up shared state for window
    unsafe {
        gl::ClearColor(0.0, 0.0, 0.0, 1.0);
    }

    // main loop
    let mut timer = sdl.timer().unwrap();
    let mut event_pump = sdl.event_pump().unwrap();
    let mut last_ticks = timer.ticks();
    'main: loop {
        for event in event_pump.poll_iter() {
            match event {
                sdl2::event::Event::Quit { .. } => break 'main,
                _ => {}
            }
        }
        unsafe {
            gl::Clear(gl::COLOR_BUFFER_BIT);
        }
        let ticks = timer.ticks();
        let delta = ticks - last_ticks;
        last_ticks = ticks;
        model_view_matrix = model_view_matrix.rotate(
            &model_view_matrix,
            (delta as f32 * 0.2 * std::f32::consts::PI) / 1000.0,
            &[1.0, 2.0, 3.0],
        );

        // draw triangle

        shader_program.set_used();
        let model_view_matrix_uniform;
        unsafe {
            model_view_matrix_uniform = gl::GetUniformLocation(
                shader_program.id(),
                "uModelViewMatrix\0".as_ptr() as *const _,
            );
            gl::UniformMatrix4fv(
                model_view_matrix_uniform,
                1,
                gl::FALSE,
                model_view_matrix.as_ptr() as *const _,
            );
        }
        unsafe {
            gl::BindVertexArray(vao);
            gl::DrawArrays(
                gl::TRIANGLES,             // mode
                0,                         // starting index in the enabled arrays
                vertices.len() as i32 / 3, // number of indices to be rendered
            );
        }
        window.gl_swap_window();
    }
}
