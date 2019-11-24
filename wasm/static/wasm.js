export async function init(url) {
  function println(data, len) {
    let str = decoder.decode(
      new Uint8Array(wasm.memory.buffer, data, len)
    );
  }

  function generateVertices() {
    let raw_parts = exports.generate_vertices();
    let int32Memory = new Int32Array(exports.memory.buffer);
    let ptr = int32Memory[raw_parts / 4 + 0];
    let len = int32Memory[raw_parts / 4 + 1];
    let capacity = int32Memory[raw_parts / 4 + 1];
    let float32Memory = new Float32Array(exports.memory.buffer);
    let result = float32Memory.subarray(ptr / 4, ptr / 4 + len).slice();
    exports.free_vec_f32(raw_parts);
    return result;
  }

  let decoder = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });
  let response = await fetch(url);
  let buffer = await response.arrayBuffer();
  let result = await WebAssembly.instantiate(buffer, {});
  let { exports } = result.instance;
  return { generateVertices };
}
