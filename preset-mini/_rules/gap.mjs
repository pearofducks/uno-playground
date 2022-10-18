import { handler as h } from "../utils.mjs";
const directions = {
  "": "",
  "x": "column-",
  "y": "row-"
};
const handleGap = ([, d = "", s], { theme }) => {
  const v = theme.spacing?.[s] ?? h.bracket.cssvar.global.rem(s);
  if (v != null) {
    return {
      [`grid-${directions[d]}gap`]: v,
      [`${directions[d]}gap`]: v
    };
  }
};
export const gaps = [
  [/^(?:flex-|grid-)?gap-?()(.+)$/, handleGap, { autocomplete: ["gap-$spacing", "gap-<num>"] }],
  [/^(?:flex-|grid-)?gap-([xy])-?(.+)$/, handleGap, { autocomplete: ["gap-(x|y)-$spacing", "gap-(x|y)-<num>"] }]
];
