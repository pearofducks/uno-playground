import { handler as h } from "../utils.mjs";
const variablesAbbrMap = {
  backface: "backface-visibility",
  break: "word-break",
  case: "text-transform",
  content: "align-content",
  fw: "font-weight",
  items: "align-items",
  justify: "justify-content",
  select: "user-select",
  self: "align-self",
  vertical: "vertical-align",
  visible: "visibility",
  whitespace: "white-space",
  ws: "white-space"
};
export const cssVariables = [
  [/^(.+?)-(\$.+)$/, ([, name, varname]) => {
    const prop = variablesAbbrMap[name];
    if (prop)
      return { [prop]: h.cssvar(varname) };
  }]
];
export const cssProperty = [
  [/^\[([\w_-]+):([^'"]+)\]$/, ([, prop, value]) => ({ [prop]: h.bracket(`[${value}]`) })]
];
