import { getComponent, handler as h } from "../utils.mjs";
export const variantSupports = {
  name: "supports",
  match(matcher, { theme }) {
    if (matcher.startsWith("supports-")) {
      const matcherValue = matcher.substring(9);
      const [match, rest] = getComponent(matcherValue, "[", "]", ":") ?? [];
      if (!(match && rest && rest !== ""))
        return;
      let supports = h.bracket(match) ?? "";
      if (supports === "") {
        const themeValue = theme.supports?.[match];
        if (themeValue)
          supports = themeValue;
      }
      if (supports) {
        return {
          matcher: rest,
          handle: (input, next) => next({
            ...input,
            parent: `${input.parent ? `${input.parent} $$ ` : ""}@supports ${supports}`
          })
        };
      }
    }
  },
  multiPass: true
};
