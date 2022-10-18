import { variantParentMatcher } from "../utils.mjs";
export const variantPrint = variantParentMatcher("print", "@media print");
export const variantCustomMedia = {
  name: "media",
  match(matcher, { theme }) {
    const match = matcher.match(/^media-([_\d\w]+)[:-]/);
    if (match) {
      const media = theme.media?.[match[1]] ?? `(--${match[1]})`;
      return {
        matcher: matcher.slice(match[0].length),
        handle: (input, next) => next({
          ...input,
          parent: `${input.parent ? `${input.parent} $$ ` : ""}@media ${media}`
        })
      };
    }
  },
  multiPass: true
};
