import { getComponent, handler as h } from "../utils.mjs";
export const variantSelector = {
  name: "selector",
  match(matcher) {
    const match = matcher.match(/^selector-\[(.+?)\][:-]/);
    if (match) {
      return {
        matcher: matcher.slice(match[0].length),
        selector: () => match[1]
      };
    }
  }
};
export const variantCssLayer = {
  name: "layer",
  match(matcher) {
    const match = matcher.match(/^layer-([_\d\w]+)[:-]/);
    if (match) {
      return {
        matcher: matcher.slice(match[0].length),
        handle: (input, next) => next({
          ...input,
          parent: `${input.parent ? `${input.parent} $$ ` : ""}@layer ${match[1]}`
        })
      };
    }
  }
};
export const variantInternalLayer = {
  name: "uno-layer",
  match(matcher) {
    const match = matcher.match(/^uno-layer-([_\d\w]+)[:-]/);
    if (match) {
      return {
        matcher: matcher.slice(match[0].length),
        layer: match[1]
      };
    }
  }
};
export const variantScope = {
  name: "scope",
  match(matcher) {
    const match = matcher.match(/^scope-([_\d\w]+)[:-]/);
    if (match) {
      return {
        matcher: matcher.slice(match[0].length),
        selector: (s) => `.${match[1]} $$ ${s}`
      };
    }
  }
};
export const variantVariables = {
  name: "variables",
  match(matcher) {
    if (!matcher.startsWith("["))
      return;
    const [match, rest] = getComponent(matcher, "[", "]", ":") ?? [];
    if (!(match && rest && rest !== ""))
      return;
    const variant = h.bracket(match) ?? "";
    if (!(variant.startsWith("@") || variant.includes("&")))
      return;
    return {
      matcher: rest,
      handle(input, next) {
        const updates = variant.startsWith("@") ? {
          parent: `${input.parent ? `${input.parent} $$ ` : ""}${variant}`
        } : {
          selector: variant.replace(/&/g, input.selector)
        };
        return next({
          ...input,
          ...updates
        });
      }
    };
  },
  multiPass: true
};
