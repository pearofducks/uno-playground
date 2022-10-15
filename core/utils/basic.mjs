export function toArray(value = []) {
  return Array.isArray(value) ? value : [value];
}
export function uniq(value) {
  return Array.from(new Set(value));
}
export function isString(s) {
  return typeof s === "string";
}
