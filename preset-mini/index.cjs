'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const core = require('@unocss/core');
require('./shared/preset-mini.740f2131.cjs');
const colors$1 = require('./shared/preset-mini.2d0396b3.cjs');
const _default$1 = require('./shared/preset-mini.5e4ef283.cjs');
const colors = require('./shared/preset-mini.30606736.cjs');
const _default = require('./shared/preset-mini.2ee569b4.cjs');
const _default$2 = require('./shared/preset-mini.74b01e88.cjs');
require('./shared/preset-mini.6d3bd985.cjs');

const preflights = [
  {
    layer: "preflights",
    getCSS(ctx) {
      if (ctx.theme.preflightBase) {
        const css = core.entriesToCss(Object.entries(ctx.theme.preflightBase));
        return `*,::before,::after{${css}}::backdrop{${css}}`;
      }
    }
  }
];

const presetMini = (options = {}) => {
  options.dark = options.dark ?? "class";
  options.attributifyPseudo = options.attributifyPseudo ?? false;
  options.preflight = options.preflight ?? true;
  return {
    name: "@unocss/preset-mini",
    theme: _default.theme,
    rules: _default$1.rules,
    variants: _default$2.variants(options),
    options,
    postprocess: options.variablePrefix && options.variablePrefix !== "un-" ? VarPrefixPostprocessor(options.variablePrefix) : void 0,
    preflights: options.preflight ? preflights : [],
    prefix: options.prefix
  };
};
function VarPrefixPostprocessor(prefix) {
  return (obj) => {
    obj.entries.forEach((i) => {
      i[0] = i[0].replace(/^--un-/, `--${prefix}`);
      if (typeof i[1] === "string")
        i[1] = i[1].replace(/var\(--un-/g, `var(--${prefix}`);
    });
  };
}

exports.parseColor = colors$1.parseColor;
exports.colors = colors.colors;
exports.theme = _default.theme;
exports["default"] = presetMini;
exports.preflights = preflights;
exports.presetMini = presetMini;
