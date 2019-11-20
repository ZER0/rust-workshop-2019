const { now } = Date;
const { PI, cos, sin } = Math;
const { mat4, vec3 } = glMatrix;

const VERTEX_SHADER_SOURCE = `
    uniform mat4 uModelViewMatrix;

    attribute vec3 aPosition;

    varying vec3 vColor;

    void main() {
        gl_Position = uModelViewMatrix * vec4(aPosition, 1.0);
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

let canvas = document.getElementById("canvas");
let gl = canvas.getContext("webgl");
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.enable(gl.DEPTH_TEST);
let program = linkProgram(
    compileShader(gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE),
    compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE),
);
let modelViewMatrixUniform = gl.getUniformLocation(program, "uModelViewMatrix");
let positionAttribute = gl.getAttribLocation(program, "aPosition");
let vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
let vertices = [];
generateSierpinsky(
    vec3.fromValues(0.0, 1.0, 0.0),
    vec3.fromValues(cos(0 / 3 * PI), -1.0, sin(0 / 3 * PI)),
    vec3.fromValues(cos(2 / 3 * PI), -1.0, sin(2 / 3 * PI)),
    vec3.fromValues(cos(4 / 3 * PI), -1.0, sin(4 / 3 * PI)),
    8,
    vertices,
);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
gl.bindBuffer(gl.ARRAY_BUFFER, null);
let previousTime = now();
let modelViewMatrix = mat4.create();
requestAnimationFrame(renderFrame);

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

function renderFrame() {
    let currentTime = now();
    let deltaTime = currentTime - previousTime;
    previousTime = currentTime;
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    mat4.rotate(
        modelViewMatrix,
        modelViewMatrix,
        deltaTime / 1000.0,
        vec3.fromValues(0.0, 1.0, 0.0)
    );
    gl.uniformMatrix4fv(modelViewMatrixUniform, false, modelViewMatrix);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.enableVertexAttribArray(positionAttribute);
    gl.vertexAttribPointer(positionAttribute, 3, gl.FLOAT, gl.FALSE, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.useProgram(null);
    requestAnimationFrame(renderFrame);
}

function generateSierpinsky(p0, p1, p2, p3, level, vertices) {
    if (level == 0) {
        generateTriangle(p0, p1, p2, vertices);
        generateTriangle(p0, p2, p3, vertices);
        generateTriangle(p0, p3, p1, vertices);
        generateTriangle(p1, p2, p3, vertices);
    } else {
        let p01 = vec3.lerp(vec3.create(), p0, p1, 0.5);
        let p02 = vec3.lerp(vec3.create(), p0, p2, 0.5);
        let p03 = vec3.lerp(vec3.create(), p0, p3, 0.5);
        let p12 = vec3.lerp(vec3.create(), p1, p2, 0.5);
        let p23 = vec3.lerp(vec3.create(), p2, p3, 0.5);
        let p31 = vec3.lerp(vec3.create(), p3, p1, 0.5);
        generateSierpinsky(p0, p01, p02, p03, level - 1, vertices);
        generateSierpinsky(p01, p31, p1, p12, level - 1, vertices);
        generateSierpinsky(p02, p12, p2, p23, level - 1, vertices);
        generateSierpinsky(p03, p23, p3, p31, level - 1, vertices);
    }
}

function generateTriangle(p0, p1, p2, vertices) {
    vertices.push(p0[0], p0[1], p0[2]);
    vertices.push(p1[0], p1[1], p1[2]);
    vertices.push(p2[0], p2[1], p2[2]);
}