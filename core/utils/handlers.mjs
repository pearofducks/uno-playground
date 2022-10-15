export function createValueHandler(handlers) {
  const handler = function(str) {
    const s = this.__options?.sequence || [];
    this.__options.sequence = [];
    for (const n of s) {
      const res = handlers[n](str);
      if (res != null)
        return res;
    }
  };
  function addProcessor(that, name) {
    if (!that.__options) {
      that.__options = {
        sequence: []
      };
    }
    that.__options.sequence.push(name);
    return that;
  }
  for (const name of Object.keys(handlers)) {
    Object.defineProperty(handler, name, {
      enumerable: true,
      get() {
        return addProcessor(this, name);
      }
    });
  }
  return handler;
}
