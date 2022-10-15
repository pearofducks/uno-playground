export class TwoKeyMap {
  constructor() {
    this._map = /* @__PURE__ */ new Map();
  }
  get(key1, key2) {
    const m2 = this._map.get(key1);
    if (m2)
      return m2.get(key2);
  }
  getFallback(key1, key2, fallback) {
    let m2 = this._map.get(key1);
    if (!m2) {
      m2 = /* @__PURE__ */ new Map();
      this._map.set(key1, m2);
    }
    if (!m2.has(key2))
      m2.set(key2, fallback);
    return m2.get(key2);
  }
  set(key1, key2, value) {
    let m2 = this._map.get(key1);
    if (!m2) {
      m2 = /* @__PURE__ */ new Map();
      this._map.set(key1, m2);
    }
    m2.set(key2, value);
    return this;
  }
  has(key1, key2) {
    return this._map.get(key1)?.has(key2);
  }
  delete(key1, key2) {
    return this._map.get(key1)?.delete(key2) || false;
  }
  deleteTop(key1) {
    return this._map.delete(key1);
  }
  map(fn) {
    return Array.from(this._map.entries()).flatMap(
      ([k1, m2]) => Array.from(m2.entries()).map(([k2, v]) => {
        return fn(v, k1, k2);
      })
    );
  }
}
export class BetterMap extends Map {
  map(mapFn) {
    const result = [];
    this.forEach((v, k) => {
      result.push(mapFn(v, k));
    });
    return result;
  }
}
