import { isString } from "./basic.mjs";
export function normalizeCSSEntries(obj) {
  if (isString(obj))
    return obj;
  return (!Array.isArray(obj) ? Object.entries(obj) : obj).filter((i) => i[1] != null);
}
export function normalizeCSSValues(obj) {
  if (Array.isArray(obj)) {
    if (obj.find((i) => !Array.isArray(i) || Array.isArray(i[0])))
      return obj.map((i) => normalizeCSSEntries(i));
    else
      return [obj];
  } else {
    return [normalizeCSSEntries(obj)];
  }
}
export function clearIdenticalEntries(entry) {
  return entry.filter(([k, v], idx) => {
    if (k.startsWith("$$"))
      return false;
    for (let i = idx - 1; i >= 0; i--) {
      if (entry[i][0] === k && entry[i][1] === v)
        return false;
    }
    return true;
  });
}
export function entriesToCss(arr) {
  if (arr == null)
    return "";
  return clearIdenticalEntries(arr).map(([key, value]) => value != null ? `${key}:${value};` : undefined).filter(Boolean).join("");
}
export function isObject(item) {
  return item && typeof item === "object" && !Array.isArray(item);
}
export function mergeDeep(original, patch) {
  const o = original;
  const p = patch;
  if (Array.isArray(o))
    return [...p];
  const output = { ...o };
  if (isObject(o) && isObject(p)) {
    Object.keys(p).forEach((key) => {
      if (isObject(o[key]) && isObject(p[key]) || Array.isArray(o[key]) && Array.isArray(p[key]))
        output[key] = mergeDeep(o[key], p[key]);
      else
        Object.assign(output, { [key]: p[key] });
    });
  }
  return output;
}
export function clone(val) {
  let k, out, tmp;
  if (Array.isArray(val)) {
    out = Array(k = val.length);
    while (k--)
      out[k] = (tmp = val[k]) && typeof tmp === "object" ? clone(tmp) : tmp;
    return out;
  }
  if (Object.prototype.toString.call(val) === "[object Object]") {
    out = {};
    for (k in val) {
      if (k === "__proto__") {
        Object.defineProperty(out, k, {
          value: clone(val[k]),
          configurable: true,
          enumerable: true,
          writable: true
        });
      } else {
        out[k] = (tmp = val[k]) && typeof tmp === "object" ? clone(tmp) : tmp;
      }
    }
    return out;
  }
  return val;
}
export function isStaticRule(rule) {
  return isString(rule[0]);
}
export function isStaticShortcut(sc) {
  return isString(sc[0]);
}
