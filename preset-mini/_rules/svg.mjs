import { colorResolver, handler as h } from "../utils.mjs";
export const svgUtilities = [
  [/^fill-(.+)$/, colorResolver("fill", "fill"), { autocomplete: "fill-$colors" }],
  [/^fill-op(?:acity)?-?(.+)$/, ([, opacity]) => ({ "--un-fill-opacity": h.bracket.percent(opacity) }), { autocomplete: "fill-(op|opacity)-<percent>" }],
  ["fill-none", { fill: "none" }],
  [/^stroke-(?:width-|size-)?(.+)$/, ([, s], { theme }) => ({ "stroke-width": theme.lineWidth?.[s] ?? h.bracket.cssvar.fraction.px.number(s) }), { autocomplete: ["stroke-width-$lineWidth", "stroke-size-$lineWidth"] }],
  [/^stroke-dash-(.+)$/, ([, s]) => ({ "stroke-dasharray": h.bracket.cssvar.number(s) }), { autocomplete: "stroke-dash-<num>" }],
  [/^stroke-offset-(.+)$/, ([, s], { theme }) => ({ "stroke-dashoffset": theme.lineWidth?.[s] ?? h.bracket.cssvar.px.numberWithUnit(s) }), { autocomplete: "stroke-offset-$lineWidth" }],
  [/^stroke-(.+)$/, colorResolver("stroke", "stroke"), { autocomplete: "stroke-$colors" }],
  [/^stroke-op(?:acity)?-?(.+)$/, ([, opacity]) => ({ "--un-stroke-opacity": h.bracket.percent(opacity) }), { autocomplete: "stroke-(op|opacity)-<percent>" }],
  ["stroke-cap-square", { "stroke-linecap": "square" }],
  ["stroke-cap-round", { "stroke-linecap": "round" }],
  ["stroke-cap-auto", { "stroke-linecap": "butt" }],
  ["stroke-join-arcs", { "stroke-linejoin": "arcs" }],
  ["stroke-join-bevel", { "stroke-linejoin": "bevel" }],
  ["stroke-join-clip", { "stroke-linejoin": "miter-clip" }],
  ["stroke-join-round", { "stroke-linejoin": "round" }],
  ["stroke-join-auto", { "stroke-linejoin": "miter" }],
  ["stroke-none", { stroke: "none" }]
];
