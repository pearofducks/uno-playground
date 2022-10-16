import { entriesToCss } from '@unocss/core';
import './shared/preset-mini.7c9c225a.mjs';
export { p as parseColor } from './shared/preset-mini.7d4b2219.mjs';
import { r as rules } from './shared/preset-mini.389e54ff.mjs';
export { c as colors } from './shared/preset-mini.65ac75be.mjs';
import { t as theme } from './shared/preset-mini.b0834387.mjs';
export { t as theme } from './shared/preset-mini.b0834387.mjs';
import { v as variants } from './shared/preset-mini.f7d1cea8.mjs';
import './shared/preset-mini.f73f9ed7.mjs';

const preflights = [
  {
    layer: "preflights",
    getCSS(ctx) {
      if (ctx.theme.preflightBase) {
        const css = entriesToCss(Object.entries(ctx.theme.preflightBase));
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
    theme,
    rules,
    variants: variants(options),
    options,
    postprocess: options.variablePrefix && options.variablePrefix !== "un-" ? VarPrefixPostprocessor(options.variablePrefix) : undefined,
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

export { presetMini as default, preflights, presetMini };