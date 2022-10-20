import { preflights } from "./preflights.mjs";
import { rules } from "./rules.mjs";
import { theme, colorNames } from "./theme.mjs";
import { variants } from "./variants.mjs";
export { preflights } from "./preflights.mjs";
export { theme, colors } from "./theme.mjs";
export { parseColor } from "./utils.mjs";
import { isStaticRule } from '@unocss/core'

for (const r of rules) if (isStaticRule(r)) console.log(r)

export const presetMini = (options = {}) => {
  options.dark = options.dark ?? "media";
  options.attributifyPseudo = options.attributifyPseudo ?? false;
  options.preflight = options.preflight ?? !options.jit;
  options.variablePrefix = 'p-'
  const base = buildBase()

  return {
    name: "@unocss/preset-mini",
    safelist: options.base ? base : [],
    unsafelist: options.jit ? base : [],
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

function map(a, b, join = '-') {
  const classes = []
  for (const n of a) {
    for (const t of b)
      classes.push(n + join + t)
  }
  return classes
}

const makeResponsive = arr => map(Object.keys(theme.breakpoints), arr, ':')

function buildBase() {
  const list = []
  const colors = colorNames()
  const colorClasses = map(['bg', 'text', 'border'], colors)
  const spacingDirections = ['', 'b','l','t','r','x','y']
  const spacingTypes = map(['p','m'], spacingDirections,'')
  const spacings = map(spacingTypes, Object.keys(theme.spacing))
  list.push(makeResponsive(spacings))
  list.push(spacings)
  list.push(colorClasses)
  const result = list.flat(Infinity)
  return result
}

// buildBase()
