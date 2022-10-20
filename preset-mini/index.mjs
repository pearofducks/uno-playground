import { preflights } from "./preflights.mjs";
import { rules } from "./rules.mjs";
import { theme } from "./theme.mjs";
import { variants } from "./variants.mjs";
export { preflights } from "./preflights.mjs";
export { theme, colors } from "./theme.mjs";
export { parseColor } from "./utils.mjs";
export const presetMini = (options = {}) => {
  options.dark = options.dark ?? "class";
  options.attributifyPseudo = options.attributifyPseudo ?? false;
  options.preflight = options.preflight ?? true;
  return {
    name: "@unocss/preset-mini",
    safelist: ['p-32'],
    blocklist: ['p-8'],
    theme,
    rules,
    variants: variants(options),
    options,
    postprocess: options.variablePrefix && options.variablePrefix !== "un-" ? VarPrefixPostprocessor(options.variablePrefix) : void 0,
    preflights: options.preflight ? preflights : [],
    prefix: options.prefix
  };
};
export default presetMini;
function VarPrefixPostprocessor(prefix) {
  return (obj) => {
    obj.entries.forEach((i) => {
      i[0] = i[0].replace(/^--un-/, `--${prefix}`);
      if (typeof i[1] === "string")
        i[1] = i[1].replace(/var\(--un-/g, `var(--${prefix}`);
    });
  };
}
