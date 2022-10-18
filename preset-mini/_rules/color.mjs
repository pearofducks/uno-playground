import { colorResolver, handler as h } from "../utils.mjs";
import { numberWithUnitRE } from "../_utils/handlers/regex.mjs";
export const opacity = [
  [/^op(?:acity)?-?(.+)$/, ([, d]) => ({ opacity: h.bracket.percent.cssvar(d) })]
];
export const textColors = [
  [/^(?:color|c)-(.+)$/, colorResolver("color", "text"), { autocomplete: "(text|color|c)-$colors" }],
  [/^text-(.+)$/, colorResolver("color", "text", (css) => !css.color?.toString().match(numberWithUnitRE)), { autocomplete: "(text|color|c)-$colors" }],
  [/^(?:text|color|c)-op(?:acity)?-?(.+)$/, ([, opacity2]) => ({ "--un-text-opacity": h.bracket.percent(opacity2) }), { autocomplete: "(text|color|c)-(op|opacity)-<percent>" }]
];
export const bgColors = [
  [/^bg-(.+)$/, colorResolver("background-color", "bg"), { autocomplete: "bg-$colors" }],
  [/^bg-op(?:acity)?-?(.+)$/, ([, opacity2]) => ({ "--un-bg-opacity": h.bracket.percent(opacity2) }), { autocomplete: "bg-(op|opacity)-<percent>" }]
];
