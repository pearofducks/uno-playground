import { resolveBreakpoints } from "../utils.mjs";
const regexCache = {};
export const calcMaxWidthBySize = (size) => {
  const value = size.match(/^-?[0-9]+\.?[0-9]*/)?.[0] || "";
  const unit = size.slice(value.length);
  const maxWidth = parseFloat(value) - 0.1;
  return Number.isNaN(maxWidth) ? size : `${maxWidth}${unit}`;
};
export const variantBreakpoints = {
  name: "breakpoints",
  match(matcher, context) {
    const variantEntries = Object.entries(resolveBreakpoints(context) ?? {}).map(([point, size], idx) => [point, size, idx]);
    for (const [point, size, idx] of variantEntries) {
      if (!regexCache[point])
        regexCache[point] = new RegExp(`^((?:[al]t-)?${point}[:-])`);
      const match = matcher.match(regexCache[point]);
      if (!match)
        continue;
      const [, pre] = match;
      const m = matcher.slice(pre.length);
      if (m === "container")
        continue;
      const isLtPrefix = pre.startsWith("lt-");
      const isAtPrefix = pre.startsWith("at-");
      let order = 1e3;
      if (isLtPrefix) {
        order -= idx + 1;
        return {
          matcher: m,
          handle: (input, next) => next({
            ...input,
            parent: `${input.parent ? `${input.parent} $$ ` : ""}@media (max-width: ${calcMaxWidthBySize(size)})`,
            parentOrder: order
          })
        };
      }
      order += idx + 1;
      if (isAtPrefix && idx < variantEntries.length - 1) {
        return {
          matcher: m,
          handle: (input, next) => next({
            ...input,
            parent: `${input.parent ? `${input.parent} $$ ` : ""}@media (min-width: ${size}) and (max-width: ${calcMaxWidthBySize(variantEntries[idx + 1][1])})`,
            parentOrder: order
          })
        };
      }
      return {
        matcher: m,
        handle: (input, next) => next({
          ...input,
          parent: `${input.parent ? `${input.parent} $$ ` : ""}@media (min-width: ${size})`,
          parentOrder: order
        })
      };
    }
  },
  multiPass: true,
  autocomplete: "(at-|lt-|)$breakpoints:"
};
