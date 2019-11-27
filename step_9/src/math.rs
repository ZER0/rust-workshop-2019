use std::ops::Index;

#[derive(Clone, Copy, Debug)]
pub struct Mat4([f32; 16]);

impl Mat4 {
  #[rustfmt::skip]
  pub fn new() -> Mat4 {
      Mat4([
          1.0, 0.0, 0.0, 0.0,
          0.0, 1.0, 0.0, 0.0,
          0.0, 0.0, 1.0, 0.0,
          0.0, 0.0, 0.0, 1.0,
      ])
  }

  #[inline]
  pub fn as_ptr(&self) -> *const f32 {
    self.0.as_ptr()
  }

  pub fn rotate(self, a: &Mat4, rad: f32, axis: &[f32; 3]) -> Mat4 {
    let mut out = self.0;

    let mut x = axis[0];
    let mut y = axis[1];
    let mut z = axis[2];

    let mut len = x.hypot(y).hypot(z);

    assert!(len != 0.0);

    len = 1.0 / len;
    x *= len;
    y *= len;
    z *= len;

    let s = rad.sin();
    let c = rad.cos();
    let t = 1.0 - c;

    let a00 = a[0];
    let a01 = a[1];
    let a02 = a[2];
    let a03 = a[3];
    let a10 = a[4];
    let a11 = a[5];
    let a12 = a[6];
    let a13 = a[7];
    let a20 = a[8];
    let a21 = a[9];
    let a22 = a[10];
    let a23 = a[11];

    let b00 = x * x * t + c;
    let b01 = y * x * t + z * s;
    let b02 = z * x * t - y * s;
    let b10 = x * y * t - z * s;
    let b11 = y * y * t + c;
    let b12 = z * y * t + x * s;
    let b20 = x * z * t + y * s;
    let b21 = y * z * t - x * s;
    let b22 = z * z * t + c;

    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;

    //if a != out {
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    //}

    Mat4(out)
  }
}

impl Index<usize> for Mat4 {
  type Output = f32;

  fn index(&self, index: usize) -> &Self::Output {
    &self.0[index]
  }
}
