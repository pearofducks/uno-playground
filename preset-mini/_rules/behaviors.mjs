import { colorResolver, globalKeywords, handler as h } from "../utils.mjs";
export const outline = [
  [/^outline-(?:width-|size-)?(.+)$/, ([, d], { theme }) => ({ "outline-width": theme.lineWidth?.[d] ?? h.bracket.cssvar.global.px(d) }), { autocomplete: "outline-(width|size)-<num>" }],
  [/^outline-(?:color-)?(.+)$/, colorResolver("outline-color", "outline-color"), { autocomplete: "outline-$colors" }],
  [/^outline-offset-(.+)$/, ([, d], { theme }) => ({ "outline-offset": theme.lineWidth?.[d] ?? h.bracket.cssvar.global.px(d) }), { autocomplete: "outline-(offset)-<num>" }],
  ["outline", { "outline-style": "solid" }],
  ...["auto", "dashed", "dotted", "double", "hidden", "solid", "groove", "ridge", "inset", "outset", ...globalKeywords].map((v) => [`outline-${v}`, { "outline-style": v }]),
  ["outline-none", { "outline": "2px solid transparent", "outline-offset": "2px" }]
];
export const appearance = [
  ["appearance-none", {
    "appearance": "none",
    "-webkit-appearance": "none"
  }]
];
const willChangeProperty = (prop) => {
  return h.properties.auto.global(prop) ?? {
    contents: "contents",
    scroll: "scroll-position"
  }[prop];
};
export const willChange = [
  [/^will-change-(.+)/, ([, p]) => ({ "will-change": willChangeProperty(p) })]
];
