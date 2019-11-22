export async function init(url) {
  function generateVertices() {
    let resultPtr = 8;
    exports.generate_vertices(resultPtr);
    let int32Memory = new Int32Array(exports.memory.buffer);
    let data = int32Memory[resultPtr / 4 + 0];
    let len = int32Memory[resultPtr / 4 + 1];
    let float32Memory = new Float32Array(exports.memory.buffer);
    let result = float32Memory.subarray(data / 4, data / 4 + len).slice();
    free(data, len);
    return result;
  }

  let response = await fetch(url);
  let buffer = await response.arrayBuffer();
  let result = await WebAssembly.instantiate(buffer, {});
  let { exports } = result.instance;
  return { generateVertices };
}
