export const attributifyRE = /^\[(.+?)~?="(.*)"\]$/;
export const cssIdRE = /\.(css|postcss|sass|scss|less|stylus|styl)($|\?)/;
export const validateFilterRE = /[\w\u00A0-\uFFFF-_:%-?]/;
export const CONTROL_SHORTCUT_NO_MERGE = "$$shortcut-no-merge";
export function isAttributifySelector(selector) {
  return selector.match(attributifyRE);
}
export function isValidSelector(selector = "") {
  return validateFilterRE.test(selector);
}
export function normalizeVariant(variant) {
  return typeof variant === "function" ? { match: variant } : variant;
}
export function isRawUtil(util) {
  return util.length === 3;
}
export function notNull(value) {
  return value != null;
}
export function noop() {
}
