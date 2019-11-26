export async function init(url) {
  let decoder = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });
  let response = await fetch(url);
  let buffer = await response.arrayBuffer();
  let result = await WebAssembly.instantiate(buffer, {
    env: { alert }
  });
  let { exports } = result.instance;
  return { sierpinski: exports.sierpinski };
}
