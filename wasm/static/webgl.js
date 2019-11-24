const VERTEX_SHADER_SOURCE = `
    attribute vec3 aPosition;

    varying vec3 vColor;

    void main() {
	gl_Position = vec4(aPosition, 1.0);
	vColor = aPosition * 0.5 + 0.5;
    }
`;

const FRAGMENT_SHADER_SOURCE = `
    precision highp float;

    varying vec3 vColor;

    void main() {
	gl_FragColor = vec4(vColor, 1.0);
    }
`;

export function init(gl, vertices) {
  function renderVertices() {
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.enableVertexAttribArray(positionAttribute);
      gl.vertexAttribPointer(positionAttribute, 3, gl.FLOAT, gl.FALSE, 0, 0);
      gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.useProgram(null);
  }

  function linkProgram(vertexShader, fragmentShader) {
      let program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
	  throw new Error(gl.getProgramInfoLog(program));
      }
      return program;
  }

  function compileShader(type, source) {
      let shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
	  throw new Error(gl.getShaderInfoLog(shader));
      }
      return shader;
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  let program = linkProgram(
      compileShader(gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE),
      compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE),
  );
  let positionAttribute = gl.getAttribLocation(program, "aPosition");
  let vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  return { renderVertices };
}
