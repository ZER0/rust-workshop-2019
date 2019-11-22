export async function init(url, imports) {
  let response = await fetch(url);
  let buffer = await response.arrayBuffer();
  let result = await WebAssembly.instantiate(buffer, {
      env: imports
  });
  return result.instance.exports;
}
